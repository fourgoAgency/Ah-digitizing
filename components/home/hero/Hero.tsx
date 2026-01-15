"use client";
// import Plasma from '@/components/Plasma';
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-center w-full">

{/* ----- Plasma Background ----- */}
{/* <div className="absolute inset-0 z-50">
  <Plasma 
count={100}
    gravity={0.4}
    friction={0.9975}
    wallBounce={0.95}
    followCursor={false}
    colors={["#01b89f","#072039"]}
  />
</div> */}

<video 
            src="234.mp4"
            autoPlay= {true}
             loop muted
            className="absolute z-10 w-auto 
            min-w-full min-h-full max-w-none">
        </video>
      {/* ----- Hero Text ----- */}
      <motion.h1
        className="text-5xl md:text-7xl font-bold text-[#0a1f44] relative z-10 leading-tight"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Build Your Digital Future <br />
        with <span className="text-[#01bfa6]">Fourgo</span>
      </motion.h1>

      {/* ----- Rotating Tagline ----- */}
      <motion.div
        className="mt-2 text-xl font-medium text-gray-500 relative h-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="absolute"
          animate={{ y: ["0%", "-100%", "-200%", "0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <p>Web Design & Branding</p>
          <p>AI-Powered Development</p>
          <p>Creative Automation</p>
        </motion.div>
      </motion.div>

      <motion.p
        className="mt-4 text-lg text-gray-600 max-w-xl z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        We build innovative, fast, and scalable web experiences that grow your business and inspire your audience.
      </motion.p>

      {/* ----- CTA Buttons ----- */}
      <motion.div
        className="mt-8 z-10 flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <Link href="/appointment">
        <button className="px-6 py-3 rounded-full bg-[#01bfa6] text-white font-medium shadow-md hover:bg-[#0a1f44] transition">
          Start a Project 🚀
        </button>
        </Link>
        <Link href="/services">
        <button className="px-6 py-3 rounded-full border border-[#01bfa6] text-[#01bfa6] font-medium hover:bg-[#e8fff9] transition">
          View Our Work
        </button>
        </Link>
      </motion.div>
    </section>
  );
}
