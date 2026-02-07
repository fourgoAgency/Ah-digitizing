"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {  ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

const services = [
  { id: 1, title: "Embroidery Digitizing", image: "/embriodery.png" },
  { id: 2, title: "Vector Art", image: "/vector.png" },
  { id: 3, title: "Custom Design", image: "/Custom.png" },
  { id: 4, title: "Raster to Vector", image: "/vector.png" },
  { id: 5, title: "Raster to Vector", image: "/vector.png" },
];

export default function ServicesCarousel() {
  const [index, setIndex] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const prev = () =>
    setIndex((index - 1 + services.length) % services.length);
  const next = () =>
    setIndex((index + 1) % services.length);

  const swipeThreshold = 100;

  const handleDragEnd = (_: any, info: any) => {
    const { offset, velocity } = info;

    if (offset.x < -swipeThreshold || velocity.x < -500) next();
    else if (offset.x > swipeThreshold || velocity.x > 500) prev();
  };

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-white"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-center text-5xl font-bold mb-10">
        Services we Offered
      </h2>

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Slider */}
        <motion.div
          className="flex items-center justify-center gap-0 sm:gap-1 md:gap-2 overflow-hidden py-8 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={handleDragEnd}
        >
          {Array.from({ length: 5 }, (_, offset) => {
            const i =
              (index - 2 + offset + services.length) % services.length;
            const service = services[i];

            const distance = Math.min(
              Math.abs(i - index),
              services.length - Math.abs(i - index)
            );

            const scale =
              distance === 0 ? 1.05 :
              distance === 1 ? 0.88 :
              0.8;

            const opacity =
              distance === 0 ? 1 :
              distance === 1 ? 0.75 :
              0.5;

            const translateX =
              distance === 2 ? (offset < 2 ? 35 : -35) : 0;

            return (
              <motion.div
                key={`${service.id}-${offset}`}
                style={{
                  transform: `scale(${scale}) translateX(${translateX}px)`,
                  opacity,
                }}
                className="transition-all duration-500 ease-in-out shrink-0 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
              >
                <div className="relative w-28 h-36 sm:w-36 sm:h-48 md:w-48 md:h-64 lg:w-56 lg:h-72 xl:w-64 xl:h-80 rounded-xl overflow-hidden shadow-md border border-accent bg-white pointer-events-none">
                  <Image
                    src={`/home-page${service.image}`}
                    alt={service.title}
                    width={256}
                    height={320}
                    className="w-full h-full object-fill"
                  />

                  {/* Bottom Name Bar (Only Center Card) */}
                  {distance === 0 && (
                    <div className="absolute bottom-0 left-0 rounded-t-lg w-full bg-primary text-white text-center py-2 text-xl font-semibold">
                      {service.title}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Center Arrows */}
        <div className="flex justify-center mt-6 gap-6">
          <button
            onClick={prev}
            className="w-15 h-10 flex text-center items-center text-white border-2 border-primary justify-center rounded-full shadow-lg bg-primary hover:bg-transparent hover:text-primary transition"
          >
            <ChevronsLeft 
             width="50"
             size="xl"
             fontWeight={900}/>
          </button>
          <button
            onClick={next}
            className="w-15 h-10 text-center flex items-center text-white border-2 border-primary justify-center rounded-full shadow-lg bg-primary hover:bg-transparent hover:text-primary transition"
          >
            <ChevronsRight
             width="50"
             size="xl"
             fontWeight={900} 
/>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
