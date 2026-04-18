"use client";

import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/data/products";
import { motion, type Variants } from "framer-motion";

export type SortOption = "relevance" | "price-low-to-high" | "price-high-to-low";

type AllProductsGridProps = {
  filteredProducts: Product[];
  onClearAllAction: () => void;
};

// Each ROW fades in as a group when it scrolls into view
const rowVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

// Each CARD inside the row fades up individually (staggered by the row)
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Split a flat array into rows of `size`
function chunkArray<T>(arr: T[], size: number): T[][] {
  return arr.reduce<T[][]>((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
}

export default function AllProductsGrid({
  filteredProducts,
  onClearAllAction,
}: AllProductsGridProps) {
  // 5 columns max (matches your xl/2xl grid), so chunk by 5
  const rows = chunkArray(filteredProducts, 5);

  return (
    <div>
      <h1 className="text-5xl font-black text-secondary text-center mt-4">
        All Products
      </h1>
      <p className="mb-6 mt-3 text-gray-600 text-center">
        Browse our complete catalog of ready-to-order digitizing and vector services.
      </p>

      <div className="mt-5 space-y-6">
        {rows.map((row, rowIdx) => (
          <motion.div
            key={rowIdx}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            variants={rowVariants}
            initial="hidden"
            whileInView="show"
            // Each row triggers independently when it enters the viewport
            viewport={{ once: true, amount: 0.15 }}
          >
            {row.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} imageVariant="largeSquare" />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

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
