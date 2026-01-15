"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import p1 from "@/../public/images/portfolio/1.png";
import p2 from "@/../public/images/portfolio/2.png";
import p3 from "@/../public/images/portfolio/3.png";
import p4 from "@/../public/images/portfolio/4.png";

const projects = [
  {
    title: "Web Development",
    description:
      "Crafting dynamic and responsive websites tailored to your brand's vision.",
    image: p1,
    link: "/services/web-design",
  },
  {
    title: "Graphics Design",
    description:
      "Creating visually stunning and impactful designs that elevate your brand identity.",
    image: p2,
    link: "/services/graphic-design",
  },
  {
    title: "Digital Marketing",
    description:
      "Leveraging data-driven strategies to enhance your online presence and drive traffic.",
    image: p3,
    link: "/services/digital-marketing",
  },
  {
    title: "E-commerce Creation & Management",
    description:
      "Building robust e-commerce platforms that enhance user experience and drive sales.",
    image: p4,
    link: "/services/e-commerce",
  },
];

export default function Portfolio() {
  return (
    <section
      id="projects"
      aria-label="FourGo Agency Projects - Completed Work and Case Studies"
      className="w-full bg-white py-24 text-center text-teal-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold"
        >
          <span className="text-teal-500">Projects</span> We Completed
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed"
        >
          Helping small businesses grow with expert, affordable solutions.  
          Explore how our work has empowered brands to stand out digitally.
        </motion.p>

        {/* Project Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl bg-white border border-teal-100 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-teal-800 mb-2 group-hover:text-teal-500 transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>

              </div>

              {/* Hover overlay animation */}
              <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
