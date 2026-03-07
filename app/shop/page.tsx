import { Metadata } from "next";
import AllProductsCatalog from "@/components/shop/AllProductsCatalog";
import ShopHero from "@/components/shop/ShopHero";

export const metadata: Metadata = {
  title: "Shop | AH Digitizing",
  description:
    "Shop premium embroidery digitizing, vector conversion, and patch design services from AH Digitizing.",
};

export default function ShopPage() {
  return (
    <main className="bg-[#f1f2f4] pb-16">
      <ShopHero />

      <section className="mx-auto mt-12 w-full max-w-7xl px-4">
        <AllProductsCatalog />
      </section>
    </main>
  );
}
