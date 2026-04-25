"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import AnimatedSectionHeading from "./AnimatedSectionHeading";

type CardProps = {
  before: string;
  after: string;
};

const Card = ({ before, after }: CardProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative bg-gray-100 text-secondary rounded-3xl w-full h-full flex gap-4 sm:gap-6 shadow-xl p-4 sm:p-0"
    >
      {/* Left: Before */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="rounded-2xl sm:ml-9 sm:mt-6 shadow-2xl bg-white shadow-black/80 border border-gray-400 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center p-2">
          <Image src={before} alt="Before" width={150} height={150} className="rounded-xl w-full h-full object-cover" />
        </div>
        <span className="text-lg lg:text-xl font-bold italic">Before</span>
      </div>

      {/* Right: After */}
      <div className="relative ml-auto shrink-0 max-w-full">
        <div className="rounded-3xl p-3 md:p-4 xl:p-6 shadow-xl shadow-black/60 border border-gray-400 flex flex-col justify-center items-center gap-2 backdrop-blur-md bg-white/10 border-white/20">
          <span className="text-lg md:text-xl xl:text-2xl font-bold italic">After</span>
          <div className="rounded-2xl shadow-2xl shadow-black/70 bg-white/20 border border-white/30 w-28 h-28 md:w-36 md:h-36 xl:w-48 xl:h-48 flex items-center justify-center p-2 hover:scale-105 transition-transform duration-500 backdrop-blur-lg">
            <Image src={after} alt="After" width={320} height={320} onClick={() => setOpen(true)} className="rounded-2xl w-full h-full object-cover cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
            onClick={() => setOpen(false)}
          >
            <button onClick={() => setOpen(false)} className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer">&times;</button>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={after} alt="After Full" width={2000} height={2000} className="object-contain" style={{ width: "75vw", height: "75vh", borderRadius: "1.5rem" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ALL_ITEMS = [
  { before: "/home-page/1B.png", after: "/home-page/1A.png" },
  { before: "/home-page/2B.png", after: "/home-page/2A.png" },
  { before: "/home-page/4B.png", after: "/home-page/4A.png" },
  { before: "/home-page/1B.png", after: "/home-page/1A.png" },
  { before: "/home-page/2B.png", after: "/home-page/2A.png" },
  { before: "/home-page/4B.png", after: "/home-page/4A.png" },
];

export default function BeforeAfterGrid() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)"); // matches Tailwind's `sm` breakpoint
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const items = isMobile ? ALL_ITEMS.slice(0, 3) : ALL_ITEMS;

  return (
    <section className="max-w-fit mx-auto px-4 py-16">
      <AnimatedSectionHeading className="mb-12 text-center text-4xl font-bold lg:text-5xl fade-in-up">
        Before & After
      </AnimatedSectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {items.map((item, i) => (
          <Card key={i} before={item.before} after={item.after} />
        ))}
      </div>
    </section>
  );
}