"use client"

import { useEffect, useMemo, useState } from "react"
import { collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore"
import { Download, Eye, Search, Trash2, X } from "lucide-react"
import { deleteDocument, firestore, updateDocument } from "@/lib/firebase"

type OrderStatus = "Ready" | "Shipped" | "Received"
type PaymentStatus = "Paid" | "Pending"
type FilterStatus = "all" | OrderStatus | PaymentStatus
type OrderDocument = Record<string, unknown> & { id: string }

type Designer = {
  id: string
  email: string
  name: string
}

type ProductDocument = Record<string, unknown> & {
  id: string
}

type OrderRow = {
  id: string
  orderNo: string
  createdAt: Date | null
  customer: string
  email: string
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  total: number
  document: OrderDocument
}

const orderStatuses: OrderStatus[] = ["Ready", "Shipped", "Received"]
const pageSize = 14

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

function getString(document: OrderDocument, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = document[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }

  return fallback
}

function getRecordString(document: Record<string, unknown> | null, keys: string[], fallback = "") {
  if (!document) return fallback

  for (const key of keys) {
    const value = document[key]
    if (typeof value === "string" && value.trim()) return value.trim()
    if (typeof value === "number" && Number.isFinite(value)) return String(value)
  }

  return fallback
}

function getNumber(document: OrderDocument, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = document[key]
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string") {
      const parsed = Number(value.replace(/[$,]/g, ""))
      if (Number.isFinite(parsed)) return parsed
    }
  }

  return fallback
}

function getDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  if (typeof value === "number") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  if (typeof value === "string") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const record = asRecord(value)
  if (record && typeof record.toDate === "function") {
    const date = record.toDate()
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null
  }

  return null
}

function getOrderDate(document: OrderDocument) {
  return getDate(document.createdAt) || getDate(document.time) || getDate(document.date) || getDate(document.updatedAt)
}

function getOrderTotal(document: OrderDocument) {
  const directTotal = getNumber(document, ["total", "totalAmount", "amount", "subtotal", "price"])
  if (directTotal > 0) return directTotal

  const items = document.items
  if (!Array.isArray(items)) return 0

  return items.reduce((sum, item) => {
    const record = asRecord(item)
    if (!record) return sum

    const product = asRecord(record.product)
    const priceValue = record.price ?? record.amount ?? product?.price
    const qtyValue = record.qty ?? record.quantity ?? 1
    const price = typeof priceValue === "number" ? priceValue : Number(priceValue)
    const qty = typeof qtyValue === "number" ? qtyValue : Number(qtyValue)

    return sum + (Number.isFinite(price) ? price : 0) * (Number.isFinite(qty) ? qty : 1)
  }, 0)
}

function normalizePaymentStatus(value: string): PaymentStatus {
  return value.toLowerCase().includes("paid") ? "Paid" : "Pending"
}

function normalizeOrderStatus(value: string): OrderStatus {
  const lowerValue = value.toLowerCase()
  if (lowerValue.includes("ship")) return "Shipped"
  if (lowerValue.includes("receiv") || lowerValue.includes("complete")) return "Received"
  return "Ready"
}

function getCustomerName(document: OrderDocument) {
  const name = getString(document, ["customerName", "name", "fullName", "displayName"])
  if (name) return name

  const firstName = getString(document, ["firstName"])
  const lastName = getString(document, ["lastName"])
  const combinedName = `${firstName} ${lastName}`.trim()

  return combinedName || getString(document, ["customerEmail", "email", "deliveryEmail"], "Customer")
}

function toOrderRow(document: OrderDocument): OrderRow {
  const createdAt = getOrderDate(document)

  return {
    id: document.id,
    orderNo: getString(document, ["orderNo", "orderNumber", "orderId"], document.id.slice(0, 8).toUpperCase()),
    createdAt,
    customer: getCustomerName(document),
    email: getString(document, ["customerEmail", "email", "deliveryEmail"]),
    paymentStatus: normalizePaymentStatus(getString(document, ["paymentStatus", "status"], "Pending")),
    orderStatus: normalizeOrderStatus(getString(document, ["orderStatus", "status"], "Ready")),
    total: getOrderTotal(document),
    document,
  }
}

