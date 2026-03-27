"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import Image from "next/image";

// ─── Types & Data ──────────────────────────────────────────────────────────────
type PortfolioItem = {
  id: number;
  title: string;
  path: string;
  service: "Embroidery" | "Vector" | "Raster-to-Vector" | "Custom Patches";
};

const portfolioData: PortfolioItem[] = [
  { id: 1, title: "Custom Logo Digitizing", path: "/new/1-Photoroom.png", service: "Embroidery" },
  { id: 2, title: "Pet Portrait Embroidery", path: "/new/2-Photoroom.png", service: "Embroidery" },
  { id: 3, title: "Sports Team Logo", path: "/new/3-Photoroom.png", service: "Embroidery" },
  { id: 4, title: "Fashion Embroidery", path: "/new/4-Photoroom.png", service: "Embroidery" },
  { id: 5, title: "Hand Embroidery Closeup", path: "/new/5-Photoroom.png", service: "Embroidery" },
  { id: 6, title: "Embroidery Tools Flatlay", path: "/new/6-Photoroom.png", service: "Embroidery" },
  { id: 7, title: "Thread Texture Study", path: "/new/7-Photoroom.png", service: "Embroidery" },
  { id: 8, title: "Custom Name Embroidery", path: "/new/8-Photoroom.png", service: "Embroidery" },
  { id: 9, title: "Floral Embroidery Design", path: "/new/9-Photoroom.png", service: "Embroidery" },
  { id: 10, title: "Logo Embroidery Mockup", path: "/new/10-Photoroom.png", service: "Embroidery" },
  { id: 11, title: "Embroidery Close Detail", path: "/new/1-Photoroom.png", service: "Embroidery" },
  { id: 12, title: "Embroidery Hoop Art", path: "/new/2-Photoroom.png", service: "Embroidery" },
  { id: 13, title: "Monogram Patch Design", path: "/new/3-Photoroom.png", service: "Embroidery" },
  { id: 14, title: "Jacket Back Embroidery", path: "/new/4-Photoroom.png", service: "Embroidery" },
  { id: 15, title: "Cap Logo Stitching", path: "/new/5-Photoroom.png", service: "Embroidery" },
  { id: 16, title: "Uniform Badge Embroidery", path: "/new/6-Photoroom.png", service: "Embroidery" },
  { id: 17, title: "Decorative Stitch Pattern", path: "/new/7-Photoroom.png", service: "Embroidery" },
  { id: 18, title: "3D Puff Embroidery", path: "/new/8-Photoroom.png", service: "Embroidery" },
  { id: 19, title: "Gold Thread Embroidery", path: "/new/9-Photoroom.png", service: "Embroidery" },
  { id: 20, title: "Applique Patch Work", path: "/new/10-Photoroom.png", service: "Embroidery" },
  { id: 21, title: "Chenille Letter Patch", path: "/new/1-Photoroom.png", service: "Embroidery" },
  { id: 22, title: "Towel Monogramming", path: "/new/2-Photoroom.png", service: "Embroidery" },
  { id: 23, title: "Quilt Embroidery Border", path: "/new/3-Photoroom.png", service: "Embroidery" },
  { id: 24, title: "Sleeve Emblem Embroidery", path: "/new/4-Photoroom.png", service: "Embroidery" },
  { id: 25, title: "Pocket Logo Embroidery", path: "/new/5-Photoroom.png", service: "Embroidery" },
  { id: 26, title: "Letterman Jacket Patch", path: "/new/6-Photoroom.png", service: "Embroidery" },
  { id: 27, title: "Scout Badge Collection", path: "/new/7-Photoroom.png", service: "Embroidery" },
  { id: 28, title: "Wedding Handkerchief", path: "/new/8-Photoroom.png", service: "Embroidery" },
  { id: 29, title: "Christmas Stocking Design", path: "/new/9-Photoroom.png", service: "Embroidery" },
  { id: 30, title: "Baby Blanket Border", path: "/new/10-Photoroom.png", service: "Embroidery" },
  { id: 31, title: "Polo Shirt Logo", path: "/new/1-Photoroom.png", service: "Embroidery" },
  { id: 32, title: "Chef Coat Embroidery", path: "/new/2-Photoroom.png", service: "Embroidery" },
  { id: 33, title: "Medical Scrubs Badge", path: "/new/3-Photoroom.png", service: "Embroidery" },
  { id: 34, title: "Firefighter Patch", path: "/new/4-Photoroom.png", service: "Embroidery" },
  { id: 35, title: "Military Unit Insignia", path: "/new/5-Photoroom.png", service: "Embroidery" },
  { id: 36, title: "Biker Club Back Patch", path: "/new/6-Photoroom.png", service: "Embroidery" },
  { id: 37, title: "Band Logo Embroidery", path: "/new/7-Photoroom.png", service: "Embroidery" },
  { id: 38, title: "School Crest Badge", path: "/new/8-Photoroom.png", service: "Embroidery" },
  { id: 39, title: "Hospitality Name Tag", path: "/new/9-Photoroom.png", service: "Embroidery" },
  { id: 40, title: "Golf Tournament Logo", path: "/new/10-Photoroom.png", service: "Embroidery" },
  { id: 41, title: "Yacht Club Emblem", path: "/new/1-Photoroom.png", service: "Embroidery" },
  { id: 42, title: "Tennis Club Badge", path: "/new/2-Photoroom.png", service: "Embroidery" },
  { id: 43, title: "Soccer Jersey Number", path: "/new/3-Photoroom.png", service: "Embroidery" },
  { id: 44, title: "Basketball Team Patch", path: "/new/4-Photoroom.png", service: "Embroidery" },
  { id: 45, title: "Martial Arts Belt Rank", path: "/new/5-Photoroom.png", service: "Embroidery" },
  { id: 46, title: "Dance Studio Logo", path: "/new/6-Photoroom.png", service: "Embroidery" },
  { id: 47, title: "Music School Badge", path: "/new/7-Photoroom.png", service: "Embroidery" },
  { id: 48, title: "Art Class Patch", path: "/new/8-Photoroom.png", service: "Embroidery" },
  { id: 49, title: "Camp Logo Embroidery", path: "/new/9-Photoroom.png", service: "Embroidery" },
  { id: 50, title: "Volunteer Group Badge", path: "/new/10-Photoroom.png", service: "Embroidery" },
  { id: 51, title: "Vintage T-Shirt Design", path: "/new/1-Photoroom.png", service: "Vector" },
  { id: 52, title: "Vintage Car Illustration", path: "/new/2-Photoroom.png", service: "Vector" },
  { id: 53, title: "Abstract Vector Art", path: "/new/3-Photoroom.png", service: "Vector" },
  { id: 54, title: "Corporate Branding", path: "/new/4-Photoroom.png", service: "Vector" },
  { id: 55, title: "Mascot Vector Design", path: "/new/5-Photoroom.png", service: "Vector" },
  { id: 56, title: "Vector Pattern Design", path: "/new/6-Photoroom.png", service: "Vector" },
  { id: 57, title: "Illustration Concept Art", path: "/new/7-Photoroom.png", service: "Vector" },
  { id: 58, title: "Tech Icon Vector Set", path: "/new/8-Photoroom.png", service: "Vector" },
  { id: 59, title: "Logo Vector Mockup", path: "/new/9-Photoroom.png", service: "Vector" },
  { id: 60, title: "Flat Vector UI Icons", path: "/new/10-Photoroom.png", service: "Vector" },
  { id: 61, title: "Infographic Vector Design", path: "/new/1-Photoroom.png", service: "Vector" },
  { id: 62, title: "Vector Character Illustration", path: "/new/2-Photoroom.png", service: "Vector" },
  { id: 63, title: "Minimalist Line Art", path: "/new/3-Photoroom.png", service: "Vector" },
  { id: 64, title: "Geometric Pattern Vector", path: "/new/4-Photoroom.png", service: "Vector" },
  { id: 65, title: "Watercolor Vector Portrait", path: "/new/5-Photoroom.png", service: "Vector" },
  { id: 66, title: "Isometric Building Set", path: "/new/6-Photoroom.png", service: "Vector" },
  { id: 67, title: "Botanical Vector Illustration", path: "/new/7-Photoroom.png", service: "Vector" },
  { id: 68, title: "Sports Team Crest", path: "/new/8-Photoroom.png", service: "Vector" },
  { id: 69, title: "Food Menu Icons", path: "/new/9-Photoroom.png", service: "Vector" },
  { id: 70, title: "Travel Badge Collection", path: "/new/10-Photoroom.png", service: "Vector" },
  { id: 71, title: "Animated Character Sheet", path: "/new/1-Photoroom.png", service: "Vector" },
  { id: 72, title: "Product Packaging Vector", path: "/new/2-Photoroom.png", service: "Vector" },
  { id: 73, title: "Comic Book Style Art", path: "/new/3-Photoroom.png", service: "Vector" },
  { id: 74, title: "Gradient Mesh Portrait", path: "/new/4-Photoroom.png", service: "Vector" },
  { id: 75, title: "Stencil Art Vector", path: "/new/5-Photoroom.png", service: "Vector" },
  { id: 76, title: "Retro Poster Design", path: "/new/6-Photoroom.png", service: "Vector" },
  { id: 77, title: "Business Card Template", path: "/new/7-Photoroom.png", service: "Vector" },
  { id: 78, title: "Social Media Icons", path: "/new/8-Photoroom.png", service: "Vector" },
  { id: 79, title: "App Interface Mockup", path: "/new/9-Photoroom.png", service: "Vector" },
  { id: 80, title: "Website Wireframe Set", path: "/new/10-Photoroom.png", service: "Vector" },
  { id: 81, title: "Flowchart Diagram", path: "/new/1-Photoroom.png", service: "Vector" },
  { id: 82, title: "Timeline Infographic", path: "/new/2-Photoroom.png", service: "Vector" },
  { id: 83, title: "Map Illustration", path: "/new/3-Photoroom.png", service: "Vector" },
  { id: 84, title: "Weather Icon Set", path: "/new/4-Photoroom.png", service: "Vector" },
  { id: 85, title: "Shopping Cart Icons", path: "/new/5-Photoroom.png", service: "Vector" },
  { id: 86, title: "Education Icons", path: "/new/6-Photoroom.png", service: "Vector" },
  { id: 87, title: "Medical Icons", path: "/new/7-Photoroom.png", service: "Vector" },
  { id: 88, title: "Finance Chart Vector", path: "/new/8-Photoroom.png", service: "Vector" },
  { id: 89, title: "Real Estate Icons", path: "/new/9-Photoroom.png", service: "Vector" },
  { id: 90, title: "Construction Symbols", path: "/new/10-Photoroom.png", service: "Vector" },
  { id: 91, title: "Transportation Icons", path: "/new/1-Photoroom.png", service: "Vector" },
  { id: 92, title: "Animal Vector Illustration", path: "/new/2-Photoroom.png", service: "Vector" },
  { id: 93, title: "Nature Landscape Vector", path: "/new/3-Photoroom.png", service: "Vector" },
  { id: 94, title: "Space Galaxy Illustration", path: "/new/4-Photoroom.png", service: "Vector" },
  { id: 95, title: "Ocean Life Vector Set", path: "/new/5-Photoroom.png", service: "Vector" },
  { id: 96, title: "Festival Poster Vector", path: "/new/6-Photoroom.png", service: "Vector" },
  { id: 97, title: "Holiday Greeting Card", path: "/new/7-Photoroom.png", service: "Vector" },
  { id: 98, title: "Birthday Invitation Design", path: "/new/8-Photoroom.png", service: "Vector" },
  { id: 99, title: "Wedding Invitation Vector", path: "/new/9-Photoroom.png", service: "Vector" },
  { id: 100, title: "Certificate Template", path: "/new/10-Photoroom.png", service: "Vector" },
];

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
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: cubicBezier(0.22, 1, 0.36, 1) } },
};

