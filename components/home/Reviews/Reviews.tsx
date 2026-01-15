"use client";
import React, { useEffect, useRef } from "react";
import Card from "./Card";
import { motion } from "framer-motion";

export default function Reviews() {
  const data = [
    {
      name: "Aisha Khan",
      role: "Founder, HalalNest",
      Review:
        "Working with Fourgo Agency was a blessing! They understood our halal brand values and built a digital identity that truly reflects our mission. Professional, creative, and sincere.",
      rating: 5,
      avatarInitial: "AK",
    },
    {
      name: "Omar Siddiqui",
      role: "CEO, DeenTech Solutions",
      Review:
        "Fourgo helped us scale our tech startup with strong branding and digital marketing. Their respect for Islamic business ethics made the collaboration smooth and trustworthy.",
      rating: 4.8,
      avatarInitial: "OS",
    },
    {
      name: "Fatima Rahman",
      role: "Co-Founder, ModestWear Collective",
      Review:
        "We wanted our fashion brand to speak to modern Muslim women — and Fourgo nailed it. The visuals, tone, and strategy were perfectly on-brand. Highly recommended!",
      rating: 4.9,
      avatarInitial: "FR",
    },
    {
      name: "Yusuf Ahmed",
      role: "Managing Director, Crescent Foods",
      Review:
        "The Fourgo team helped us modernize our marketing while maintaining our halal integrity. Their approach was data-driven yet deeply respectful of our brand identity.",
      rating: 5,
      avatarInitial: "YA",
    },
    {
      name: "Sara Malik",
      role: "Owner, Noor Essentials",
      Review:
        "Our eCommerce store saw a massive boost in sales and engagement after Fourgo revamped our visuals and ad strategy. Their design sense is just next-level.",
      rating: 4.7,
      avatarInitial: "SM",
    },
    {
      name: "Bilal Hassan",
      role: "Founder, Ummah Connect",
      Review:
        "Fourgo Agency transformed our community app’s online presence with sleek UI and meaningful storytelling. They truly understand purpose-driven Muslim brands.",
      rating: 5,
      avatarInitial: "BH",
    },
  ];

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const stoppedRef = useRef(false); // track if autoplay finished
  // speed in pixels per millisecond
  console.log(stoppedRef.current);
  const speedPxPerMs = 0.16;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const prevScrollBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 1) {
      el.style.scrollBehavior = prevScrollBehavior;
      return;
    }

    const step = (time: number) => {
      rafRef.current = requestAnimationFrame(step);

      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const move = delta * speedPxPerMs;
      el.scrollLeft += move;

      // When reaching end, reset to start for infinite loop
      if (el.scrollLeft >= maxScroll - 0.5) {
        el.scrollLeft = 0;
      }
    };

    // start at beginning
    el.scrollLeft = 0;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
      el.style.scrollBehavior = prevScrollBehavior;
    };
  }, []); // Empty dependency array for running once on mount

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white via-teal-50/40 to-white text-teal-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold mt-4">
          <span className="text-teal-500">Client</span> Reviews
        </h2>
        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Enthusiastic Client Reviews Illuminate Our Commitment, Creativity, and
          Exceptional Service — Inspiring Our Pursuit of Excellence.
        </p>

        {/* Horizontal continuous scroll (autoplay once, stops at end) */}
        <div className="mt-12 relative">
          <div
            ref={scrollRef}
            className="flex gap-8 px-4 overflow-x-auto py-6 scrollbar-hide"
            style={{
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {data.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(45, 212, 191, 0.12)",
                }}
                className="testimonial-card min-w-[280px] md:min-w-[320px] lg:min-w-[360px] transition-all duration-300 rounded-3xl bg-white/90 backdrop-blur-sm border border-teal-100 hover:border-teal-400"
              >
                <Card {...review} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
