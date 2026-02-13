import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ShopHero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-8">
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200 px-6 py-16 text-white sm:px-10"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(5,10,68,0.82), rgba(10,33,192,0.25)), url('/home-page/portfolio-vector/1st.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <p className="text-sm uppercase tracking-[0.2em] text-white/90">AH Digitizing Shop</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold sm:text-5xl">
          Premium Digitizing and Vector Services
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/90 sm:text-base">
          Order professionally prepared embroidery digitizing, vector conversion, and custom patch
          files with fast turnaround and production-ready output.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-7">
            <Link href="/shop/all-products">All Products</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white bg-white/10 px-7 text-white hover:bg-white hover:text-primary">
            <Link href="/get-quote">Get Custom Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
