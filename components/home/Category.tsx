"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AnimatedSectionHeading from "./AnimatedSectionHeading";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

type ShopCategoryDefinition = {
  id: string;
  label: string;
  slug: string;
  image?: string;
  order?: number;
};

const sectionVariants = {
  hidden: {
    x: -200,
  },
  visible: {
    x: 0,
    transition: {
      duration: 1.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: {
    x: -560,
  },
  visible: (index: number) => ({
    x: 0,
    transition: {
      delay: 0.26 + index * 0.1,
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ServicesCarousel() {
  const [categories, setCategories] = useState<ShopCategoryDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "category"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ShopCategoryDefinition[];

        setCategories(
          data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );

        setLoading(false);
      },
      (error) => {
        console.error("Failed to load categories:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="overflow-x-hidden py-14 bg-gray-50">
      <div className="max-w-full pr-4">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-8 z-10 items-stretch lg:flex-row"
        >
          {/* LEFT SIDEBAR */}
          <div className="hidden w-80 shrink-0 z-10 lg:flex">
            <div className="bg-primary p-8 shadow-[12px_0_20px_-6px_rgba(0,0,0,0.25)] shadow-black/50 flex flex-col justify-center h-full w-full rounded-r-2xl">
              <div>
                <AnimatedSectionHeading className="mb-4 text-5xl font-bold text-white">
                  Shop By
                  <br />
                  Category
                </AnimatedSectionHeading>

                <p className="text-gray-100 text-xl mb-6">
                  Explore our wide range of services tailored to meet your
                  design and digitizing needs.
                </p>
              </div>
            </div>
          </div>

          <AnimatedSectionHeading className="text-5xl text-center font-bold text-primary sm:hidden block">
            Shop By Category
          </AnimatedSectionHeading>

          {/* GRID */}
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Loading categories...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-2 md:px-4 lg:grid-cols-3">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      custom={index}
                      variants={cardVariants}
                      className="w-full"
                    >
                      <Link
                        href={`/shop?category=${category.slug}`}
                        className="block h-full w-full"
                      >
                        <div className="bg-white cursor-pointer rounded-2xl hover:border-primary hover:border hover:-translate-y-1 transition-all h-full flex flex-col">
                          <div className="w-full h-36 sm:h-52 md:h-56 flex items-center justify-center rounded-t-2xl drop-shadow-xl drop-shadow-black/20">
                            <Image
                              src={
                                category.image || "/placeholder.png"
                              }
                              alt={category.label}
                              width={500}
                              height={500}
                              className="max-h-full max-w-[80%] object-contain"
                              draggable={false}
                            />
                          </div>

                          <div className="mt-auto">
                            <span className="block text-center bg-primary text-white py-3 rounded-b-2xl text-sm font-semibold">
                              {category.label}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="lg:flex hidden justify-center">
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/shop")}
                    className="my-8 px-9 rounded-full text-md border-primary cursor-pointer text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    View More
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* MOBILE CTA */}
        <div className="lg:hidden mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}