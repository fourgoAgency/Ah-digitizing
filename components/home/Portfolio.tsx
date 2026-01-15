"use client";

import { useState } from "react";

import portfolioData from "../../data/portfolio.json";
import Image from "next/image";

type ImageItem = { id: number; src: string; alt: string };

const embroideryImages: ImageItem[] = (portfolioData as any).embroidery || [];
const vectorImages: ImageItem[] = (portfolioData as any).vector || [];

export default function ShowcaseGallery() {
  const [activeTab, setActiveTab] = useState<"embroidery" | "vector">("embroidery");
  
  const images = activeTab === "embroidery" ? embroideryImages : vectorImages;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Showcasing Our Crafts</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our gallery of recently completed projects that demonstrate our dedication to quality and detail.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full border-2 border-primary p-1">
            <button
              onClick={() => setActiveTab("embroidery")}
              className={`px-12 py-3 rounded-full font-medium transition-all ${
                activeTab === "embroidery"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary"
              }`}
            >
              Embroidery
            </button>
            <button
              onClick={() => setActiveTab("vector")}
              className={`px-12 py-3 rounded-full font-medium transition-all ${
                activeTab === "vector"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary"
              }`}
            >
              Vector
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <Image
                src={image.src} 
                alt={image.alt} 
                width={900}
                height={900}
                className="w-full h-full object-fill transition-transform group-hover:scale-110 duration-500" 
              />
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}