"use client";

import { useState, useEffect } from "react";
import AnimatedSectionHeading from "../home/AnimatedSectionHeading";
import { motion, AnimatePresence } from "framer-motion";
import { getDocuments } from "@/lib/firebase";
import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Testimonial = {
  id: number;
  name: string;
  country: string;
  text: string;
  avatar: string;
  service: "embroidery" | "vector" | "both";
};

type ServiceTestimonialsProps = {
  service: "embroidery" | "vector";
};

// ─── Animation variants ─────────────────────────────────────────────────────────

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const createCardVariants = (offset: number) => ({
  hidden: { opacity: 0, x: offset },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
});

const imageVariants = createCardVariants(-72);
const panelVariants = createCardVariants(72);

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: {
    x: 0, opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300, opacity: 0,
    transition: { duration: 0.4 },
  }),
};

// ─── Skeleton ───────────────────────────────────────────────────────────────────

function SkeletonSlide() {
  return (
    <div className="flex items-center animate-pulse">
      <div className="shrink-0 w-64 h-80 md:w-80 md:h-96 rounded-l-xl bg-blue-700/40" />
      <div className="flex-1 bg-blue-800/60 rounded-r-xl p-8 h-80 md:h-96 space-y-4">
        <div className="h-4 w-full rounded bg-blue-700/50" />
        <div className="h-4 w-5/6 rounded bg-blue-700/50" />
        <div className="h-4 w-4/6 rounded bg-blue-700/50" />
        <div className="h-4 w-3/6 rounded bg-blue-700/50" />
        <div className="mt-8 h-4 w-28 rounded bg-blue-700/50" />
        <div className="h-3 w-20 rounded bg-blue-700/40" />
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────────

export default function ServiceTestimonials({ service }: ServiceTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [index, setIndex]               = useState(0);
  const [direction, setDirection]       = useState(1);

  useEffect(() => {
    setIndex(0); // reset slide when service changes

    getDocuments<Testimonial>("testimonials")
      .then((docs) => {
        const filtered = docs
          .filter((t) => t.service === service || t.service === "both")
          .sort((a, b) => a.id - b.id);
        setTestimonials(filtered);
      })
      .catch((err) => console.error("Testimonials fetch failed:", err))
      .finally(() => setLoading(false));
  }, [service]);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <section className="w-full bg-blue-900 text-white py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

        {/* Heading */}
        <div className="lg:col-span-1 text-left px-4">
          <AnimatedSectionHeading className="text-4xl lg:text-5xl font-bold mb-4">
            From the people
          </AnimatedSectionHeading>
          <p className="text-sm lg:text-base text-blue-100 max-w-md">
            We love hearing from our customers! You&apos;re the reason we&apos;re here and the reason we do what we do.
          </p>
        </div>

        {/* Slider */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="relative overflow-hidden" style={{ minHeight: "24rem" }}>

            {loading ? (
              <SkeletonSlide />
            ) : testimonials.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-blue-200 text-sm">
                No testimonials available.
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex items-center"
                  >
                    <motion.div
                      variants={imageVariants}
                      className="shrink-0 w-64 h-80 md:w-80 md:h-96 overflow-hidden shadow-xl rounded-l-xl bg-white"
                    >
                      <Image width={150} height={250} src={t.avatar} alt={t.name} className="w-full h-full object-fill" />
                    </motion.div>

                    <motion.div
                      variants={panelVariants}
                      className="flex-1 bg-blue-800 bg-opacity-90 rounded-r-xl p-8 shadow-inner h-80 md:h-96"
                    >
                      <p className="text-base lg:text-lg leading-relaxed mb-6">{t.text}</p>
                      <div className="mt-6">
                        <div className="font-semibold text-white">{t.name}</div>
                        <div className="text-sm text-blue-200">{t.country}</div>
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Nav buttons — only show if more than 1 */}
                {testimonials.length > 1 && (
                  <div className="absolute right-6 bottom-6 flex gap-4 z-10">
                    <button
                      onClick={prev}
                      aria-label="Previous"
                      className="w-12 h-12 cursor-pointer rounded-full bg-blue-700 bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next"
                      className="w-12 h-12 rounded-full cursor-pointer bg-blue-700 bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}