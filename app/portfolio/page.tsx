"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";


type PortfolioItem = {
  id: number;
  title: string;
  path: string;
  service: "Embroidery" | "Vector" | "Raster-to-Vector";
};

const portfolioData: PortfolioItem[] = [
  
  { id: 1, title: "Custom Logo Digitizing", path: "/my.jpg", service: "Embroidery" },
  { id: 2, title: "Pet Portrait Embroidery", path: "/my.jpg", service: "Embroidery" },
  { id: 3, title: "Sports Team Logo", path: "/my.jpg", service: "Embroidery" },
  { id: 4, title: "Fashion Embroidery", path: "/my.jpg", service: "Embroidery" },
  { id: 5, title: "Hand Embroidery Closeup", path: "/my.jpg", service: "Embroidery" },
  { id: 6, title: "Embroidery Tools Flatlay", path: "/my.jpg", service: "Embroidery" },
  { id: 7, title: "Thread Texture Study", path: "/my.jpg", service: "Embroidery" },
  { id: 8, title: "Custom Name Embroidery", path: "/my.jpg", service: "Embroidery" },
  { id: 9, title: "Floral Embroidery Design", path: "/my.jpg", service: "Embroidery" },
  { id: 10, title: "Logo Embroidery Mockup", path: "/my.jpg", service: "Embroidery" },
  { id: 11, title: "Embroidery Close Detail", path: "/my.jpg", service: "Embroidery" },
  { id: 12, title: "Embroidery Hoop Art", path: "/my.jpg", service: "Embroidery" },
  { id: 13, title: "Animal Embroidery Piece", path: "/my.jpg", service: "Embroidery" },
  { id: 14, title: "Lettering Embroidery", path: "/my.jpg", service: "Embroidery" },
  { id: 15, title: "Embroidery Pattern Sheet", path: "/my.jpg", service: "Embroidery" },
  { id: 16, title: "Textile Embroidery Study", path: "/my.jpg", service: "Embroidery" },
  { id: 17, title: "Decorative Stitching", path: "/my.jpg", service: "Embroidery" },
  { id: 18, title: "Custom Patch Design", path: "/my.jpg", service: "Embroidery" },
  { id: 19, title: "Embroidery Project Layout", path: "/my.jpg", service: "Embroidery" },
  { id: 20, title: "Handmade Embroidery Art", path: "/my.jpg", service: "Embroidery" },

  
  { id: 21, title: "Vintage T-Shirt Design", path: "/my.jpg", service: "Vector" },
  { id: 22, title: "Vintage Car Illustration", path: "/my.jpg", service: "Vector" },
  { id: 23, title: "Abstract Vector Art", path: "/my.jpg", service: "Vector" },
  { id: 24, title: "Corporate Branding", path: "/my.jpg", service: "Vector" },
  { id: 25, title: "Mascot Vector Design", path: "/my.jpg", service: "Vector" },
  { id: 26, title: "Vector Pattern Design", path: "/my.jpg", service: "Vector" },
  { id: 27, title: "Illustration Concept Art", path: "/my.jpg", service: "Vector" },
  { id: 28, title: "Tech Icon Vector Set", path: "/my.jpg", service: "Vector" },
  { id: 29, title: "Logo Vector Mockup", path: "/my.jpg", service: "Vector" },
  { id: 30, title: "Flat Vector UI Icons", path: "/my.jpg", service: "Vector" },
  { id: 31, title: "Infographic Vector Design", path: "/my.jpg", service: "Vector" },
  { id: 32, title: "Vector Character Illustration", path: "/my.jpg", service: "Vector" },
  { id: 33, title: "Vector Sticker Sheet", path: "/my.jpg", service: "Vector" },
  { id: 34, title: "Vector Illustration Pack", path: "/my.jpg", service: "Vector" },
  { id: 35, title: "Minimalist Vector Art", path: "/my.jpg", service: "Vector" },
  { id: 36, title: "Vector Branding Elements", path: "/my.jpg", service: "Vector" },
  { id: 37, title: "Vector Logo Series", path: "/my.jpg", service: "Vector" },
  { id: 38, title: "Vector Icon Set", path: "/my.jpg", service: "Vector" },
  { id: 39, title: "Abstract Shapes Vector", path: "/my.jpg", service: "Vector" },
  { id: 40, title: "Vector Illustration Study", path: "/my.jpg", service: "Vector" },

  
  { id: 41, title: "Blueprint Vectorization", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 42, title: "Logo Vectorization", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 43, title: "Photo to Vector", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 44, title: "Raster Logo Reconstruction", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 45, title: "Image Trace Project", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 46, title: "Raster to Vector Study", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 47, title: "Vectorization Workflow", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 48, title: "Photo Trace Illustration", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 49, title: "Line Art Vectorization", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 50, title: "Raster Image Conversion", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 51, title: "Logo Rebuild Project", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 52, title: "Illustration Vector Trace", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 53, title: "Raster Graphic Conversion", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 54, title: "Technical Drawing Vector", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 55, title: "Vectorization Mockup", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 56, title: "Raster Art Conversion", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 57, title: "Photo to Vector Study", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 58, title: "Linework Vectorization", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 59, title: "Raster Design Rebuild", path: "/my.jpg", service: "Raster-to-Vector" },
  { id: 60, title: "Vectorization Detail Study", path: "/my.jpg", service: "Raster-to-Vector" },
];


const chunkArray = <T,>(arr: T[], size: number) =>
  arr.reduce<T[][]>((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);


const useInView = (activeFilter: string) => {
  const [isInView, setIsInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsInView(false); // reset animation on filter change

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [activeFilter]);

  return { ref, isInView };
};


const PortfolioRow = ({
  row,
  isFirstRow,
  activeFilter,
}: {
  row: PortfolioItem[];
  isFirstRow?: boolean;
  activeFilter: string;
}) => {
  const { ref, isInView } = useInView(activeFilter);

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-start"
      initial={{ opacity: isFirstRow ? 1 : 0, y: isFirstRow ? 0 : 60 }}
      animate={{ opacity: isInView || isFirstRow ? 1 : 0, y: isInView || isFirstRow ? 0 : 60 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {row.map((item) => (
        <motion.div
          key={item.id}
          className="group relative bg-white rounded-2xl shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          whileHover={{ scale: 1.03 }}
        >
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <Image
              src={item.path}
              width={500}
              height={500}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-3 left-3 z-10">
              <span className="bg-white/30 backdrop-blur-md text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/40">
                {item.service}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-gray-900 font-semibold text-base transition-all duration-300 group-hover:text-blue-600 group-hover:translate-x-1">
              {item.title}
            </h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};


export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<"All" | PortfolioItem["service"]>("All");

  const filters: ("All" | PortfolioItem["service"])[] = ["All", "Embroidery", "Vector", "Raster-to-Vector"];

  const filteredData =
    activeFilter === "All"
      ? portfolioData
      : portfolioData.filter((item) => item.service === activeFilter);

  const rows = chunkArray(filteredData, 4);

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our diverse collection of digitized embroidery and vectorized art projects.See the quality and precision we bring to every design.
          </p>

<div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex flex-wrap justify-center gap-3 min-w-max md:min-w-0">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 md:px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-xs md:text-base whitespace-nowrap
                    ${
                      activeFilter === filter
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600 hover:text-blue-600"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {rows.map((row, idx) => (
            <PortfolioRow
              key={`${activeFilter}-${idx}`}
              row={row}
              isFirstRow={idx === 0}
              activeFilter={activeFilter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
