"use client";

import React from "react";
import Hero from "@/components/pricing/Hero";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      {/* Additional pricing sections can be added here */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">More pricing sections coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
}