"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ContactCTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="bg-[#0A21C0] w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-around gap-6 sm:gap-9 lg:gap-10">

          {/* Left Side */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0"
            >
              <div className="relative w-full h-full">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop"
                  alt="Company Logo"
                  className="object-contain rounded-full"
                />
              </div>
            </motion.div>

            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Get In Touch With Us!
              </h2>
              <p className="text-blue-100 text-sm sm:text-base max-w-md">
                Let us be the game-changing partner to make your business fly high.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
                         hover:bg-white hover:text-[#0A21C0] transition text-sm sm:text-base
                         font-medium w-full sm:w-auto shadow-xl"
            >
              CALL NOW
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#0A21C0] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
                         hover:bg-blue-50 transition text-sm sm:text-base
                         font-medium w-full sm:w-auto"
            >
              LET&apos;S TALK
            </motion.button>

          </div>
        </div>
      </div>
    </motion.section>
  );
}
