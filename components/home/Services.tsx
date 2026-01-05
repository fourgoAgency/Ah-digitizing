"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Embroidery Digitizing",
    image: "/logo.jpeg",
  },
  {
    id: 2,
    title: "Vector Art",
    image: "/logo.jpeg",
  },
  {
    id: 3,
    title: "Custom Design",
    image: "/logo.jpeg",
  },
  {
    id: 4,
    title: "Raster to Vector",
    image: "/logo.jpeg",
  },
  {
    id: 5,
    title: "Raster to Vector",
    image: "/logo.jpeg",
  },
];

export default function ServicesCarousel() {
  const [index, setIndex] = useState(1);

  const prev = () =>
    setIndex((index - 1 + services.length) % services.length);
  const next = () =>
    setIndex((index + 1) % services.length);

  return (
    <section className="py-20 bg-white">
      <h2 className="text-center text-2xl font-semibold mb-10">
        Services we Offered
      </h2>

      <div className="relative max-w-6xl mx-auto flex items-center justify-center">

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-0 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        {/* Slider */}
        <div className="flex items-center gap-3 overflow-hidden">
          {Array.from({ length: 5 }, (_, offset) => {
            const i = (index - 2 + offset + services.length) % services.length;
            const service = services[i];
            const distance = Math.min(
              Math.abs(i - index),
              services.length - Math.abs(i - index)
            );
            const scaleClass =
              distance === 0 ? "scale-100" : distance === 1 ? "scale-75" : "scale-50";
            const opacityClass =
              distance === 0 ? "opacity-100" : distance === 1 ? "opacity-75" : "opacity-50";
            return (
              <div
                key={`${service.id}-${offset}`}
                className={`transition-all duration-500 ease-in-out ${scaleClass} ${opacityClass}`}
              >
                <div className="w-52 h-60 rounded-xl overflow-hidden shadow-md border border-accent bg-white">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-0 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {services.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition ${
              i === index ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
