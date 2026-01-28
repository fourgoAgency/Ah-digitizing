"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function TransformationExamples() {
  const images: Record<number, { before: string; after: string }> = {
    1: { before: "/services/2 Cap Before.png", after: "/services/cap.svg" },
    2: { before: "/services/3D PUFF Before.png", after: "/services/3D PUFF after.svg" },
    3: { before: "/services/outline.png", after: "/services/OUTLINE.svg" },
    4: { before: "/services/2 Cap Before.png", after: "/services/cap.svg" },
  };

  const examples = [
    {
      id: 1,
      title: "Logo Embroidery Perfection",
      description:
        "Transforming pixelated company logos into crisp, embroidery-ready files suitable for all branding needs.",
      beforeLabel: "Before (Low Quality)",
      afterLabel: "After (Digitized)",
    },
    {
      id: 2,
      title: "Detailed Design Digitizing",
      description:
        "Converting hand-drawn or scanned designs into precise stitch files, preserving all artistic details.",
      beforeLabel: "Before (Raster)",
      afterLabel: "After (Digitized)",
    },
    {
      id: 3,
      title: "Apparel Image Enhancement",
      description:
        "Perfecting product images and photos for embroidery by digitizing them for consistent stitch quality.",
      beforeLabel: "Before (Raster)",
      afterLabel: "After (Digitized)",
    },
    {
      id: 4,
      title: "Complex Artwork Conversion",
      description:
        "Bringing intricate or complex artwork to life in embroidery format, ideal for large-scale projects and garments.",
      beforeLabel: "Before (Original)",
      afterLabel: "After (Digitized)",
    },
  ];
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (

    <section className="bg-gray-200 px-4 py-12 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See the Transformation
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Witness the dramatic improvement in quality and detail our skilled digitizers bring to every design.
          </p>
        </div>

        {/* Grid of Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {examples.map((example) => (
            <div
              className="bg-white p-6 sm:p-8 md:p-10 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center"
              key={example.id}
            >
              {/* Left: Title and Description */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {example.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {example.description}
                </p>

                {/* CTA */}
                <div className="flex justify-start">
                  <Button className="rounded-full px-8 py-2 text-sm sm:text-base hover:bg-transparent hover:border-primary hover:text-primary hover:border">
                    Order Now
                  </Button>
                </div>
                {/* Before */}
                <div className="text-center mt-4">
                  <div className="bg-white rounded-lg h-40 sm:h-48 flex items-center justify-center mb-3 overflow-hidden shadow-md shadow-gray-700">
                    <img
                      src={images[example.id].before}
                      className="w-full h-full object-contain"
                      alt="Before"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {example.beforeLabel}
                  </p>
                </div>
              </div>


                {/* After */}
                <div className="text-center">
                  <div
                    className="bg-white rounded-lg h-full 2xl:h-96 xl:h-72 w-full 2xl:w-96 xl:w-72 flex items-center justify-center mb-3 overflow-hidden shadow-md shadow-gray-700 cursor-pointer"
                    onClick={() => setActiveImage(images[example.id].after)}
                  >
                    <img
                      src={images[example.id].after}
                      className="w-full h-full object-cover"
                      alt="After"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {example.afterLabel}
                  </p>
                </div>

              </div>

              

          ))}
        </div>
      </div>
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setActiveImage(null)}
        >
            <button
              className="absolute top-3 right-3 text-white hover:text-black text-2xl"
              onClick={() => setActiveImage(null)}
            >
              &times;
            </button>
          <div
            className="relative rounded-lg w-[95%] sm:w-[80%] lg:w-[70%] h-auto lg:h-[90%] p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}

            {/* Image */}
            <img
              src={activeImage}
              className="w-full h-full object-contain"
              alt="Preview"
            />
          </div>
        </div>
      )}

    </section>
  );
}
