import { Metadata } from "next";
import AllProductsCatalog from "@/components/shop/AllProductsCatalog";
import ShopHero from "@/components/shop/ShopHero";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop | AH Digitizing",
  description:
    "Shop premium embroidery digitizing, vector conversion, and patch design services from AH Digitizing.",
};

export default function ShopPage() {
  return (
    <main className="bg-[#f1f2f4] pb-16">
      <ShopHero />

      <section className="mx-auto mt-12 w-full max-w-7xl px-4 xl:max-w-[1400px] 2xl:max-w-[1680px]">
        <Suspense fallback={<div className="text-center py-20">Loading products...</div>}>
        <AllProductsCatalog />
        </Suspense>
      </section>
    </main>
  );
}

