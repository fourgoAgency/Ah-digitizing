"use client"

import { FormEvent, useRef, useState } from "react"
import { ImagePlus, UploadCloud, X } from "lucide-react"
import { uploadFile } from "@/lib/firebase"
import RichTextEditor from "./RichTextEditor"
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)

  async function handleMediaUpload(file?: File) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setMediaError("Choose an image file to upload.")
      return
    }

    setUploadingMedia(true)
    setMediaError(null)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
      const imageUrl = await uploadFile(file, `blogs/media/${Date.now()}-${safeName}`)
      onChange("image", imageUrl)
    } catch (uploadError) {
      setMediaError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.")
    } finally {
      setUploadingMedia(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

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
              <RichTextEditor
                value={form.content}
                onChange={(value) => onChange("content", value)}
              />
            </Field>

            <div>
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Blog media</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => void handleMediaUpload(event.target.files?.[0])}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={uploadingMedia || saving}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingMedia ? <UploadCloud className="h-4 w-4 animate-pulse" /> : <ImagePlus className="h-4 w-4" />}
                  {uploadingMedia ? "Uploading..." : form.image ? "Replace media" : "Upload media"}
                </button>
                {form.image ? <span className="text-xs text-emerald-700">Media uploaded</span> : <span className="text-xs text-slate-500">Upload a cover image to Firebase Storage.</span>}
              </div>
              {mediaError ? <p className="mt-2 text-sm text-rose-600">{mediaError}</p> : null}
              {form.image ? (
                <img src={form.image} alt="Blog media preview" className="mt-3 h-28 w-44 rounded-xl border border-slate-200 object-cover" />
              ) : null}
            </div>

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
                disabled={saving || uploadingMedia}
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
