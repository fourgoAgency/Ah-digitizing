"use client";

import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/data/products";

export type SortOption = "relevance" | "price-low-to-high" | "price-high-to-low";

type AllProductsGridProps = {
  filteredProducts: Product[];
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onClearAll: () => void;
};

export default function AllProductsGrid({
  filteredProducts,
  sortOption,
  onSortChange,
  onClearAll,
}: AllProductsGridProps) {
  return (
    <div >
      <div className="rounded-md border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-products" className="text-sm font-medium text-gray-700">
              Sort by
            </label>
            <select
              id="sort-products"
              value={sortOption}
              onChange={(event) => onSortChange(event.target.value as SortOption)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

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
            onClick={onClearAll}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}