// ─── Animated Nav Button ───────────────────────────────────────────────────────
const NavButton = ({
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
      whileTap={enabled ? { scale: 0.93 } : {}}
      className="relative shrink-0 overflow-hidden rounded-xl flex items-center justify-center border outline-none"
      style={{
        width: "clamp(36px, 3vw, 44px)",
        height: "clamp(300px, 65vh, 660px)",
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ color: enabled ? "white" : "rgba(255,255,255,0.2)" }}>
          {isPrev ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
        </svg>
      </motion.span>
    </motion.button>
  );
};

// ─── Animated Thumbnail Button ────────────────────────────────────────────────
// FIX 2: Scale kam kiya (1.12 → 1.06) taake adjacent images se na jure.
// Scroll container me py-2 padding add ki taake vertical overflow clip na ho.
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
    style={{ width: "clamp(44px, 9vw, 68px)", height: "clamp(32px, 6.5vw, 50px)", background: "white" }}
    animate={{
      opacity: isActive ? 1 : 0.35,
      scale: isActive ? 1.06 : 1,
      boxShadow: isActive
        ? "0 0 0 2px rgba(255,255,255,0.85), 0 4px 16px rgba(0,0,0,0.5)"
        : "0 0 0 0px rgba(255,255,255,0)",
    }}
    whileHover={
      !isActive
        ? { opacity: 0.9, scale: 1.06, boxShadow: "0 0 0 1.5px rgba(255,255,255,0.5), 0 4px 14px rgba(0,0,0,0.4)" }
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

  const prevIndexRef = useRef(currentIndex);
  const directionRef = useRef(0);
  if (currentIndex !== prevIndexRef.current) {
    directionRef.current = currentIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentIndex;
  }
  const direction = directionRef.current;

  const isScrollingRef = useRef(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

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

  // ── Suppress header z-index while lightbox is open ────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const header = document.querySelector("header") as HTMLElement | null;
    const stickyNav = document.querySelector(".sticky") as HTMLElement | null;
    if (header) header.style.zIndex = "0";
    if (stickyNav) stickyNav.style.zIndex = "0";
    return () => {
      document.body.style.overflow = "";
      if (header) header.style.zIndex = "";
      if (stickyNav) stickyNav.style.zIndex = "";
    };
  }, []);

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
          className="pointer-events-auto shrink-0 flex items-center justify-between px-5 md:px-8 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              className="flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-full px-3 py-1.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.28 }}
            >
              <span className="text-white text-xs font-bold tabular-nums">{currentIndex + 1}</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-white/40 text-xs tabular-nums">{items.length}</span>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.span
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="text-white/70 text-sm font-medium truncate max-w-40 md:max-w-xs"
              >
                {item.title}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Close button — spins in on mount */}
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,1)", color: "#111827" }}
              whileTap={{ scale: 0.9, rotate: 90 }}
              className="w-9 h-9 rounded-full border border-white/15 bg-white/8 text-white/60
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
          className="pointer-events-auto flex-1 min-h-0 flex items-center justify-center px-4 md:px-8 gap-3 md:gap-4"
          onClick={(e) => e.stopPropagation()}
          onWheel={handleWheel}
        >
          <div
            className="flex items-stretch gap-3 md:gap-4 w-full justify-center"
            style={{ height: "clamp(300px, 65vh, 660px)" }}
          >
            <NavButton direction="prev" enabled={hasPrev} onClick={onPrev} />

            {/* Image container */}
            <div
              className="relative flex-1 min-w-0 rounded-2xl overflow-hidden"
              style={{
                maxWidth: "min(100%, 580px)",
                height: "100%",
                background: "linear-gradient(160deg, #07112e 0%, #0b1e52 50%, #06102e 100%)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.div
                  key={item.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-3"
                  >
                  <Image
                    src={item.path}
                    width={900}
                    height={700}
                    alt={item.title}
                    className="w-full lg:w-[60%] h-full object-contain drop-shadow-2xl"
                    style={{ background: "white" }}
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.2)" }} />
              <div onClick={hasPrev ? onPrev : undefined}
                className={`absolute left-0 top-0 bottom-0 w-1/4 z-10 ${hasPrev ? "cursor-pointer" : ""}`} />
              <div onClick={hasNext ? onNext : undefined}
                className={`absolute right-0 top-0 bottom-0 w-1/4 z-10 ${hasNext ? "cursor-pointer" : ""}`} />
            </div>

            <NavButton direction="next" enabled={hasNext} onClick={onNext} />
          </div>
        </div>

        {/* BOTTOM: THUMBNAILS
            FIX 2: outer wrapper overflow-x-auto moved here with py-2 padding so
            scaled thumbs don't clip vertically. Inner div uses width fit-content. */}
        <div
          className="pointer-events-auto shrink-0 px-4 md:px-8 pt-3 pb-5"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
            /* overflow-x-auto here, py-2 gives vertical room for scale */
            className="overflow-x-auto py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* inner row — ref lives here so scroll math still works */}
            <div
              ref={thumbStripRef}
              onWheel={handleWheel}
              className="flex gap-2 px-1"
              style={{ width: "max-content" }}
            >
              {items.map((thumb, idx) => (
                <ThumbButton
                  key={thumb.id}
                  thumb={thumb}
                  isActive={idx === currentIndex}
                  onClick={() => onJump(idx)}
                />
              ))}
            </div>
          </motion.div>

          <div className="mt-1 flex justify-center">
            <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/50 rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Portfolio Card ────────────────────────────────────────────────────────────
// FIX 1: Overlay image ke PEECHE — z-index layering:
//   z-0  → dark gradient overlay  (image ke peeche)
//   z-10 → Image                  (image ke upar, overlay ke upar)
//   z-20 → title / view text      (sab ke upar)
//   z-30 → shine sweep            (sabse upar)
// Is tarah overlay sirf un jagahon pe dikhega jahan image transparent hai,
// image khud dark nahi hogi aur quality sahi lagegi.
const PortfolioCard = ({ item, onClick }: { item: PortfolioItem; onClick: () => void }) => (
  <motion.div
    onClick={onClick}
    className="group relative rounded-3xl cursor-pointer overflow-hidden w-full max-w-[320px]"
    variants={fadeUp}
    whileHover={{ y: -8, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 280, damping: 22 }}
    style={{ boxShadow: "0 15px 35px rgba(0,0,0,0.45), 0 5px 15px rgba(0,0,0,0.3)" }}
  >
    {/* Hover glow border — outermost ring */}
    <motion.div
      className="absolute inset-0 rounded-3xl pointer-events-none z-40"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ boxShadow: "inset 0 0 0 1.5px rgba(99,102,241,0.6), 0 0 28px rgba(99,102,241,0.12)" }}
    />

    <div className="relative w-full overflow-hidden rounded-2xl">

      {/* ── z-0: Dark gradient overlay — IMAGE KE PEECHE ── */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* ── z-10: Image — overlay ke upar ── */}
      <Image
        src={item.path}
        width={500}
        height={500}
        alt={item.title}
        className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
      />

      {/* ── z-20: View icon — image ke upar ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-4 gap-1 pointer-events-none">
        <span
          className="text-white
            flex items-center gap-1
            translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-300 ease-out drop-shadow-md"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </span>
      </div>

      {/* ── z-30: Shine sweep — sabse upar ── */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
          style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)" }}
        />
      </div>
    </div>
  </motion.div>
);

