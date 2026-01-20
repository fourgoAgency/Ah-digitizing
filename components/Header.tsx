"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaPinterest,
  FaYoutube,
  FaUser,
} from "react-icons/fa6";
import { ChevronDown, Menu } from "lucide-react";

/* ================= TOP NAVBAR ================= */
function TopNavbar() {
  return (
    <nav className="border-b border-gray-100 flex justify-between items-center px-16 py-2">
      <ul className="flex gap-4">
        <li><FaFacebook className="text-blue-800" /></li>
        <li><FaInstagram className="text-blue-800" /></li>
        <li><FaXTwitter className="text-blue-800" /></li>
        <li><FaPinterest className="text-blue-800" /></li>
        <li><FaYoutube className="text-blue-800" /></li>
      </ul>

      <Link href="/account" className="flex items-center gap-2 text-blue-800 text-sm">
        <FaUser /> My Account
      </Link>
    </nav>
  );
}

/* ================= DESKTOP MENU ================= */

const embroideryItems = [
  { label: "Logo Embroidery Digitizing", href: "/services/embroidery/logo" },
  { label: "Left Chest Embroidery Digitizing", href: "/services/embroidery/left-chest" },
  { label: "Cap Embroidery Digitizing", href: "/services/embroidery/cap" },
  { label: "3D Puff Embroidery Digitizing", href: "/services/embroidery/3d-puff" },
  { label: "Jacket Embroidery Digitizing", href: "/services/embroidery/jacket" },
  { label: "Applique Embroidery Digitizing", href: "/services/embroidery/applique" },
  { label: "Image Embroidery Digitizing", href: "/services/embroidery/image" },
  { label: "Towel Embroidery Digitizing", href: "/services/embroidery/towel" },
];

const rasterToVectorItems = [
  { label: "Raster To Vector Services", href: "/services/raster-to-vector" },
  { label: "Silhouette Art", href: "/services/raster-to-vector/silhouette" },
  { label: "Stencil Art", href: "/services/raster-to-vector/stencil" },
  { label: "Color Separation", href: "/services/raster-to-vector/color-separation" },
];

