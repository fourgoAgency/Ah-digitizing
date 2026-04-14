"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

const services = [
  { id: 1, title: "Embroidery Digitizing", image: "/embriodery.png" },
  { id: 2, title: "Vector Art", image: "/vector.png" },
  { id: 3, title: "Custom Design", image: "/Custom.png" },
  { id: 4, title: "Raster to Vector", image: "/vector.png" },
  { id: 5, title: "Raster to Vector", image: "/vector.png" },
];

const carriageVariants = {
  hidden: { opacity: 0, x: -64, scale: 0.94 },
  visible: (offset: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: 0.14 + offset * 0.08,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ServicesCarousel({ inTransition = false }: { inTransition?: boolean }) {
  const [index, setIndex] = useState(1);

  const prev = () => setIndex((index - 1 + services.length) % services.length);
  const next = () => setIndex((index + 1) % services.length);

  const swipeThreshold = 100;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -swipeThreshold || velocity.x < -500) next();
    else if (offset.x > swipeThreshold || velocity.x > 500) prev();
  };

  return (
    <motion.section
      className={cn(
        "relative z-10 bg-white px-4 sm:px-6",
        inTransition
          ? "flex flex-col justify-center overflow-hidden rounded-[2rem] px-4 pt-5 lg:pt-6 shadow-none sm:px-6 lg:px-8 h-full"
          : "rounded-t-[2rem] pt-24 shadow-[0_-28px_70px_rgba(15,23,42,0.22)] sm:rounded-t-[2.5rem] md:pt-32 lg:pt-44 xl:pt-48 2xl:pt-40"
      )}
    >
      <div
        className={cn(
          "relative z-20 mx-auto max-w-5xl text-center",
          inTransition ? "mb-3 pt-1" : "mb-8 pt-2"
        )}
      >
        <h1
          className={cn(
            "text-center font-bold",
            inTransition ? "mb-2 text-3xl sm:text-4xl" : "mb-10 text-5xl fade-in-up"
          )}
        >
          Services we Offered
        </h1>
        <p
          className={cn(
            "mx-auto text-pretty text-slate-600",
            inTransition ? "mt-1 max-w-2xl text-sm sm:text-base" : "mt-3 max-w-3xl text-base sm:text-lg"
          )}
        >
          Swipe through our core services and open the category that fits your next digitizing, vector, or custom artwork job.
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className={cn(
            "flex items-center justify-center gap-0 sm:gap-1 md:gap-2 overflow-hidden cursor-grab active:cursor-grabbing",
            inTransition ? "py-3" : "py-8"
          )}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={handleDragEnd}
        >
          {Array.from({ length: 5 }, (_, offset) => {
            const i = (index - 2 + offset + services.length) % services.length;
            const service = services[i];

            const distance = Math.min(
              Math.abs(i - index),
              services.length - Math.abs(i - index)
            );

            const scale = distance === 0 ? 1.05 : distance === 1 ? 0.88 : 0.8;
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.75 : 0.5;
            const translateX = distance === 2 ? (offset < 2 ? 35 : -35) : 0;

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
                <motion.div
                  custom={offset}
                  variants={carriageVariants}
                  className={cn(
                    "relative rounded-xl overflow-hidden shadow-md border border-accent bg-white pointer-events-none",
                    inTransition
                      ? "w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 lg:w-56 lg:h-72 xl:w-60 xl:h-80"
                      : "w-28 h-36 sm:w-36 sm:h-48 md:w-48 md:h-64 lg:w-56 lg:h-72 xl:w-64 xl:h-80"
                  )}
                >
                  <Image
                    src={`/home-page${service.image}`}
                    alt={service.title}
                    width={256}
                    height={320}
                    className="w-full h-full object-fill"
                  />
                  {distance === 0 && (
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 rounded-t-lg w-full bg-primary text-white text-center font-semibold",
                        inTransition ? "py-1.5 text-base" : "py-2 text-xl"
                      )}
                    >
                      {service.title}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.55, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex justify-center gap-4 sm:gap-6",
            inTransition ? "mt-3 mb-2" : "mt-4 sm:mt-6"
          )}
        >
          <motion.button
            onClick={prev}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="h-11 min-w-11 px-4 flex text-center items-center text-white border-2 border-primary justify-center rounded-full shadow-lg bg-primary hover:bg-transparent hover:text-primary transition"
          >
            <ChevronsLeft width="50" size="xl" fontWeight={900} />
          </motion.button>
          <motion.button
            onClick={next}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="h-11 min-w-11 px-4 text-center flex items-center text-white border-2 border-primary justify-center rounded-full shadow-lg bg-primary hover:bg-transparent hover:text-primary transition"
          >
            <ChevronsRight width="50" size="xl" fontWeight={900} />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}