"use client";

import Image from "next/image";
import Link from "next/link";
import { useState,useRef } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/public/ahlogobgremove.png";
import { FaUser } from "react-icons/fa6";
import { ChevronDown, Menu } from "lucide-react";
import { BiCart } from "react-icons/bi";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useCartSidebar } from "@/components/shop/CartSidebarContext";

/* ================= DESKTOP MENU ================= */

function DesktopMenu({ isSticky, onCartClick, cartCount }: { isSticky: boolean; onCartClick: () => void; cartCount: number }) {
  return (
    <motion.nav
      initial={false}
      animate={{
        y: isSticky ? 5 : 10,
        opacity: 1,
        boxShadow: isSticky
          ? "0 10px 30px rgba(0,0,0,0.15)"
          : "0 0 0 rgba(0,0,0,0)",
        scale: isSticky ? 0.9999 : 1,
        marginLeft: "0rem",
        marginRight: "0rem",
      }}
      transition={{
        duration: isSticky ? 0.5 : 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}

      className="
        w-full
        bg-primary
        md:flex
        justify-between
        gap-8
        text-lg
        font-medium
        text-white
        will-change-transform
      "
      style={{
        borderRadius: isSticky ? 0 : 10,
        padding: isSticky ? "0.1rem 3rem" : "0rem 3rem",
      }}
    >


      <motion.div
        animate={{
          opacity: isSticky ? 1 : 0,
          y: isSticky ? 0 : -40,
          pointerEvents: isSticky ? "auto" : "none",
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-45 shrink-0"
      >
        <Link href="/" className="flex items-center gap-1 text-3xl cursor-pointer">
          <p className="font-bold text-black text-4xl">𝓐𝓗</p>
          <p
            className="font-bold"
          >
           𝓓𝓲𝓰𝓲𝓽𝓲𝔃𝓲𝓷𝓰
          </p>
        </Link>
      </motion.div>
      <div className="flex items-center justify-between gap-8">
        <Link className="cursor-pointer" href="/">Home</Link>

        {/* SERVICES */}
        <div className="relative group">
            <span className="cursor-pointer flex">Services<ChevronDown className=" text-lg" /></span>
          {/* Main dropdown */}
          <div className="absolute left-0 top-full mt-3 opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

            <div className="flex rounded-lg shadow-xl bg-white text-primary ">

              {/* LEFT PANEL */}
              <ul className="w-64 py-3">
                <li className="relative group/emb px-5 py-3 hover:bg-linear-to-br from-primary via-primary to-black/70 hover:text-white flex justify-between items-center cursor-pointer">
                  <Link href="/services/embroidery" className="flex-1">Embroidery Digitizing</Link>
                  {/* <span>›</span> */}

                  {/* RIGHT PANEL
                <ul className="absolute left-full top-0 w-80 bg-white text-primary py-3 
                               opacity-0 invisible group-hover/emb:opacity-100 
                               group-hover/emb:visible transition-all duration-200 rounded-2xl">

                  {embroideryItems.map((item) => (
                    <li key={item.href} className="px-5 py-2 hover:bg-primary hover:text-white">
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}

                </ul>*/}
                </li>

                <li className="relative group/raster px-5 py-3 hover:bg-linear-to-br from-primary via-primary to-black/70 hover:text-white flex justify-between items-center cursor-pointer">
                  <Link href="/services/raster-to-vector" className="flex-1">Raster to Vector Services</Link>
                  {/* <span>›</span> */}

                  {/* <ul className="absolute left-full top-0 w-80 bg-white text-primary py-3
                               opacity-0 invisible group-hover/raster:opacity-100
                               group-hover/raster:visible transition-all duration-200 rounded-2xl">

                  {rasterToVectorItems.map((item) => (
                    <li key={item.href} className="px-5 py-2 hover:bg-primary hover:text-white">
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}

                </ul> */}
                </li>

                {/* <li className="px-5 py-3 hover:bg-primary hover:text-white cursor-pointer">
                <Link href="/services/custom-patches">Custom Patches</Link>
              </li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="relative group">
          <span className="cursor-pointer flex">Pricing <ChevronDown className=" text-lg" /></span>
          <div className="absolute left-0 top-full mt-3 opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

            <div className="flex rounded-lg shadow-xl bg-white text-primary">

              {/* LEFT PANEL */}
              <ul className="w-72 py-3">
                <li className="relative group/emb px-5 py-3 hover:bg-linear-to-br from-primary via-primary to-black/70 hover:text-white flex justify-between items-center cursor-pointer">
                  <Link href="/pricing/embroidery-digitizing">
                    <span>Embroidery Digitizing Pricing</span>
                  </Link>
                </li>
                <li className="relative group/raster px-5 py-3 hover:bg-linear-to-br from-primary via-primary to-black/70 hover:text-white flex justify-between items-center cursor-pointer">
                  <Link href="/pricing/raster-to-vector">
                    <span>Raster to Vector Pricing</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Link className="cursor-pointer" href="/portfolio">Portfolio</Link>
        <Link className="cursor-pointer" href="/shop">Store</Link>
        <Link className="cursor-pointer" href="/blogs">Blogs</Link>

        {/* ABOUT */}
        <div className="relative group">
          <Link href="/about-us">
            <span className="cursor-pointer flex">About <ChevronDown className="text-lg" /></span>
          </Link>
          <div className="absolute left-0 top-full mt-3 opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

            <div className="flex rounded-lg shadow-xl bg-white text-primary">

              {/* LEFT PANEL */}
              <ul className="w-64 py-3">
                <li className="relative group/emb px-5 py-3 hover:bg-linear-to-br from-primary via-primary to-black/70 hover:text-white flex justify-between items-center cursor-pointer">
                  <Link href="/write-a-review">Write a Review</Link>
                </li>
                <li className="relative group/raster px-5 py-3 hover:bg-linear-to-br from-primary via-primary to-black/70 hover:text-white flex justify-between items-center cursor-pointer">
                  <Link href="/contact-us">Contact</Link>
                </li>
                <li className="relative group/raster px-5 py-3 hover:bg-linear-to-br from-primary via-primary to-black/70 hover:text-white flex justify-between items-center cursor-pointer">
                  <Link href="/FAQs">FAQs</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
                <button
          type="button"
          onClick={onCartClick}
          className="relative transition hover:text-white/90 cursor-pointer"
          aria-label="Open cart"
        >
          <span className="absolute -right-3 -top-2 min-w-[1.1rem]  rounded-full bg-white px-1 text-[10px] font-semibold text-primary">{cartCount}</span>
          <BiCart size={24} />
        </button>
        <Link href="/login" className="cursor-pointer">
          <FaUser />
        </Link>
      </div>
    </motion.nav>
  );
}


/* ================= MOBILE MENU ================= */
function MobileMenu({ cartCount, onCartClick }: { cartCount: number; onCartClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const close = () => setOpen(false);

  return (
    <div ref={menuRef} className="md:hidden relative">
      <button type="button" onClick={onCartClick} className="relative transition cursor-pointer hover:text-white/90" aria-label="Open cart">
        <span className="absolute -right-3 -top-2 min-w-[1.1rem] rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{cartCount}</span>
        <BiCart size={24} />
      </button>
      <button onClick={() => setOpen(!open)} className="text-sm font-medium pl-5 cursor-pointer">
        <Menu />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-primary shadow-xl rounded-lg z-50">
          <div className="py-2">
            <div className="px-6 py-4 space-y-2 border-t border-blue-700">
              <Link href="/" onClick={close} className="block py-2 text-sm font-medium text-white hover:text-muted">Home</Link>
              <Link href="/portfolio" onClick={close} className="block py-2 text-sm font-medium text-white hover:text-muted">Portfolio</Link>
              <Link href="/shop" onClick={close} className="block py-2 text-sm font-medium text-white hover:text-muted">Store</Link>
              <Link href="/blogs" onClick={close} className="block py-2 text-sm font-medium text-white hover:text-muted">Blogs</Link>
            </div>

            {/* SERVICES ACCORDION */}
            <div className="border-b border-blue-700">
              <button onClick={() => toggleAccordion('services')} className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-primary cursor-pointer transition-colors">
                <span className="font-semibold text-white">Services</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${activeAccordion === 'services' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'services' && (
                <div className="px-6 pb-4 space-y-2">
                  <Link href="/services/embroidery/left-chest" onClick={close} className="block py-2 text-sm text-white hover:text-muted">Embroidery Digitizing</Link>
                  <Link href="/services/raster-to-vector/silhouette" onClick={close} className="block py-2 text-sm text-white hover:text-muted">Raster to Vector</Link>
                  <Link href="/services/custom-patches" onClick={close} className="block py-2 text-sm text-white hover:text-muted">Custom Patches</Link>
                </div>
              )}
            </div>

            {/* PRICING ACCORDION */}
            <div className="border-b border-primary">
              <button onClick={() => toggleAccordion('pricing')} className="w-full px-6 py-4 cursor-pointer text-left flex justify-between items-center hover:bg-primary transition-colors">
                <span className="font-semibold text-white">Pricing</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${activeAccordion === 'pricing' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'pricing' && (
                <div className="px-6 pb-4 space-y-2">
                  <Link href="/pricing/embroidery-digitizing" onClick={close} className="block py-2 text-sm text-white hover:text-muted">Embroidery Pricing</Link>
                  <Link href="/pricing/raster-to-vector" onClick={close} className="block py-2 text-sm text-white hover:text-muted">Raster Pricing</Link>
                </div>
              )}
            </div>

            {/* ABOUT ACCORDION */}
            <div>
              <button onClick={() => toggleAccordion('about')} className="w-full px-6 cursor-pointer py-4 text-left flex justify-between items-center hover:bg-primary transition-colors">
                <span className="font-semibold text-white">About</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${activeAccordion === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'about' && (
                <div className="px-6 pb-4 space-y-2">
                  <Link href="/about/write-a-review" onClick={close} className="block py-2 text-sm text-white hover:text-muted">Write a Review</Link>
                  <Link href="/contact-us" onClick={close} className="block py-2 text-sm text-white hover:text-muted">Contact</Link>
                  <Link href="/FAQs" onClick={close} className="block py-2 text-sm text-white hover:text-muted">FAQs</Link>
                </div>
              )}
              <div className="px-6 py-4 space-y-2 border-b border-blue-700">
                <Button asChild className="w-full bg-white text-primary border cursor-pointer border-primary rounded-full px-10 py-2">
                  <Link href="/get-free-quote" onClick={close}>Get Free Quote</Link>
                </Button>
                <Button asChild className="w-full bg-primary text-white border cursor-pointer border-white rounded-full px-10 py-2">
                  <Link href="/get-quote" onClick={close}>Order Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MAIN HEADER ================= */
export default function Header() {
  const { openCart, items } = useCartSidebar();
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);
  const [hoveredButton, setHoveredButton] = useState<'free' | 'order' | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;

          setIsSticky((prev) => {
            if (!prev && y > 140) return true;   // stick late
            if (prev && y < 80) return false;    // unstick early
            return prev;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="relative z-[100] border-b border-slate-100 bg-white/95 backdrop-blur">
        {/* ===== TOP ROW (Logo + Buttons) ===== */}
        <div className="flex items-center justify-between px-4 pt-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="AH Digitizing home" className="shrink-0">
            <Image
              src={logo}
              alt="AH Digitizing"
              priority
              className="object-contain w-16 sm:w-20 lg:w-40 h-full"
            />
          </Link>

          <div className="hidden lg:flex gap-4">
            <Button
              asChild
              className={`btn-ring border shadow-xl rounded-full px-10 transition-all duration-200 bg-transparent ${hoveredButton === 'free'
                ? 'bg-primary text-white border-primary'
                : hoveredButton === 'order'
                  ? 'bg-white cursor-pointer text-primary border-primary'
                  : 'border-accent text-accent'
                }`}
              onMouseEnter={() => setHoveredButton('free')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Link href="/get-free-quote">Get Free Quote</Link>
            </Button>

            <Button
              asChild
              className={`btn-ring border shadow-xl rounded-full px-10 transition-all duration-200 ${hoveredButton === 'order'
                ? 'bg-primary text-white cursor-pointer border-primary'
                : hoveredButton === 'free'
                  ? 'bg-white text-primary border-primary'
                  : 'bg-primary text-white border-primary'
                }`}
              onMouseEnter={() => setHoveredButton('order')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Link href="/get-quote">Order Now</Link>
            </Button>
          </div>

          <MobileMenu cartCount={cartCount} onCartClick={openCart}/>
        </div>
        {/* ===== SECOND ROW (DESKTOP MENU) ===== */}

      </header>

      <div className="sticky top-0 z-50 hidden md:flex">
        <DesktopMenu isSticky={isSticky} onCartClick={openCart} cartCount={cartCount} />
      </div>
    </>
  );
}














