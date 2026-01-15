"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaUsers, FaLightbulb, FaClock, FaAward } from "react-icons/fa";

export default function AboutUs() {
  return (
    <section
      id="about"
      aria-label="About FourGo Agency - Digital Creativity and Innovation"
      className="w-full bg-white py-24 text-center text-teal-900"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mt-5 leading-tight"
        >
          Crafting <span className="text-teal-500">Digital Experiences</span> That Inspire.
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed"
        >
          At <strong>FourGo Agency</strong>, we transform ideas into impactful digital realities.
          Our creative team blends design, technology, and storytelling to help brands stand out
          and grow in a fast-changing world.
        </motion.p>

        {/* Highlighted Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 justify-items-center">
          {[
            { icon: <FaUsers />, label: "Talented Team" },
            { icon: <FaLightbulb />, label: "Creative Ideas" },
            { icon: <FaClock />, label: "On-Time Delivery" },
            { icon: <FaAward />, label: "Trusted Quality" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white border border-teal-100 hover:bg-teal-500 hover:text-white transition-all duration-500 rounded-2xl shadow-md hover:shadow-lg p-6 flex flex-col items-center gap-3 w-full max-w-[200px]"
            >
              <div className="text-3xl text-teal-500 group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>
              <p className="font-semibold text-teal-800 group-hover:text-white transition-all duration-500">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats + Animated Button */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-5xl font-bold text-teal-500">5+</h3>
            <p className="text-gray-700 font-medium mt-2">Years of Collective Experience</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-5xl font-bold text-teal-500">12+</h3>
            <p className="text-gray-700 font-medium mt-2">Projects Completed</p>
          </motion.div>

          {/* Magic Button Animation */}
          <Link href="https://wa.me/+923353123932?text=Can%20you%20tell%20me%20more%20about%20your%20services%3F" className="mt-6 sm:mt-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative inline-flex items-center bg-teal-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-teal-600 transition-all group overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="transition-all duration-500 group-hover:translate-x-5">
                Let’s Connect
              </span>
              <span className="transition-all duration-500 group-hover:-translate-x-30">
                →
              </span>
            </span>

            {/* Optional glowing hover effect */}
            <span className="absolute inset-0 bg-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full" />
          </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
