"use client";
import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/data/products";

export type SortOption = "relevance" | "price-low-to-high" | "price-high-to-low";

type AllProductsGridProps = {
  filteredProducts: Product[];
  onClearAllAction: () => void;
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function AllProductsGrid({
  filteredProducts,
  onClearAllAction,
}: AllProductsGridProps) {
  return (
    <div>
      <h1 className="text-5xl font-black text-secondary text-center mt-4">
        All Products
      </h1>
      <p className="mb-6 mt-3 text-gray-600 text-center">
        Browse our complete catalog of ready-to-order digitizing and vector services.
      </p>

      <div className="mt-5 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <ProductCard product={product} imageVariant="largeSquare" />
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
            className="mt-3 cursor-pointer text-sm font-semibold text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
