"use client";

import { useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import AnimatedSectionHeading from "./AnimatedSectionHeading";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "James Cooper",
    role: "Apparel Brand Owner",
    rating: 5,
    text:
      "Clean digitizing, fast replies, and the files stitched smoothly on our caps without the usual cleanup round.",
    avatar: "/avatar.png",
  },
  {
    id: 2,
    name: "Maria Lewis",
    role: "Print Shop Manager",
    rating: 5,
    text:
      "Their vector conversion saved a messy client logo. The artwork came back crisp, organized, and ready for production.",
    avatar: "/avatar.png",
  },
  {
    id: 3,
    name: "Owen Patel",
    role: "Freelance Designer",
    rating: 4,
    text:
      "Turnaround was quick and the team handled revision notes clearly. It felt easy to move from proof to final file.",
    avatar: "/avatar.png",
  },
  {
    id: 4,
    name: "Sarah Bennett",
    role: "Uniform Supplier",
    rating: 5,
    text:
      "We sent multiple logos at once and every file was consistent. That made our production week much smoother.",
    avatar: "/avatar.png",
  },
];

const marqueeTestimonials = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="relative mt-16 w-[280px] shrink-0 rounded-[28px] border border-gray-200 bg-white p-6 pt-16 shadow-xl transition-transform duration-300 hover:-translate-y-1 sm:w-[320px]">
      <div className="absolute right-6 -top-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-200 bg-white shadow-xl">
        <Image
          src={t.avatar}
          alt={t.name}
          width={80}
          height={80}
          className="h-[72px] w-[72px] rounded-full object-cover"
        />
      </div>

      <div className="absolute left-[-20px] top-0">
        <div className="absolute left-0 top-[38px] h-10 w-5 rounded-bl-[20px] bg-[#2a5492]" />
        <div className="relative rounded-tl-[26px] rounded-tr-[26px] rounded-br-[26px] bg-[#2f5fa7] px-10 py-3 shadow-lg">
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-white/80">{t.role}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="w-1 rounded-full bg-[#2f5fa7]" />
        <div>
          <div className="mb-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={i < t.rating ? "h-4 w-4 text-yellow-400" : "h-4 w-4 text-gray-300"}
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-gray-600">{t.text}</p>
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-full px-4">
        <div className="mb-8 text-center sm:mb-10">
          <AnimatedSectionHeading className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Testimonials
          </AnimatedSectionHeading>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Real client feedback moving across the page. Hover or hold the strip to pause and read.
          </p>
        </div>

        <div
          className="relative cursor-grab overflow-hidden touch-pan-y active:cursor-grabbing"
          onPointerCancel={resume}
          onTouchEnd={resume}
          onPointerCancelCapture={pause}
          onTouchStart={pause}
          tabIndex={0}
          aria-label="Scrolling testimonials. Hover or hold to pause the motion."
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-20" />

          <div
            className="flex w-max gap-6 py-14 will-change-transform"
            style={{
              animation: "home-testimonials-marquee 34s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {marqueeTestimonials.map((item, index) => (
              <TestimonialCard key={`${item.id}-${index}`} t={item} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes home-testimonials-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
