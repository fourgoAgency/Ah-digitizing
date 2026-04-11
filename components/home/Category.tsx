"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AnimatedSectionHeading from "./AnimatedSectionHeading";
import { Button } from "../ui/button";

const categories = [
  { id: 1, name: "Embroidery Digitizing", slug: "embroidery-digitizing", image: "/home-page/portfolio-embroidery/1st.png" },
  { id: 2, name: "Vector Conversion", slug: "vector-conversion", image: "/home-page/portfolio-embroidery/2nd.png" },
  { id: 3, name: "Custom Patches", slug: "custom-patches", image: "/home-page/portfolio-embroidery/3rd.png" },
  { id: 4, name: "Logo Design", slug: "logo-design", image: "/home-page/portfolio-embroidery/1st.png" },
  { id: 5, name: "3D Puff", slug: "3d-puff", image: "/home-page/portfolio-embroidery/5th.png" },
  { id: 6, name: "Applique", slug: "applique", image: "/home-page/portfolio-embroidery/3rd.png" },
];

const sectionVariants = {
  visible: {
    x: 0,
    transition: {
      duration: 1.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: {
    x: -156,
  },
  visible: (index: number) => ({
    x: 0,
    transition: {
      delay: 0.26 + index * 0.1,
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ServicesCarousel() {
  return (
    <section className="overflow-x-hidden py-14 bg-gray-50">
      <div className="max-w-full pr-4">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-8 z-10 items-stretch lg:flex-row"
        >

          {/* LEFT SIDEBAR */}
          <div className="hidden w-80 shrink-0 z-10 lg:flex">
            <div className="bg-primary p-8 shadow-[12px_0_20px_-6px_rgba(0,0,0,0.25)] shadow-black/50 flex flex-col justify-center h-full w-full rounded-r-2xl">
              <div>
                <h3
                  className="mb-4 text-5xl font-bold text-white"
                >
                  Shop By<br />Category
                </h3>
                <p className="text-gray-100 text-xl mb-6">
                  Explore our wide range of services tailored to meet your design and digitizing needs.
                </p>
              </div>

              {/* <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-white text-primary text-center rounded-full font-medium hover:bg-transparent hover:text-white border-2 border-white transition-colors"
              >
                Shop now
              </Link> */}
            </div>
          </div>

          {/* SERVICES GRID */}
          <div className="flex-1 flex flex-col">
<div className="grid grid-cols-1 gap-6 px-2 mr-7 sm:grid-cols-2 md:px-4 lg:grid-cols-3">
  
  {categories.map((category, index) => (
    <motion.div
      key={category.id}
      custom={index}
      variants={cardVariants}
      className="w-full"
    >
      <Link
        href={`/shop/${category.slug}`}
        className="block h-full w-full"
      >
        <div className="bg-white rounded-2xl hover:border-primary hover:border hover:-translate-y-1 transition-all h-full flex flex-col">

          {/* IMAGE WRAPPER */}
          <div className="
          w-full 
          h-48 sm:h-52 md:h-56 
          flex items-center justify-center rounded-t-2xl  drop-shadow-xl drop-shadow-black/70
          shadow-[12px_0_20px_-6px_rgba(0,0,0,0.25)]
        ">
            <Image
              src={category.image}
              alt={category.name}
              width={500}
              height={500}
              className="max-h-full max-w-[80%] object-contain"
              draggable={false}
            />
          </div>

          {/* BUTTON */}
          <div className="mt-auto">
            <span className="block text-center bg-primary text-white py-3 rounded-b-2xl text-sm font-semibold">
              {category.name}
            </span>
          </div>

        </div>
      </Link>
    </motion.div>
  ))}
</div>
<div className="lg:flex hidden justify-center">
  <Button
    variant="outline"
    className="my-8 px-9 rounded-full text-md border-primary text-primary hover:bg-primary hover:text-white transition-colors"
  >
    View More
  </Button>
</div>
          </div>
        </motion.div>

        {/* MOBILE CTA */}
        <div className="lg:hidden mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}
