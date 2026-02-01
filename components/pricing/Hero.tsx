"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-linear-to-r from-blue-700 to-blue-600 py-32 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Transparent Pricing for Every Project
        </h1>
        
        <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Choose the perfect plan for your embroidery digitizing and vector art needs, from individual designs to enterprise solutions.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            href="#pricing" 
            className="inline-block px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Pricing
          </Link>
          <Link 
            href="/contact-us" 
            className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors border border-white"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}