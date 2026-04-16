"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const leftVariants = {
  hidden: { opacity: 0, x: -72 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const rightVariants = {
  hidden: { opacity: 0, x: 72 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const groupVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export default function EmbHero() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left - Text */}
          <motion.div variants={leftVariants}>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
              Embroidery digitizing with excellence in every stitch.
            </h2>
            <p className="text-gray-600 mb-6">
              Customized and precise digitizing to transform your artwork into
              production-ready embroidery files. Fast turnaround and consistent
              stitch quality for any fabric or garment.
            </p>
            <div className="flex gap-3">
              <Link
                href="/portfolio"
                className="inline-block px-5 py-2 bg-primary text-white rounded-md font-medium hover:bg-transparent hover:border-primary hover:text-primary hover:border transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/pricing/embroidery-digitizing"
                className="inline-block px-5 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                Pricing
              </Link>
            </div>
          </motion.div>

          {/* Right - Blue card with inner white card */}
          <motion.div
            variants={rightVariants}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-secondary rounded-xl p-6 flex items-center justify-center shadow-lg">
                <div className="hidden md:block absolute -right-6 -top-6 w-20 h-20 bg-[url('/dots.svg')] bg-no-repeat" />
                <div className="bg-white rounded-lg w-44 h-56 md:w-56 md:h-72 flex flex-col overflow-hidden shadow-md">
                  <div className="flex-1 bg-gray-100 flex items-center justify-center">
                    <img
                      src="/home-page/portfolio-embroidery/2nd.png"
                      alt="embroidery"
                      className="object-contain p-4 drop-shadow-xl drop-shadow-black/80"
                    />
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}