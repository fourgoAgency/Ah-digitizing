"use client";
import { motion, Variants } from "framer-motion";

const cardVariants: Variants = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(10, 33, 192, 0.12)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const iconVariants: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 10, scale: 1.1, transition: { duration: 0.3 } },
};

const lineVariants: Variants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const services = [
  {
    id: "embroidery",
    title: "Embroidery Digitizing",
    desc: "Transform your designs into high-quality embroidery files with precision and detail, tailored for all fabric types.",
    icon: (
      <svg className="w-12 h-12 text-[#0A21C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    id: "vector",
    title: "Raster to Vector",
    desc: "Convert any low-resolution image into a crisp, scalable vector format, perfect for printing and branding.",
    icon: (
      <svg className="w-12 h-12 text-[#0A21C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: "custom",
    title: "Custom Design",
    desc: "Bring your unique ideas to life with bespoke design solutions tailored to your brand and creative requirements.",
    icon: (
      <svg className="w-12 h-12 text-[#0A21C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-gray-100/2 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16"
        >
          Our Services: Digital Art Solutions
        </motion.h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              variants={cardVariants}
              whileHover="hover"
              animate="rest"
              className="bg-white rounded-lg p-8 text-center cursor-pointer"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  variants={iconVariants}
                  className="bg-blue-50 p-4 rounded-full"
                >
                  {service.icon}
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{service.desc}</p>
              <button className="text-[#0A21C0] font-semibold text-sm hover:text-blue-700">
                Learn More
              </button>

              {/* Bottom accent line */}
              <motion.div
                variants={lineVariants}
                className="h-[2px] bg-[#0A21C0] origin-left rounded-full w-1/2 mx-auto mt-4"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
