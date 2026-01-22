"use client";

import { Button } from "@/components/ui/button";

export default function TransformationExamples() {
  const examples = [
    {
      id: 1,
      title: "Logo Embroidery Perfection",
      description: "Transforming pixelated company logos into crisp, embroidery-ready files suitable for all branding needs.",
      beforeLabel: "Before (Low Quality)",
      afterLabel: "After (Digitized)",
    },
    {
      id: 2,
      title: "Detailed Design Digitizing",
      description: "Converting hand-drawn or scanned designs into precise stitch files, preserving all artistic details.",
      beforeLabel: "Before (Raster)",
      afterLabel: "After (Digitized)",
    },
    {
      id: 3,
      title: "Apparel Image Enhancement",
      description: "Perfecting product images and photos for embroidery by digitizing them for consistent stitch quality.",
      beforeLabel: "Before (Raster)",
      afterLabel: "After (Digitized)",
    },
    {
      id: 4,
      title: "Complex Artwork Conversion",
      description: "Bringing intricate or complex artwork to life in embroidery format, ideal for large-scale projects and garments.",
      beforeLabel: "Before (Original)",
      afterLabel: "After (Digitized)",
    },
  ];

  return (
    <section className="p-20 bg-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See the Transformation: Embroidery Digitizing Examples
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Witness the dramatic improvement in quality and detail our skilled digitizers bring to every design.
          </p>
        </div>

        {/* Grid of Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {examples.map((example) => (
            <div className="bg-white p-10 rounded-lg" key={example.id}>
              {/* Title and Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{example.title}</h3>
                <p className="text-gray-600">{example.description}</p>
              </div>

              {/* Before/After Images */}
              <div className="grid grid-cols-2 gap-6">
                {/* Before */}
                <div className="text-center">
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-3 overflow-hidden">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{example.beforeLabel}</p>
                </div>

                {/* After */}
                <div className="text-center">
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-3 overflow-hidden">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{example.afterLabel}</p>
                </div>
              </div>
              <div className="flex justify-center items-center mt-6">
                <Button className="rounded-full px-9 hover:bg-transparent hover:border-primary hover:text-primary hover:border">Order Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
