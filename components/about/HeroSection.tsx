"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 flex flex-col justify-center order-2 lg:order-1"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight text-center lg:text-left">
              About us AH Digitizing
            </h1>
            <p className="text-gray-600 text-xl lg:text-lg text-center lg:text-left">
              At AH Digitizing, we provide professional embroidery digitizing and vector artwork services for businesses, clothing brands, and embroidery professionals. We turn logos, images, and custom artwork into production-ready embroidery files and clean vector designs.
              <br/><br/>
              With 10 years of industry experience, we understand the importance of accurate stitch placement, proper design structure, and consistent results. Our team considers fabric type, design size, embroidery machine requirements, and intended applications when preparing each design.
              <br/><br/>
              We serve customers worldwide, including embroidery businesses, apparel manufacturers, promotional product companies, and custom clothing professionals. Our goal is to provide dependable service, competitive pricing, and carefully prepared designs that meet our customers' production needs.
            </p>
              <Link
                href="/get-free-quote"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center px-8 py-3 cursor-pointer rounded-md transition-colors duration-200"
              >
                Get Started Today
              </Link>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 lg:order-2"
          >
            <Image
              width={500}
              height={500}
              src="/about_two.jpeg"
              alt="Professional working at desk"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
