"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

type PortfolioItem = {
  id: number;
  title: string;
  path: string;
  service: "Embroidery" | "Vector" | "Raster-to-Vector" | "Custom Patches";
};

const portfolioData: PortfolioItem[] = [
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

  { id: 21, title: "Vintage T-Shirt Design", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 22, title: "Vintage Car Illustration", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 23, title: "Abstract Vector Art", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 24, title: "Corporate Branding", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 25, title: "Mascot Vector Design", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 26, title: "Vector Pattern Design", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 27, title: "Illustration Concept Art", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 28, title: "Tech Icon Vector Set", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
  { id: 29, title: "Logo Vector Mockup", path: "/home-page/portfolio-vector/1st.jpg", service: "Vector" },
  { id: 30, title: "Flat Vector UI Icons", path: "/home-page/portfolio-vector/2nd.jpg", service: "Vector" },
  { id: 31, title: "Infographic Vector Design", path: "/home-page/portfolio-vector/3rd.jpg", service: "Vector" },
  { id: 32, title: "Vector Character Illustration", path: "/home-page/portfolio-vector/4th.jpg", service: "Vector" },
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

// ─── Portfolio Card ────────────────────────────────────────────────────────────
const PortfolioCard = ({
  item,
  accentColor,
}: {
  item: PortfolioItem;
  accentColor: string;
}) => (
  <motion.div
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
}: {
  items: PortfolioItem[];
  accentColor: string;
}) => {
  const rows = chunkArray(items, 3);
  return (
    <div className="space-y-8">
      {rows.map((row, idx) => (
        <motion.div
          key={idx}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: idx === 0 ? 0 : 0.1 }}
        >
          {row.map((item) => (
            <PortfolioCard key={item.id} item={item} accentColor={accentColor} />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// ─── Sticky Category Banner — background moves, text stays still ───────────────
const CategoryBanner = ({
  config,
  sectionRef,
}: {
  config: CategoryConfig;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) => {
  // Track scroll progress of the ENTIRE section (banner + grid)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background moves UP (negative Y) as user scrolls — creates parallax drift
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Ghost text drifts slightly slower than bg for depth
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    // sticky — stays at top while section scrolls
    <div className="sticky top-0 z-10 h-screen overflow-hidden">

      {/* ── MOVING background gradient ── */}
      <motion.div
        style={{ y: bgY }}
        className={`absolute inset-0 scale-[1.4] bg-gradient-to-br ${config.bannerBg}`}
      />

      {/* ── MOVING ghost text (parallax layer) ── */}
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

      {/* ── MOVING decorative blobs ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none"
      />

      {/* ── STILL text — no motion, no transform, stays perfectly centered ── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-white/50 text-sm font-semibold uppercase tracking-[0.3em] mb-3">
          {config.tagline}
        </p>
        <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tight ${config.bannerTextColor} mb-4`}>
          {config.label}
        </h2>
        <p className="text-white/70 max-w-xl text-base md:text-lg">
          {config.description}
        </p>
      </div>
    </div>
  );
};

// ─── Single Category Section ───────────────────────────────────────────────────
const CategorySection = ({ config }: { config: CategoryConfig }) => {
  // ref covers the FULL section (banner height + grid height)
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const items = portfolioData.filter((item) => item.service === config.service);

  return (
    <div ref={sectionRef}>
      {/* Sticky banner — bg parallax, text still */}
      <CategoryBanner config={config} sectionRef={sectionRef} />

      {/* Grid slides over banner */}
      <div className="relative z-20 bg-gray-50 py-14 px-4 shadow-[0_-40px_80px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{config.label}</h3>
              <p className="text-gray-500 mt-1 text-sm">{items.length} projects</p>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-gray-700 border border-gray-300 rounded-full px-5 py-2 hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              View All →
            </a>
          </div>
          <ProductGrid items={items} accentColor={config.accentColor} />
        </div>
      </div>
    </div>
  );
};

// ─── Page Header ───────────────────────────────────────────────────────────────
const PageHeader = () => (
  <div className="bg-white py-16 px-4 text-center border-b border-gray-100">
    <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
      Creative Studio
    </p>
    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-5">Our Portfolio</h1>
    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
      Explore our diverse collection of digitized embroidery, vector art, raster conversions, and
      custom patches — crafted with precision for every client.
    </p>
  </div>
);

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function PortfolioSection() {
  return (
    <div className="bg-gray-50">
      <section className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-[0.3em] mb-4">
            Creative Studio
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
            Our Portfolio
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Explore our diverse collection of digitized embroidery, vector art, raster conversions, and
      custom patches — crafted with precision for every client.
          </p>
        </div>
      </section>
      {/* <PageHeader /> */}
      {categories.map((config) => (
        <CategorySection key={config.service} config={config} />
      ))}
    </div>
  );
}


