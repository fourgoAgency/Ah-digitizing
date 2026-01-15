"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  image: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    title: "Blog title",
    category: "custom design",
    excerpt:
      "Magna magna dolor ad ullamco sit veniam. Mollit nulla exercitation incididunt consectetur labore nisi consectetur dolore ex aute adipisicing.",
    image: "/logo.jpeg",
  },
  {
    id: 2,
    title: "Second blog post",
    category: "Embroidery Digitizing",
    excerpt:
      "Dolore adipisicing non. Magna magna dolor ad ullamco sit veniam.",
    image: "/logo.jpeg",
  },
  {
    id: 3,
    title: "Third blog post",
    category: "Vector Art",
    excerpt:
      "Mollit nulla exercitation incididunt consectetur labore nisi.",
    image: "/logo.jpeg",
  },
];

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative w-full py-10 bg-gray-100 overflow-hidden h-screen">
      <div className="max-w-6xl mx-auto flex justify-center gap-6">
        {blogs.map((blog, index) => (
          <Card key={blog.id} blog={blog} isCenter={index === 1} isInView={isInView} />
        ))}
      </div>
    </section>
  );
}

const Card = ({ blog, isCenter, isInView }: { blog: Blog; isCenter: boolean; isInView: boolean }) => {
  return (
    <motion.div
      className="relative w-96 h-96 rounded-2xl overflow-hidden shadow-xl border hover:scale-105 hover:shadow-2xl transition-transform duration-300 transform-gpu"
      initial={isCenter ? { scale: 1.2 } : { scale: 0.5 }}
      animate={isInView ? { scale: 1 } : (isCenter ? { scale: 1.2 } : { scale: 0.5 })}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <Image
        src={blog.image}
        alt={blog.title}
        width={500}
        height={1200}
        className="object-cover transition-transform duration-500 hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-white/90 via-white/60 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300">
        <span className="inline-block mb-2 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full w-fit">
          {blog.category}
        </span>

        <h3 className="text-lg font-semibold mb-2">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm">
          {blog.excerpt}
        </p>
      </div>
    </motion.div>
  );
};
