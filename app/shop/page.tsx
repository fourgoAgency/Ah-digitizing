import Link from "next/link";
import { Metadata } from "next";
import ProductCard from "@/components/shop/ProductCard";
import ShopHero from "@/components/shop/ShopHero";
import TransformationGrid from "@/components/shop/TransformationGrid";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop | AH Digitizing",
  description:
    "Shop premium embroidery digitizing, vector conversion, and patch design services from AH Digitizing.",
};

export default function ShopPage() {
  const featuredProducts = products.slice(0, 5);

  return (
    <main className="bg-[#f1f2f4] pb-16">
      <ShopHero />

      <section className="mx-auto mt-12 w-full max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary">FEATURED PRODUCTS</h2>
          <p className="mt-2 text-sm text-gray-600">Must have products from our top sellers</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild className="rounded-full px-7">
            <Link href="/shop/all-products">Browse All Products</Link>
          </Button>
        </div>
      </section>

      <div className="mt-16">
        <TransformationGrid />
      </div>
    </main>
  );
}
