"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

export default function Mission() {
  return (
    <section className="w-full bg-white text-gray-800 py-20 px-6 md:px-16 lg:px-28">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-10"
        >
          Our <span className="text-teal-500">Mission</span> & <span className="text-teal-500">Vision</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-teal-100 p-3 rounded-full mb-4">
              <Target className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-semibold text-teal-700 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide top-tier digital solutions that empower businesses,
              inspire innovation, and drive sustainable growth.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-teal-100 p-3 rounded-full mb-4">
              <Eye className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-semibold text-teal-700 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become a globally recognized agency known for creativity,
              innovation, and lasting partnerships built on trust and excellence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
