"use client";

import Image from "next/image";
import Link from "next/link";
import portfolioData from "../../data/portfolio.json";
import { Button } from "../ui/button";

type ImageItem = {
  id: number;
  src: string;
  alt: string;
};

const embroideryImages: ImageItem[] =
  (portfolioData as any).embroidery?.slice(0, 4) || [];
const vectorImages: ImageItem[] =
  (portfolioData as any).vector?.slice(0, 4) || [];

export default function ShowcaseGallery() {
  return (
    <section className="pt-16 sm:pt-20 pb-6 bg-gray-100">
      <div className="max-w-7xl 4k:max-w-[1800px] mx-auto px-4 4k:px-16">

        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl 4k:text-6xl font-bold mb-4">
            Showcasing Our Crafts
          </h2>
          <p className="text-sm sm:text-base lg:text-lg 4k:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our recent embroidery and vector design work.
          </p>
        </div>

        {/* TABS (STATIC UI) */}
        <div className="flex w-full mx-auto mb-10 gap-16">
          <span className="w-1/2 text-center py-2 sm:py-3 font-medium bg-primary text-white rounded-2xl border-2 border-primary transition hover:bg-primary/90">
            Embroidery
          </span>

          <span className="w-1/2 text-center py-2 sm:py-3 font-medium text-white bg-primary rounded-2xl border-2 border-primary transition hover:bg-primary/90">
            Vector
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 4k:gap-24">

          {/* EMBROIDERY COLUMN */}
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            lg:grid-cols-2 
            4k:grid-cols-3
            gap-4 sm:gap-6 4k:gap-10
          ">
            {embroideryImages.map((image) => (
              <div
                key={image.id}
                className="
                  relative aspect-square rounded-2xl 4k:rounded-3xl 
                  overflow-hidden border border-primary 
                  shadow-xl shadow-black/60
                  transition-transform duration-500 ease-out 
                  hover:scale-105
                "
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-3 sm:p-4 4k:p-6 drop-shadow-xl drop-shadow-black/80"
                />
              </div>
            ))}
          </div>

          {/* VECTOR COLUMN */}
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            lg:grid-cols-2 
            4k:grid-cols-3
            gap-4 sm:gap-6 4k:gap-10
          ">
            {vectorImages.map((image) => (
              <div
                key={image.id}
                className="
                  relative aspect-square rounded-2xl 4k:rounded-3xl 
                  overflow-hidden border border-primary 
                  shadow-xl shadow-black/60
                  transition-transform duration-500 ease-out 
                  hover:scale-105
                "
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-3 sm:p-4 4k:p-6"
                />
              </div>
            ))}
          </div>

        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10 sm:mt-14">
          <Button
            variant="outline"
            className="
              text-primary border-primary rounded-full 
              hover:bg-primary hover:text-white 
              px-6 py-2 
              sm:px-8 sm:py-3 
              4k:px-12 4k:py-4 4k:text-lg 
            "
          >
            <Link href="/portfolio">View Full Portfolio</Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
