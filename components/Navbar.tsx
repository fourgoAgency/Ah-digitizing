"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-35 border-b-2 border-b-white/20">
      {/* <nav className="fixed top-0 left-0 w-full z-35 backdrop-blur-lg bg-white/5 border-b border-white/20"> */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-[#0a1f44] hover:text-[#01bfa6] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Centered on mobile, left on desktop */}
          <Link href="/" className="text-2xl font-bold text-[#0a1f44] md:flex-1 md:text-left">
            Fourgo<span className="text-[#01bfa6]">Agency</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#01bfa6]",
                  pathname === link.href ? "text-[#01bfa6]" : "text-[#0a1f44]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Right on both mobile and desktop */}
          <div className="md:flex-1 md:text-right">
            <Link href='/appointment'>
              <Button>Book service</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <Link href="/" className="text-2xl font-bold text-[#0a1f44] md:flex-1 md:text-left">
            Fourgo<span className="text-[#01bfa6]">Agency</span>
          </Link>
              <div className="flex flex-col gap-6 mt-16">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-[#01bfa6]",
                      pathname === link.href ? "text-[#01bfa6]" : "text-[#0a1f44]"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
