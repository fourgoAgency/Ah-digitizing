import { Metadata } from "next";
import Link from "next/link";
import AllProductsCatalog from "@/components/shop/AllProductsCatalog";

export const metadata: Metadata = {
  title: "All Products | AH Digitizing",
  description: "Explore all digitizing, vector conversion, and custom patch services.",
};

export default function AllProductsPage() {
  return (
    <main className="bg-[#f7f7f8] py-12">
      <section className="mx-auto w-full max-w-7xl px-4">
        <AllProductsCatalog />
        <div className="mt-10 text-center">
          <Link href="/get-quote" className="text-sm font-semibold text-primary hover:underline">
            Need custom work? Request a quote
          </Link>
        </div>
      </section>
    </main>
  );
}
