"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { collection, onSnapshot, serverTimestamp } from "firebase/firestore"
import { Download, Edit2, Plus, Search, Trash2 } from "lucide-react"
import { deleteDocument, firestore, setDocument, updateDocument } from "@/lib/firebase"

type CategoryDocument = {
  id: string
  slug: string
  label: string
  order?: number
  subcategories?: CategorySubcategoryDocument[]
}

type CategorySubcategoryDocument = {
  label: string
  slug?: string
  href?: string
  order?: number
}

type ProductType = "top-selling" | "free" | "bulk" | "none"

type ProductDocument = {
  id: string
  productId?: number | string
  slug?: string
  title?: string
  category?: string
  categoryLabel?: string
  subcategory?: string
  subcategoryLabel?: string
  shortDescription?: string
  description?: string
  price?: number | string
  discountPrice?: number | string
  inventory?: number | string
  color?: string
  rating?: number | string
  votes?: number | string
  turnaround?: string
  revisions?: string
  totalSold?: number | string
  heroImage?: string
  gallery?: string[]
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  hasMultipleOptions?: boolean
  optionName?: string
  optionValues?: string[]
  weight?: string
  country?: string
  digitalProduct?: boolean
  productType?: ProductType
}

type ProductFormState = {
  title: string
  slug: string
  shortDescription: string
  description: string
  category: string
  subcategory: string
  heroImage: string
  galleryText: string
  price: string
  discountPrice: string
  inventory: string
  color: string
  rating: string
  votes: string
  turnaround: string
  revisions: string
  totalSold: string
  tagsText: string
  seoTitle: string
  seoDescription: string
  hasMultipleOptions: boolean
  optionName: string
  optionValuesText: string
  weight: string
  country: string
  digitalProduct: boolean
  productType: ProductType
}

const pageSize = 10

const emptyForm: ProductFormState = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "",
  subcategory: "",
  heroImage: "",
  galleryText: "",
  price: "",
  discountPrice: "",
  inventory: "",
  color: "",
  rating: "",
  votes: "",
  turnaround: "",
  revisions: "",
  totalSold: "",
  tagsText: "",
  seoTitle: "",
  seoDescription: "",
  hasMultipleOptions: false,
  optionName: "Size",
  optionValuesText: "S, M, L, XL",
  weight: "",
  country: "",
  digitalProduct: true,
  productType: "none",
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,]/g, ""))
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(asNumber(value))
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function splitList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getProductTitle(product: ProductDocument) {
  return product.title?.trim() || "Untitled Product"
}

function getProductCategoryLabel(product: ProductDocument) {
  if (product.categoryLabel && product.subcategoryLabel) {
    return `${product.categoryLabel} / ${product.subcategoryLabel}`
  }
  return product.categoryLabel || product.category || "Uncategorized"
}

function productToForm(product: ProductDocument): ProductFormState {
  return {
    title: product.title || "",
    slug: product.slug || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    heroImage: product.heroImage || "",
    galleryText: Array.isArray(product.gallery) ? product.gallery.join("\n") : "",
    price: product.price === undefined ? "" : String(product.price),
    discountPrice: product.discountPrice === undefined ? "" : String(product.discountPrice),
    inventory: product.inventory === undefined ? "" : String(product.inventory),
    color: product.color || "",
    rating: product.rating === undefined ? "" : String(product.rating),
    votes: product.votes === undefined ? "" : String(product.votes),
    turnaround: product.turnaround || "",
    revisions: product.revisions || "",
    totalSold: product.totalSold === undefined ? "" : String(product.totalSold),
    tagsText: Array.isArray(product.tags) ? product.tags.join(", ") : "",
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    hasMultipleOptions: Boolean(product.hasMultipleOptions),
    optionName: product.optionName || "Size",
    optionValuesText: Array.isArray(product.optionValues) ? product.optionValues.join(", ") : "",
    weight: product.weight || "",
    country: product.country || "",
    digitalProduct: product.digitalProduct !== false,
    productType: (product.productType as ProductType) || "none",
  }
}

