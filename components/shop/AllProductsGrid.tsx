"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { ProductCategory, categoryTabs, products } from "@/data/products";

type FilterSlug = "all-products" | ProductCategory;

export default function AllProductsGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterSlug>("all-products");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all-products") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {categoryTabs.map((tab) => {
          const isActive = activeFilter === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setActiveFilter(tab.slug as FilterSlug)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} imageVariant="largeSquare" />
        ))}
      </div>
    </>
  );
}
