"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

import AnimatedSectionHeading from "./AnimatedSectionHeading";
import { Button } from "../ui/button";

type ImageItem = {
  id: number;
  src: string;
  alt: string;
};

const groupVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const createCardVariants = (offset: number) => ({
  hidden: { opacity: 0, x: offset },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
});

const embroideryCardVariants = createCardVariants(-72);
const vectorCardVariants = createCardVariants(72);

async function fetchStorageImages(folder: "embroidery" | "vector"): Promise<ImageItem[]> {
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);
  const urls = await Promise.all(
    result.items.slice(0, 4).map((item) => getDownloadURL(item))
  );
  return urls.map((src, i) => ({ id: i, src, alt: `${folder} design ${i + 1}` }));
}

function SkeletonCard() {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/30 bg-gray-200 animate-pulse" />
  );
}

export default function ShowcaseGallery() {
  const [embroideryImages, setEmbroideryImages] = useState<ImageItem[]>([]);
  const [vectorImages, setVectorImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchStorageImages("embroidery"),
      fetchStorageImages("vector"),
    ])
      .then(([embroidery, vector]) => {
        setEmbroideryImages(embroidery);
        setVectorImages(vector);
      })
      .catch((err) => console.error("Storage fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const renderGrid = (
    images: ImageItem[],
    cardVariants: ReturnType<typeof createCardVariants>
  ) => (
    <motion.div
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 4k:grid-cols-3 gap-4 sm:gap-6 4k:gap-10"
    >
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : images.map((image) => (
            <motion.div
              key={image.id}
              variants={cardVariants}
              className="relative aspect-square rounded-2xl 4k:rounded-3xl overflow-hidden border border-primary shadow-xl shadow-black/60 transition-transform duration-500 ease-out hover:scale-105"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-3 sm:p-4 4k:p-6 drop-shadow-xl drop-shadow-black/80"
              />
            </motion.div>
          ))}
    </motion.div>
  );

  return (
    <section className="overflow-x-hidden bg-gray-100 pt-16 pb-6 sm:pt-20">
      <div className="max-w-7xl 4k:max-w-[1800px] mx-auto px-4 4k:px-16">
        <div className="text-center mb-10 sm:mb-12">
          <AnimatedSectionHeading className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl 4k:text-6xl">
            Showcasing Our Crafts
          </AnimatedSectionHeading>
          <p className="text-sm sm:text-base lg:text-lg 4k:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our recent embroidery and vector design work.
          </p>
        </div>

        <div className="mx-auto mb-10 grid w-full grid-cols-2 gap-10 lg:gap-16 4k:gap-24">
          <span className="text-center py-2 sm:py-3 font-medium bg-primary text-white rounded-2xl border-2 border-primary transition hover:bg-primary/90">
            Embroidery
          </span>
          <span className="text-center py-2 sm:py-3 font-medium text-white bg-primary rounded-2xl border-2 border-primary transition hover:bg-primary/90">
            Vector
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 4k:gap-24">
          {renderGrid(embroideryImages, embroideryCardVariants)}
          {renderGrid(vectorImages, vectorCardVariants)}
        </div>

        <div className="flex justify-center mt-10 sm:mt-14">
          <Button
            variant="outline"
            className="text-primary border-primary rounded-full cursor-pointer hover:bg-primary hover:text-white px-6 py-2 sm:px-8 sm:py-3 4k:px-12 4k:py-4 4k:text-lg"
          >
            <Link href="/portfolio">View Full Portfolio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}