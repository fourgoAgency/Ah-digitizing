"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { Plus, Search } from "lucide-react"
import { deleteDocument, firestore, setDocument, updateDocument } from "@/lib/firebase"
import BlogFormDialog from "@/components/(dashboard)/BlogFormDialog"
import BlogTable from "@/components/(dashboard)/BlogTable"

type BlogDocument = {
  id: string
  title?: string
  slug?: string
  author?: string
  category?: string
  description?: string
  content?: string
  image?: string
  isPublished?: boolean
  createdAt?: string | { toDate?: () => Date }
}

type BlogFormState = {
  title: string
  slug: string
  author: string
  description: string
  content: string
  category: string
  image: string
  isPublished: boolean
}

const emptyForm: BlogFormState = {
  title: "",
  slug: "",
  author: "Admin",
  description: "",
  content: "",
  category: "",
  image: "",
  isPublished: true,
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toParagraphs(content: string) {
  return content
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function blogToForm(blog: BlogDocument): BlogFormState {
  return {
    title: blog.title || "",
    slug: blog.slug || "",
    author: blog.author || "Admin",
    description: blog.description || "",
    content: typeof blog.content === "string" ? blog.content : "",
    category: blog.category || "",
    image: blog.image || "",
    isPublished: blog.isPublished !== false,
  }
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<BlogDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogDocument | null>(null)
  const [form, setForm] = useState<BlogFormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "blogs"),
      (snapshot) => {
        setBlogs(
          snapshot.docs
            .map((document) => ({ ...document.data(), id: document.id } as BlogDocument))
            .sort((a, b) => (b.createdAt ? 1 : 0) - (a.createdAt ? 1 : 0))
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

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return blogs.filter((blog) => {
      if (!query) return true
      const haystack = [blog.title, blog.slug, blog.author, blog.category, blog.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [blogs, searchQuery])

  function updateForm<K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) {
    setForm((current) => {
      if (key === "title" && !editingBlog) {
        return {
          ...current,
          title: value as string,
          slug: slugify(value as string),
        }
      }
      return { ...current, [key]: value }
    })
  }

  function openAddDialog() {
    setEditingBlog(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  function openEditDialog(blog: BlogDocument) {
    setEditingBlog(blog)
    setForm(blogToForm(blog))
    setFormError(null)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingBlog(null)
    setForm(emptyForm)
    setFormError(null)
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    )
  }

  async function deleteSelectedBlogs() {
    if (selectedIds.length === 0) return
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected blog post${selectedIds.length === 1 ? "" : "s"}?`)
    if (!confirmed) return
    await Promise.all(selectedIds.map((id) => deleteDocument("blogs", id)))
    setSelectedIds([])
  }

  async function deleteBlog(id: string) {
    const confirmed = window.confirm("Delete this blog post?")
    if (!confirmed) return
    await deleteDocument("blogs", id)
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
  }

  async function saveBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = form.title.trim()
    const slug = slugify(form.slug || form.title)

    if (!title || !slug) {
      setFormError("Title and slug are required.")
      return
    }

    setSaving(true)
    setFormError(null)

    const payload = {
      title,
      slug,
      author: form.author.trim() || "Admin",
      description: form.description.trim(),
      content: toParagraphs(form.content),
      category: form.category.trim(),
      image: form.image.trim(),
      isPublished: form.isPublished,
      createdAt: editingBlog?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (editingBlog) {
        await updateDocument("blogs", editingBlog.id, payload)
      } else {
        await setDocument("blogs", slug, payload)
      }
      closeDialog()
    } catch (saveError) {
      console.error(saveError)
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save blog post.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin dashboard</p>
          <h1 className="text-2xl font-semibold text-slate-900">Blog management</h1>
          <p className="mt-1 text-sm text-slate-500">Create, edit, and remove blog posts for the public blog page.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search blogs"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <button
            type="button"
            onClick={openAddDialog}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add blog
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Loading blog posts...
        </div>
      ) : (
        <BlogTable
          blogs={filteredBlogs}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelected}
          onEdit={openEditDialog}
          onDelete={deleteBlog}
          onDeleteSelected={deleteSelectedBlogs}
        />
      )}

      <BlogFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        form={form}
        onChange={updateForm}
        onSubmit={saveBlog}
        saving={saving}
        error={formError}
      />
    </div>
  )
}
