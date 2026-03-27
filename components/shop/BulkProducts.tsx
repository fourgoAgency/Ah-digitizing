"use client";

import ShopProductSection from "@/components/shop/ShopProductSection";
import { products } from "@/data/products";

const bulkProducts = products.slice(0, 10);

export default function BulkProducts() {
  return (
    <ShopProductSection
      title="Bulk Products"
      description="Explore a focused set of high-volume ready-to-order designs suited for repeat production and larger customer batches."
      products={bulkProducts}
    />
  );
}
