"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/data/products";

export type SortOption = "relevance" | "price-low-to-high" | "price-high-to-low";

type AllProductsGridProps = {
  filteredProducts: Product[];
  onClearAllAction: () => void;
};

export default function AllProductsGrid({
  filteredProducts,
  onClearAllAction,
}: AllProductsGridProps) {
  
  // 🔥 responsive items per row detect
  const getItemsPerRow = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth >= 1536) return 5; // 2xl
    if (window.innerWidth >= 1280) return 4; // xl
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2;  // md
    return 1; // mobile
  };

  return (
    <div>
      <h1 className="text-5xl font-black text-secondary text-center mt-4">
        All Products
      </h1>

      <p className="mb-6 mt-3 text-gray-600 text-center">
        Browse our complete catalog of ready-to-order digitizing and vector services.
      </p>

      {/* 🔥 GRID WITH ANIMATION */}
      <div className="mt-5 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredProducts.map((product, index) => {
          const itemsPerRow = getItemsPerRow();

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: Math.floor(index / itemsPerRow) * 0.15, // 😈 row-wise delay
              }}
            >
              <ProductCard
                product={product}
                imageVariant="largeSquare"
              />
            </motion.div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">
            No products match your selected filters.
          </p>

          <button
            type="button"
            onClick={onClearAllAction}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
