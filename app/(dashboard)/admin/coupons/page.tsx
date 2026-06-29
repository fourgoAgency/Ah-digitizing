"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Edit2, Plus, Search, Trash2 } from "lucide-react"
import { serverTimestamp } from "firebase/firestore"
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firebase"
import CouponForm, { CouponFormState, emptyCouponForm } from "@/components/(dashboard)/CouponForm"

type CouponStatus = "Active" | "Expired"

type Coupon = {
  id: string
  code: string
  name: string
  type: CouponFormState["type"]
  usage: number
  status: CouponStatus
  date: string
  discountValue: string
  appliesTo?: string
  selectedProductIds?: string[]
}

// Shape stored in Firestore (no `id` — that comes from the doc ref)
type CouponDoc = Omit<Coupon, "id"> & {
  appliesTo?: string
  selectedProductIds?: string[]
  createdAt?: unknown
  updatedAt?: unknown
}

const tabs = ["All Coupons", "Active Coupons", "Expired Coupons"] as const

function formatTypeLabel(type: Coupon["type"]) {
  switch (type) {
    case "fixed":         return "Fixed Discount"
    case "percentage":    return "Percentage Discount"
    case "free-shipping": return "Free Shipping"
    case "price":         return "Price Discount"
  }
}

function buildDateString(form: CouponFormState): string {
  if (!form.limitDate && form.startDate && form.endDate) {
    return `${form.startDate} - ${form.endDate}`
  }
  return "No duration set"
}

