"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartSidebar } from "@/components/shop/CartSidebarContext";
import { formatPrice, Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  imageVariant?: "default" | "largeSquare";
  showDescription?: boolean;
};

export default function ProductCard({
  product,
  imageVariant = "default",
}: ProductCardProps) {
  const { openCart, addItem } = useCartSidebar();

  const imageWrapperClass =
    imageVariant === "largeSquare"
      ? "relative aspect-square w-full overflow-hidden rounded-lg"
      : "relative h-44 w-full overflow-hidden rounded-lg";

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="z-0 rounded-2xl pointer-events-none absolute inset-0 bg-radial to-primary/30 via-5% from-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Link href={`/shop/${product.slug}`} className="relative z-10 block">
        <div className={imageWrapperClass}>
          <Image
            src={product.heroImage}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 20vw"
          />
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-gray-700">
            {product.categoryLabel}
          </span>
        </div>
      </Link>

      <div className="relative z-10 mt-4 flex flex-1 flex-col gap-2">
        <Link href={`/shop/${product.slug}`} className="relative z-10 block">
          <h3 className="min-h-12 text-base font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          <Button asChild className="h-8 rounded-md px-3 text-sm font-semibold">
            <button type="button" onClick={() => { addItem(product, 1); openCart(); }}>
              Add to Cart
            </button>
          </Button>
        </div>
      </div>
    </article>
  );
}






