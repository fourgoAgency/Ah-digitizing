"use client";

import { useMemo, useState } from "react";
import AllProductsFilter from "@/components/shop/AllProductsFilter";
import AllProductsGrid, { SortOption } from "@/components/shop/AllProductsGrid";
import BestSellingProducts from "@/components/shop/BestSellingProducts";
import BulkProducts from "@/components/shop/BulkProducts";
import FreeProducts from "@/components/shop/FreeProducts";
import {
  ProductCategory,
  products,
  shopCategoryDefinitions,
  shopSubcategoryDefinitions,
} from "@/data/products";

type FilterSubcategoryOption = {
  label: string;
  href: string;
  count: number;
};

export default function AllProductsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const categoryOptions = useMemo(() => {
    return shopCategoryDefinitions.map(({ slug, label }) => ({
      slug,
      label,
      count: products.filter((product) => product.category === slug).length,
    }));
  }, []);

  const subcategoryOptions = useMemo<FilterSubcategoryOption[]>(() => {
    const baseOptions =
      selectedCategories.length === 0
        ? []
        : shopSubcategoryDefinitions.filter((option) => selectedCategories.includes(option.category));

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
          const option = shopSubcategoryDefinitions.find((item) => item.href === subcategoryHref);
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
    setSelectedCategories((previous) => {
      const nextCategories = previous.includes(slug)
        ? previous.filter((item) => item !== slug)
        : [...previous, slug];

      setSelectedSubcategories((previousSubcategories) =>
        previousSubcategories.filter((subcategoryHref) => {
          const option = shopSubcategoryDefinitions.find((item) => item.href === subcategoryHref);
          return option ? nextCategories.includes(option.category) : false;
        })
      );

      return nextCategories;
    });
  };

  const toggleSubcategory = (slug: string) => {
    setSelectedSubcategories((previous) =>
      previous.includes(slug) ? previous.filter((item) => item !== slug) : [...previous, slug]
    );
  };

  return (
    <>
      <section className="mt-8 grid lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
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
        <section className="mb-6 flex flex-col gap-6">
        <BulkProducts />
        <FreeProducts />
        <BestSellingProducts />
        <AllProductsGrid
          filteredProducts={filteredProducts}
          onClearAllAction={clearAllFilters}
        />
        </section>
      </section>
    </>
  );
}