function formatDateTime(date: Date | null) {
  if (!date) return "Unknown"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function toDatetimeInputValue(date: Date | null) {
  if (!date) return ""

  const pad = (value: number) => String(value).padStart(2, "0")
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function statusClass(status: OrderStatus | PaymentStatus) {
  if (status === "Paid") return "bg-emerald-100 text-emerald-600"
  if (status === "Pending") return "bg-slate-100 text-slate-500"
  if (status === "Ready") return "bg-amber-100 text-amber-700"
  if (status === "Shipped") return "bg-slate-700 text-white"
  return "bg-blue-100 text-blue-700"
}

function escapeCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function detailValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "Not provided"
  return String(value)
}

function getOrderItems(order: OrderDocument) {
  return Array.isArray(order.items) ? order.items.map(asRecord).filter(Boolean) : []
}

function getProductImage(item: Record<string, unknown> | null) {
  const product = asRecord(item?.product)
  return getRecordString(item, ["image", "heroImage", "thumbnail", "photoUrl", "photoURL"], getRecordString(product, ["image", "heroImage", "thumbnail", "photoUrl", "photoURL"]))
}

function getProductName(item: Record<string, unknown> | null) {
  const product = asRecord(item?.product)
  return getRecordString(item, ["title", "name", "productName"], getRecordString(product, ["title", "name", "productName"], "Product"))
}

function getProductId(item: Record<string, unknown> | null) {
  const product = asRecord(item?.product)
  return getRecordString(item, ["productId", "id", "slug"], getRecordString(product, ["id", "productId", "slug"], "Not provided"))
}

function findProductForItem(item: Record<string, unknown> | null, products: ProductDocument[]) {
  const product = asRecord(item?.product)
  const candidates = [
    item?.productId,
    item?.id,
    item?.slug,
    item?.title,
    item?.name,
    product?.id,
    product?.productId,
    product?.slug,
    product?.title,
    product?.name,
  ]
    .map((value) => (value === null || value === undefined ? "" : String(value).trim().toLowerCase()))
    .filter(Boolean)

  return products.find((productDocument) => {
    const productValues = [
      productDocument.id,
      productDocument.productId,
      productDocument.slug,
      productDocument.title,
      productDocument.name,
    ]
      .map((value) => (value === null || value === undefined ? "" : String(value).trim().toLowerCase()))
      .filter(Boolean)

    return productValues.some((value) => candidates.includes(value))
  })
}

function getItemQuantity(item: Record<string, unknown> | null) {
  const value = item?.qty ?? item?.quantity
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }

  return 1
}

function getItemPrice(item: Record<string, unknown> | null) {
  const product = asRecord(item?.product)
  const value = item?.price ?? item?.amount ?? product?.price
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,]/g, ""))
    if (Number.isFinite(parsed)) return parsed
  }

  return 0
}

