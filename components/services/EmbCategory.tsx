"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedSectionHeading from "../home/AnimatedSectionHeading";

const embroideryCategories = [
  { id: 1, label: "Logo Embroidery Digitizing", href: "/services/embroidery/logo" },
  { id: 2, label: "Left Chest Logo Digitizing", href: "/services/embroidery/left-chest" },
  { id: 3, label: "Cap & Hat Digitizing", href: "/services/embroidery/cap" },
  { id: 4, label: "Visor Digitizing", href: "/services/embroidery/logo" },
  { id: 5, label: "3D Puff Digitizing", href: "/services/embroidery/3d-puff" },
  { id: 6, label: "Patch Embroidery Digitizing", href: "/services/embroidery/left-chest" },
  { id: 7, label: "Applique Design Digitizing", href: "/services/embroidery/jacket" },
  { id: 8, label: "Outline / Line Art Embroidery Digitizing", href: "/services/embroidery/applique" },
  { id: 9, label: "Jacket Back Digitizing", href: "/services/embroidery/jacket" },
  { id: 10, label: "NGS Wings XP", href: "/services/embroidery/cap" },
  { id: 10, label: "PXF Pulse", href: "/services/embroidery/3d-puff" },
  { id: 12, label: "Custom Digitizing (Any Design You Need)", href: "/services/embroidery/applique" }
];

export default function EmbCategory() {
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
         <AnimatedSectionHeading className="mb-12 text-center text-4xl font-bold lg:text-5xl fade-in-up">
        Embroidery Digitizing
      </AnimatedSectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {embroideryCategories.map((category) => (
            <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                 key={category.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="aspect-4/3 bg-gray-100 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-2">
                <h4 className="text-lg font-semibold mb-2">{category.label}</h4>
                <p className="text-sm text-gray-600">Transform any image or logo into a high quality, scalable embroidery-ready file. Our digitizing service produces stitch-accurate files suitable for production on any machine.</p>

                <div className="flex justify-center items-end mb-3 mt-auto">
                  <Link href="/get-quote" className="inline-block px-6 py-2 bg-primary text-white rounded-full text-sm cursor-pointer font-medium hover:bg-transparent hover:border-primary hover:text-primary hover:border transition-colors">
                    Order Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
