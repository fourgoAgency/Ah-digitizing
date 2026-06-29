"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { MoreHorizontal, RefreshCw, Settings } from "lucide-react"
import { firestore } from "@/lib/firebase"

type DashboardDocument = Record<string, unknown> & { id: string }
type CollectionKey = "orders" | "quotes" | "users" | "products"
type StatusType = "Paid" | "Pending"

type TransactionRow = {
  id: string
  name: string
  date: string
  amount: number
  status: StatusType
  createdAt: Date | null
}

type ProductRow = {
  id: string
  name: string
  price: number
  units: number
  image: string
}

type StatCardData = {
  label: string
  value: string
  change: string
  accent: string
  bars: string[]
}

const collectionKeys: CollectionKey[] = ["orders", "quotes", "users", "products"]
const fallbackImage = "/home-page/products picture/1.png"

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

function getString(document: DashboardDocument, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = document[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }

  return fallback
}

function getNumber(document: DashboardDocument, keys: string[], fallback = 0) {
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

function getDocumentDate(document: DashboardDocument) {
  return (
    getDate(document.createdAt) ||
    getDate(document.time) ||
    getDate(document.date) ||
    getDate(document.submittedAt) ||
    getDate(document.updatedAt)
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

function formatShortNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)
}

function formatDate(date: Date | null) {
  if (!date) return "Unknown"
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function isRecent(date: Date | null, days: number, referenceDate: Date) {
  if (!date) return false
  return referenceDate.getTime() - date.getTime() <= days * 24 * 60 * 60 * 1000
}

function isPaidDocument(document: DashboardDocument) {
  const status = getString(document, ["status", "paymentStatus", "orderStatus"]).toLowerCase()
  return status.includes("paid") || status.includes("complete") || status.includes("success")
}

function getLineAmount(document: DashboardDocument) {
  const directAmount = getNumber(document, ["total", "totalAmount", "amount", "subtotal", "revenue", "price"])
  if (directAmount > 0) return directAmount

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

function getCustomerName(document: DashboardDocument) {
  const name = getString(document, ["customerName", "name", "fullName", "displayName"])
  if (name) return name

  const firstName = getString(document, ["firstName"])
  const lastName = getString(document, ["lastName"])
  const combinedName = `${firstName} ${lastName}`.trim()
  if (combinedName) return combinedName

  return getString(document, ["customerEmail", "email", "deliveryEmail"], "Customer")
}

function getCustomerEmail(document: DashboardDocument) {
  return getString(document, ["customerEmail", "email", "deliveryEmail"])
}

function getStatus(document: DashboardDocument): StatusType {
  return isPaidDocument(document) ? "Paid" : "Pending"
}

function getProductImage(document: DashboardDocument) {
  const gallery = document.gallery
  if (Array.isArray(gallery) && typeof gallery[0] === "string") return gallery[0]
  return getString(document, ["heroImage", "image", "thumbnail", "photoUrl", "photoURL"], fallbackImage)
}

function getProductRows(products: DashboardDocument[], orders: DashboardDocument[]): ProductRow[] {
  const orderedUnits = new Map<string, number>()

  orders.forEach((order) => {
    const items = order.items
    if (!Array.isArray(items)) return

    items.forEach((item) => {
      const record = asRecord(item)
      if (!record) return

      const product = asRecord(record.product)
      const id = String(record.productId ?? record.id ?? product?.id ?? product?.slug ?? product?.title ?? "")
      if (!id) return

      const qtyValue = record.qty ?? record.quantity ?? 1
      const qty = typeof qtyValue === "number" ? qtyValue : Number(qtyValue)
      orderedUnits.set(id, (orderedUnits.get(id) || 0) + (Number.isFinite(qty) ? qty : 1))
    })
  })

  return products
    .map((product) => {
      const numericId = getNumber(product, ["id"])
      const slug = getString(product, ["slug"])
      const title = getString(product, ["title", "name"], "Untitled Product")
      const possibleKeys = [product.id, slug, title, numericId ? String(numericId) : ""]
      const orderUnits = possibleKeys.reduce((sum, key) => sum + (key ? orderedUnits.get(String(key)) || 0 : 0), 0)

      return {
        id: product.id,
        name: title,
        price: getNumber(product, ["price", "salePrice"]),
        units: orderUnits || getNumber(product, ["totalSold", "unitsSold", "sold"]),
        image: getProductImage(product),
      }
    })
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
}

function getTransactions(orders: DashboardDocument[], quotes: DashboardDocument[]): TransactionRow[] {
  const rows = [...orders, ...quotes].map((document) => {
    const createdAt = getDocumentDate(document)
    return {
      id: document.id,
      name: getCustomerName(document),
      date: formatDate(createdAt),
      amount: getLineAmount(document),
      status: getStatus(document),
      createdAt,
    }
  })

  return rows
    .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
    .slice(0, 5)
}

function buildSparkBars(color: "blue" | "violet" | "amber" | "emerald", value: number) {
  const palettes = {
    blue: ["bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-500"],
    violet: ["bg-violet-100", "bg-violet-200", "bg-violet-300", "bg-violet-500"],
    amber: ["bg-amber-100", "bg-amber-200", "bg-amber-300", "bg-amber-400"],
    emerald: ["bg-emerald-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400"],
  }
  const heights = ["h-3", "h-5", "h-8", value > 0 ? "h-12" : "h-6"]

  return palettes[color].map((barColor, index) => `${heights[index]} ${barColor}`)
}

function getHourlyCounts(documents: DashboardDocument[], dayOffset: number, referenceDate: Date) {
  const now = referenceDate
  const target = new Date(now)
  target.setDate(now.getDate() - dayOffset)
  const hours = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now)
    date.setHours(now.getHours() - (11 - index), 0, 0, 0)
    if (dayOffset > 0) date.setDate(date.getDate() - dayOffset)
    return date
  })

  return hours.map((hour) => {
    const nextHour = new Date(hour)
    nextHour.setHours(hour.getHours() + 1)

    return documents.filter((document) => {
      const date = getDocumentDate(document)
      return date ? date >= hour && date < nextHour && date.toDateString() === target.toDateString() : false
    }).length
  })
}