function ProductField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  )
}

const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "top-selling", label: "Top Selling" },
  { value: "free", label: "Free Product" },
  { value: "bulk", label: "Bulk Product" },
  { value: "none", label: "None of these" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDocument[]>([])
  const [categories, setCategories] = useState<CategoryDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState<"all" | ProductType>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null)
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(null)
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "products"),
      (snapshot) => {
        setProducts(
          snapshot.docs
            .map((document) => ({ ...document.data(), id: document.id }))
            .sort((a, b) => getProductTitle(a).localeCompare(getProductTitle(b)))
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
    const unsubscribe = onSnapshot(collection(firestore, "category"), (snapshot) => {
      setCategories(
        snapshot.docs
          .map((document) => ({ ...document.data(), id: document.id } as CategoryDocument))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      )
    })
    return () => unsubscribe()
  }, [])

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        getProductTitle(product).toLowerCase().includes(query) ||
        String(product.slug || "").toLowerCase().includes(query) ||
        getProductCategoryLabel(product).toLowerCase().includes(query)

      const matchesCategory =
        filterCategory === "all" ||
        product.category === filterCategory ||
        product.subcategory === filterCategory

      const matchesType =
        filterType === "all" ||
        (filterType === "none"
          ? !product.productType || product.productType === "none"
          : product.productType === filterType)

      return matchesSearch && matchesCategory && matchesType
    })
  }, [filterCategory, filterType, products, searchQuery])

  const pageCount = Math.max(Math.ceil(filteredProducts.length / pageSize), 1)
  const currentPage = Math.min(page, pageCount)
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const visibleIds = visibleProducts.map((product) => product.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))

  function updateForm<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => {
      if (key === "title" && !editingProduct) {
        return {
          ...current,
          title: value as string,
          slug: slugify(value as string),
          seoTitle: current.seoTitle || (value as string),
        }
      }
      if (key === "category") {
        return { ...current, category: value as string, subcategory: "" }
      }
      return { ...current, [key]: value }
    })
  }

  function openAddDialog() {
    setDialogMode("add")
    setEditingProduct(null)
    setForm(emptyForm)
    setFormError(null)
  }

  function openEditDialog(product: ProductDocument) {
    setDialogMode("edit")
    setEditingProduct(product)
    setForm(productToForm(product))
    setFormError(null)
  }

  function closeDialog() {
    setDialogMode(null)
    setEditingProduct(null)
    setForm(emptyForm)
    setFormError(null)
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    )
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id))
      return [...current, ...visibleIds.filter((id) => !current.includes(id))]
    })
  }

  async function deleteSelectedProducts() {
    if (selectedIds.length === 0) return
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected product${selectedIds.length === 1 ? "" : "s"}?`)
    if (!confirmed) return
    await Promise.all(selectedIds.map((id) => deleteDocument("products", id)))
    setSelectedIds([])
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm("Delete this product?")
    if (!confirmed) return
    await deleteDocument("products", id)
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
  }

  function exportProducts() {
    const csv = [
      ["Product", "Category", "Price", "Tags", "Status", "Type"].map((item) => `"${item}"`).join(","),
      ...filteredProducts.map((product) =>
        [
          getProductTitle(product),
          getProductCategoryLabel(product),
          product.price ?? "",
          Array.isArray(product.tags) ? product.tags.join("; ") : "",
          asNumber(product.inventory) <= 0 ? "Out of Stock" : "In Stock",
          product.productType || "none",
        ]
          .map((item) => `"${String(item).replaceAll('"', '""')}"`)
          .join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "products.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = form.title.trim()
    const slug = slugify(form.slug || form.title)
    const category = categories.find((item) => item.slug === form.category)
    const subcategory = category?.subcategories?.find(
      (item) => (item.slug || slugify(item.label)) === form.subcategory
    )

    if (!title || !slug) {
      setFormError("Product name and slug are required.")
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      const payload = {
        title,
        slug,
        productId: editingProduct?.productId ?? Date.now(),
        category: form.category || category?.slug || "",
        categoryLabel: category?.label || form.category || "Uncategorized",
        subcategory: form.subcategory || subcategory?.slug || "",
        subcategoryLabel: subcategory?.label || form.subcategory || "",
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        price: asNumber(form.price),
        discountPrice: form.discountPrice ? asNumber(form.discountPrice) : null,
        inventory: asNumber(form.inventory),
        color: form.color.trim(),
        rating: form.rating ? asNumber(form.rating) : 0,
        votes: form.votes ? asNumber(form.votes) : 0,
        turnaround: form.turnaround.trim(),
        revisions: form.revisions.trim(),
        totalSold: form.totalSold ? asNumber(form.totalSold) : 0,
        heroImage: form.heroImage.trim(),
        gallery: splitList(form.galleryText),
        tags: splitList(form.tagsText),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        hasMultipleOptions: form.hasMultipleOptions,
        optionName: form.optionName.trim(),
        optionValues: splitList(form.optionValuesText),
        weight: form.weight.trim(),
        country: form.country.trim(),
        digitalProduct: form.digitalProduct,
        productType: form.productType,
        updatedAt: serverTimestamp(),
      }

      if (editingProduct) {
        await updateDocument("products", editingProduct.id, payload)
      } else {
        await setDocument("products", slug, {
          ...payload,
          createdAt: serverTimestamp(),
        })
      }

      closeDialog()
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save product.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-[#f5f6fb] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">Products</h1>
            {error ? <p className="mt-1 text-xs font-medium text-rose-500">Firebase: {error}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportProducts}
              className="inline-flex h-9 items-center gap-2 rounded border border-blue-100 bg-white px-3 text-xs font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              type="button"
              onClick={openAddDialog}
              className="inline-flex h-9 items-center gap-2 rounded bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </header>

        <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterCategory}
                onChange={(event) => {
                  setFilterCategory(event.target.value)
                  setPage(1)
                }}
                className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-500 outline-none focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(event) => {
                  setFilterType(event.target.value as typeof filterType)
                  setPage(1)
                }}
                className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-500 outline-none focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="top-selling">Top Selling</option>
                <option value="free">Free</option>
                <option value="bulk">Bulk</option>
                <option value="none">None of these</option>
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
                onClick={deleteSelectedProducts}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label="Delete selected products"
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
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                  </th>
                  <th className="py-3">Product</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Tags</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                      Loading products...
                    </td>
                  </tr>
                ) : visibleProducts.length > 0 ? (
                  visibleProducts.map((product) => {
                    const isOutOfStock = asNumber(product.inventory) <= 0

                    return (
                      <tr key={product.id} className="border-b border-slate-100 text-xs text-slate-700 hover:bg-slate-50/70">
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(product.id)}
                            onChange={() => toggleSelected(product.id)}
                            className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                          />
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded bg-slate-100 ring-1 ring-slate-100">
                              {product.heroImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={product.heroImage} alt={getProductTitle(product)} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-[10px] text-slate-400">No img</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-800">{getProductTitle(product)}</p>
                              {product.productType && product.productType !== "none" ? (
                                <span className="mt-0.5 inline-block rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold capitalize text-blue-500">
                                  {product.productType.replace("-", " ")}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-[11px] text-slate-500">{getProductCategoryLabel(product)}</td>
                        <td className="py-3 font-semibold text-slate-800">{formatCurrency(product.price)}</td>
                        <td className="py-3 max-w-[160px] truncate text-[11px] text-slate-400">
                          {product.tags?.slice(0, 3).join(", ") || "—"}
                        </td>
                        <td className="py-3">
                          {isOutOfStock ? (
                            <span className="rounded bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-500">Out of Stock</span>
                          ) : (
                            <span className="rounded bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">In Stock</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditDialog(product)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                              aria-label={`Edit ${getProductTitle(product)}`}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(product.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                              aria-label={`Delete ${getProductTitle(product)}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                      No products found.
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
                &larr;
              </button>
              {Array.from({ length: Math.min(pageCount, 6) }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-8 min-w-8 rounded ${pageNumber === currentPage ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`}
                >
                  {pageNumber}
                </button>
              ))}
              {pageCount > 6 ? <span className="px-2">...</span> : null}
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(current + 1, pageCount))}
                className="h-8 min-w-8 rounded text-slate-500 hover:bg-slate-100"
              >
                &rarr;
              </button>
            </div>
            <span>{filteredProducts.length} Results</span>
          </footer>
        </section>
      </div>

      {dialogMode ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-6" role="dialog" aria-modal="true">
          <form onSubmit={saveProduct} className="mx-auto w-full max-w-5xl bg-slate-50 p-6 rounded-md shadow-lg ring-1 ring-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <button type="button" onClick={closeDialog} className="text-xs font-medium text-slate-500 hover:text-blue-600">
                  &larr; Back
                </button>
                <h2 className="mt-1 text-lg font-bold text-slate-950">{dialogMode === "add" ? "Add Product" : "Edit Product"}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={closeDialog} className="h-8 rounded border border-slate-200 bg-white px-4 text-xs font-semibold text-blue-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="h-8 rounded bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {formError ? (
              <p className="mb-4 rounded border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{formError}</p>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Information</h3>
                  <div className="grid gap-4">
                    <ProductField label="Product Name">
                      <input
                        value={form.title}
                        onChange={(event) => updateForm("title", event.target.value)}
                        placeholder="Summer T-shirt"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Slug">
                      <input
                        value={form.slug}
                        onChange={(event) => updateForm("slug", slugify(event.target.value))}
                        placeholder="summer-t-shirt"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Product Short Description">
                      <textarea
                        value={form.shortDescription}
                        onChange={(event) => updateForm("shortDescription", event.target.value)}
                        rows={2}
                        placeholder="Brief product caption"
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Product Description">
                      <textarea
                        value={form.description}
                        onChange={(event) => updateForm("description", event.target.value)}
                        rows={4}
                        placeholder="Product description"
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                  </div>
                </section>

                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Images</h3>
                  <div className="rounded-md border border-dashed border-slate-200 p-4">
                    <ProductField label="Main Image URL">
                      <input
                        value={form.heroImage}
                        onChange={(event) => updateForm("heroImage", event.target.value)}
                        placeholder="/home-page/products picture/1.png"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <div className="mt-4">
                      <ProductField label="Gallery URLs">
                        <textarea
                          value={form.galleryText}
                          onChange={(event) => updateForm("galleryText", event.target.value)}
                          rows={4}
                          placeholder="One image URL per line"
                          className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </ProductField>
                    </div>
                  </div>
                </section>

                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Price</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProductField label="Product Price">
                      <input
                        value={form.price}
                        onChange={(event) => updateForm("price", event.target.value)}
                        inputMode="decimal"
                        placeholder="Enter price"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Discount Price">
                      <input
                        value={form.discountPrice}
                        onChange={(event) => updateForm("discountPrice", event.target.value)}
                        inputMode="decimal"
                        placeholder="Price at Discount"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                  </div>
                  <label className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <input
                      type="checkbox"
                      checked={Boolean(form.discountPrice)}
                      onChange={(event) => updateForm("discountPrice", event.target.checked ? form.price : "")}
                      className="h-4 w-4 accent-blue-600"
                    />
                    Add tax for this product
                  </label>
                </section>

                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Different Options</h3>
                  <label className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.hasMultipleOptions}
                      onChange={(event) => updateForm("hasMultipleOptions", event.target.checked)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    This product has multiple options
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProductField label="Option Name">
                      <input
                        value={form.optionName}
                        onChange={(event) => updateForm("optionName", event.target.value)}
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Option Values">
                      <input
                        value={form.optionValuesText}
                        onChange={(event) => updateForm("optionValuesText", event.target.value)}
                        placeholder="S, M, L, XL"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                  </div>
                </section>

                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Shipping</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProductField label="Weight">
                      <input
                        value={form.weight}
                        onChange={(event) => updateForm("weight", event.target.value)}
                        placeholder="Enter Weight"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Country">
                      <input
                        value={form.country}
                        onChange={(event) => updateForm("country", event.target.value)}
                        placeholder="Select Country"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                  </div>
                  <label className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.digitalProduct}
                      onChange={(event) => updateForm("digitalProduct", event.target.checked)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    This is digital product
                  </label>
                </section>
              </div>

              <aside className="space-y-5">
                {/* Product Type */}
                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Product Type</h3>
                  <div className="grid gap-2">
                    {PRODUCT_TYPE_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name="productType"
                          checked={form.productType === option.value}
                          onChange={() => updateForm("productType", option.value)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </section>

                {/* Categories */}
                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const subcategories = category.subcategories ?? []
                      return (
                        <div key={category.id} className="rounded border border-slate-100 p-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <input
                              type="radio"
                              name="category"
                              checked={form.category === category.slug}
                              onChange={() => updateForm("category", category.slug)}
                              className="h-4 w-4 accent-blue-600"
                            />
                            {category.label}
                          </label>
                          {form.category === category.slug && subcategories.length > 0 ? (
                            <div className="mt-3 grid gap-2 pl-6">
                              {subcategories.map((subcategory) => {
                                const subSlug = subcategory.slug || slugify(subcategory.label)
                                return (
                                  <label key={`${category.slug}-${subSlug}`} className="flex items-center gap-2 text-sm text-slate-500">
                                    <input
                                      type="radio"
                                      name="subcategory"
                                      checked={form.subcategory === subSlug}
                                      onChange={() => updateForm("subcategory", subSlug)}
                                      className="h-4 w-4 accent-blue-600"
                                    />
                                    {subcategory.label}
                                  </label>
                                )
                              })}
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Product Data */}
                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Product Data</h3>
                  <div className="grid gap-4">
                    <ProductField label="Inventory">
                      <input
                        value={form.inventory}
                        onChange={(event) => updateForm("inventory", event.target.value)}
                        inputMode="numeric"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Color">
                      <input
                        value={form.color}
                        onChange={(event) => updateForm("color", event.target.value)}
                        placeholder="Black"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Rating">
                      <input
                        value={form.rating}
                        onChange={(event) => updateForm("rating", event.target.value)}
                        inputMode="decimal"
                        placeholder="5.0"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Votes">
                      <input
                        value={form.votes}
                        onChange={(event) => updateForm("votes", event.target.value)}
                        inputMode="numeric"
                        placeholder="32"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Turnaround">
                      <input
                        value={form.turnaround}
                        onChange={(event) => updateForm("turnaround", event.target.value)}
                        placeholder="6-10 Hours"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Revisions">
                      <input
                        value={form.revisions}
                        onChange={(event) => updateForm("revisions", event.target.value)}
                        placeholder="Unlimited minor revisions"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Total Sold">
                      <input
                        value={form.totalSold}
                        onChange={(event) => updateForm("totalSold", event.target.value)}
                        inputMode="numeric"
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                  </div>
                </section>

                {/* Tags */}
                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">Tags</h3>
                  <ProductField label="Add Tags">
                    <input
                      value={form.tagsText}
                      onChange={(event) => updateForm("tagsText", event.target.value)}
                      placeholder="T-Shirt, Men, Cotton"
                      className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                    />
                  </ProductField>
                </section>

                {/* SEO */}
                <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-bold text-slate-950">SEO Settings</h3>
                  <div className="grid gap-4">
                    <ProductField label="Title">
                      <input
                        value={form.seoTitle}
                        onChange={(event) => updateForm("seoTitle", event.target.value)}
                        className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                    <ProductField label="Description">
                      <textarea
                        value={form.seoDescription}
                        onChange={(event) => updateForm("seoDescription", event.target.value)}
                        rows={4}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </ProductField>
                  </div>
                </section>
              </aside>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={closeDialog} className="h-8 rounded border border-slate-200 bg-white px-4 text-xs font-semibold text-blue-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="h-8 rounded bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}