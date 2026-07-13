"use client"

import { FormEvent } from "react"
import { X } from "lucide-react"

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

type BlogFormDialogProps = {
  open: boolean
  onClose: () => void
  form: BlogFormState
  onChange: <K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  saving: boolean
  error: string | null
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}

export default function BlogFormDialog({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
  error,
}: BlogFormDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6">
      <div className="relative w-full max-w-3xl max-h-[calc(100vh-4rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {form.title ? "Edit blog post" : "Create blog post"}
            </h3>
            <p className="text-sm text-slate-500">Add or update a blog entry for the public site.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-6 py-6">
          <form onSubmit={onSubmit} className="space-y-5">
            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  required
                  value={form.title}
                  onChange={(event) => onChange("title", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                  placeholder="How we prepare artwork"
                />
              </Field>

              <Field label="Slug">
                <input
                  required
                  value={form.slug}
                  onChange={(event) => onChange("slug", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                  placeholder="how-we-prepare-artwork"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Author">
                <input
                  value={form.author}
                  onChange={(event) => onChange("author", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                  placeholder="Admin"
                />
              </Field>

              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(event) => onChange("category", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                  placeholder="Embroidery"
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) => onChange("description", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                placeholder="Short summary shown on cards"
              />
            </Field>

            <Field label="Content">
              <textarea
                rows={6}
                value={form.content}
                onChange={(event) => onChange("content", event.target.value)}
                className="min-h-[12rem] max-h-[18rem] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                placeholder="Write one paragraph per line"
              />
            </Field>

            <Field label="Image URL">
              <input
                value={form.image}
                onChange={(event) => onChange("image", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                placeholder="/home-page/embroidery.png"
              />
            </Field>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => onChange("isPublished", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              Publish immediately
            </label>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : form.title ? "Save changes" : "Create post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
