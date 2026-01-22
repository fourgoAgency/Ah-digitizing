"use client";

import Link from "next/link";

export default function EmbHero() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Embroidery digitizing with excellence in every stitch.</h2>
            <p className="text-gray-600 mb-6">Customized and precise digitizing to transform your artwork into production-ready embroidery files. Fast turnaround and consistent stitch quality for any fabric or garment.</p>

            <div className="flex gap-3">
              <Link href="/portfolio" className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">Portfolio</Link>
              <Link href="/pricing/embroidery-digitizing" className="inline-block px-5 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">Pricing</Link>
            </div>
          </div>

          {/* Right - Blue card with inner white card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-blue-600 rounded-xl p-6 flex items-center justify-center shadow-lg">
                <div className="hidden md:block absolute -right-6 -top-6 w-20 h-20 bg-[url('/dots.svg')] bg-no-repeat" />

                <div className="bg-white rounded-lg w-44 h-56 md:w-56 md:h-72 flex flex-col overflow-hidden shadow-md">
                  <div className="flex-1 bg-gray-100 flex items-center justify-center">
                    <img src="/home-page/portfolio-embroidery/2nd.png" alt="embroidery" className="object-contain p-4" />
                  </div>
                  <div className="p-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">Blue Wolf</span>
                      <span className="text-gray-600">$12.00</span>
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
