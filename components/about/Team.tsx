"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import team1 from "@/../public/images/team/1.png";
import team2 from "@/../public/images/team/3.png";
import team3 from "@/../public/images/team/2.png";
import team4 from "@/../public/images/team/4.png";

const teamMembers = [
  {
    name: "Ayan Ahmed",
    role: "CEO & Founder",
    image: team1,
    description:
      "Founder and CEO of Fourgo Agency, Ayan leads with a vision to help brands grow with purpose, clarity, and bold ideas.",
  },
  {
    name: "Fatima Amir",
    role: "Creative Director",
    image: team2,
    description:
      "Fatima brings designs to life with a passion for storytelling and creative direction that connects with audiences.",
  },
  {
    name: "Esha Adeel",
    role: "Lead Developer",
    image: team4,
    description:
      "Esha heads development at FourGo, ensuring projects are technically strong and executed with precision.",
  },
  {
    name: "Ammar Shaikh",
    role: "Software Developer",
    image: team3,
    description:
      "Ammar builds robust, user-focused applications, always pushing to deliver seamless experiences.",
  },
];

export default function Team() {
  return (
    <section className="px-6 sm:px-10 lg:px-14 py-16 bg-gray-50 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-10"
      >
        Meet Our <span className="text-teal-500">Team</span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="flex justify-center mt-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600">
                {member.name}
              </h3>
              <p className="text-gray-500 text-sm mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {member.description}
              </p>
            </div>

            
          </motion.div>
        ))}
      </div>
    </section>
  );
}
