"use client";

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
  return (
    <div >
            <h1 className="text-5xl font-black text-secondary text-center mt-4">All Products</h1>
      <p className="mb-6 mt-3 text-gray-600 text-center">Browse our complete catalog of ready-to-order digitizing and vector services.</p>
      <div className="mt-5 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} imageVariant="largeSquare" />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">No products match your selected filters.</p>
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






