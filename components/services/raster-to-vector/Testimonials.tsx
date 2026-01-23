"use client";

import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Lee",
    country: "USA",
    text: "The vector conversion was flawless. Our logo now scales perfectly across all our marketing materials without any pixelation. Highly recommend their service!",
    image: "/home-page/portfolio-vector/1st.jpg",
  },
  {
    id: 2,
    name: "Mike Chen",
    country: "Canada",
    text: "Fast turnaround and excellent quality. The vector files are clean and editable. Saved us a lot of time and hassle in our design process.",
    image: "/home-page/portfolio-vector/2nd.jpg",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  const t = testimonials[index];

  return (
    <section className="w-full bg-blue-900 text-white py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-1 text-left px-4">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">From the people</h2>
          <p className="text-sm lg:text-base text-blue-100 max-w-md">
            We love hearing from our customers! You're the reason we're here and the reason we do what we do.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="relative flex items-center">
            <div className="shrink-0 w-64 h-80 md:w-80 md:h-96 overflow-hidden shadow-xl rounded-l-xl bg-white">
              <img src={t.image} alt={t.name} className="w-full h-full object-fill" />
            </div>

            <div className="flex-1 bg-blue-800 bg-opacity-90 rounded-r-xl p-8 shadow-inner h-80 md:h-96">
              <p className="text-base lg:text-lg leading-relaxed mb-6">{t.text}</p>
              <div className="mt-6">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-blue-200">{t.country}</div>
              </div>
            </div>

            <div className="absolute right-6 bottom-6 flex gap-4">
              <button onClick={prev} aria-label="Previous" className="w-12 h-12 rounded-full bg-blue-700 bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={next} aria-label="Next" className="w-12 h-12 rounded-full bg-blue-700 bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
