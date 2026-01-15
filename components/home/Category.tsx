"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const categories = [
  { id: 1, name: "Embroidery Digitizing", slug: "embroidery-digitizing", image: "/services/embroidery.jpg" },
  { id: 2, name: "Vector Conversion", slug: "vector-conversion", image: "/services/vector.jpg" },
  { id: 3, name: "Custom Patches", slug: "custom-patches", image: "/services/patches.jpg" },
  { id: 4, name: "Logo Design", slug: "logo-design", image: "/services/logo.jpg" },
  { id: 5, name: "3D Puff", slug: "3d-puff", image: "/services/3d-puff.jpg" },
  { id: 6, name: "Applique", slug: "applique", image: "/services/applique.jpg" },
];

export default function ServicesCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-5xl font-bold text-center mb-16">Services we Offered</h2>

        <div className="flex gap-8 items-start">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-3xl font-bold text-primary mb-4">
                Shop By<br />Category
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Duis Lorem laborum quis esse officia ea commodo commodo anim est et nulla
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 border-2 bg-primary text-white rounded-full font-medium hover:border-primary hover:text-primary transition-colors"
              >
                Shop now
              </Link>
            </div>
          </div>

          {/* Draggable Carousel */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className={`flex gap-6 overflow-x-auto scrollbar-hide ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                scrollBehavior: isDragging ? "auto" : "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className="group shrink-0 w-72"
                  draggable={false}
                  onClick={(e) => {
                    // Prevent click if dragging
                    if (isDragging) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:bg-primary transition-all">
                    {/* Image */}
                    <div className="aspect-4/3 bg-gray-200 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
                        {/* Replace with actual image */}
                        <svg className="w-20 h-20 opacity-30" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        {/* Uncomment when you have images:
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          draggable={false}
                        />
                        */}
                      </div>
                    </div>

                    {/* Category Name */}
                    <div className="p-6 text-center">
                      <h4 className="text-xl font-semibold text-primary group-hover:text-white transition-colors">
                        {category.name}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden mt-8 text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 border-2 bg-primary text-white rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
          >
            Shop now
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}