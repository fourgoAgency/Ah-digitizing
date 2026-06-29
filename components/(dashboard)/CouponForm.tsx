"use client"

import { FormEvent, useEffect, useState } from "react"
import { FiCalendar, FiPercent, FiTag } from "react-icons/fi"
import { Search, X, Package } from "lucide-react"
import { getDocuments } from "@/lib/firebase"

// ── Product type (matches your Firestore `products` collection) ──────────────
type Product = {
  id: string
  title: string
  price?: number
  heroImage?: string
  category?: string
}

export type CouponFormState = {
  code: string
  name: string
  type: "fixed" | "percentage" | "free-shipping" | "price"
  discountValue: string
  appliesTo: string
  selectedProductIds: string[]   // ← new
  startDate: string
  endDate: string
  usageLimit: string
  limitDate: boolean
  limitUsage: boolean
  notes: string
}

type CouponFormProps = {
  open: boolean
  saving?: boolean
  isEditing?: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  form: CouponFormState
  setForm: React.Dispatch<React.SetStateAction<CouponFormState>>
  error?: string | null
}

const couponTypes = [
  { value: "fixed",         label: "Fixed Discount",     icon: FiTag },
  { value: "percentage",    label: "Percentage Discount", icon: FiPercent },
  { value: "free-shipping", label: "Free Shipping",       icon: FiCalendar },
  { value: "price",         label: "Price Discount",      icon: FiTag },
] as const

export const emptyCouponForm: CouponFormState = {
  code:               "",
  name:               "",
  type:               "percentage",
  discountValue:      "",
  appliesTo:          "all-products",
  selectedProductIds: [],
  startDate:          "",
  endDate:            "",
  usageLimit:         "",
  limitDate:          false,
  limitUsage:         false,
  notes:              "",
}

