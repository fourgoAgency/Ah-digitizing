"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const categories = [
  { id: 1, name: "Embroidery Digitizing", slug: "embroidery-digitizing", image: "/home-page/portfolio-embroidery/1st.png" },
  { id: 2, name: "Vector Conversion", slug: "vector-conversion", image: "/home-page/portfolio-embroidery/2nd.png" },
  { id: 3, name: "Custom Patches", slug: "custom-patches", image: "/home-page/portfolio-embroidery/3rd.png" },
  { id: 4, name: "Logo Design", slug: "logo-design", image: "/home-page/portfolio-embroidery/1st.png" },
  { id: 5, name: "3D Puff", slug: "3d-puff", image: "/home-page/portfolio-embroidery/5th.png" },
  { id: 6, name: "Applique", slug: "applique", image: "/home-page/portfolio-embroidery/3rd.png" },
];

export default function ServicesCarousel() {
  return (
    <section className=" bg-gray-50">
      <div className="max-w-full pr-4">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:flex w-80 shrink-0">
            <div className="bg-primary p-8 shadow-[12px_0_20px_-6px_rgba(0,0,0,0.25)] shadow-black/50 flex flex-col justify-center h-full w-full rounded-r-2xl">
              <div>
                <h3 className="text-5xl font-bold text-white mb-4">
                  Shop By<br />Category
                </h3>
                <p className="text-gray-100 text-xl mb-6">
                  Explore our wide range of services tailored to meet your design and digitizing needs.
                </p>
              </div>

              {/* <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-white text-primary text-center rounded-full font-medium hover:bg-transparent hover:text-white border-2 border-white transition-colors"
              >
                Shop now
              </Link> */}
            </div>
          </div>

          {/* SERVICES GRID */}
          <div className="flex-1 flex flex-col">
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 mt-6 text-center">
              Services we Offered
            </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-4 mr-7">
  
  {categories.map((category) => (
    <Link
      key={category.id}
      href={`/shop/${category.slug}`}
      className="w-full"
    >
      <div className="bg-white rounded-2xl hover:-translate-y-1 transition-all h-full flex flex-col">

        {/* IMAGE WRAPPER */}
        <div className="
          w-full 
          h-48 sm:h-52 md:h-56 
          flex items-center justify-center rounded-t-2xl drop-shadow-xl drop-shadow-black/70
          shadow-[12px_0_20px_-6px_rgba(0,0,0,0.25)]
        ">
          <Image
            src={category.image}
            alt={category.name}
            width={500}
            height={500}
            className="max-h-full max-w-[80%] object-contain"
            draggable={false}
          />
        </div>

        {/* BUTTON */}
        <div className="mt-auto">
          <span className="block text-center bg-primary text-white py-3 rounded-b-2xl text-sm font-semibold">
            {category.name}
          </span>
        </div>

      </div>
    </Link>
  ))}
</div>
<div className="lg:flex hidden justify-center">
  <Button
    variant="outline"
    className="my-8 px-6 py-3 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
  >
    View More
  </Button>
</div>
          </div>
        </div>

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
