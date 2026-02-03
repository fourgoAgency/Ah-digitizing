"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

type TransformationExample = {
  id: number;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
};

type ServiceTransformationExamplesProps = {
  title: string;
  description: string;
  examples: TransformationExample[];
};

export default function ServiceTransformationExamples({
  title,
  description,
  examples,
}: ServiceTransformationExamplesProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <section className="bg-gray-200 px-4 py-12 flex justify-between items-center">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Grid of Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {examples.map((example) => (
            <div
              className="bg-white pl-4 py-3 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center justify-between "
              key={example.id}
            >
              {/* Left: Title and Description */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {example.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {example.description}
                </p>

                {/* Before */}
                <div className="text-center mt-4">
                  <div className="bg-white rounded-lg h-40 sm:h-48 flex items-center justify-center mb-3 overflow-hidden shadow-md shadow-gray-700">
                    <img
                      src={example.beforeImage}
                      className="w-full h-full object-contain"
                      alt="Before"
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button className="rounded-full px-8 py-2 text-sm sm:text-base hover:bg-transparent hover:border-primary hover:text-primary hover:border">
                    Order Now
                  </Button>
                </div>
              </div>

              {/* After */}
              <div className="text-center mr-6">
                <div
                  className="bg-white rounded-lg w-full h-56 sm:h-64 md:h-72 lg:h-80 
             flex items-center justify-center overflow-hidden 
             shadow-md shadow-gray-700 cursor-pointer"
                  onClick={() => setActiveImage(example.afterImage)}
                >
                  <Image
                    src={example.afterImage}
                    alt="After"
                    className="max-w-full max-h-full "
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setActiveImage(null)}
        >
          <button
            className="absolute top-3 right-3 text-white hover:text-black text-2xl"
            onClick={() => setActiveImage(null)}
          >
            &times;
          </button>
          <div
            className="relative rounded-lg w-[95%] sm:w-[80%] lg:w-[70%] h-auto lg:h-[90%] p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <Image
              src={activeImage}
              width={500}
              height={500}
              className="w-full h-full hover:scale-105 transition-transform duration-300"
              alt="Preview"
            />
          </div>
        </div>
      )}
    </section>
  );
}
