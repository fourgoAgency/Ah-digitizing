"use client"

import { Edit2, Trash2 } from "lucide-react"

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

type BlogTableProps = {
  blogs: BlogDocument[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onEdit: (blog: BlogDocument) => void
  onDelete: (id: string) => void
  onDeleteSelected: () => void
}

export default function BlogTable({
  blogs,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDelete,
  onDeleteSelected,
}: BlogTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-semibold text-slate-700">Blog posts</p>
        <button
          type="button"
          onClick={onDeleteSelected}
          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          Delete selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Select</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No blog posts found.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="border-t border-slate-200 transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(blog.id)}
                      onChange={() => onToggleSelect(blog.id)}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{blog.title || "Untitled"}</div>
                    <div className="mt-1 text-xs text-slate-500">/{blog.slug || ""}</div>
                  </td>
                  <td className="px-4 py-3">{blog.category || "Uncategorized"}</td>
                  <td className="px-4 py-3">{blog.author || "Admin"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${blog.isPublished === false ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {blog.isPublished === false ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(blog)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(blog.id)}
                        className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
