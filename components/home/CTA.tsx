"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
export default function CTABanner() {
  const [hovered, setHovered] = useState(false);
  return (
    <section className="bg-linear-to-t from-primary via-primary to-black/80 py-16 rounded-3xl shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Side - Logo/Icon */}
          <div className="shrink-0">
            <div className="w-36 h-36 md:w-44 md:h-44 bg-white rounded-full flex items-center justify-center shadow-lg">
              {/* Replace with your actual logo/icon */}
              <div className="relative w-24 h-24 md:w-28 md:h-28">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  width={800}
                  height={800}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Center - Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get In Touch With Us!
            </h2>
            <p className="text-white/90 text-lg">
              Let us be the game changing partner to make your business fly high.
            </p>
          </div>

          {/* Right Side - CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 shrink-0"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* CALL NOW */}
            <a
              href="tel:+1234567890"
              className={`px-8 py-3 font-semibold rounded-full text-center transition-all duration-300 ${hovered
                  ? "bg-white text-secondary"
                  : "bg-secondary text-white"
                }`}
            >
              CALL NOW
            </a>

            {/* LET'S TALK */}
            <a
              href="/contact"
              className={`px-8 py-3 font-semibold rounded-full text-center transition-all duration-300 ${hovered
                  ? "bg-secondary text-white"
                  : "bg-white text-secondary"
                }`}
            >
              LET&apos;S TALK
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}