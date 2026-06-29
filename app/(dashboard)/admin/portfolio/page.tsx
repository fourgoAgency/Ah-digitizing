// app/admin/portfolio/page.tsx
"use client";

import { usePortfolioUpload,PortfolioCategory } from "@/scripts/protfolioUpload";
import { useState } from "react";

export default function PortfolioUploadPage() {
  const { upload, uploading, progress, results, errors } = usePortfolioUpload();
  const [category, setCategory] = useState<PortfolioCategory>("embroidery");

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    await upload(category, files);
    e.target.value = ""; // reset input
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upload Portfolio Images</h1>

      {/* Category selector */}
      <div className="flex gap-3">
        {(["embroidery", "vector"] as PortfolioCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full border capitalize transition ${
              category === cat
                ? "bg-primary text-white border-primary"
                : "text-primary border-primary hover:bg-primary/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* File input — accepts images only, multiple */}
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={handleFilePick}
        className="block"
      />

      {/* Per-file progress bars */}
      {Object.entries(progress).map(([name, pct]) => (
        <div key={name} className="space-y-1">
          <p className="text-sm text-gray-600">{name}</p>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ))}

      {/* Errors */}
      {Object.entries(errors).map(([name, msg]) => (
        <p key={name} className="text-sm text-red-500">
          {name}: {msg}
        </p>
      ))}

      {/* Success list */}
      {results.length > 0 && (
        <div className="space-y-1">
          <p className="font-medium text-green-600">
            {results.length} file(s) uploaded successfully
          </p>
          {results.map((r) => (
            <p key={r.fileName} className="text-xs text-gray-500 truncate">
              {r.fileName}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}