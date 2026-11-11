"use client"

import dynamic from "next/dynamic"

// Load editor without SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-400">
      Loading editor...
    </div>
  ),
})

// Keep modules outside component to prevent recreation
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
}

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  return (
    <div className="rich-text-editor rounded-xl border border-slate-200 bg-white">

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        useSemanticHTML={false}
        modules={modules}
        placeholder="Write your blog content here..."
      />

      <style jsx global>{`
        .rich-text-editor {
          position: relative;
          overflow: visible !important;
        }

        .rich-text-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          position: relative;
          z-index: 10;
        }

        .rich-text-editor .ql-container {
          border: none;
          font-size: 14px;
          min-height: 250px;
        }

        .rich-text-editor .ql-editor {
          min-height: 250px;
          max-height: 450px;
          overflow-y: auto;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }

        /* Fix toolbar dropdown visibility */
        .rich-text-editor .ql-toolbar .ql-picker {
          position: relative;
        }

        .rich-text-editor .ql-toolbar .ql-picker.ql-expanded {
          z-index: 1000;
        }

        .rich-text-editor .ql-toolbar .ql-picker-options {
          z-index: 1001 !important;
        }

        .rich-text-editor .ql-toolbar .ql-picker.ql-expanded .ql-picker-options {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>

    </div>
  )
}
