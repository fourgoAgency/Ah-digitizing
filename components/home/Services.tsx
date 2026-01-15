"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const prev = () =>
    setIndex((index - 1 + services.length) % services.length);
  const next = () =>
    setIndex((index + 1) % services.length);

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-white"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-center text-2xl font-semibold mb-10">
        Services we Offered
      </h2>

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition-all duration-200"
        >
          <ChevronLeft />
        </button>

        {/* Slider */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 overflow-hidden py-8">
          {Array.from({ length: 5 }, (_, offset) => {
            const i = (index - 2 + offset + services.length) % services.length;
            const service = services[i];
            const distance = Math.min(
              Math.abs(i - index),
              services.length - Math.abs(i - index)
            );

            // scale
            const scale =
              distance === 0 ? 1 :
                distance === 1 ? 0.85 :
                  0.7;

            // opacity
            const opacity =
              distance === 0 ? 1 :
                distance === 1 ? 0.75 :
                  0.5;

            // 👇 NEW: pull far cards closer
            const translateX =
              distance === 0 ? 0 :
                distance === 1 ? 0 :
                  distance === 2 ? -20 : 0;

            return (
              <div
                key={`${service.id}-${offset}`}
                style={{
                  transform: `scale(${scale}) translateX(${translateX}px)`,
                  opacity: opacity,
                }}
                className="transition-all duration-500 ease-in-out shrink-0"
              >

                <div className="w-28 h-36 sm:w-36 sm:h-48 md:w-48 md:h-64 lg:w-56 lg:h-72 xl:w-64 xl:h-80 rounded-xl overflow-hidden shadow-md border border-accent bg-white">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={256}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition-all duration-200"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {services.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition ${i === index ? "bg-blue-600" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </motion.section>
  );
}
