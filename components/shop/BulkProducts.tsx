"use client";

import ShopProductSection from "@/components/shop/ShopProductSection";
import { Product } from "@/data/products";

type BulkProductsProps = {
  products: Product[];
};

export default function BulkProducts({ products }: BulkProductsProps) {
  const bulkProducts = products.slice(0, 10);

  return (
    <ShopProductSection
      title="Bulk Products"
      description="Explore a focused set of high-volume ready-to-order designs suited for repeat production and larger customer batches."
      products={bulkProducts}
    />
  );
}
