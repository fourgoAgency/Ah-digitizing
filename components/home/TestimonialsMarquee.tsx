"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { getDocuments } from "@/lib/firebase";
import AnimatedSectionHeading from "./AnimatedSectionHeading";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="relative mt-16 w-[280px] shrink-0 rounded-[28px] border border-gray-200 bg-white p-6 pt-16 shadow-xl sm:w-[320px] animate-pulse">
      <div className="absolute right-6 -top-10 h-20 w-20 rounded-full bg-gray-200 border-4 border-gray-100" />
      <div className="absolute left-[-20px] top-0">
        <div className="relative rounded-tl-[26px] rounded-tr-[26px] rounded-br-[26px] bg-gray-200 px-10 py-3 w-36 h-12" />
      </div>
      <div className="mt-6 flex gap-4">
        <div className="w-1 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 rounded bg-gray-200" />
            ))}
          </div>
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
          <div className="h-3 w-4/6 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="relative mt-16 w-[280px] shrink-0 rounded-[28px] border border-gray-200 bg-white p-6 pt-16 shadow-xl transition-transform duration-300 hover:-translate-y-1 sm:w-[320px]">
      <div className="absolute right-6 -top-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-200 bg-white shadow-xl">
        <Image
          src={t.avatar}
          alt={t.name}
          width={80}
          height={80}
          unoptimized
          className="h-[72px] w-[72px] rounded-full object-cover"
        />
      </div>

      <div className="absolute left-[-20px] top-0">
        <div className="absolute left-0 top-[38px] h-10 w-5 rounded-bl-[20px] bg-[#2a5492]" />
        <div className="relative rounded-tl-[26px] rounded-tr-[26px] rounded-br-[26px] bg-[#2f5fa7] px-10 py-3 shadow-lg">
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-white/80">{t.role}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="w-1 rounded-full bg-[#2f5fa7]" />
        <div>
          <div className="mb-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={i < t.rating ? "h-4 w-4 text-yellow-400" : "h-4 w-4 text-gray-300"}
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-gray-600">{t.text}</p>
        </div>
      </div>
    </article>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function TestimonialsMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocuments<Testimonial>("testimonials")
      .then((docs) => {
        const sorted = docs.sort((a, b) => a.id - b.id);
        setTestimonials(sorted);
      })
      .catch((err) => console.error("Failed to fetch testimonials:", err))
      .finally(() => setLoading(false));
  }, []);

  const marqueeItems = [...testimonials, ...testimonials];
  const skeletons = Array.from({ length: 5 });

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-full px-4">
        <div className="mb-8 text-center sm:mb-10">
          <AnimatedSectionHeading className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Testimonials
          </AnimatedSectionHeading>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Real client feedback moving across the page. Hover or hold the strip to pause and read.
          </p>
        </div>

        <div
          className="relative overflow-hidden touch-pan-y cursor-grab"
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          tabIndex={0}
          aria-label="Scrolling testimonials. Hold to pause the motion."
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-20" />

          <div
            className="flex w-max gap-6 py-14 will-change-transform"
            style={{
              animationName: loading ? "none" : "home-testimonials-marquee",
              animationDuration: "34s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {loading
              ? skeletons.map((_, i) => <SkeletonCard key={i} />)
              : marqueeItems.map((item, index) => (
                <TestimonialCard key={`${item.id}-${index}`} t={item} />
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes home-testimonials-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}