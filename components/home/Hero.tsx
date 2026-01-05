"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function BlogCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  

  const prev = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setIndex((index - 1 + blogs.length) % blogs.length);
  };

  const next = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setIndex((index + 1) % blogs.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setDirection(null);
    }, 500); // Match the animation duration

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    // GSAP ScrollTrigger: pin hero and animate .hero-content as user scrolls
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(".hero-content", {
        opacity: 0,
        y: -120,
        ease: "none",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Optional: reveal animation when the carousel comes into view
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.from(sectionRef.current, {
      y: 120,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });
  }, []);

  return (
    <section
      ref={(el) => {
        heroRef.current = el as HTMLDivElement | null;
        sectionRef.current = el as HTMLDivElement | null;
      }}
      className="relative w-full py-24 bg-gray-100 overflow-hidden h-screen"
    >
      <div className="hero-content relative max-w-6xl mx-auto flex items-center justify-center">

        {/* Left preview */}
        <div className="hidden lg:block absolute left-0 opacity-30 scale-90 transition-all duration-500 ease-in-out">
          <PreviewCard blog={blogs[(index - 1 + blogs.length) % blogs.length]} />
        </div>

        {/* Main card */}
          <div className="relative z-10">
            <MainCard
              blog={blogs[index]}
              direction={direction}
              isAnimating={isAnimating}
            />
          </div>

        {/* Right preview */}
        <div className="hidden lg:block absolute right-0 opacity-30 scale-90 transition-all duration-500 ease-in-out">
          <PreviewCard blog={blogs[(index + 1) % blogs.length]} />
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-4 lg:left-32 w-10 h-10 flex items-center justify-center rounded-full border bg-white shadow hover:bg-gray-100 transition-all duration-300 hover:scale-105"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute right-4 lg:right-32 w-10 h-10 flex items-center justify-center rounded-full border bg-white shadow hover:bg-gray-100 transition-all duration-300 hover:scale-105"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

/* ---------------- Components ---------------- */

interface CardProps {
  blog: Blog;
  direction?: 'left' | 'right' | null;
  isAnimating?: boolean;
}

function MainCard({ blog, direction, isAnimating }: CardProps) {
  return (
    <div
      className={`
        relative w-180 h-105 rounded-2xl overflow-hidden shadow-xl border
        transition-all duration-500 ease-in-out
        ${isAnimating
          ? direction === 'right'
            ? 'animate-fade-in-right'
            : 'animate-fade-in-left'
          : 'hover:scale-105 hover:shadow-2xl transition-transform duration-300'
        }
        transform-gpu
      `}
    >
      <Image
        src={blog.image}
        alt={blog.title}
        fill
        className="object-cover transition-transform duration-500 hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-white/90 via-white/60 to-transparent p-8 flex flex-col justify-end transition-opacity duration-300">
        <span className="inline-block mb-3 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full w-fit animate-fade-in-up">
          {blog.category}
        </span>

        <h3 className="text-2xl font-semibold mb-2 animate-fade-in-up">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm max-w-xl animate-fade-in-up">
          {blog.excerpt}
        </p>
      </div>
    </div>
  );
}

function PreviewCard({ blog }: { blog: Blog }) {
  return (
    <div className="relative w-90 h-75 rounded-xl overflow-hidden border transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
      <Image
        src={blog.image}
        alt={blog.title}
        fill
        className="object-cover transition-transform duration-500 hover:scale-110"
      />
    </div>
  );
}
