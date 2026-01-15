"use client";

import { motion } from "framer-motion";
import { FaToolbox, FaLightbulb, FaHandsHelping } from "react-icons/fa";

const features = [
  {
    icon: <FaToolbox className="text-teal-600 text-3xl" />,
    title: "All-in-One Services",
    desc: "From web development to marketing — we've got you covered.",
  },
  {
    icon: <FaLightbulb className="text-teal-600 text-3xl" />,
    title: "Creative & Modern Solutions",
    desc: "We design digital experiences tailored for the modern world.",
  },
  {
    icon: <FaHandsHelping className="text-teal-600 text-3xl" />,
    title: "Client-Centric Approach",
    desc: "We grow when our clients do — your success is our priority.",
  },
];

export default function ChooseUS() {
  return (
    <section className="w-full bg-white text-gray-800 py-20 px-6 md:px-16 lg:px-28">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-16"
        >
          Why <span className="text-teal-500">Choose FourGo?</span>
        </motion.h2>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="bg-teal-100 p-4 rounded-full mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
