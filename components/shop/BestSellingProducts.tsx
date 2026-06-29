"use client";

import ShopProductSection from "@/components/shop/ShopProductSection";
import { Product } from "@/data/products";

type BestSellingProductsProps = {
  products: Product[];
};

export default function BestSellingProducts({ products }: BestSellingProductsProps) {
  const bestSellingProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);

  return (
    <ShopProductSection
      title="Top Selling Products"
      description="Browse ten standout products curated to feel like top performers, with stronger premium-value and feature-rich options."
      products={bestSellingProducts}
      showSoldBadge
    />
  );
}
