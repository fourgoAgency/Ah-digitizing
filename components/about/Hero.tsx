"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-gray-900 bg-white overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-6 leading-tight"
        >
          Explore <span className="text-teal-500">Passion</span>, Creativity, and Innovation
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl leading-relaxed"
        >
          Welcome to FourGo. We are a team of thinkers, creators, and innovators
          who believe in turning ideas into impactful experiences.
          Every step we take is guided by passion, integrity, and purpose.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10"
        >
          <button className="group relative inline-flex items-center gap-3 bg-teal-500 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:bg-teal-600">
            <span className="relative z-10">Discover More</span>
            <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