// ── Product Picker sub-component ─────────────────────────────────────────────
function ProductPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  const [products, setProducts]     = useState<Product[]>([])
  const [loading, setLoading]       = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getDocuments<Product>("products")
      .then((docs) => setProducts(docs))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id]
    )
  }

  function removeSelected(id: string) {
    onChange(selectedIds.filter((i) => i !== id))
  }

  const filtered = products.filter((p) =>
    !searchQuery.trim() ||
    p.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    (p.category ?? "").toLowerCase().includes(searchQuery.trim().toLowerCase())
  )

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id))

  return (
    <div className="space-y-3">
      {/* Selected pills */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200"
            >
              {p.title}
              <button
                type="button"
                onClick={() => removeSelected(p.id)}
                className="text-blue-400 hover:text-blue-700"
                aria-label={`Remove ${p.title}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products…"
          className="h-9 w-full rounded border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-blue-500"
        />
      </div>

      {/* Product list */}
      <div className="max-h-56 overflow-y-auto rounded border border-slate-200 bg-white">
        {loading ? (
          <p className="px-4 py-6 text-center text-xs text-slate-400">Loading products…</p>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-slate-400">No products found.</p>
        ) : (
          filtered.map((product) => {
            const checked = selectedIds.includes(product.id)
            return (
              <label
                key={product.id}
                className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-0 hover:bg-slate-50 ${
                  checked ? "bg-blue-50/60" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(product.id)}
                  className="h-4 w-4 accent-blue-600"
                />
                {product.heroImage ? (
                  <img
                    src={product.heroImage}
                    alt={product.title}
                    className="h-8 w-8 rounded object-cover ring-1 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-400">
                    <Package className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{product.title}</p>
                  {product.category && (
                    <p className="text-[10px] text-slate-400">{product.category}</p>
                  )}
                </div>
                {product.price != null && (
                  <span className="shrink-0 text-[11px] font-semibold text-slate-500">
                    ${product.price}
                  </span>
                )}
              </label>
            )
          })
        )}
      </div>

      <p className="text-[11px] text-slate-400">
        {selectedIds.length === 0
          ? "No products selected"
          : `${selectedIds.length} product${selectedIds.length === 1 ? "" : "s"} selected`}
      </p>
    </div>
  )
}

// ── Main CouponForm ───────────────────────────────────────────────────────────
export default function CouponForm({
  open,
  saving,
  isEditing = false,
  onClose,
  onSubmit,
  form,
  setForm,
  error,
}: CouponFormProps) {
  if (!open) return null

  function updateForm<K extends keyof CouponFormState>(key: K, value: CouponFormState[K]) {
    setForm((cur) => ({ ...cur, [key]: value }))
  }

  const title       = isEditing ? "Edit Coupon"   : "Create Coupon"
  const submitLabel = saving    ? "Saving…"        : isEditing ? "Update" : "Save"

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-5xl rounded-md bg-slate-50 p-6 shadow-lg ring-1 ring-slate-100"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-slate-500 hover:text-blue-600"
            >
              &larr; Back
            </button>
            <h2 className="mt-1 text-lg font-bold text-slate-950">{title}</h2>
            <p className="text-xs text-slate-500">Define coupon details, validity, and usage controls.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded border border-slate-200 bg-white px-4 text-xs font-semibold text-blue-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-8 rounded bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
            >
              {submitLabel}
            </button>
          </div>
        </div>

        {error ? (
          <p className="mb-4 rounded border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
            {error}
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            {/* Coupon Information */}
            <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-1 text-sm font-bold text-slate-950">Coupon Information</h3>
              <p className="mb-4 text-xs text-slate-500">Code will be used by users at checkout.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">Coupon Code</span>
                  <input
                    value={form.code}
                    onChange={(e) => updateForm("code", e.target.value)}
                    placeholder="SPRING20"
                    className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">Coupon Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Spring Sale"
                    className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
              </div>
            </section>

            {/* Coupon Type */}
            <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-1 text-sm font-bold text-slate-950">Coupon Type</h3>
              <p className="mb-4 text-xs text-slate-500">Type of coupon you want to create.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {couponTypes.map((type) => {
                  const Icon   = type.icon
                  const active = form.type === type.value
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateForm("type", type.value)}
                      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border px-4 py-5 text-sm font-semibold transition ${
                        active
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Conditions */}
            <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-4 text-sm font-bold text-slate-950">Conditions</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">
                    {form.type === "percentage" ? "Discount Percentage" : "Discount Value"}
                  </span>
                  <input
                    value={form.discountValue}
                    onChange={(e) => updateForm("discountValue", e.target.value)}
                    inputMode="decimal"
                    placeholder={form.type === "percentage" ? "20" : "Amount"}
                    className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">Applies To</span>
                  <select
                    value={form.appliesTo}
                    onChange={(e) => {
                      updateForm("appliesTo", e.target.value)
                      // clear selection when switching away from selected-products
                      if (e.target.value !== "selected-products") {
                        updateForm("selectedProductIds", [])
                      }
                    }}
                    className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="all-products">All Products</option>
                    <option value="selected-products">Selected Products</option>
                    <option value="collections">Collections</option>
                  </select>
                </label>
              </div>

              {/* Product picker — only shown when "Selected Products" is chosen */}
              {form.appliesTo === "selected-products" && (
                <div className="mt-4">
                  <span className="mb-2 block text-[11px] font-semibold text-slate-500">
                    Select Products
                  </span>
                  <ProductPicker
                    selectedIds={form.selectedProductIds}
                    onChange={(ids) => updateForm("selectedProductIds", ids)}
                  />
                </div>
              )}
            </section>

            {/* Advanced */}
            <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-4 text-sm font-bold text-slate-950">Advanced</h3>
              <label className="mb-4 block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-500">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  rows={4}
                  placeholder="Internal coupon notes"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </label>
            </section>
          </div>

          <aside className="space-y-5">
            {/* Validity */}
            <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-4 text-sm font-bold text-slate-950">Validity</h3>
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">Start Date</span>
                  <input
                    value={form.startDate}
                    onChange={(e) => updateForm("startDate", e.target.value)}
                    type="date"
                    className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">End Date</span>
                  <input
                    value={form.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    type="date"
                    className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.limitDate}
                    onChange={(e) => updateForm("limitDate", e.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Don&apos;t set duration
                </label>
              </div>
            </section>

            {/* Usage Limits */}
            <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-4 text-sm font-bold text-slate-950">Usage Limits</h3>
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">Amount of Uses</span>
                  <input
                    value={form.usageLimit}
                    onChange={(e) => updateForm("usageLimit", e.target.value)}
                    inputMode="numeric"
                    placeholder="100"
                    className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.limitUsage}
                    onChange={(e) => updateForm("limitUsage", e.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Don&apos;t limit amount of uses
                </label>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded border border-slate-200 bg-white px-4 text-xs font-semibold text-blue-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-8 rounded bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}