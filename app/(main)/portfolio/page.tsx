"use client";

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import Image from "next/image";
import { getDocuments } from "../../../lib/firebase";

// ─── Types & Data ──────────────────────────────────────────────────────────────
type PortfolioItem = {
  id: string;
  itemId: number;
  title: string;
  path: string;
  service: "Embroidery" | "Vector" | "Raster-to-Vector" | "Custom Patches";
};

type CategoryConfig = {
  service: PortfolioItem["service"];
  label: string;
  description: string;
  bannerBg: string;
  accentColor: string;
  bannerTextColor: string;
  tagline: string;
};

const categories: CategoryConfig[] = [
  {
    service: "Embroidery",
    label: "EMBROIDERY",
    description: "Precision-stitched designs digitized for any fabric, any machine.",
    bannerBg: "from-indigo-950 via-blue-900 to-slate-900",
    accentColor: "bg-blue-600 border-blue-500",
    bannerTextColor: "text-white",
    tagline: "Thread by thread. Pixel by pixel.",
  },
  {
    service: "Vector",
    label: "VECTOR ART",
    description: "Scalable vector illustrations crafted for print, screen, and beyond.",
    bannerBg: "from-indigo-950 via-blue-900 to-slate-900",
    accentColor: "bg-emerald-600 border-emerald-500",
    bannerTextColor: "text-white",
    tagline: "Infinite resolution. Infinite possibilities.",
  },
];

// ─── Animation variants ────────────────────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: cubicBezier(0.22, 1, 0.36, 1) } },
};

// ─── Shared image size constant ───────────────────────────────────────────────
// Perfect square (width === height). On md+ it's measured dynamically to fill
// the stage; this clamp is the fallback used below md (and the first paint on
// desktop before the measurement kicks in):
//   • vertical  budget  → 100vh minus top bar + thumb strip + breathing room
//   • horizontal budget → 100vw minus stage padding + a little breathing room
//     (24px each side on mobile — the old `100vw - 200px` assumed the desktop
//     side nav buttons and forced the 320px floor onto narrow screens)
const IMG_SIZE = "clamp(220px, min(calc(100vh - 190px), calc(100vw - 48px)), 1080px)";

