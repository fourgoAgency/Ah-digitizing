"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { ProductCategory, products } from "@/data/products";

type PriceFilter = "all" | "under-20" | "20-30" | "above-30";
type TurnaroundFilter = "all" | "fast";
type SortOption = "relevance" | "price-low-to-high" | "price-high-to-low";

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "All Prices" },
  { value: "under-20", label: "Under $20" },
  { value: "20-30", label: "$20 to $30" },
  { value: "above-30", label: "$30 & Above" },
];

function getMinimumHours(turnaround: string): number {
  const matchedHours = turnaround.match(/\d+/);
  return matchedHours ? Number(matchedHours[0]) : 0;
}

function matchesPrice(productPrice: number, priceFilter: PriceFilter): boolean {
  if (priceFilter === "all") return true;
  if (priceFilter === "under-20") return productPrice < 20;
  if (priceFilter === "20-30") return productPrice >= 20 && productPrice <= 30;
  return productPrice > 30;
}

function matchesTurnaround(turnaround: string, turnaroundFilter: TurnaroundFilter): boolean {
  if (turnaroundFilter === "all") return true;
  return getMinimumHours(turnaround) <= 8;
}

export default function AllProductsGrid() {
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [turnaroundFilter, setTurnaroundFilter] = useState<TurnaroundFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("relevance");

  const categoryOptions = useMemo(() => {
    const labels = new Map<ProductCategory, string>();
    for (const product of products) {
      if (!labels.has(product.category)) {
        labels.set(product.category, product.categoryLabel);
      }
    }

    return (Array.from(labels.entries()) as [ProductCategory, string][]).map(([slug, label]) => ({
      slug,
      label,
      count: products.filter((product) => product.category === slug).length,
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    let nextProducts = products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return (
        categoryMatch &&
        matchesPrice(product.price, priceFilter) &&
        matchesTurnaround(product.turnaround, turnaroundFilter)
      );
    });

    if (sortOption === "price-low-to-high") {
      nextProducts = [...nextProducts].sort((a, b) => a.price - b.price);
    }
    if (sortOption === "price-high-to-low") {
      nextProducts = [...nextProducts].sort((a, b) => b.price - a.price);
    }

    return nextProducts;
  }, [priceFilter, selectedCategories, sortOption, turnaroundFilter]);

  const activeFilterCount =
    selectedCategories.length + (priceFilter !== "all" ? 1 : 0) + (turnaroundFilter !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceFilter("all");
    setTurnaroundFilter("all");
    setSortOption("relevance");
  };

  const toggleCategory = (slug: ProductCategory) => {
    setSelectedCategories((previous) =>
      previous.includes(slug) ? previous.filter((item) => item !== slug) : [...previous, slug]
    );
  };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[270px_1fr]">
      <aside className="h-fit rounded-md border border-gray-200 bg-white lg:sticky lg:top-24">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-5 p-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Category</h3>
            <ul className="space-y-2">
              {categoryOptions.map((option) => (
                <li key={option.slug}>
                  <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(option.slug)}
                        onChange={() => toggleCategory(option.slug)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Price</h3>
            <ul className="space-y-2">
              {PRICE_OPTIONS.map((option) => (
                <li key={option.value}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="price-filter"
                      checked={priceFilter === option.value}
                      onChange={() => setPriceFilter(option.value)}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    {option.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Delivery</h3>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={turnaroundFilter === "fast"}
                onChange={() => setTurnaroundFilter((prev) => (prev === "fast" ? "all" : "fast"))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Fast turnaround (8 hours or less)
            </label>
          </div>
        </div>
      </aside>

      <div>
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
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} imageVariant="largeSquare" />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-sm text-gray-600">No products match your selected filters.</p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
