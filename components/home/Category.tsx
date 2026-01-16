"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { id: 1, name: "Embroidery Digitizing", slug: "embroidery-digitizing", image: "/home-page/products picture/1.png" },
  { id: 2, name: "Vector Conversion", slug: "vector-conversion", image: "/home-page/products picture/2.png" },
  { id: 3, name: "Custom Patches", slug: "custom-patches", image: "/home-page/products picture/3.png" },
  { id: 4, name: "Logo Design", slug: "logo-design", image: "/home-page/products picture/4.png" },
  { id: 5, name: "3D Puff", slug: "3d-puff", image: "/home-page/products picture/5.png" },
  { id: 6, name: "Applique", slug: "applique", image: "/home-page/products picture/6.png" },
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
    const walk = (x - startX) * 2; // scroll speed
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
    snapToNearestCard();
  };

  // Auto snap function
  const snapToNearestCard = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.querySelector<HTMLDivElement>(".group");
    if (!card) return;

    const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card).marginRight); // card width + gap
    const scroll = container.scrollLeft;
    const index = Math.round(scroll / cardWidth);
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">

          {/* Left Sidebar */}
          <div className="hidden lg:flex w-80 shrink-0">
            <div className="bg-primary rounded-2xl p-8 shadow-sm flex flex-col justify-between h-full w-full">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Shop By<br />Category
                </h3>
                <p className="text-gray-100 text-sm mb-6">
                  Explore our wide range of services tailored to meet your design and digitizing needs.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 border-2 bg-white text-primary rounded-full font-medium hover:border-white hover:text-white hover:bg-transparent transition-colors"
              >
                Shop now
              </Link>
            </div>
          </div>

          {/* Carousel */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center lg:text-left">
              Services we Offered
            </h2>

            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              className={`flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 ${
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
                  className="group shrink-0 w-64 sm:w-72 md:w-80 lg:w-72"
                  draggable={false}
                  onClick={(e) => {
                    if (isDragging) e.preventDefault();
                  }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:bg-primary transition-all h-full">
                    <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        draggable={false}
                      />
                    </div>
                    <div className="p-4 md:p-6 text-center">
                      <h4 className="text-base md:text-lg lg:text-xl font-semibold text-primary group-hover:text-white transition-colors">
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
        <div className="lg:hidden mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
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
