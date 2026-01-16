"use client";

import Image from "next/image";
import Link from "next/link";
import portfolioData from "../../data/portfolio.json";
import { Button } from "../ui/button";

type ImageItem = { id: number; src: string; alt: string };

const embroideryImages: ImageItem[] = (portfolioData as any).embroidery?.slice(0, 4) || [];
const vectorImages: ImageItem[] = (portfolioData as any).vector?.slice(0, 4) || [];

export default function ShowcaseGallery() {
  return (
    <section className="pt-20 pb-2 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Showcasing Our Crafts</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our recent embroidery and vector design work.
          </p>
        </div>

        {/* Full-width Tab Toggle (Links) */}
        <div className="flex w-full mb-12 gap-4">
          <Link
            href=""
            className="w-1/2 text-center py-2 font-medium bg-primary text-white rounded-full border-2 border-primary transition hover:bg-primary/90"
          >
            Embroidery
          </Link>

          <Link
            href=""
            className="w-1/2 text-center py-2 font-medium text-primary bg-white rounded-full border-2 border-primary transition hover:bg-primary hover:text-white"
          >
            Vector
          </Link>
        </div>


        {/* Split Gallery Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Embroidery Column */}
          <div className="grid grid-cols-2 gap-6">
            {embroideryImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-2xl overflow-hidden border-primary border"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-fit"
                />
              </div>
            ))}
          </div>

          {/* Vector Column */}

          <div className="grid grid-cols-2 gap-6">
            {vectorImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-2xl border border-primary overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-fit"
                />
              </div>
            ))}
          </div>

        </div>
        <div className="flex justify-center m-9">

          <Button
            variant="outline"
            className="text-primary border-primary w-36 hover:bg-primary hover:text-white"
            size='sm'
          >
            <Link href="/portfolio">
              View Full Portfolio
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
