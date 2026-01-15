"use client";

import { motion } from "framer-motion";

export default function GlobalBackground() {
  return (
    
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* --- Floating Gradient Orbs --- */}
      <motion.div
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-[#01bfa6] rounded-full opacity-20 blur-lg"
        animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[#ffd701] rounded-full opacity-20 blur-md"
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[50%] left-[60%] w-[300px] h-[300px] bg-[#0a1f44] rounded-full opacity-15 blur-sm "
        animate={{ x: [0, 30, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* --- Floating Lines (like particles but ultra-light) --- */}
      <div className="absolute inset-0">
        <div className="absolute w-[2px] h-[200px] bg-gradient-to-b from-[#01bfa6] to-transparent left-[20%] top-[20%] animate-slideDown opacity-30" />
        <div className="absolute w-[2px] h-[180px] bg-gradient-to-b from-[#ffd701] to-transparent right-[25%] top-[40%] animate-slideDown opacity-40 delay-1000" />
        <div className="absolute w-[1.5px] h-[220px] bg-gradient-to-b from-[#0a1f44] to-transparent left-[50%] top-[10%] animate-slideDown opacity-30 delay-500" />
      </div>
    </div>
  );
}
