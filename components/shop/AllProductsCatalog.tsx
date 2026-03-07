"use client";

import { useMemo, useState } from "react";
import AllProductsFilter from "@/components/shop/AllProductsFilter";
import AllProductsGrid, { SortOption } from "@/components/shop/AllProductsGrid";
import { ProductCategory, products } from "@/data/products";

type SubcategoryDefinition = {
  label: string;
  href: string;
  category: ProductCategory;
};

type FilterSubcategoryOption = {
  label: string;
  href: string;
  count: number;
};

const EMBROIDERY_ITEMS: SubcategoryDefinition[] = [
  { label: "Logo Embroidery Digitizing", href: "/services/embroidery/logo", category: "embroidery-digitizing" },
  {
    label: "Left Chest Embroidery Digitizing",
    href: "/services/embroidery/left-chest",
    category: "embroidery-digitizing",
  },
  { label: "Cap Embroidery Digitizing", href: "/services/embroidery/cap", category: "embroidery-digitizing" },
  { label: "3D Puff Embroidery Digitizing", href: "/services/embroidery/3d-puff", category: "embroidery-digitizing" },
  { label: "Jacket Embroidery Digitizing", href: "/services/embroidery/jacket", category: "embroidery-digitizing" },
  { label: "Applique Embroidery Digitizing", href: "/services/embroidery/applique", category: "embroidery-digitizing" },
  { label: "Image Embroidery Digitizing", href: "/services/embroidery/image", category: "embroidery-digitizing" },
  { label: "Towel Embroidery Digitizing", href: "/services/embroidery/towel", category: "embroidery-digitizing" },
];

const SUBCATEGORY_OPTIONS: SubcategoryDefinition[] = [...EMBROIDERY_ITEMS];

export default function AllProductsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const categoryOptions = useMemo(() => {
    const labels = new Map<ProductCategory, string>();
    for (const product of products) {
      if (!labels.has(product.category)) {
        labels.set(product.category, product.categoryLabel);
      }
    }

    return (Array.from(labels.entries()) as [ProductCategory, string][])
      .filter(([slug]) => slug !== "vector-conversion")
      .map(([slug, label]) => ({
        slug,
        label,
        count: products.filter((product) => product.category === slug).length,
      }));
  }, []);

  const subcategoryOptions = useMemo<FilterSubcategoryOption[]>(() => {
    const baseOptions =
      selectedCategories.length === 0
        ? SUBCATEGORY_OPTIONS
        : SUBCATEGORY_OPTIONS.filter((option) => selectedCategories.includes(option.category));

    return baseOptions.map((option) => ({
      href: option.href,
      label: option.label,
      count: products.filter((product) => product.category === option.category).length,
    }));
  }, [selectedCategories]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    let nextProducts = products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const subcategoryMatch =
        selectedSubcategories.length === 0 ||
        selectedSubcategories.some((subcategoryHref) => {
          const option = SUBCATEGORY_OPTIONS.find((item) => item.href === subcategoryHref);
          return option ? option.category === product.category : false;
        });
      const searchMatch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.categoryLabel.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      return categoryMatch && subcategoryMatch && searchMatch;
    });

    if (sortOption === "price-low-to-high") {
      nextProducts = [...nextProducts].sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-high-to-low") {
      nextProducts = [...nextProducts].sort((a, b) => b.price - a.price);
    }

    return nextProducts;
  }, [searchQuery, selectedCategories, selectedSubcategories, sortOption]);

  const activeFilterCount = selectedCategories.length + selectedSubcategories.length + (searchQuery.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSortOption("relevance");
  };

  const toggleCategory = (slug: ProductCategory) => {
    setSelectedCategories((previous) =>
      previous.includes(slug) ? previous.filter((item) => item !== slug) : [...previous, slug]
    );
  };

  const toggleSubcategory = (slug: string) => {
    setSelectedSubcategories((previous) =>
      previous.includes(slug) ? previous.filter((item) => item !== slug) : [...previous, slug]
    );
  };

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Shop</p>
      <h1 className="mt-2 text-4xl font-bold text-gray-900">All Products</h1>
      <p className="mt-3 max-w-2xl text-gray-600">
        Browse our complete catalog of ready-to-order digitizing and vector services.
      </p>

      <section className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <AllProductsFilter
          activeFilterCount={activeFilterCount}
          searchQuery={searchQuery}
          categoryOptions={categoryOptions}
          selectedCategories={selectedCategories}
          selectedSubcategories={selectedSubcategories}
          subcategoryOptions={subcategoryOptions}
          onSearchChange={setSearchQuery}
          onClearAll={clearAllFilters}
          onToggleCategory={toggleCategory}
          onToggleSubcategory={toggleSubcategory}
        />

        <AllProductsGrid
          filteredProducts={filteredProducts}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onClearAll={clearAllFilters}
        />
      </section>
    </>
  );
}