function DesktopMenu() {
  return (
    <nav className="hidden p-1 rounded-full shadow-lg shadow-gray-600 bg-primary w-full md:flex items-center gap-8 text-sm font-medium text-center justify-center text-white">

      <Link href="/">Home</Link>

      {/* SERVICES */}
      <div className="relative group">
        <Link href="/services">
        <span className="cursor-pointer flex">Services<ChevronDown className=" text-sm" /></span></Link>

        {/* Main dropdown */}
        <div className="absolute left-0 top-full mt-3 opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

          <div className="flex rounded-lg shadow-xl bg-primary text-white">

            {/* LEFT PANEL */}
            <ul className="w-64 py-3">
              <li className="relative group/emb px-5 py-3 hover:bg-[#0a4d99] flex justify-between items-center cursor-pointer">
                <Link href="/services/embroidery" className="flex-1">Embroidery Digitizing</Link>
                <span>›</span>

                {/* RIGHT PANEL */}
                <ul className="absolute left-full top-0 w-80 bg-[#0a4d99] py-3 
                               opacity-0 invisible group-hover/emb:opacity-100 
                               group-hover/emb:visible transition-all duration-200 rounded-2xl">

                  {embroideryItems.map((item) => (
                    <li key={item.href} className="px-5 py-2 hover:bg-[#0d5db8]">
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}

                </ul>
              </li>

              <li className="relative group/raster px-5 py-3 hover:bg-[#0a4d99] flex justify-between items-center cursor-pointer">
                <Link href="/services/raster-to-vector" className="flex-1">Raster to Vector Services</Link>
                <span>›</span>

                {/* RIGHT PANEL */}
                <ul className="absolute left-full top-0 w-80 bg-[#0a4d99] py-3
                               opacity-0 invisible group-hover/raster:opacity-100
                               group-hover/raster:visible transition-all duration-200 rounded-2xl">

                  {rasterToVectorItems.map((item) => (
                    <li key={item.href} className="px-5 py-2 hover:bg-[#0d5db8]">
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}

                </ul>
              </li>

              <li className="px-5 py-3 hover:bg-[#0a4d99] cursor-pointer">
                <Link href="/services/custom-patches">Custom Patches</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="relative group">
        <span className="cursor-pointer flex">Pricing <ChevronDown className=" text-sm" /></span>
        <div className="absolute left-0 top-full mt-3 opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

          <div className="flex rounded-lg shadow-xl bg-primary text-white">

            {/* LEFT PANEL */}
            <ul className="w-64 py-3">
              <li className="relative group/emb px-5 py-3 hover:bg-[#0a4d99] flex justify-between items-center cursor-pointer">
                <Link href="/pricing/embroidery-digitizing">
                <span>Embroidery Digitizing Pricing</span>
                </Link>
              </li>
              <li className="relative group/raster px-5 py-3 hover:bg-[#0a4d99] flex justify-between items-center cursor-pointer">
                <Link href="/pricing/raster-to-vector">
                <span>Raster to Vector Pricing</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Link href="/portfolio">Portfolio</Link>
      <Link href="/blogs">Blogs</Link>

      {/* ABOUT */}
      <div className="relative group">
        <Link href="/about-us">
        <span className="cursor-pointer flex">About <ChevronDown className="text-sm" /></span>
        </Link>
               <div className="absolute left-0 top-full mt-3 opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

          <div className="flex rounded-lg shadow-xl bg-primary text-white">

            {/* LEFT PANEL */}
            <ul className="w-64 py-3">
              <li className="relative group/emb px-5 py-3 hover:bg-[#0a4d99] flex justify-between items-center cursor-pointer">
                <Link href="/write-a-review">Write a Review</Link>
              </li>
              <li className="relative group/raster px-5 py-3 hover:bg-[#0a4d99] flex justify-between items-center cursor-pointer">
                <Link href="/contact-us">Contact</Link>
              </li>
              <li className="relative group/raster px-5 py-3 hover:bg-[#0a4d99] flex justify-between items-center cursor-pointer">
                <Link href="/FAQs">FAQs</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </nav>
  );
}


/* ================= MOBILE MENU ================= */
function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="md:hidden relative">
      <button onClick={() => setOpen(!open)} className="text-sm font-medium pl-5">
        <Menu />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-primary shadow-xl rounded-lg z-50">
          <div className="py-2">
            {/* BUTTONS */}
            <div className="px-6 py-4 space-y-2 border-b border-blue-700">
              <Button className="w-full bg-white text-primary border border-primary rounded-full px-10 py-2">
                Shop Now
              </Button>
              <Button className="w-full bg-primary text-white border border-white rounded-full px-10 py-2">
                Get Quote
              </Button>
            </div>
            {/* ADDITIONAL LINKS */}
            <div className="px-6 py-4 space-y-2 border-t border-blue-700">
              <Link href="/" className="block py-2 text-sm font-medium text-white hover:text-muted">
                Home
              </Link>
              <Link href="/portfolio" className="block py-2 text-sm font-medium text-white hover:text-muted">
                Portfolio
              </Link>
              <Link href="/blogs" className="block py-2 text-sm font-medium text-white hover:text-muted">
                Blogs
              </Link>
            </div>
            {/* SERVICES ACCORDION */}
            <div className="border-b border-blue-700">
              <button
                onClick={() => toggleAccordion('services')}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#0a4d99] transition-colors"
              >
                <span className="font-semibold text-white">Services</span>
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform duration-200 ${
                    activeAccordion === 'services' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'services' && (
                <div className="px-6 pb-4 space-y-2 z-[9999]">
                  <Link href="/services/embroidery/left-chest" className="block py-2 text-sm text-white hover:text-muted">
                    Embroidery Digitizing
                  </Link>
                  <Link href="/services/raster-to-vector/silhouette" className="block py-2 text-sm text-white hover:text-muted">
                    Raster to Vector
                  </Link>
                  <Link href="/services/custom-patches" className="block py-2 text-sm text-white hover:text-muted">
                    Custom Patches
                  </Link>
                </div>
              )}
            </div>

            {/* PRICING ACCORDION */}
            <div className="border-b border-[#0a4d99]">
              <button
                onClick={() => toggleAccordion('pricing')}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#0a4d99] transition-colors"
              >
                <span className="font-semibold text-white">Pricing</span>
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform duration-200 ${
                    activeAccordion === 'pricing' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'pricing' && (
                <div className="px-6 pb-4 space-y-2 z-9999">
                  <Link href="/pricing/embroidery-digitizing" className="block py-2 text-sm text-white hover:text-muted">
                    Embroidery Pricing
                  </Link>
                  <Link href="/pricing/raster-to-vector" className="block py-2 text-sm text-white hover:text-muted">
                    Raster Pricing
                  </Link>
                </div>
              )}
            </div>

            {/* ABOUT ACCORDION */}
            <div>
              <button
                onClick={() => toggleAccordion('about')}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#0a4d99] transition-colors"
              >
                    <span className="font-semibold text-white">About</span>

                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform duration-200 ${
                    activeAccordion === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'about' && (
                <div className="px-6 pb-4 space-y-2 z-9999">
                  <Link href="/about/write-a-review" className="block py-2 text-sm text-white hover:text-muted">
                    Write a Review
                  </Link>
                  <Link href="/contact-us" className="block py-2 text-sm text-white hover:text-muted">
                    Contact
                  </Link>
                  <Link href="/FAQs" className="block py-2 text-sm text-white hover:text-muted">
                    FAQs
                  </Link>
                </div>
              )}
            </div>


          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MAIN HEADER ================= */
export default function Header() {
  const [hoveredButton, setHoveredButton] = useState<'shop' | 'quote' | null>(null);

  return (
    <>
      <TopNavbar />

      <header className="relative z-[100">
        {/* ===== TOP ROW (Logo + Buttons) ===== */}
        <div className="flex justify-between items-center px-6">
          <Image src={logo} alt="Logo" width={150} />

          <div className="hidden lg:flex gap-4">
            <Button
              className={`border shadow-xl rounded-full px-10 transition-all duration-200 bg-transparent  ${
                hoveredButton === 'shop'
                  ? 'bg-primary text-white border-primary'
                  : hoveredButton === 'quote'
                    ? 'bg-white text-primary border-primary'
                    : 'border-accent text-accent'
              }`}
              onMouseEnter={() => setHoveredButton('shop')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Shop Now
            </Button>

            <Button
              className={`border shadow-xl rounded-full px-10 transition-all duration-200 ${
                hoveredButton === 'quote'
                  ? 'bg-primary text-white border-primary'
                  : hoveredButton === 'shop'
                    ? 'bg-white text-primary border-primary'
                    : 'bg-primary text-white border-primary'
              }`}
              onMouseEnter={() => setHoveredButton('quote')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Get Quote
            </Button>
          </div>

          <MobileMenu />
        </div>

        {/* ===== SECOND ROW (DESKTOP MENU) ===== */}
        <div className="hidden md:flex justify-center mb-5  items-center">
          <DesktopMenu />
        </div>
      </header>
    </>
  );
}

