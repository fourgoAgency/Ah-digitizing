"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-linear-to-r from-primary to-secondary py-32 px-6 mt-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Transform Your Designs into Perfect Embroidery
        </h1>
        
        <p className="text-lg md:text-xl text-white mb-12 max-w-3xl mx-auto">
          Achieve exceptional stitch quality and precision with our expert embroidery digitizing services. Perfect for logos, apparel, patches, and creative designs of any complexity.
        </p>

        <Link href="/account?quote=embroidery" className="inline-block px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get a Quote
        </Link>
      </div>
    </section>
  );
}
