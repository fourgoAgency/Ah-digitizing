"use client";

import { motion } from "framer-motion";
import {
  FaHandshake,
  FaBalanceScale,
  FaUserAlt,
  FaHeart,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";

export default function CoreValue() {
  const values = [
    {
      title: "Client First",
      description: "Your success is our priority.",
      icon: <FaBalanceScale className="text-teal-500 text-3xl" />,
    },
    {
      title: "Integrity",
      description: "Honest, transparent, and trustworthy.",
      icon: <FaHandshake className="text-teal-500 text-3xl" />,
    },
    {
      title: "Innovation",
      description: "Creative solutions that drive impact.",
      icon: <FaLightbulb className="text-teal-500 text-3xl" />,
    },
    {
      title: "Accountability",
      description: "We own our work and results.",
      icon: <FaUserAlt className="text-teal-500 text-3xl" />,
    },
    {
      title: "Collaboration",
      description: "Strong partnerships, better outcomes.",
      icon: <FaGlobe className="text-teal-500 text-3xl" />,
    },
    {
      title: "Results",
      description: "Focused on what truly moves the needle.",
      icon: <FaHeart className="text-teal-500 text-3xl" />,
    },
  ];

  return (
    <section className="px-6 sm:px-10 lg:px-14 py-16 text-center bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-10"
      >
        Our <span className="text-teal-500">Core Values</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="mb-4">{value.icon}</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {value.title}
            </h4>
            <p className="text-gray-600 text-sm">{value.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
