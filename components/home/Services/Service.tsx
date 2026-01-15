"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode, FaPaintBrush, FaShoppingCart, FaBullhorn } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  image: string;
}
const services: Service[] = [
  {
    id: "web",
    title: "Website Design & Development",
    icon: <FaCode />,
    description:
      "We create fast, scalable, and beautiful websites tailored to your brand — designed for performance and built to impress.",
    image: "/images/service/webdev.jpg",
  },
  {
    id: "graphic",
    title: "Graphic Designing",
    icon: <FaPaintBrush />,
    description:
      "Transforming ideas into visual stories — from logos to full brand identities with modern, elegant design.",
    image: "/images/service/graphic.jpg",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Management",
    icon: <FaShoppingCart />, // better suited icon for e-commerce
    description:
      "We help businesses manage and scale their online stores with optimized product listings, seamless user experiences, and smart automation.",
    image: "/images/service/ecommerce.jpg", // update this path to your e-commerce themed image
  },

  {
    id: "marketing",
    title: "Digital Marketing",
    icon: <FaBullhorn />,
    description:
      "We amplify your brand’s voice through SEO, paid ads, and social media campaigns that convert.",
    image: "/images/service/marketing.jpg",
  },
];

export default function Service() {
  const [activeTab, setActiveTab] = useState("web");
  const activeService = services.find((s) => s.id === activeTab);

  return (
    <section className="relative w-full py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mt-2"
          >
            Our Expertise
          </motion.h2>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            We build digital experiences that combine creativity and technology to help you grow your business and reach your audience.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {services.map((service) => (
            <motion.button
              key={service.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(service.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === service.id
                  ? "bg-teal-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <span className="text-lg">{service.icon}</span>
              {service.title.split(" ")[0]}
            </motion.button>
          ))}
        </div>

        {/* Active Service Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService?.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="bg-teal-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg"
          >
            <div className="md:w-1/2 flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {activeService?.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {activeService?.description}
              </p>
              <Link href='https://wa.me/+923353123932?text=Can%20you%20tell%20me%20more%20about%20your%20services%3F'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full w-max transition-all"
                >
                  Let’s Chat 💬
                </motion.button>
              </Link>
            </div>

            <motion.div
              className="md:w-1/2 mt-8 md:mt-0 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={activeService?.image || ''}
                  alt={activeService?.title || 'Service image'}
                  width={800}
                  height={800}

                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
