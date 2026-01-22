"use client";

import Link from "next/link";

export default function VecHero() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Professional vector conversion with precision and clarity.</h2>
            <p className="text-gray-600 mb-6">Transform your raster images into scalable vector graphics. Our expert team converts artwork, logos, and designs into clean, editable vector files suitable for any medium—print, web, or signage.</p>

            <div className="flex gap-3">
              <Link href="/portfolio" className="inline-block px-5 py-2 bg-primary text-white rounded-md font-medium hover:bg-transparent hover:border-primary hover:border hover:text-primary transition-colors">Portfolio</Link>
              <Link href="/pricing/raster-to-vector" className="inline-block px-5 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">Pricing</Link>
            </div>
          </div>

          {/* Right - Blue card with inner white card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-secondary rounded-xl p-6 flex items-center justify-center shadow-lg">
                <div className="hidden md:block absolute -right-6 -top-6 w-20 h-20 bg-[url('/dots.svg')] bg-no-repeat" />

                <div className="bg-white rounded-lg w-44 h-56 md:w-56 md:h-72 flex flex-col overflow-hidden shadow-md shadow-white/70">
                  <div className="flex-1 bg-gray-100 flex items-center justify-center">
                    <img src="/home-page/portfolio-vector/1st.jpg" alt="vector" className="object-contain p-4" />
                  </div>
                  <div className="p-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">Vector Logo</span>
                      <span className="text-gray-600">$8.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-[url('/dots.svg')] bg-no-repeat opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
