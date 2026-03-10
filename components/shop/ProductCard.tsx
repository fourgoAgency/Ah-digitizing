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
  showDescription = true,
}: ProductCardProps) {
  const { openCart } = useCartSidebar();

  const imageWrapperClass =
    imageVariant === "largeSquare"
      ? "relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
      : "relative h-44 w-full overflow-hidden rounded-lg bg-gray-100";

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="z-20 rounded-2xl pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/70 via-5% to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Link href={`/shop/${product.slug}`} className="block">
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

      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="min-h-[3rem] text-base font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          <Button asChild className="h-8 rounded-md px-3 text-sm font-semibold">
            <button type="button" onClick={openCart}>
              Add to Cart
            </button>
          </Button>
        </div>
      </div>
    </article>
  );
}


