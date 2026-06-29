"use client";

import ShopProductSection from "@/components/shop/ShopProductSection";
import { Product } from "@/data/products";

type FreeProductsProps = {
  products: Product[];
};

export default function FreeProducts({ products }: FreeProductsProps) {
  const freeProducts = [...products].sort((a, b) => a.price - b.price).slice(0, 10);

  return (
    <ShopProductSection
      title="Free Products"
      description="A lightweight collection of our most budget-friendly product designs, surfaced here as a quick-pick starter set."
      products={freeProducts}
    />
  );
}
