"use client";

import Link from "next/link";

const embroideryCategories = [
  { id: 1, label: "Logo Embroidery Digitizing", href: "/services/embroidery/logo" },
  { id: 2, label: "Left Chest Embroidery Digitizing", href: "/services/embroidery/left-chest" },
  { id: 3, label: "Cap Embroidery Digitizing", href: "/services/embroidery/cap" },
  { id: 4, label: "3D Puff Embroidery Digitizing", href: "/services/embroidery/3d-puff" },
  { id: 5, label: "Jacket Embroidery Digitizing", href: "/services/embroidery/jacket" },
  { id: 6, label: "Applique Embroidery Digitizing", href: "/services/embroidery/applique" },
  { id: 7, label: "Image Embroidery Digitizing", href: "/services/embroidery/image" },
  { id: 8, label: "Towel Embroidery Digitizing", href: "/services/embroidery/towel" },
];

export default function EmbCategory() {
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-center text-2xl font-semibold mb-8">Embroidery Digitizing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {embroideryCategories.map((category) => (
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
                <p className="text-sm text-gray-600 mb-6">Transform any image or logo into a high quality, scalable embroidery-ready file. Our digitizing service produces stitch-accurate files suitable for production on any machine.</p>

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
