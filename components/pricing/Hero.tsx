"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export default function Hero() {
  const [hoveredButton, setHoveredButton] = useState<'contact' | 'pricing' | null>(null);
  return (
    <section className="w-full bg-linear-to-r from-primary to-black py-32 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Transparent Pricing for Every Project
        </h1>
        
        <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Choose the perfect plan for your embroidery digitizing and vector art needs, from individual designs to enterprise solutions.
        </p>

         <div className="flex gap-4 justify-center items-center">
            <Button
              className={`border shadow-xl rounded-full px-10 transition-all duration-200 bg-transparent  ${hoveredButton === 'contact'
                ? 'bg-primary text-white border-primary'
                : hoveredButton === 'pricing'
                  ? 'bg-transparent text-white border-white'
                  : 'border-white text-white'
                }`}
              onMouseEnter={() => setHoveredButton('contact')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Contact Sales
            </Button>

            <Button
              className={`border shadow-xl rounded-full px-10 transition-all duration-200 ${hoveredButton === 'pricing'
                ? 'bg-primary text-white border-primary'
                : hoveredButton === 'contact'
                  ? 'bg-transparent text-white border-white'
                  : 'bg-primary text-white border-primary'
                }`}
              onMouseEnter={() => setHoveredButton('pricing')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              View Pricing
            </Button>
          </div>
      </div>
    </section>
  );
}

