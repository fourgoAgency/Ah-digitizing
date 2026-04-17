"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import Banner from "@/components/home/Banner";
import Services from "@/components/home/Services";

export default function BannerStackTransition() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

// Tighter spring — less overshoot lag
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 160,
  damping: 30,
  mass: 0.2,
});

const transitionWindow = useTransform(
  smoothProgress,
  [0, 0.20, 0.28, 0.36, 0.42, 0.45],
  [0, 0,    0.4,  0.4,  1,    1]
);
  const revealPercent = useTransform(transitionWindow, [0, 1], [0, 100]);
  const bannerOpacity = useTransform(transitionWindow, [0, 0.74, 1], [1, 0.97, 0.08]);
  const bannerScale = useTransform(transitionWindow, [0, 1], [1, 0.985]);
  const bannerY = useTransform(transitionWindow, [0, 1], [0, -16]);
  const servicesRevealTop = useTransform(transitionWindow, [0, 1], [50, 0]);
  const servicesOpacity = useTransform(transitionWindow, [0, 0.5, 1], [0.35, 0.78, 1]);
  const servicesScale = useTransform(transitionWindow, [0, 1], [0.54, 1]);
  const servicesOverlayOpacity = useTransform(transitionWindow, [0, 0.32, 1], [0.5, 0.16, 0]);

  const bannerClipPath = useMotionTemplate`inset(0% 0% ${revealPercent}% 0% round 2rem)`;
  const servicesClipPath = useMotionTemplate`inset(${servicesRevealTop}% 0% 0% 0% round 2rem 2rem 0 0)`;

  return (
    <section
      ref={wrapperRef}
      className="relative h-[300svh] bg-white"
      style={{
        perspective: "1600px",
      }}
    >
      <div className="sticky top-0 h-svh overflow-hidden flex flex-col">
        <motion.div
          className="absolute inset-0 z-10 pt-5 will-change-transform"
          style={{
            opacity: servicesOpacity,
            scale: servicesScale,
            clipPath: servicesClipPath,
            transformOrigin: "50% 50%",
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-20 z-20 bg-linear-to-b from-primary/35 via-primary/10 to-transparent"
            style={{ opacity: servicesOverlayOpacity }}
          />
          <Services inTransition />
        </motion.div>

        <motion.div
          className="absolute inset-0 z-30 will-change-transform"
          style={{
            opacity: bannerOpacity,
            scale: bannerScale,
            y: bannerY,
            clipPath: bannerClipPath,
          }}
        >
          <Banner />
        </motion.div>
      </div>
    </section>
  );
}