function getDesignerName(document: OrderDocument) {
  return getString(document, ["displayName", "name", "fullName"], getString(document, ["email"], "Designer"))
}

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">{detailValue(value)}</p>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeOrder, setActiveOrder] = useState<OrderRow | null>(null)
  const [designers, setDesigners] = useState<Designer[]>([])
  const [products, setProducts] = useState<ProductDocument[]>([])
  const [designerError, setDesignerError] = useState<string | null>(null)
  const [selectedDesignerId, setSelectedDesignerId] = useState("")
  const [submissionDeadline, setSubmissionDeadline] = useState("")
  const [assigningDesigner, setAssigningDesigner] = useState(false)
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "orders"),
      (snapshot) => {
        setOrders(
          snapshot.docs
            .map((document) => toOrderRow({ ...document.data(), id: document.id }))
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
        )
        setLoading(false)
      },
      (snapshotError) => {
        setError(snapshotError.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const designerQuery = query(collection(firestore, "users"), where("role", "==", "designer"))
    const unsubscribe = onSnapshot(
      designerQuery,
      (snapshot) => {
        setDesigners(
          snapshot.docs
            .map((document) => {
              const data = { ...document.data(), id: document.id } as OrderDocument
              return {
                id: document.id,
                email: getString(data, ["email"]),
                name: getDesignerName(data),
              }
            })
            .sort((a, b) => a.name.localeCompare(b.name))
        )
        setDesignerError(null)
      },
      (snapshotError) => {
        setDesignerError(snapshotError.message)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "products"),
      (snapshot) => {
        setProducts(snapshot.docs.map((document) => ({ ...document.data(), id: document.id })))
      }
    )

    return () => unsubscribe()
  }, [])

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderNo.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      const matchesFilter = filterStatus === "all" || order.paymentStatus === filterStatus || order.orderStatus === filterStatus

      return matchesSearch && matchesFilter
    })
  }, [filterStatus, orders, searchQuery])

  const pageCount = Math.max(Math.ceil(filteredOrders.length / pageSize), 1)
  const currentPage = Math.min(page, pageCount)
  const visibleOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const visibleIds = visibleOrders.map((order) => order.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))

  function toggleSelected(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]))
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id))
      return [...current, ...visibleIds.filter((id) => !current.includes(id))]
    })
  }

  function exportOrders() {
    const rows = filteredOrders.map((order) => [
      order.orderNo,
      formatDateTime(order.createdAt),
      order.customer,
      order.email,
      order.paymentStatus,
      order.orderStatus,
      order.total,
    ])
    const csv = [
      ["Order", "Date", "Customer", "Email", "Payment Status", "Order Status", "Total"].map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "orders.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  async function updateOrderStatus(id: string, orderStatus: OrderStatus) {
    await updateDocument("orders", id, { orderStatus, updatedAt: serverTimestamp() })
  }

  async function deleteSelectedOrders() {
    if (selectedIds.length === 0) return
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected order${selectedIds.length === 1 ? "" : "s"}?`)
    if (!confirmed) return

    await Promise.all(selectedIds.map((id) => deleteDocument("orders", id)))
    setSelectedIds([])
  }

  function openOrderDetails(order: OrderRow) {
    const deadline = getDate(order.document.submissionDeadline) || getDate(order.document.deadline)

    setActiveOrder(order)
    setSelectedDesignerId(getString(order.document, ["assignedDesignerId", "designerId"]))
    setSubmissionDeadline(toDatetimeInputValue(deadline))
    setAssignmentMessage(null)
  }

  async function assignOrderToDesigner() {
    if (!activeOrder || !selectedDesignerId || !submissionDeadline) return

    const designer = designers.find((item) => item.id === selectedDesignerId)
    if (!designer) return

    setAssigningDesigner(true)
    setAssignmentMessage(null)

    try {
      const deadlineDate = new Date(submissionDeadline)
      await updateDocument("orders", activeOrder.id, {
        assignedDesignerId: designer.id,
        assignedDesignerName: designer.name,
        assignedDesignerEmail: designer.email,
        assignedAt: serverTimestamp(),
        submissionDeadline: deadlineDate.toISOString(),
        updatedAt: serverTimestamp(),
      })

      setActiveOrder((current) =>
        current
          ? {
              ...current,
              document: {
                ...current.document,
                assignedDesignerId: designer.id,
                assignedDesignerName: designer.name,
                assignedDesignerEmail: designer.email,
                assignedAt: new Date().toISOString(),
                submissionDeadline: deadlineDate.toISOString(),
              },
            }
          : current
      )
      setAssignmentMessage("Order assigned successfully.")
    } catch (assignmentError) {
      setAssignmentMessage(assignmentError instanceof Error ? assignmentError.message : "Unable to assign designer.")
    } finally {
      setAssigningDesigner(false)
    }
  }

  const activeOrderItems = activeOrder ? getOrderItems(activeOrder.document) : []
  const activeOrderDocument = activeOrder?.document
  const paymentTime = activeOrderDocument
    ? getDate(activeOrderDocument.paymentTime) || getDate(activeOrderDocument.paidAt) || getDate(activeOrderDocument.transactionTime)
    : null
  const assignedAt = activeOrderDocument ? getDate(activeOrderDocument.assignedAt) : null
  const assignedDesignerName = activeOrderDocument ? getString(activeOrderDocument, ["assignedDesignerName", "designerName"]) : ""
  const assignedDesignerEmail = activeOrderDocument ? getString(activeOrderDocument, ["assignedDesignerEmail", "designerEmail"]) : ""
  const selectedDesigner = designers.find((designer) => designer.id === selectedDesignerId)
  const displayedDesignerName = assignedDesignerName || selectedDesigner?.name || ""
  const displayedDesignerEmail = assignedDesignerEmail || selectedDesigner?.email || ""
  const displayedDeadline =
    (activeOrderDocument ? getDate(activeOrderDocument.submissionDeadline) || getDate(activeOrderDocument.deadline) : null) ||
    getDate(submissionDeadline)

  return (
    <div className="min-h-full bg-[#f5f6fb] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">Orders</h1>
            {error ? <p className="mt-1 text-xs font-medium text-rose-500">Firebase: {error}</p> : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportOrders}
              className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm font-medium text-blue-600 shadow-sm hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </header>

        <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterStatus}
                onChange={(event) => {
                  setFilterStatus(event.target.value as FilterStatus)
                  setPage(1)
                }}
                className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-500 outline-none focus:border-blue-500"
              >
                <option value="all">Filter</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Ready">Ready</option>
                <option value="Shipped">Shipped</option>
                <option value="Received">Received</option>
              </select>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search..."
                  className="h-10 w-72 rounded border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={deleteSelectedOrders}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label="Delete selected orders"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-y border-slate-100 text-xs font-medium text-slate-400">
                  <th className="w-10 py-3">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
                  </th>
                  <th className="py-3">Order</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Payment status</th>
                  <th className="py-3">Order Status</th>
                  <th className="py-3 text-right">Total</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : visibleOrders.length > 0 ? (
                  visibleOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 text-xs text-slate-700 hover:bg-slate-50/70">
                      <td className="py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleSelected(order.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                        />
                      </td>
                      <td className="py-3 font-semibold text-slate-800">{order.orderNo}</td>
                      <td className="py-3">{formatDateTime(order.createdAt)}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">
                        <span className={`inline-flex h-6 items-center rounded px-2 text-xs font-semibold ${statusClass(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                          className={`h-6 rounded px-2 text-xs font-semibold outline-none ${statusClass(order.orderStatus)}`}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-800">{formatCurrency(order.total)}</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openOrderDetails(order)}
                          className="inline-flex h-8 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm text-slate-400">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                className="h-8 min-w-8 rounded text-slate-500 hover:bg-slate-100"
              >
                ←
              </button>
              {Array.from({ length: Math.min(pageCount, 5) }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-8 min-w-8 rounded ${pageNumber === currentPage ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`}
                >
                  {pageNumber}
                </button>
              ))}
              {pageCount > 5 ? <span className="px-2">...</span> : null}
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(current + 1, pageCount))}
                className="h-8 min-w-8 rounded text-slate-500 hover:bg-slate-100"
              >
                →
              </button>
            </div>
            <span>{filteredOrders.length} Results</span>
          </footer>
        </section>
      </div>

      {activeOrder && activeOrderDocument ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-xl">
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">Order Detail</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{activeOrder.orderNo}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50"
                aria-label="Close order detail"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-[calc(90vh-78px)] overflow-y-auto px-5 py-5">
              <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <DetailField label="Customer Name" value={activeOrder.customer} />
                <DetailField label="Customer Email" value={activeOrder.email} />
                <DetailField label="Delivery Email" value={getString(activeOrderDocument, ["deliveryEmail", "customerEmail", "email"])} />
                <DetailField label="Coupon Code" value={getString(activeOrderDocument, ["couponCode", "coupon", "discountCode", "promoCode"])} />
                <DetailField label="Payment Method" value={getString(activeOrderDocument, ["paymentMethod", "paymentType"])} />
                <DetailField label="Transaction ID" value={getString(activeOrderDocument, ["transactionId", "transactionID", "paymentId", "paymentIntentId", "chargeId"])} />
                <DetailField label="Payment Time" value={formatDateTime(paymentTime)} />
                <DetailField label="Payment Status" value={activeOrder.paymentStatus} />
                <DetailField label="Order Status" value={activeOrder.orderStatus} />
              </section>

              <section className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Instruction</p>
                <p className="mt-2 min-h-16 rounded border border-slate-100 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-700">
                  {detailValue(getString(activeOrderDocument, ["instructions", "instruction", "notes", "additionalNotes"]))}
                </p>
              </section>

              <section className="mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">Assign to Designer</h3>
                    <p className="mt-1 text-xs text-slate-500">Select a designer and set the submission deadline.</p>
                  </div>
                  <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-100">
                    Assigned: {formatDateTime(assignedAt)}
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Designer</span>
                    <select
                      value={selectedDesignerId}
                      onChange={(event) => setSelectedDesignerId(event.target.value)}
                      className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                      <option value="">Select designer</option>
                      {designers.map((designer) => (
                        <option key={designer.id} value={designer.id}>
                          {designer.name}{designer.email ? ` - ${designer.email}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Submission Deadline</span>
                    <input
                      type="datetime-local"
                      value={submissionDeadline}
                      onChange={(event) => setSubmissionDeadline(event.target.value)}
                      className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                    />
                  </label>

                  <button
                    type="button"
                    disabled={!selectedDesignerId || !submissionDeadline || assigningDesigner}
                    onClick={assignOrderToDesigner}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 lg:mt-[19px]"
                  >
                    {assigningDesigner ? "Assigning..." : "Assign"}
                  </button>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <DetailField label="Current Designer" value={displayedDesignerName} />
                  <DetailField label="Designer Email" value={displayedDesignerEmail} />
                  <DetailField label="Deadline" value={formatDateTime(displayedDeadline)} />
                </div>

                {designerError ? <p className="mt-3 text-xs font-medium text-rose-500">Designers: {designerError}</p> : null}
                {assignmentMessage ? (
                  <p className={`mt-3 text-xs font-semibold ${assignmentMessage.includes("success") ? "text-emerald-600" : "text-rose-500"}`}>
                    {assignmentMessage}
                  </p>
                ) : null}
              </section>

              <section className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-950">Products</h3>
                  <span className="text-xs font-semibold text-slate-400">{activeOrderItems.length} item{activeOrderItems.length === 1 ? "" : "s"}</span>
                </div>

                {activeOrderItems.length > 0 ? (
                  <div className="space-y-3">
                    {activeOrderItems.map((item, index) => {
                      const image = getProductImage(item)
                      const qty = getItemQuantity(item)
                      const price = getItemPrice(item)
                      const matchedProduct = findProductForItem(item, products)
                      const turnaround = getRecordString(item, ["turnaround"], getRecordString(matchedProduct ?? null, ["turnaround"]))
                      const revisions = getRecordString(item, ["revisions"], getRecordString(matchedProduct ?? null, ["revisions"]))

                      return (
                        <article key={`${getProductId(item)}-${index}`} className="grid gap-4 rounded-md border border-slate-100 p-3 sm:grid-cols-[80px_minmax(0,1fr)]">
                          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded border border-slate-100 bg-slate-50">
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={image} alt={getProductName(item)} className="h-full w-full object-cover" />
                            ) : (
                              <span className="px-2 text-center text-xs text-slate-400">No image</span>
                            )}
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailField label="Product Name" value={getProductName(item)} />
                            <DetailField label="Product ID" value={getProductId(item)} />
                            <DetailField label="Quantity" value={qty} />
                            <DetailField label="Price" value={formatCurrency(price)} />
                            <DetailField label="Turnaround" value={turnaround} />
                            <DetailField label="Revisions" value={revisions} />
                          </div>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
                    No product items found for this order.
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
