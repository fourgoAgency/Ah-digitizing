"use client";
import { motion } from "framer-motion";
import { Lightbulb, Shield, Award } from "lucide-react";
import React from "react";

type Value = {
  title: string;
  desc: string;
  icon: string;
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Lightbulb": return Lightbulb;
    case "Shield": return Shield;
    case "Award": return Award;
    default: return Lightbulb;
  }
};

const cardVariants = {
  rest: { y: 0, boxShadow: "0 0px 0px rgba(10, 33, 192, 0)" },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(10, 33, 192, 0.12)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 10, scale: 1.1, transition: { duration: 0.3 } },
};

const lineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function MissionValuesSection({ values }: { values: Value[] }) {
  return (
    <section className="bg-white text-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl lg:text-4xl font-bold mb-12"
        >
          Our Mission: Empowering Creativity
        </motion.h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, index) => {
            const IconComponent = getIconComponent(v.icon);
            return (
              <motion.div
                key={v.title}
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
                className="bg-gray-50 p-8 rounded-xl space-y-4 cursor-pointer"
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <motion.div
                    variants={iconVariants}
                    className="bg-white p-4 rounded-full shadow-sm"
                  >
                    <IconComponent className="w-8 h-8 text-[#0A21C0]" />
                  </motion.div>
                </div>

                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>

                {/* Bottom accent line */}
                <motion.div
                  variants={lineVariants}
                  className="h-[2px] bg-[#0A21C0] origin-left rounded-full w-1/2 mx-auto"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
