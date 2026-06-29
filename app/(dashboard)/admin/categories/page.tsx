"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { collection, onSnapshot, serverTimestamp } from "firebase/firestore"
import { ArrowRight, Edit2, Plus, Trash2 } from "lucide-react"
import { deleteDocument, firestore, setDocument, updateDocument } from "@/lib/firebase"
import { uploadFile } from "@/lib/firebase"
import Image from "next/image"
type SubcategoryDocument = {
  label: string
  slug?: string
  href?: string
  order?: number
}

type CategoryDocument = {
  id: string
  slug: string
  label: string
  image?: string
  order?: number
  subcategories?: SubcategoryDocument[]
}

type CategoryFormState = {
  type: "main" | "sub"
  label: string
  slug: string
  image: string
  order: string
  parentSlug: string
  href: string
}

type CategoryEditTarget =
  | { type: "main"; slug: string }
  | { type: "sub"; parentSlug: string; slug: string }

const emptyForm: CategoryFormState = {
  type: "main",
  label: "",
  slug: "",
  image: "",
  order: "",
  parentSlug: "",
  href: "",
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeSlug(value: string, fallback = "") {
  return slugify(value || fallback)
}

function asNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function omitId<T extends { id: string }>(value: T) {
  const rest = { ...value }
  delete (rest as { id?: string }).id
  return rest
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDocument[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryFormState>(emptyForm)
  const [editingTarget, setEditingTarget] = useState<CategoryEditTarget | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "category"),
      (snapshot) => {
        setCategories(
          snapshot.docs
            .map((document) => ({ ...document.data(), id: document.id } as CategoryDocument))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
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

  const categoryStats = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        subcategoryCount: category.subcategories?.length ?? 0,
      })),
    [categories]
  )

  function resetForm() {
    setForm(emptyForm)
    setEditingTarget(null)
    setFormError(null)
  }

  function openAddMain() {
    setForm({ ...emptyForm, type: "main" })
    setEditingTarget(null)
    setFormError(null)
    setDialogOpen(true)
  }

  function openAddSub(parentSlug: string) {
    setForm({ ...emptyForm, type: "sub", parentSlug })
    setEditingTarget(null)
    setFormError(null)
    setDialogOpen(true)
  }

  function openEditMain(category: CategoryDocument) {
    setForm({
      type: "main",
      label: category.label,
      slug: category.slug,
      image: category.image || "",
      order: String(category.order ?? ""),
      parentSlug: "",
      href: "",
    })
    setEditingTarget({ type: "main", slug: category.slug })
    setFormError(null)
    setDialogOpen(true)
  }

  function openEditSub(parent: CategoryDocument, subcategory: SubcategoryDocument) {
  setForm({
    type: "sub",
    label: subcategory.label,
    slug: subcategory.slug || slugify(subcategory.label),
    image: "",
    order: String(subcategory.order ?? ""),
    parentSlug: parent.slug,
    href: subcategory.href || "",
  })

  setEditingTarget({
    type: "sub",
    parentSlug: parent.slug,
    slug: subcategory.slug || slugify(subcategory.label),
  })

  setFormError(null)
  setDialogOpen(true)
}
  function closeDialog() {
    setDialogOpen(false)
    resetForm()
  }

  function updateForm<K extends keyof CategoryFormState>(key: K, value: CategoryFormState[K]) {
    setForm((current) => {
      if (key === "label" && current.type === "main") {
        return { ...current, label: value as string, slug: current.slug || slugify(value as string) }
      }

      if (key === "type") {
        return {
          ...current,
          type: value as "main" | "sub",
          parentSlug: value === "main" ? "" : current.parentSlug,
        }
      }

      return { ...current, [key]: value }
    })
  }

  async function deleteMainCategory(category: CategoryDocument) {
    if (!window.confirm(`Delete "${category.label}" and all of its subcategories?`)) return
    await deleteDocument("category", category.slug)
  }

  async function deleteSubcategory(parent: CategoryDocument, subcategory: SubcategoryDocument) {
    const subSlug = subcategory.slug || slugify(subcategory.label)
    if (!window.confirm(`Delete "${subcategory.label}"?`)) return

    const nextSubcategories = (parent.subcategories ?? []).filter(
      (item) => (item.slug || slugify(item.label)) !== subSlug
    )
    await updateDocument("category", parent.slug, { subcategories: nextSubcategories, updatedAt: serverTimestamp() })
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    let imageUrl = form.image
    event.preventDefault()
    const label = form.label.trim()
    const slug = normalizeSlug(form.slug, form.label)
    const order = form.order ? asNumber(form.order) : 0

    if (!label || !slug) {
      setFormError("Category label and slug are required.")
      return
    }

    setSaving(true)
    if (imageFile) {
      setUploading(true)

      imageUrl = await uploadFile(
        imageFile,
        `categories/${slug}/${Date.now()}-${imageFile.name}`
      )

      setUploading(false)
    }
    setFormError(null)

    try {
      if (form.type === "main") {
        const existing = editingTarget?.type === "main"
          ? categories.find((category) => category.slug === editingTarget.slug)
          : undefined
        const existingData = existing ? omitId(existing) : {}

        await setDocument("category", slug, {
          ...existingData,
          slug,
          label,
          image: imageUrl,
          order,
          subcategories: existing?.subcategories ?? [],
          updatedAt: serverTimestamp(),
        })
      } else {
        const parentSlug = form.parentSlug || categories[0]?.slug || ""
        const parent = categories.find((category) => category.slug === parentSlug)

        if (!parent) {
          throw new Error("Select a parent category for the subcategory.")
        }

        const subSlug = normalizeSlug(form.slug, form.label)
        const subcategories = parent.subcategories ?? []
        const nextSubcategories = [
          ...subcategories.filter((item) => (item.slug || slugify(item.label)) !== subSlug),
          {
            label,
            slug: subSlug,
            href: form.href.trim() || `/${parent.slug}/${subSlug}`,
            order,
          },
        ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

        const nextParentSlug = editingTarget?.type === "sub" ? editingTarget.parentSlug : parent.slug
        if (nextParentSlug !== parent.slug) {
          const previousParent = categories.find((category) => category.slug === nextParentSlug)
          if (previousParent) {
            const previousSubcategories = (previousParent.subcategories ?? []).filter(
              (item) => (item.slug || slugify(item.label)) !== (editingTarget?.type === "sub" ? editingTarget.slug : subSlug)
            )
            await updateDocument("category", previousParent.slug, {
              subcategories: previousSubcategories,
              updatedAt: serverTimestamp(),
            })
          }
        }

        const parentData = omitId(parent)

        await setDocument("category", parent.slug, {
          ...parentData,
          subcategories: nextSubcategories,
          updatedAt: serverTimestamp(),
        })
      }

      closeDialog()
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save category.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-[#f5f6fb] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">Categories</h1>
            <p className="mt-1 text-sm text-slate-500">Manage main categories and their nested subcategories.</p>
            {error ? <p className="mt-1 text-xs font-medium text-rose-500">Firebase: {error}</p> : null}
          </div>

          <button
            type="button"
            onClick={openAddMain}
            className="inline-flex h-9 items-center gap-2 rounded bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </header>

        <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-950">All Categories</h2>
              <p className="text-xs text-slate-500">
                {categoryStats.length} main categor{categoryStats.length === 1 ? "y" : "ies"} and{" "}
                {categoryStats.reduce((sum, category) => sum + (category.subcategoryCount ?? 0), 0)} subcategories
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading categories...</div>
          ) : categoryStats.length === 0 ? (
            <div className="rounded border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
              No categories yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categoryStats.map((category) => (
                <article key={category.id} className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4">
                    <Image
                      src={category.image || "/placeholder.png"}
                      alt={category.label}
                      width={75}
                      height={75}
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-950">{category.label}</p>
                      <p className="text-xs text-slate-500">/{category.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openAddSub(category.slug)}
                        className="inline-flex h-8 items-center gap-1 rounded border border-blue-100 bg-blue-50 px-2 text-[11px] font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Sub
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditMain(category)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                        aria-label={`Edit ${category.label}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMainCategory(category)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                        aria-label={`Delete ${category.label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 px-4 py-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Subcategories</span>
                      <span>{category.subcategoryCount ?? 0}</span>
                    </div>

                    {(category.subcategories ?? []).length === 0 ? (
                      <div className="rounded border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-400">
                        No subcategories yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {category.subcategories
                          ?.slice()
                          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                          .map((subcategory) => {
                            const subSlug = subcategory.slug || slugify(subcategory.label)
                            return (
                              <div
                                key={`${category.slug}-${subSlug}`}
                                className="flex items-center justify-between gap-3 rounded border border-slate-100 bg-white px-3 py-2"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-slate-800">{subcategory.label}</p>
                                  <p className="truncate text-[11px] text-slate-400 flex items-center gap-1">
                                    <ArrowRight className="h-3 w-3" />
                                    {subcategory.href || `/${category.slug}/${subSlug}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openEditSub(category, subcategory)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                                    aria-label={`Edit ${subcategory.label}`}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteSubcategory(category, subcategory)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-blue-50"
                                    aria-label={`Delete ${subcategory.label}`}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {dialogOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-6" role="dialog" aria-modal="true">
          <form onSubmit={saveCategory} className="mx-auto w-full max-w-2xl rounded-md bg-slate-50 p-6 shadow-lg ring-1 ring-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <button type="button" onClick={closeDialog} className="text-xs font-medium text-slate-500 hover:text-blue-600">
                  &larr; Back
                </button>
                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  {editingTarget ? "Edit Category" : form.type === "main" ? "Add Main Category" : "Add Subcategory"}
                </h2>
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

            {formError ? <p className="mb-4 rounded border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{formError}</p> : null}

            <div className="grid gap-4">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-500">Type</span>
                <select
                  value={form.type}
                  onChange={(event) => updateForm("type", event.target.value as CategoryFormState["type"])}
                  className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="main">Main category</option>
                  <option value="sub">Subcategory</option>
                </select>
              </label>

              {form.type === "sub" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">Parent Category</span>
                  <select
                    value={form.parentSlug}
                    onChange={(event) => updateForm("parentSlug", event.target.value)}
                    className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Select parent category</option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-500">Label</span>
                <input
                  value={form.label}
                  onChange={(event) => updateForm("label", event.target.value)}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-500">
                  Category Image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageFile(file)
                    }
                  }}
                  className="w-full rounded border border-slate-200 p-2 text-sm"
                />
              </label>
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="h-28 w-28 rounded object-cover"
                />
              )}

              {!imageFile && form.image && (
                <img
                  src={form.image}
                  alt="current"
                  className="h-28 w-28 rounded object-cover"
                />
              )}
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-500">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) => updateForm("slug", slugify(event.target.value))}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                />
              </label>

              {form.type === "sub" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">URL Path</span>
                  <input
                    value={form.href}
                    onChange={(event) => updateForm("href", event.target.value)}
                    placeholder="/shop/main-category/sub-category"
                    className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-500">Order</span>
                <input
                  value={form.order}
                  onChange={(event) => updateForm("order", event.target.value)}
                  inputMode="numeric"
                  className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
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