// ─── Product Grid with staggered cards ────────────────────────────────────────
const chunkArray = <T,>(arr: T[], size: number) =>
  arr.reduce<T[][]>((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);

const ProductGrid = ({
  items,
  accentColor,
  onCardClick,
  visibleCount,
}: {
  items: PortfolioItem[];
  accentColor: string;
  onCardClick: (index: number) => void;
  visibleCount: number;
}) => {
  const visibleItems = items.slice(0, visibleCount);
  const rows = chunkArray(visibleItems, 3);
  return (
    <div className="space-y-8">
      {rows.map((row, rowIdx) => (
        <motion.div
          key={rowIdx}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {row.map((item, colIdx) => {
            const globalIndex = rowIdx * 3 + colIdx;
            return (
              <PortfolioCard key={item.id} item={item} onClick={() => onCardClick(globalIndex)} />
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  BOTTOM LAYER — Fixed banners with animated floating blobs
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
        {/* Ghost watermark — scales in */}
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

        {/* Banner text */}
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
//  TOP LAYER — Category section
// ═══════════════════════════════════════════════════════════════════════════════
const CategorySection = ({
  config,
  spacerRef,
  gridMidRef,
}: {
  config: CategoryConfig;
  spacerRef: (el: HTMLDivElement | null) => void;
  gridMidRef: (el: HTMLDivElement | null) => void;
}) => {
  const items = portfolioData.filter((item) => item.service === config.service);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const goNext = useCallback(
    () => setLightboxIndex((i) => (i !== null && i < items.length - 1 ? i + 1 : i)),
    [items.length]
  );

  const handleViewMore = () => setVisibleCount((prev) => Math.min(prev + 15, items.length));
  const hasMoreItems = visibleCount < items.length;

  return (
    <div>
      <div ref={spacerRef} className="h-[70vh]" aria-hidden="true" />

      <div
        className="relative z-20 bg-gray-50 py-14 px-4"
        style={{ boxShadow: "0 -48px 80px rgba(0,0,0,0.55), 0 -8px 24px rgba(0,0,0,0.3)" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-3xl font-bold text-gray-900">{config.label}</h3>
            <motion.div
              className="mt-2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            />
            <p className="text-gray-500 mt-2 text-sm">{items.length} projects</p>
          </motion.div>

          <ProductGrid
            items={items}
            accentColor={config.accentColor}
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
                whileHover={{ scale: 1.04, color: "#0A21C0", borderColor: "#0A21C0" }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
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
          items={items}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          onJump={setLightboxIndex}
        />
      )}
    </div>
  );
};

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

  return (
    <div className="relative">
      <BottomBannerLayer activeBannerIndex={activeBannerIndex} />
      <div className="relative z-10">
        {/* ── Hero — staggered entrance ── */}
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
              style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1, #a855f7)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80px", opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto text-lg">
              Explore our diverse collection of digitized embroidery, vector art, raster conversions,
              and custom patches — crafted with precision for every client.
            </motion.p>
          </motion.div>
        </section>

        {categories.map((config, i) => (
          <CategorySection
            key={config.service}
            config={config}
            spacerRef={(el) => { spacerRefs.current[i] = el; }}
            gridMidRef={(el) => { gridMidRefs.current[i] = el; }}
          />
        ))}
      </div>
    </div>
  );
}
