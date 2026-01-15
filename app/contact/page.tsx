"use client";

import { FaWhatsapp, FaFacebookF, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import Form from "@/components/Form"; // ✅ adjust if it's a named export
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="w-full bg-white text-gray-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-white to-gray-50"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-teal-700">
          Get In Touch
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl sm:max-w-2xl leading-relaxed text-sm sm:text-base">
          We’re here to help you build, grow, and elevate your business. Whether you need guidance or want to start
          your next project — let’s create something great together.
        </p>
      </motion.div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Contact Form */}
          <Form />

          {/* Social Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <FaWhatsapp className="text-teal-500 text-5xl group-hover:text-teal-600 transition" />,
                title: "Chat on WhatsApp",
                href: "https://wa.me/+923353123932?text=Can%20you%20tell%20me%20more%20about%20your%20services%3F",
              },
              {
                icon: <FaFacebookF className="text-teal-500 text-5xl group-hover:text-teal-600 transition" />,
                title: "Visit Facebook Page",
                href: "https://www.facebook.com/profile.php?id=61582074620117",
              },
              {
                icon: <FaInstagram className="text-teal-500 text-5xl group-hover:text-teal-600 transition" />,
                title: "Visit Instagram Page",
                href: "https://www.instagram.com/fourgo04",
              },
              {
                icon: <FaPhoneAlt className="text-teal-500 text-5xl group-hover:text-teal-600 transition" />,
                title: "Call Us",
                href: "tel:03353123932",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center text-center bg-white border border-gray-100 rounded-xl shadow-sm p-8 hover:shadow-md hover:bg-teal-50 transition-all"
              >
                {item.icon}
                <h3 className="text-lg font-semibold mt-3">{item.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
