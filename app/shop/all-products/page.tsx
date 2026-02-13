import { Metadata } from "next";
import Link from "next/link";
import AllProductsGrid from "@/components/shop/AllProductsGrid";

export const metadata: Metadata = {
  title: "All Products | AH Digitizing",
  description: "Explore all digitizing, vector conversion, and custom patch services.",
};

export default function AllProductsPage() {
  return (
    <main className="bg-[#f7f7f8] py-12">
      <section className="mx-auto w-full max-w-7xl px-4">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Shop</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">All Products</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Browse our complete catalog of ready-to-order digitizing and vector services.
        </p>

        <AllProductsGrid />

        <div className="mt-10 text-center">
          <Link href="/get-quote" className="text-sm font-semibold text-primary hover:underline">
            Need custom work? Request a quote
          </Link>
        </div>
      </section>
    </main>
  );
}
