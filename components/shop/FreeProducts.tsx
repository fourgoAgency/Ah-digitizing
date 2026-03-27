"use client";

import ShopProductSection from "@/components/shop/ShopProductSection";
import { products } from "@/data/products";

const freeProducts = [...products].sort((a, b) => a.price - b.price).slice(0, 10);

export default function FreeProducts() {
  return (
    <ShopProductSection
      title="Free Products"
      description="A lightweight collection of our most budget-friendly product designs, surfaced here as a quick-pick starter set."
      products={freeProducts}
    />
  );
}
