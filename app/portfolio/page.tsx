"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";

type PortfolioItem = {
  id: number;
  title: string;
  path: string;
  service: "Embroidery" | "Vector" | "Raster-to-Vector" | "Custom Patches";
};

const portfolioData: PortfolioItem[] = [
  // Embroidery - 50 items
  { id: 1, title: "Custom Logo Digitizing", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 2, title: "Pet Portrait Embroidery", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 3, title: "Sports Team Logo", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 4, title: "Fashion Embroidery", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 5, title: "Hand Embroidery Closeup", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 6, title: "Embroidery Tools Flatlay", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 7, title: "Thread Texture Study", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 8, title: "Custom Name Embroidery", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 9, title: "Floral Embroidery Design", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 10, title: "Logo Embroidery Mockup", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 11, title: "Embroidery Close Detail", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 12, title: "Embroidery Hoop Art", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 13, title: "Monogram Patch Design", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 14, title: "Jacket Back Embroidery", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 15, title: "Cap Logo Stitching", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 16, title: "Uniform Badge Embroidery", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 17, title: "Decorative Stitch Pattern", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 18, title: "3D Puff Embroidery", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 19, title: "Gold Thread Embroidery", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 20, title: "Applique Patch Work", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 21, title: "Chenille Letter Patch", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 22, title: "Towel Monogramming", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 23, title: "Quilt Embroidery Border", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 24, title: "Sleeve Emblem Embroidery", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 25, title: "Pocket Logo Embroidery", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 26, title: "Letterman Jacket Patch", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 27, title: "Scout Badge Collection", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 28, title: "Wedding Handkerchief", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 29, title: "Christmas Stocking Design", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 30, title: "Baby Blanket Border", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 31, title: "Polo Shirt Logo", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 32, title: "Chef Coat Embroidery", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 33, title: "Medical Scrubs Badge", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 34, title: "Firefighter Patch", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 35, title: "Military Unit Insignia", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 36, title: "Biker Club Back Patch", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 37, title: "Band Logo Embroidery", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 38, title: "School Crest Badge", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 39, title: "Hospitality Name Tag", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 40, title: "Golf Tournament Logo", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 41, title: "Yacht Club Emblem", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 42, title: "Tennis Club Badge", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 43, title: "Soccer Jersey Number", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 44, title: "Basketball Team Patch", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 45, title: "Martial Arts Belt Rank", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },
  { id: 46, title: "Dance Studio Logo", path: "/home-page/portfolio-embroidery/1st.jpg", service: "Embroidery" },
  { id: 47, title: "Music School Badge", path: "/home-page/portfolio-embroidery/2nd.jpg", service: "Embroidery" },
  { id: 48, title: "Art Class Patch", path: "/home-page/portfolio-embroidery/3rd.jpg", service: "Embroidery" },
  { id: 49, title: "Camp Logo Embroidery", path: "/home-page/portfolio-embroidery/4th.jpg", service: "Embroidery" },
  { id: 50, title: "Volunteer Group Badge", path: "/home-page/portfolio-embroidery/5th.jpg", service: "Embroidery" },

  // Vector - 50 items
  { id: 51, title: "Vintage T-Shirt Design", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 52, title: "Vintage Car Illustration", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 53, title: "Abstract Vector Art", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 54, title: "Corporate Branding", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 55, title: "Mascot Vector Design", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 56, title: "Vector Pattern Design", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 57, title: "Illustration Concept Art", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 58, title: "Tech Icon Vector Set", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 59, title: "Logo Vector Mockup", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 60, title: "Flat Vector UI Icons", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 61, title: "Infographic Vector Design", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 62, title: "Vector Character Illustration", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 63, title: "Minimalist Line Art", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 64, title: "Geometric Pattern Vector", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 65, title: "Watercolor Vector Portrait", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 66, title: "Isometric Building Set", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 67, title: "Botanical Vector Illustration", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 68, title: "Sports Team Crest", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 69, title: "Food Menu Icons", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 70, title: "Travel Badge Collection", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 71, title: "Animated Character Sheet", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 72, title: "Product Packaging Vector", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 73, title: "Comic Book Style Art", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 74, title: "Gradient Mesh Portrait", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 75, title: "Stencil Art Vector", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 76, title: "Retro Poster Design", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 77, title: "Business Card Template", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 78, title: "Social Media Icons", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 79, title: "App Interface Mockup", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 80, title: "Website Wireframe Set", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 81, title: "Flowchart Diagram", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 82, title: "Timeline Infographic", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 83, title: "Map Illustration", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 84, title: "Weather Icon Set", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 85, title: "Shopping Cart Icons", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 86, title: "Education Icons", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 87, title: "Medical Icons", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 88, title: "Finance Chart Vector", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 89, title: "Real Estate Icons", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 90, title: "Construction Symbols", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 91, title: "Transportation Icons", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 92, title: "Animal Vector Illustration", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 93, title: "Nature Landscape Vector", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 94, title: "Space Galaxy Illustration", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 95, title: "Ocean Life Vector Set", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 96, title: "Festival Poster Vector", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 97, title: "Holiday Greeting Card", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 98, title: "Birthday Invitation Design", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 99, title: "Wedding Invitation Vector", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 100, title: "Certificate Template", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
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

  // Ref to prevent rapid scroll triggers
  const isScrollingRef = useRef(false);

  // Ref for the thumbnail strip
  const thumbStripRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active thumbnail into view whenever index changes
  useEffect(() => {
    if (thumbStripRef.current) {
      const activeThumb = thumbStripRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        const container = thumbStripRef.current;
        const thumbLeft = activeThumb.offsetLeft;
        const thumbWidth = activeThumb.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        container.scrollTo({
          left: thumbLeft - (containerWidth - thumbWidth) / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { if (hasPrev) onPrev(); }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { if (hasNext) onNext(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Wheel scroll on thumbnail strip changes image
  const handleThumbWheel = useCallback((e: React.WheelEvent) => {
    if (isScrollingRef.current) return;
    e.preventDefault();
    isScrollingRef.current = true;
    if (e.deltaY > 0) { if (hasNext) onNext(); }
    else { if (hasPrev) onPrev(); }
    setTimeout(() => { isScrollingRef.current = false; }, 300);
  }, [hasNext, hasPrev, onNext, onPrev]);

  // Wheel scroll on main image changes image
  const handleImageWheel = useCallback((e: React.WheelEvent) => {
    if (isScrollingRef.current) return;
    e.preventDefault();
    isScrollingRef.current = true;
    if (e.deltaY > 0) { if (hasNext) onNext(); }
    else { if (hasPrev) onPrev(); }
    setTimeout(() => { isScrollingRef.current = false; }, 300);
  }, [hasNext, hasPrev, onNext, onPrev]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        key="modal"
        className="fixed inset-0 z-[1000] flex items-start justify-center pt-6 pointer-events-none"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Centered image viewer */}
        <div className="flex items-center gap-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}>

            {/* LEFT arrow */}
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className={`h-[500px] max-h-[75vh] w-12 flex items-center justify-center
                bg-neutral-700/80 backdrop-blur rounded-l-xl transition-all duration-200
                ${hasPrev ? "hover:bg-neutral-600/90 cursor-pointer text-white" : "cursor-default text-white/20"}`}
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Image panel */}
            <div className="flex flex-col items-center">
              {/* Counter + title on bottom left */}
              <div className="w-[500px] max-w-[75vw] flex  mb-3">
                <div className="flex flex-col">
                  <p className="text-white/50 text-xs font-medium tracking-widest uppercase">
                    {currentIndex + 1} / {items.length}
                  </p>
                  <p className="text-white/80 text-sm font-semibold">{item.title}</p>
                </div>
              </div>

              <div
                onWheel={handleImageWheel}
                className="w-[500px] max-w-[75vw] bg-white flex items-center justify-center p-4 min-h-[350px]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="w-full flex items-center justify-center"
                  >
                    <Image
                      src={item.path}
                      width={600}
                      height={600}
                      alt={item.title}
                      className="max-h-[55vh] w-auto object-contain drop-shadow-xl"
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT arrow */}
            <button
              onClick={onNext}
              disabled={!hasNext}
              className={`h-[500px] max-h-[75vh] w-12 flex items-center justify-center
                bg-neutral-700/80 backdrop-blur rounded-r-xl transition-all duration-200
                ${hasNext ? "hover:bg-neutral-600/90 cursor-pointer text-white" : "cursor-default text-white/20"}`}
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* ── BOTTOM: horizontal thumbnail strip ── */}
          <div
            ref={thumbStripRef}
            onWheel={handleThumbWheel}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto py-3 px-8
              scrollbar-none pointer-events-auto bg-black/40 backdrop-blur-sm rounded-t-xl"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {items.map((thumb, idx) => (
              <button
                key={thumb.id}
                onClick={() => onJump(idx)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 outline-none
                  ${idx === currentIndex
                    ? "ring-2 ring-white scale-105 brightness-100"
                    : "brightness-50 hover:brightness-75 hover:scale-105"
                  }`}
                style={{ width: "120px", height: "80px" }}
                aria-label={`View ${thumb.title}`}
              >
                <Image
                  src={thumb.path}
                  width={160}
                  height={120}
                  alt={thumb.title}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                {/* Active indicator line on bottom edge */}
                {idx === currentIndex && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* ── Close button ── */}
          <button
            onClick={onClose}
            className="fixed top-6 right-6 w-10 h-10 rounded-full bg-white text-gray-800
              flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors cursor-pointer z-[1001]"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      </AnimatePresence>
  );
};

// ─── Portfolio Card ────────────────────────────────────────────────────────────
const PortfolioCard = ({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: () => void;
}) => (
  <motion.div
    onClick={onClick}
    className="group relative rounded-3xl cursor-pointer overflow-hidden w-full max-w-[320px]
      shadow-[0_15px_35px_rgba(0,0,0,0.45),0_5px_15px_rgba(0,0,0,0.3)]
      transition-all duration-300
      hover:-translate-y-2
      hover:shadow-[0_30px_70px_rgba(0,0,0,0.65),0_10px_25px_rgba(0,0,0,0.4)]"
    whileHover={{ scale: 1.03 }}
  >
    <div className="relative w-full overflow-hidden rounded-2xl">
      <Image
        src={item.path}
        width={500}
        height={500}
        alt={item.title}
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
      />
      {/* Hover overlay with zoom icon hint */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <span className="text-white text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          View
        </span>
      </div>
    </div>
  </motion.div>
);

// ─── Product Grid ──────────────────────────────────────────────────────────────
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
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: rowIdx === 0 ? 0 : 0.1 }}
        >
          {row.map((item, colIdx) => {
            const globalIndex = rowIdx * 3 + colIdx;
            return (
              <PortfolioCard
                key={item.id}
                item={item}
                onClick={() => onCardClick(globalIndex)}
              />
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

// ─── Category Banner ───────────────────────────────────────────────────────────
const CategoryBanner = ({
  config,
  sectionRef,
}: {
  config: CategoryConfig;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div className="sticky top-0 z-10 h-screen overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className={`absolute inset-0 scale-[1.4] bg-gradient-to-br ${config.bannerBg}`}
      />
      <motion.div
        style={{ y: ghostY }}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="text-white/[0.05] font-black uppercase tracking-tighter leading-none"
          style={{ fontSize: "clamp(80px, 18vw, 220px)" }}
        >
          {config.label}
        </span>
      </motion.div>
      <motion.div style={{ y: bgY }} className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <motion.div style={{ y: bgY }} className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-white/50 text-sm font-semibold uppercase tracking-[0.3em] mb-3">{config.tagline}</p>
        <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tight ${config.bannerTextColor} mb-4`}>{config.label}</h2>
        <p className="text-white/70 max-w-xl text-base md:text-lg">{config.description}</p>
      </div>
    </div>
  );
};

// ─── Single Category Section ───────────────────────────────────────────────────
const CategorySection = ({ config }: { config: CategoryConfig }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const items = portfolioData.filter((item) => item.service === config.service);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Visible items state - start with 4 rows (12 items), then add 15 more on each click
  const [visibleCount, setVisibleCount] = useState(12);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const goNext = useCallback(() => setLightboxIndex((i) => (i !== null && i < items.length - 1 ? i + 1 : i)), [items.length]);

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 15, items.length));
  };

  const hasMoreItems = visibleCount < items.length;

  return (
    <div ref={sectionRef}>
      <CategoryBanner config={config} sectionRef={sectionRef} />

      <div className="relative z-20 bg-gray-50 py-14 px-4 shadow-[0_-40px_80px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900">{config.label}</h3>
            <p className="text-gray-500 mt-1 text-sm">{items.length} projects</p>
          </div>
          <ProductGrid
            items={items}
            accentColor={config.accentColor}
            onCardClick={openLightbox}
            visibleCount={visibleCount}
          />
          {hasMoreItems && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleViewMore}
                className="cursor-pointer text-sm font-semibold text-gray-700 border border-gray-300 rounded-full px-5 py-2 hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                View More →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox — renders per section so each has its own item list */}
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
  return (
    <div className="bg-gray-50">
      <section className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-[0.3em] mb-4">Creative Studio</p>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">Our Portfolio</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Explore our diverse collection of digitized embroidery, vector art, raster conversions, and custom patches — crafted with precision for every client.
          </p>
        </div>
      </section>
      {categories.map((config) => (
        <CategorySection key={config.service} config={config} />
      ))}
    </div>
  );
}
