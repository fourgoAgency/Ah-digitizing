"use client";

import Link from "next/link";

const vectorCategories = [
  { id: 1, label: "Raster To Vector Services", href: "/services/raster-to-vector" },
  { id: 2, label: "Silhouette Art", href: "/services/raster-to-vector/silhouette" },
  { id: 3, label: "Stencil Art", href: "/services/raster-to-vector/stencil" },
  { id: 4, label: "Color Separation", href: "/services/raster-to-vector/color-separation" },
];

export default function VecCategory() {
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-center text-2xl font-semibold mb-8">Vector Conversion Services</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vectorCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-4/3 bg-gray-100 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-lg font-medium mb-2">{category.label}</h4>
                <p className="text-sm text-gray-600 mb-6">Convert raster images to high-quality vector graphics. Perfect for logos, artwork, and designs that need to scale infinitely without quality loss. Professional results suitable for any application.</p>

                <div className="flex justify-center">
                  <Link href={category.href} className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
