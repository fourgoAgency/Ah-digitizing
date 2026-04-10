"use client";

import ShopProductSection from "@/components/shop/ShopProductSection";
import { products } from "@/data/products";

const bestSellingProducts = [...products]
  .sort((a, b) => b.price - a.price)
  .slice(0, 10);

export default function BestSellingProducts() {
  return (
    <ShopProductSection
      title="Top Selling Products"
      description="Browse ten standout products curated to feel like top performers, with stronger premium-value and feature-rich options."
      products={bestSellingProducts}
      showSoldBadge
    />
  );
}
