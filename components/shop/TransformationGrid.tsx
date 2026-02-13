"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { transformationExamples } from "@/data/products";

export default function TransformationGrid() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImage]);

  return (
    <>
    <section className="bg-[#f1f2f4] py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            See the Transformation: Raster to Vector Examples
          </h2>
          <p className="mt-4 text-gray-600">
            Witness the dramatic improvement in quality and detail our skilled digitizers bring to
            every image.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {transformationExamples.map((example) => (
            <article key={example.id} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900">{example.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{example.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 p-2">
                  <div className="relative h-40 w-full overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={example.beforeImage}
                      alt={`${example.title} before`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <p className="pt-2 text-center text-xs font-medium text-gray-600">Before (Raster)</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-2">
                  <button
                    type="button"
                    onClick={() => setActiveImage(example.afterImage)}
                    className="relative h-52 w-full overflow-hidden rounded-md bg-gray-100"
                    aria-label={`Open ${example.title} after image`}
                  >
                    <Image
                      src={example.afterImage}
                      alt={`${example.title} after`}
                      fill
                      className="object-contain transition duration-300 hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </button>
                  <p className="pt-2 text-center text-xs font-medium text-gray-600">After (Vector)</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    {activeImage && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={() => setActiveImage(null)}
      >
        <div
          className="relative h-[90vh] w-[50vw] min-h-70 min-w-70 max-h-[90vh] max-w-[50vw] rounded-xl bg-white p-4"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute right-3 top-2 text-2xl font-bold text-gray-700 hover:text-black"
            aria-label="Close image preview"
          >
            &times;
          </button>
          <div className="relative h-full w-full">
            <Image
              src={activeImage}
              alt="After preview"
              fill
              className="object-contain"
              sizes="50vw"
            />
          </div>
        </div>
      </div>
    )}
    </>
  );
}
