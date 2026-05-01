"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartSidebar } from "@/components/shop/CartSidebarContext";
import { formatPrice, Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  imageVariant?: "default" | "largeSquare";
  showDescription?: boolean;
  showSoldBadge?: boolean;
};

export default function ProductCard({
  product,
  imageVariant = "default",
  showSoldBadge = false,
}: ProductCardProps) {
  const { openCart, addItem } = useCartSidebar();
  const soldLabel = `${product.totalSold}+ sold`;

  const articleClass =
    imageVariant === "largeSquare"
      ? "group relative flex h-full min-h-[24rem] overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      : "group relative flex h-full min-h-[22rem] overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm";

  const restImageClass =
    imageVariant === "largeSquare"
      ? "absolute inset-x-4 top-4 bottom-36 z-10 block overflow-hidden rounded-[1.25rem]"
      : "absolute inset-x-4 top-4 bottom-32 z-10 block overflow-hidden rounded-[1.25rem]";

  const hoverImageClass =
    imageVariant === "largeSquare"
      ? "absolute inset-x-4 top-2 bottom-36 pt-1 z-10 block overflow-hidden rounded-[1.25rem] "
      : "absolute inset-x-4 top-2 bottom-32 z-10 block overflow-hidden rounded-[1.25rem] ";

  return (
    <motion.article
      className={articleClass}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      style={{ boxShadow: "0 15px 35px rgba(0,0,0,0.08), 0 5px 15px rgba(0,0,0,0.05)" }}
    >
      {/* Hover glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{ boxShadow: "inset 0 0 0 1.5px rgba(99,102,241,0.6), 0 0 28px rgba(99,102,241,0.12)" }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 rounded-2xl bg-radial from-transparent via-5% to-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="absolute inset-0 transition-all duration-300 ease-out group-hover:translate-y-4 group-hover:opacity-0 group-focus-within:translate-y-3 group-focus-within:opacity-0">
            {showSoldBadge ? (
              <div className="absolute left-1/5 top-0 z-20 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md">
                {soldLabel}
              </div>
            ) : null}
        <Link href={`/shop/${product.slug}`} className={restImageClass}>
          <div className="relative h-full w-full bg-white cursor-pointer">
            <Image
              src={product.heroImage}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 20vw"
            />
          </div>
        </Link>

        <div className="absolute inset-x-4 bottom-4 z-20 rounded-[1.25rem] bg-white p-4">
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="cursor-pointer min-h-12 text-base font-semibold text-gray-900 line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
            <Button
              asChild
              className="h-8 rounded-md px-3 text-sm cursor-pointer font-semibold hover:bg-white/90 hover:text-primary hover:border-primary hover:border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <button
                type="button"
                onClick={() => {
                  addItem(product, 1);
                  openCart();
                }}
              >
                Add to Cart
              </button>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 translate-y-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <Link href={`/shop/${product.slug}`} className={hoverImageClass}>
          <div className="cursor-pointer relative h-full w-full">
            {showSoldBadge ? (
              <div className="absolute left-1/2 top-1 z-20 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md">
                {soldLabel}
              </div>
            ) : null}
            <Image
              src={product.heroImage}
              alt={product.title}
              fill
              className="object-contain transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 20vw"
            />
          </div>
        </Link>

        <div className="absolute inset-x-4 bottom-4 z-20 rounded-[1.25rem] bg-white/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="cursor-pointer min-h-12 text-base font-semibold text-gray-900 line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
            <Button asChild className="h-8 rounded-md px-3 text-sm font-semibold hover:bg-white/90 cursor-pointer hover:text-primary hover:border-primary hover:border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <button
                type="button"
                onClick={() => {
                  addItem(product, 1);
                  openCart();
                }}
              >
                Add to Cart
              </button>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