// ─── Animated Nav Button ───────────────────────────────────────────────────────
const NavButton = ({
  direction,
  enabled,
  onClick,
  heightPx,
}: {
  direction: "prev" | "next";
  enabled: boolean;
  onClick: () => void;
  heightPx?: string;
}) => {
  const isPrev = direction === "prev";
  return (
    <motion.button
      onClick={onClick}
      disabled={!enabled}
      whileTap={enabled ? { scale: 0.93 } : {}}
      className="relative shrink-0 overflow-hidden rounded-xl flex items-center cursor-pointer justify-center border outline-none w-9 2xl:w-14"
      style={{
        height: heightPx ?? IMG_SIZE,
        borderColor: enabled ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)",
        background: enabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
        cursor: enabled ? "pointer" : "default",
      }}
      variants={
        enabled
          ? {
            rest: { boxShadow: "0 0 0px 0px rgba(255,255,255,0)", borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)" },
            hover: { boxShadow: "0 0 18px 2px rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.15)" },
          }
          : {}
      }
      initial="rest"
      whileHover={enabled ? "hover" : "rest"}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {enabled && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)" }}
          variants={{ rest: { opacity: 0, y: "100%" }, hover: { opacity: 1, y: "0%" } }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}
      <motion.span
        className="relative z-10 flex items-center justify-center"
        variants={
          enabled
            ? { rest: { x: 0, opacity: 0.7 }, hover: { x: isPrev ? -3 : 3, opacity: 1 } }
            : { rest: { x: 0, opacity: 0.2 }, hover: { x: 0, opacity: 0.2 } }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <svg className="w-[18px] h-[18px] 2xl:w-6 2xl:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ color: enabled ? "white" : "rgba(255,255,255,0.2)" }}>
          {isPrev ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
        </svg>
      </motion.span>
    </motion.button>
  );
};

// ─── Mobile Nav Button (for inside image container on mobile) ─────────────────
const MobileNavButton = ({
  direction,
  enabled,
  onClick,
}: {
  direction: "prev" | "next";
  enabled: boolean;
  onClick: () => void;
}) => {
  const isPrev = direction === "prev";
  return (
    <motion.button
      onClick={onClick}
      disabled={!enabled}
      whileTap={enabled ? { scale: 0.9 } : {}}
      whileHover={enabled ? { scale: 1.08, backgroundColor: "rgba(255,255,255,0.22)" } : {}}
      className="flex items-center justify-center rounded-full outline-none border cursor-pointer"
      style={{
        width: 44,
        height: 44,
        borderColor: enabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)",
        background: enabled ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(8px)",
        cursor: enabled ? "pointer" : "default",
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ color: enabled ? "white" : "rgba(255,255,255,0.2)" }}>
        {isPrev ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </motion.button>
  );
};

// ─── Animated Thumbnail Button ────────────────────────────────────────────────
const ThumbButton = ({
  thumb,
  isActive,
  onClick,
}: {
  thumb: PortfolioItem;
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className="relative shrink-0 rounded-lg overflow-hidden outline-none cursor-pointer"
    style={{
      width: "clamp(36px, 7vw, 72px)",
      height: "clamp(28px, 5vw, 54px)",
      background: "white"
    }}
    animate={{
      opacity: isActive ? 1 : 0.35,
      scale: isActive ? 1.08 : 1,
      boxShadow: isActive
        ? "0 0 0 2px rgba(255,255,255,0.85), 0 4px 16px rgba(0,0,0,0.5)"
        : "0 0 0 0px rgba(255,255,255,0)",
    }}
    whileHover={
      !isActive
        ? { opacity: 0.85, scale: 1.12, boxShadow: "0 0 0 1.5px rgba(255,255,255,0.5), 0 4px 14px rgba(0,0,0,0.4)" }
        : {}
    }
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    {/* Shine sweep on hover */}
    <motion.span
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{ x: "-100%", opacity: 0 }}
      whileHover={{ x: "100%", opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
    />
    <Image src={thumb.path} width={100} height={80} alt={thumb.title}
      className="w-full h-full object-cover" unoptimized />
  </motion.button>
);

// ─── Lightbox Modal ────────────────────────────────────────────────────────────
type LightboxProps = {
  items: PortfolioItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
};

const Lightbox = ({ items, currentIndex, onClose, onPrev, onNext, onJump }: LightboxProps) => {
  const item = items[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const direction = 0;

  const isScrollingRef = useRef(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  // Refs used to measure the stage so the square image can fill the leftover
  // height on md+ without touching the top bar / thumbnail strip.
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const leftNavRef = useRef<HTMLDivElement>(null);
  const rightNavRef = useRef<HTMLDivElement>(null);
  const [imgSizePx, setImgSizePx] = useState<number | null>(null);

  useEffect(() => {
    const container = thumbStripRef.current;
    if (!container) return;
    const activeThumb = container.children[currentIndex] as HTMLElement;
    if (activeThumb) {
      container.scrollTo({
        left: activeThumb.offsetLeft - (container.offsetWidth - activeThumb.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") { if (hasPrev) onPrev(); }
      if (e.key === "ArrowRight") { if (hasNext) onNext(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isScrollingRef.current) return;
    e.preventDefault();
    isScrollingRef.current = true;
    if (e.deltaY > 0) { if (hasNext) onNext(); }
    else { if (hasPrev) onPrev(); }
    setTimeout(() => { isScrollingRef.current = false; }, 350);
  }, [hasNext, hasPrev, onNext, onPrev]);

  // ── Suppress header/footer z-index while lightbox is open ─────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const header = document.querySelector("header") as HTMLElement | null;
    const stickyNav = document.querySelector(".sticky") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    if (header) header.style.zIndex = "0";
    if (stickyNav) stickyNav.style.zIndex = "0";
    if (footer) footer.style.zIndex = "0";
    return () => {
      document.body.style.overflow = "";
      if (header) header.style.zIndex = "";
      if (stickyNav) stickyNav.style.zIndex = "";
      if (footer) footer.style.zIndex = "";
    };
  }, []);

  // ── Fill the stage with the largest square that fits ─────────────────────
  // On md+ the nav buttons sit at the image's sides, so the square can take
  // the stage's FULL leftover height. We measure the actual flex space
  // (between top bar and thumb strip) and subtract the side nav + gaps for
  // the width budget — min(height, width) keeps it a perfect square while
  // never overflowing or pushing into the chrome above/below.
  // Below md the nav buttons drop below the image, so we keep the clamp
  // fallback (IMG_SIZE) instead of forcing the square to fill the height.
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const row = rowRef.current;
      const leftNav = leftNavRef.current;
      const rightNav = rightNavRef.current;
      if (!stage || !row) return;
      // Left/right nav wrappers are `hidden md:flex` → offsetWidth 0 on mobile.
      if (!leftNav || leftNav.offsetWidth === 0) {
        setImgSizePx(null);
        return;
      }
      const gap = parseFloat(getComputedStyle(row).columnGap) || 16;
      // Keep a little breathing room below so the square doesn't touch the thumb strip.
      const availHeight = stage.clientHeight - 24;
      const availWidth =
        row.clientWidth -
        (leftNav?.offsetWidth ?? 0) -
        (rightNav?.offsetWidth ?? 0) -
        gap * 2;
      setImgSizePx(Math.max(280, Math.min(availHeight, availWidth, 1080)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  // Measured px size when available, otherwise the responsive clamp fallback.
  const imgSize = imgSizePx ? `${imgSizePx}px` : IMG_SIZE;

  const progressPct = ((currentIndex + 1) / items.length) * 100;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-99999 cursor-pointer"
        style={{ background: "rgba(2, 6, 30, 0.93)", backdropFilter: "blur(20px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* Modal shell */}
      <motion.div
        key="modal"
        className="fixed inset-0 z-100000 flex flex-col pointer-events-none"
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* TOP BAR */}
        <div
          className="pointer-events-auto shrink-0 flex items-center justify-between px-5 md:px-8 xl:px-12 py-4 xl:py-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 min-w-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="text-white/70 text-sm font-medium xl:text-base truncate max-w-40 md:max-w-xs"
              >
                {item.title}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:block w-28 xl:w-40 h-[3px] xl:h-[4px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/60 rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            {/* Close button , spins in on mount */}
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,1)", color: "#111827" }}
              whileTap={{ scale: 0.9, rotate: 90 }}
              className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border border-white/15 bg-white/8 text-white/60
                flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* IMAGE STAGE */}
        <div
          ref={stageRef}
          className="pointer-events-auto flex-1 min-h-0 flex items-center justify-center px-4 md:px-8 gap-3 md:gap-4"
          onClick={(e) => e.stopPropagation()}
          onWheel={handleWheel}
        >
          <div ref={rowRef} className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full justify-center">

            {/* Desktop-only left nav , height matches image (square) */}
            <div ref={leftNavRef} className="hidden md:flex items-stretch" style={{ height: imgSize }}>
              <NavButton
                direction="prev"
                enabled={hasPrev}
                onClick={onPrev}
                heightPx={imgSize}
              />
            </div>

            {/* ── Image container ──
                Perfect square: width === height = imgSize (measured on md+ to
                fill the leftover stage height; clamp fallback below md). */}
            <div
              className="relative rounded-2xl overflow-hidden shrink-0"
              style={{
                width: imgSize,
                height: imgSize,
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                // background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)",
                background: "white",
              }}
            >
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={item.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.path}
                    width={1280}
                    height={1001}
                    alt={item.title}
                    className="w-full h-full object-contain bg-white"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.2)" }} />

              {/* Desktop click zones */}
              <div onClick={hasPrev ? onPrev : undefined}
                className={`absolute left-0 top-0 bottom-0 w-1/4 z-10 hidden md:block ${hasPrev ? "cursor-pointer" : ""}`} />
              <div onClick={hasNext ? onNext : undefined}
                className={`absolute right-0 top-0 bottom-0 w-1/4 z-10 hidden md:block ${hasNext ? "cursor-pointer" : ""}`} />
            </div>

            {/* Desktop-only right nav , height matches image (square) */}
            <div ref={rightNavRef} className="hidden md:flex items-stretch" style={{ height: imgSize }}>
              <NavButton direction="next" enabled={hasNext} onClick={onNext} heightPx={imgSize} />
            </div>

            {/* Mobile nav buttons - below image container on small screens */}
            <div className="flex md:hidden items-center gap-4 w-full justify-center pt-2">
              <MobileNavButton direction="prev" enabled={hasPrev} onClick={onPrev} />
              <MobileNavButton direction="next" enabled={hasNext} onClick={onNext} />
            </div>

          </div>
        </div>

        {/* THUMBNAIL STRIP , fixed min height so it never gets too thin */}
        <div
          className="pointer-events-auto flex-shrink-0 px-4 md:px-8 pt-2 pb-4 hidden md:flex min-h-[76px] items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            ref={thumbStripRef}
            onWheel={handleWheel}
            className="flex gap-3 overflow-x-auto px-1 pb-1 w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
          >
            {items.map((thumb, idx) => (
              <ThumbButton
                key={thumb.id}
                thumb={thumb}
                isActive={idx === currentIndex}
                onClick={() => onJump(idx)}
              />
            ))}
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Portfolio Card ────────────────────────────────────────────────────────────
const PortfolioCard = ({ item, onClick }: { item: PortfolioItem; onClick: () => void }) => (
  <motion.div
    onClick={onClick}
    // `aspect-square`  → always a perfect 1:1 square, regardless of grid column width
    // `bg-white`       → the white canvas lives here so it scales with the card
    // `w-full max-w-[320px]` → still respects the grid column width
    className="group relative rounded-2xl cursor-pointer overflow-hidden w-full max-w-[320px] aspect-square bg-white"
    initial={{ opacity: 0, y: 28 }}
    whileInView={{
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: cubicBezier(0.22, 1, 0.36, 1) },
    }}
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ y: -8, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 280, damping: 22 }}
    style={{ boxShadow: "0 15px 35px rgba(0,0,0,0.45), 0 5px 15px rgba(0,0,0,0.3)" }}
  >
    {/* Hover glow border , unchanged */}
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ boxShadow: "inset 0 0 0 1.5px rgba(99,102,241,0.6), 0 0 28px rgba(99,102,241,0.12)" }}
    />

    {/*
      Image wrapper
      ─────────────
      `absolute inset-[2px]`  → 2 px gap between the image and the card edge.
                                 This gives the "almost no space" look from the screenshot.
                                 • Use `inset-0`    for fully edge-to-edge
                                 • Use `inset-1`    for 4 px gap
                                 • Use `inset-[6px]` for a more padded look
      `overflow-hidden`        → clip the image on hover scale so it doesn't bleed outside
    */}
    <div className="absolute inset-[2px] overflow-hidden rounded-xl z-10">
      <Image
        src={item.path}
        fill                   // ← stretches to fill the parent box (the `absolute inset-[2px]` div)
        alt={item.title}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        // `object-contain` keeps the full artwork visible, no cropping.
        // The white card background shows through any transparent/white image padding.
        className="object-contain transition-transform duration-500 group-hover:scale-105 z-20"
        unoptimized
      />

      {/* Gradient overlay — sits BEHIND the image now, so it never darkens the artwork */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Shine sweep , unchanged */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
          style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)" }}
        />
      </div>
    </div>
  </motion.div>
);

// ─── Product Grid with staggered cards ────────────────────────────────────────
const ProductGrid = ({
  items,
  onCardClick,
  visibleCount,
}: {
  items: PortfolioItem[];
  onCardClick: (index: number) => void;
  visibleCount: number;
}) => {
  const visibleItems = items.slice(0, visibleCount);
  return (
    // Single responsive grid: cards flow into 1/2/3 columns based on width.
    // (Chunking into rows of 3 previously caused a 2+1 wrap on 2-col screens.)
    // Each card animates itself on its own `whileInView`, so cards added later
    // (Firestore data arriving after mount, or "View More") always become
    // visible instead of staying stuck at opacity 0.
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 justify-items-center">
      {visibleItems.map((item, index) => (
        <PortfolioCard key={item.id} item={item} onClick={() => onCardClick(index)} />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  BOTTOM LAYER , Fixed banners with animated floating blobs
// ═══════════════════════════════════════════════════════════════════════════════
const FloatingBlob = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -18, 0], scale: [1, 1.07, 1] }}
    transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const BottomBannerLayer = ({ activeBannerIndex }: { activeBannerIndex: number }) => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {categories.map((config, i) => (
      <motion.div
        key={config.service}
        className={`absolute inset-0 bg-gradient-to-br ${config.bannerBg}`}
        initial={false}
        animate={{ opacity: i === activeBannerIndex ? 1 : 0 }}
        transition={{ duration: 0 }}
      >
        {/* Ghost watermark , scales in */}
        <div className="absolute inset-0 flex items-center justify-center select-none" aria-hidden="true">
          <motion.span
            className="text-white/[0.05] font-black uppercase tracking-tighter leading-none"
            style={{ fontSize: "clamp(60px, 14vw, 180px)" }}
            animate={i === activeBannerIndex ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {config.label}
          </motion.span>
        </div>

        {/* Floating ambient blobs */}
        <FloatingBlob className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" delay={0} />
        <FloatingBlob className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 blur-2xl" delay={2.5} />
        <FloatingBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.025] blur-3xl" delay={1.2} />
        <FloatingBlob className="absolute top-1/4 right-1/4 w-52 h-52 rounded-full bg-indigo-400/5 blur-2xl" delay={3.5} />

        {/* Banner text , staggered slide-up per category */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="text-white/50 text-sm font-semibold uppercase tracking-[0.3em] mb-3"
            animate={i === activeBannerIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {config.tagline}
          </motion.p>
          <motion.h2
            className={`text-4xl md:text-6xl font-black uppercase tracking-tight ${config.bannerTextColor} mb-4`}
            animate={i === activeBannerIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
          >
            {config.label}
          </motion.h2>
          <motion.p
            className="text-white/70 max-w-xl text-sm md:text-base"
            animate={i === activeBannerIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
          >
            {config.description}
          </motion.p>
        </div>
      </motion.div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  TOP LAYER , Category section
// ═══════════════════════════════════════════════════════════════════════════════
const CategorySection = ({
  config,
  spacerRef,
  gridMidRef,
  items,
}: {
  config: CategoryConfig;
  spacerRef: (el: HTMLDivElement | null) => void;
  gridMidRef: (el: HTMLDivElement | null) => void;
  items: PortfolioItem[];
}) => {
  const sectionItems = items.filter((item) => item.service === config.service);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const goNext = useCallback(
    () => setLightboxIndex((i) => (i !== null && i < sectionItems.length - 1 ? i + 1 : i)),
    [sectionItems.length]
  );
  const handleJump = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);
  const handleViewMore = () => setVisibleCount((prev) => Math.min(prev + 12, sectionItems.length));
  const hasMoreItems = visibleCount < sectionItems.length;

  return (
    <div>
      <div ref={spacerRef} className="h-[70vh]" aria-hidden="true" />

      <div
        className="relative z-20 bg-gray-50 py-14 px-4"
        style={{ boxShadow: "0 -48px 80px rgba(0,0,0,0.55), 0 -8px 24px rgba(0,0,0,0.3)" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header , slides in from left */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-3xl font-bold text-gray-900">{config.label}</h3>
            {/* Animated accent line under header */}
            <motion.div
              className="mt-2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>

          <ProductGrid
            items={sectionItems}
            onCardClick={openLightbox}
            visibleCount={visibleCount}
          />
          <div ref={gridMidRef} aria-hidden="true" />

          {hasMoreItems && (
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                onClick={handleViewMore}
                className="cursor-pointer text-sm font-semibold text-gray-700 border border-gray-300
                  rounded-full px-6 py-2.5 relative overflow-hidden"
                whileHover={{ scale: 1.04, color: "#2563eb", borderColor: "#2563eb" }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                {/* Fill sweep on hover */}
                <motion.span
                  className="absolute inset-0 rounded-full bg-blue-50 pointer-events-none"
                  initial={{ scaleX: 0, originX: "0%" }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <span className="relative">View More →</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={sectionItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          onJump={handleJump}
        />
      )}
    </div>
  );
};
// ─────Fetch Documents from firebase─────────────────────────────────────────────
type PortfolioIndex = {
  updatedAt?: unknown;
  urls: string[];
};

async function getPortfolioIndex() {
  const docs = await getDocuments<PortfolioIndex>("portfolioIndex");

  return docs.flatMap((doc) => {
    const service = (
      doc.id === "embroidery"
        ? "Embroidery"
        : doc.id === "vector"
          ? "Vector"
          : doc.id === "raster"
            ? "Raster-to-Vector"
            : "Custom Patches"
    ) as PortfolioItem["service"];

    return (doc.urls || []).map((url, index) => ({
      id: `${doc.id}-${index}`,
      itemId: index + 1,
      title: service,
      path: url,
      service,
    }));
  });
}
// ─── Main Export ───────────────────────────────────────────────────────────────
export default function PortfolioSection() {
  const spacerRefs = useRef<(HTMLDivElement | null)[]>(categories.map(() => null));
  const gridMidRefs = useRef<(HTMLDivElement | null)[]>(categories.map(() => null));
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      let next = 0;
      spacerRefs.current.forEach((ref, i) => {
        if (!ref) return;
        if (ref.getBoundingClientRect().top < vh) next = i;
      });
      gridMidRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const nextIdx = i + 1;
        if (nextIdx < categories.length && ref.getBoundingClientRect().top < vh) next = nextIdx;
      });
      setActiveBannerIndex(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPortfolio() {
      try {
        const data = await getPortfolioIndex();

        if (!active) return;

        setPortfolioData(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative">
      <BottomBannerLayer activeBannerIndex={activeBannerIndex} />
      <div className="relative z-10">
        {/* ── Hero , staggered entrance ── */}
        <section className="min-h-[60vh] flex items-center justify-center bg-white relative">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />
          <motion.div
            className="relative text-center px-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={fadeUp} className="text-blue-600 text-sm font-semibold uppercase tracking-[0.3em] mb-4">
              Creative Studio
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black text-gray-900 mb-4">
              Our Portfolio
            </motion.h1>
            {/* Animated gradient underline */}
            <motion.div
              className="mx-auto mb-6 h-1 rounded-full"
              style={{ background: "linear-gradient(90deg, #181818, #0A21C0)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100px", opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto text-lg">
              Explore our diverse collection of digitized embroidery, vector art, raster conversions,
              and custom patches , crafted with precision for every client.
            </motion.p>
          </motion.div>
        </section>

        {categories.map((config, i) => (
          <CategorySection
            key={config.service}
            config={config}
            spacerRef={(el) => { spacerRefs.current[i] = el; }}
            gridMidRef={(el) => { gridMidRefs.current[i] = el; }}
            items={portfolioData}
          />
        ))}
      </div>
    </div>
  );
}

