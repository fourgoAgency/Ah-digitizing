"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AnimatedSectionHeading from "../home/AnimatedSectionHeading";
export default function Hero() {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = useState<'contact' | 'pricing' | null>(null);
  return (
    <section className="w-full bg-white py-32 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <AnimatedSectionHeading className="text-5xl pb-2 md:text-6xl font-bold mb-6 bg-linear-to-br from-primary to-blue-400 text-transparent bg-clip-text">
          Transparent Pricing for Every Project
        </AnimatedSectionHeading>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Choose the perfect plan for your embroidery digitizing and vector art needs, from individual designs to enterprise solutions.
        </p>

         <div className="flex gap-4 justify-center items-center">
            <Button
              className={`border shadow-xl rounded-full px-10 transition-all duration-200 bg-primary text-white border-primary`}
              onMouseEnter={() => setHoveredButton('contact')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => router.push(`/contact-us`)}
            >
              Contact Sales
            </Button>
          </div>
      </div>
    </section>
  );
}

