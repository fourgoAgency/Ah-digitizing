"use client";
import Image from "next/image";
import { useState } from "react";
type CardProps = {
  before: string;
  after: string;
};

const Card = ({ before, after }: CardProps) => {
    const [open, setOpen] = useState(false);
  return (
    <div className="relative bg-muted rounded-3xl w-full h-full flex gap-4 sm:gap-6 shadow-xl p-4 sm:p-0">

      {/* Left: Before */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="rounded-2xl sm:ml-9 sm:mt-6 shadow-2xl bg-white shadow-black/80 
                        border border-gray-400 
                        w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 
                        flex items-center justify-center p-2">
          <Image
            src={before}
            alt="Before"
            width={150}
            height={150}
            className="rounded-xl w-full h-full object-cover"
          />
        </div>
        <span className="text-lg lg:text-xl font-bold italic text-black">
          Before
        </span>
      </div>

      {/* Right: After */}
      <div className="relative ml-auto shrink-0 max-w-full">
        <div
          className="
            rounded-3xl
            p-3 md:p-4 xl:p-6
            shadow-xl shadow-black/60 border border-gray-400
            flex flex-col justify-center items-center gap-2
          "
        >
          <span className="text-lg md:text-xl xl:text-2xl font-bold italic text-black">
            After
          </span>

          <div
            className="
              rounded-2xl shadow-2xl shadow-black/70 bg-white border border-gray-400
              w-28 h-28
              md:w-36 md:h-36
              xl:w-48 xl:h-48
              flex items-center justify-center p-2
              hover:scale-110 transition-transform duration-300
            "
          >
{/* Thumbnail */}
      <Image
        src={after}
        alt="After"
        width={320}
        height={320}
        onClick={() => setOpen(true)}
        className="rounded-2xl w-full h-full object-cover cursor-pointer"
      />

          </div>
        </div>
      </div>
      {/* Full Screen Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold"
          >
            &times;
          </button>
          <Image
            src={after}
            alt="After Full"
            width={900}
            height={900}
            className="max-w-[60%] max-h-[90%] object-contain rounded-xl"
          />
        </div>
      )}

    </div>
  );
};

export default function BeforeAfterGrid() {
  const items = Array.from({ length: 6 });

  return (
    <section className="max-w-fit mx-auto px-4 py-16">
      <div className="text-4xl lg:text-5xl text-center font-bold mb-12">
        Before & After
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {items.map((_, i) => (
          <Card
            key={i}
            before="/home-page/tiger.png"
            after="/home-page/after.jpeg"
          />
        ))}
      </div>
    </section>
  );
}