function getLinePath(values: number[], width = 704, height = 210, left = 44, top = 40) {
  const max = Math.max(...values, 1)
  const step = width / Math.max(values.length - 1, 1)

  return values
    .map((value, index) => {
      const x = left + index * step
      const y = top + height - (value / max) * height
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

function getSevenDaySales(orders: DashboardDocument[], referenceDate: Date) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceDate)
    date.setDate(date.getDate() - (6 - index))
    date.setHours(0, 0, 0, 0)
    return date
  })

  return days.map((day) => {
    const nextDay = new Date(day)
    nextDay.setDate(day.getDate() + 1)
    const dayOrders = orders.filter((order) => {
      const date = getDocumentDate(order)
      return date ? date >= day && date < nextDay : false
    })

    return {
      label: String(day.getDate()),
      revenue: dayOrders.reduce((sum, order) => sum + getLineAmount(order), 0),
      items: dayOrders.length,
    }
  })
}

function StatusBadge({ status }: { status: StatusType }) {
  const isPaid = status === "Paid"

  return (
    <span
      className={`inline-flex h-6 min-w-16 items-center justify-center rounded px-2 text-xs font-medium ${
        isPaid ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  )
}

function StatCard({ stat }: { stat: StatCardData }) {
  return (
    <article className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-slate-400">{stat.label}</p>
          <p className="mt-1 text-lg font-bold leading-none text-slate-950">{stat.value}</p>
          <p className={`mt-2 text-[11px] font-semibold ${stat.accent}`}>{stat.change}</p>
        </div>
        <div className="flex h-14 items-end gap-1.5">
          {stat.bars.map((bar, index) => (
            <span key={`${stat.label}-${index}`} className={`w-2 rounded-full ${bar}`} />
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Dashboard() {
  const [collections, setCollections] = useState<Record<CollectionKey, DashboardDocument[]>>({
    orders: [],
    quotes: [],
    users: [],
    products: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncedAt, setSyncedAt] = useState(() => new Date())

  useEffect(() => {
    const unsubscribers = collectionKeys.map((key) =>
      onSnapshot(
        collection(firestore, key),
        (snapshot) => {
          setCollections((current) => ({
            ...current,
            [key]: snapshot.docs.map((document) => ({
              ...document.data(),
              id: document.id,
            })),
          }))
          setSyncedAt(new Date())
          setLoading(false)
        },
        (snapshotError) => {
          setError(snapshotError.message)
          setLoading(false)
        }
      )
    )

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  const dashboardData = useMemo(() => {
    const commerceItems = [...collections.orders, ...collections.quotes]
    const paidOrders = collections.orders.filter(isPaidDocument)
    const revenue = paidOrders.reduce((sum, order) => sum + getLineAmount(order), 0)
    const totalOrderValue = collections.orders.reduce((sum, order) => sum + getLineAmount(order), 0)
    const recentRevenue = collections.orders.filter((order) => isRecent(getDocumentDate(order), 7, syncedAt)).reduce((sum, order) => sum + getLineAmount(order), 0)
    const previousRevenue = collections.orders
      .filter((order) => {
        const date = getDocumentDate(order)
        if (!date) return false
        const age = syncedAt.getTime() - date.getTime()
        return age > 7 * 24 * 60 * 60 * 1000 && age <= 14 * 24 * 60 * 60 * 1000
      })
      .reduce((sum, order) => sum + getLineAmount(order), 0)
    const revenueChange = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : recentRevenue > 0 ? 100 : 0

    const uniqueEmails = new Set(
      commerceItems
        .map(getCustomerEmail)
        .filter(Boolean)
        .map((email) => email.toLowerCase())
    )
    const newUsers = collections.users.filter((user) => isRecent(getDocumentDate(user), 7, syncedAt)).length
    const existingUsers = Math.max(collections.users.length - newUsers, 0)
    const todayCounts = getHourlyCounts(commerceItems, 0, syncedAt)
    const yesterdayCounts = getHourlyCounts(commerceItems, 1, syncedAt)
    const sales = getSevenDaySales(collections.orders, syncedAt)
    const totalItemsSold = sales.reduce((sum, day) => sum + day.items, 0)
    const sevenDayRevenue = sales.reduce((sum, day) => sum + day.revenue, 0)
    const maxSaleRevenue = Math.max(...sales.map((day) => day.revenue), 1)
    const chartLabels = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(syncedAt)
      date.setHours(date.getHours() - (11 - index), 0, 0, 0)
      return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).toLowerCase().replace(" ", "")
    })

    return {
      stats: [
        {
          label: "Total Revenue",
          value: formatCurrency(revenue || totalOrderValue),
          change: `${Math.abs(revenueChange).toFixed(2)}%`,
          accent: revenueChange >= 0 ? "text-emerald-500" : "text-rose-500",
          bars: buildSparkBars("blue", revenue),
        },
        {
          label: "Orders",
          value: formatShortNumber(collections.orders.length),
          change: `${formatShortNumber(collections.quotes.length)} quotes`,
          accent: "text-emerald-500",
          bars: buildSparkBars("violet", collections.orders.length),
        },
        {
          label: "Unique Visits",
          value: formatShortNumber(uniqueEmails.size || collections.users.length),
          change: `${formatShortNumber(commerceItems.length)} leads`,
          accent: "text-rose-500",
          bars: buildSparkBars("amber", uniqueEmails.size),
        },
        {
          label: "New Users",
          value: formatShortNumber(newUsers),
          change: "Last 7 days",
          accent: "text-emerald-500",
          bars: buildSparkBars("emerald", newUsers),
        },
        {
          label: "Existing User",
          value: formatShortNumber(existingUsers),
          change: `${formatShortNumber(collections.users.length)} total`,
          accent: "text-rose-500",
          bars: buildSparkBars("blue", existingUsers),
        },
      ] satisfies StatCardData[],
      transactions: getTransactions(collections.orders, collections.quotes),
      products: getProductRows(collections.products, collections.orders),
      todayCounts,
      yesterdayCounts,
      todayPath: getLinePath(todayCounts),
      yesterdayPath: getLinePath(yesterdayCounts),
      chartLabels,
      todayTotal: todayCounts.reduce((sum, count) => sum + count, 0),
      yesterdayTotal: yesterdayCounts.reduce((sum, count) => sum + count, 0),
      sales,
      maxSaleRevenue,
      totalItemsSold,
      sevenDayRevenue,
    }
  }, [collections, syncedAt])

  return (
    <div className="min-h-full bg-slate-100 px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">Dashboard</h1>
            {error ? <p className="mt-1 text-xs font-medium text-rose-500">Firebase: {error}</p> : null}
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded border border-blue-100 bg-white px-3 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
            {loading ? "Syncing" : "Manage"}
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {dashboardData.stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_280px]">
          <article className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-950">Orders Over Time</h2>
                <div className="mt-5 flex gap-10">
                  <div>
                    <p className="text-xl font-bold text-slate-950">{dashboardData.todayTotal}</p>
                    <p className="mt-1 text-xs text-slate-400">Orders today</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-950">{dashboardData.yesterdayTotal}</p>
                    <p className="mt-1 text-xs text-slate-400">Orders yesterday</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5 text-xs text-slate-400">
                <span>Last 12 Hours</span>
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </div>

            <div className="flex justify-end gap-5 pb-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                Yesterday
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Today
              </span>
            </div>

            <div className="h-72 overflow-hidden rounded-md">
              <svg viewBox="0 0 760 300" className="h-full w-full" role="img" aria-label="Orders over time chart">
                {[40, 80, 120, 160, 200, 240].map((y) => (
                  <line key={y} x1="42" x2="748" y1={y} y2={y} stroke="#edf2f7" strokeDasharray="4 6" />
                ))}
                {[0, 2, 4, 6, 8, 10].map((tick, index) => (
                  <text key={tick} x="8" y={246 - index * 40} className="fill-slate-300 text-[11px]">
                    {tick}
                  </text>
                ))}
                <path
                  d={dashboardData.yesterdayPath}
                  fill="none"
                  stroke="#d8e2ef"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={dashboardData.todayPath}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="44" cy="250" r="0" fill="transparent" />
                {dashboardData.chartLabels.map((label, index) => (
                  <text key={`${label}-${index}`} x={72 + index * 58} y="292" textAnchor="middle" className="fill-slate-300 text-[11px]">
                    {label}
                  </text>
                ))}
              </svg>
            </div>
          </article>

          <aside className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-base font-bold text-slate-950">Last 7 Days Sales</h2>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-2xl font-bold text-slate-950">{formatShortNumber(dashboardData.totalItemsSold)}</p>
                <p className="mt-1 text-xs text-slate-400">Items Sold</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950">{formatCurrency(dashboardData.sevenDayRevenue)}</p>
                <p className="mt-1 text-xs text-slate-400">Revenue</p>
              </div>
            </div>
            <div className="my-7 h-px bg-slate-100" />
            <div className="relative flex h-48 items-end justify-between gap-3 px-2">
              <div className="absolute left-[36%] top-4 rounded bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-md">
                {formatCurrency(dashboardData.maxSaleRevenue)}
              </div>
              {dashboardData.sales.map((day) => (
                <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className="w-full max-w-4 rounded-t bg-emerald-400"
                    style={{ height: `${Math.max((day.revenue / dashboardData.maxSaleRevenue) * 100, day.revenue > 0 ? 12 : 4)}%` }}
                  />
                  <span className="text-[10px] font-medium text-slate-300">{day.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-2">
          <article className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-base font-bold text-slate-950">Recent Transactions</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-medium text-slate-400">
                    <th className="py-3">Name</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.transactions.length > 0 ? (
                    dashboardData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 font-semibold text-slate-800">{transaction.name}</td>
                        <td className="py-3 text-slate-600">{transaction.date}</td>
                        <td className="py-3 text-slate-800">{formatCurrency(transaction.amount)}</td>
                        <td className="py-3">
                          <StatusBadge status={transaction.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-8 text-center text-sm text-slate-400" colSpan={4}>
                        No orders or quotes found in Firebase.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-base font-bold text-slate-950">Top Products by Units Sold</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-medium text-slate-400">
                    <th className="py-3">Name</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.products.length > 0 ? (
                    dashboardData.products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-2">
                          <div className="flex items-center gap-3">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={34}
                              height={34}
                              className="h-9 w-9 rounded object-cover ring-1 ring-slate-100"
                            />
                            <span className="font-semibold text-slate-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-2 text-slate-800">{formatCurrency(product.price)}</td>
                        <td className="py-2 text-slate-800">{product.units}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-8 text-center text-sm text-slate-400" colSpan={3}>
                        No products found in Firebase.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
