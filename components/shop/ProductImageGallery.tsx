"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type ProductImageGalleryProps = {
  title: string;
  heroImage: string;
  gallery: string[];
};

export default function ProductImageGallery({ title, heroImage, gallery }: ProductImageGalleryProps) {
  const images = useMemo(() => {
    const merged = [heroImage, ...gallery];
    return Array.from(new Set(merged));
  }, [heroImage, gallery]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  useEffect(() => {
    if (images.length <= 1 || activeModalImage) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [images, activeModalImage]);

  useEffect(() => {
    if (!activeModalImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModalImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModalImage]);

  const currentImage = images[activeIndex] || heroImage;

  return (
    <>
      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveModalImage(currentImage)}
          className="relative h-[360px] w-full overflow-hidden rounded-xl bg-gray-100 sm:h-[440px]"
          aria-label={`Open ${title} image preview`}
        >
          <Image
            src={currentImage}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 48vw"
            priority
          />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={`${title}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-32 overflow-hidden rounded-lg border bg-white ${
                isActive ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
              }`}
              aria-label={`Show ${title} image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} preview ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 16vw, 16vw"
              />
            </button>
          );
        })}
      </div>

      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative h-[50vh] w-[50vw] min-h-[280px] min-w-[280px] rounded-xl bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalImage(null)}
              className="absolute right-3 top-2 text-2xl font-bold text-gray-700 hover:text-black"
              aria-label="Close image preview"
            >
              &times;
            </button>
            <div className="relative h-full w-full">
              <Image
                src={activeModalImage}
                alt={`${title} preview`}
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