export default function CouponsPage() {
  const [coupons, setCoupons]         = useState<Coupon[]>([])
  const [loading, setLoading]         = useState(true)
  const [fetchError, setFetchError]   = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab]     = useState<(typeof tabs)[number]>("All Coupons")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage]               = useState(1)

  const [formOpen, setFormOpen]       = useState(false)
  const [saving, setSaving]           = useState(false)
  const [formError, setFormError]     = useState<string | null>(null)
  const [form, setForm]               = useState<CouponFormState>(emptyCouponForm)
  const [editingId, setEditingId]     = useState<string | null>(null)

  const pageSize = 8

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      // getDocuments returns Array<CouponDoc & { id: string }> sorted by Firestore default order
      const docs = await getDocuments<CouponDoc>("coupons")
      const result: Coupon[] = docs.map((d) => ({
        id:                 d.id,
        code:               d.code               ?? "",
        name:               d.name               ?? "",
        type:               d.type               ?? "percentage",
        usage:              d.usage              ?? 0,
        status:             d.status             ?? "Active",
        date:               d.date               ?? "",
        discountValue:      d.discountValue      ?? "",
        appliesTo:          d.appliesTo          ?? "all-products",
        selectedProductIds: d.selectedProductIds ?? [],
      }))
      // newest first (createdAt desc) — sort client-side since getDocuments uses getDocs without orderBy
      setCoupons(result.reverse())
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load coupons.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  // ─── Filter + paginate ────────────────────────────────────────────────────
  const filteredCoupons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return coupons.filter((c) => {
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        formatTypeLabel(c.type).toLowerCase().includes(q)
      const matchesTab =
        activeTab === "All Coupons" ||
        (activeTab === "Active Coupons"  && c.status === "Active")  ||
        (activeTab === "Expired Coupons" && c.status === "Expired")
      return matchesSearch && matchesTab
    })
  }, [activeTab, coupons, searchQuery])

  const pageCount      = Math.max(Math.ceil(filteredCoupons.length / pageSize), 1)
  const currentPage    = Math.min(page, pageCount)
  const visibleCoupons = filteredCoupons.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const visibleIds     = visibleCoupons.map((c) => c.id)
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))

  // ─── Form helpers ─────────────────────────────────────────────────────────
  function openCreateCoupon() {
    setForm(emptyCouponForm)
    setEditingId(null)
    setFormError(null)
    setFormOpen(true)
  }

  function openEditCoupon(coupon: Coupon & { selectedProductIds?: string[]; appliesTo?: string }) {
    setForm({
      code:               coupon.code,
      name:               coupon.name,
      type:               coupon.type,
      discountValue:      coupon.discountValue,
      appliesTo:          coupon.appliesTo ?? "all-products",
      selectedProductIds: coupon.selectedProductIds ?? [],
      startDate:          "",
      endDate:            "",
      usageLimit:         "",
      limitDate:          false,
      limitUsage:         false,
      notes:              "",
    })
    setEditingId(coupon.id)
    setFormError(null)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setFormError(null)
    setForm(emptyCouponForm)
    setEditingId(null)
  }

  // ─── Selection ────────────────────────────────────────────────────────────
  function toggleSelected(id: string) {
    setSelectedIds((cur) =>
      cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id]
    )
  }

  function toggleAllVisible() {
    setSelectedIds((cur) => {
      if (allVisibleSelected) return cur.filter((id) => !visibleIds.includes(id))
      return [...cur, ...visibleIds.filter((id) => !cur.includes(id))]
    })
  }

  // ─── Delete ───────────────────────────────────────────────────────────────
  async function deleteSelected() {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Delete ${selectedIds.length} selected coupon${selectedIds.length === 1 ? "" : "s"}?`)) return
    try {
      await Promise.all(selectedIds.map((id) => deleteDocument("coupons", id)))
      setCoupons((cur) => cur.filter((c) => !selectedIds.includes(c.id)))
      setSelectedIds([])
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete coupons.")
    }
  }

  async function deleteCoupon(id: string) {
    if (!window.confirm("Delete this coupon?")) return
    try {
      await deleteDocument("coupons", id)
      setCoupons((cur) => cur.filter((c) => c.id !== id))
      setSelectedIds((cur) => cur.filter((i) => i !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete coupon.")
    }
  }

  // ─── Create / Update ──────────────────────────────────────────────────────
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const code = form.code.trim().toUpperCase()
    const name = form.name.trim()

    if (!code || !name) {
      setFormError("Coupon code and name are required.")
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      const date = buildDateString(form)

      if (editingId) {
        // ── UPDATE ──────────────────────────────────────────────────────────
        const patch: Partial<CouponDoc> = {
          code,
          name,
          type:               form.type,
          discountValue:      form.discountValue.trim(),
          date,
          appliesTo:          form.appliesTo,
          selectedProductIds: form.appliesTo === "selected-products" ? form.selectedProductIds : [],
          updatedAt:          serverTimestamp(),
        }
        await updateDocument<CouponDoc>("coupons", editingId, patch)
        setCoupons((cur) =>
          cur.map((c) =>
            c.id === editingId
              ? { ...c, code, name, type: form.type, discountValue: form.discountValue.trim(), date }
              : c
          )
        )
      } else {
        // ── CREATE ──────────────────────────────────────────────────────────
        const payload: CouponDoc = {
          code,
          name,
          type:               form.type,
          discountValue:      form.discountValue.trim(),
          usage:              0,
          status:             "Active",
          date,
          appliesTo:          form.appliesTo,
          selectedProductIds: form.appliesTo === "selected-products" ? form.selectedProductIds : [],
          createdAt:          serverTimestamp(),
          updatedAt:          serverTimestamp(),
        }
        const newId = await createDocument<CouponDoc>("coupons", payload)
        const newCoupon: Coupon = { id: newId, code, name, type: form.type, discountValue: form.discountValue.trim(), usage: 0, status: "Active", date }
        setCoupons((cur) => [newCoupon, ...cur])
      }

      closeForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to save coupon.")
    } finally {
      setSaving(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[#f5f6fb] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">Coupons</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create discount codes, track usage, and manage coupon status.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateCoupon}
            className="inline-flex h-9 items-center gap-2 rounded bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </header>

        <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
          {/* Tabs + search */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => {
                const active = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => { setActiveTab(tab); setPage(1) }}
                    className={`rounded px-3 py-2 text-xs font-semibold transition ${
                      active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <input
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  placeholder="Search..."
                  className="h-10 w-72 rounded border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={deleteSelected}
                disabled={selectedIds.length === 0}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label="Delete selected coupons"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Fetch error */}
          {fetchError && (
            <p className="mb-4 rounded border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
              {fetchError}
            </p>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-y border-slate-100 text-xs font-medium text-slate-400">
                  <th className="w-10 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                  </th>
                  <th className="py-3">Coupon Name</th>
                  <th className="py-3">Usage</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                      Loading coupons…
                    </td>
                  </tr>
                ) : visibleCoupons.length > 0 ? (
                  visibleCoupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="border-b border-slate-100 text-xs text-slate-700 hover:bg-slate-50/70"
                    >
                      <td className="py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(coupon.id)}
                          onChange={() => toggleSelected(coupon.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white ring-1 ring-blue-100">
                            <Edit2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{coupon.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {coupon.code}
                              {coupon.discountValue ? ` • ${coupon.discountValue}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{coupon.usage} times</td>
                      <td className="py-3">
                        <span
                          className={`rounded px-2 py-1 text-[11px] font-semibold ${
                            coupon.status === "Active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {coupon.status}
                        </span>
                      </td>
                      <td className="py-3">{coupon.date}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditCoupon(coupon)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                            aria-label={`Edit ${coupon.name}`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCoupon(coupon.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                            aria-label={`Delete ${coupon.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <footer className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((cur) => Math.max(cur - 1, 1))}
                className="h-8 min-w-8 rounded text-slate-500 hover:bg-slate-100"
              >
                &larr;
              </button>
              {Array.from({ length: Math.min(pageCount, 6) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 rounded ${
                    n === currentPage ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              {pageCount > 6 ? <span className="px-2">…</span> : null}
              <button
                type="button"
                onClick={() => setPage((cur) => Math.min(cur + 1, pageCount))}
                className="h-8 min-w-8 rounded text-slate-500 hover:bg-slate-100"
              >
                &rarr;
              </button>
            </div>
            <span>{filteredCoupons.length} Results</span>
          </footer>
        </section>
      </div>

      <CouponForm
        open={formOpen}
        saving={saving}
        onClose={closeForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        error={formError}
        isEditing={!!editingId}
      />
    </div>
  )
}