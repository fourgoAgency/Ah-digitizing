import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/data/products";

type CategoryOption = {
  slug: ProductCategory;
  label: string;
  count: number;
};

type SubcategoryOption = {
  href: string;
  label: string;
  count: number;
};

type AllProductsFilterProps = {
  activeFilterCount: number;
  searchQuery: string;
  categoryOptions: CategoryOption[];
  selectedCategories: ProductCategory[];
  selectedSubcategories: string[];
  subcategoryOptions: SubcategoryOption[];
  onSearchChange: (value: string) => void;
  onClearAll: () => void;
  onToggleCategory: (slug: ProductCategory) => void;
  onToggleSubcategory: (slug: string) => void;
};

export default function AllProductsFilter({
  activeFilterCount,
  searchQuery,
  categoryOptions,
  selectedCategories,
  selectedSubcategories,
  subcategoryOptions,
  onSearchChange,
  onClearAll,
  onToggleCategory,
  onToggleSubcategory,
}: AllProductsFilterProps) {
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hasSelectedCategory = selectedCategories.length > 0;

  const visibleSubcategories = useMemo(
    () => (showAllSubcategories ? subcategoryOptions : subcategoryOptions.slice(0, 7)),
    [showAllSubcategories, subcategoryOptions]
  );

  const hasMoreSubcategories = subcategoryOptions.length > 7;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!hasSelectedCategory) setShowAllSubcategories(false);
  }, [hasSelectedCategory]);

  const filterContent = (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search Product...."
        className="w-full mt-3 rounded-md border border-gray-800 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
      />

      <h3 className="mb-2 mt-2 text-sm font-semibold text-black">Category</h3>
      <ul className="space-y-2">
        {categoryOptions.map((option) => (
          <li key={option.slug}>
            <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-800">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(option.slug)}
                  onChange={() => onToggleCategory(option.slug)}
                  className="h-4 w-4 rounded border-gray-800 text-black focus:ring-primary"
                />
                {option.label}
              </span>
              <span className="text-xs text-gray-800">({option.count})</span>
            </label>
          </li>
        ))}
      </ul>

      {hasSelectedCategory && (
        <>
          <h3 className="mb-2 mt-4 text-sm font-semibold text-black">Sub Category</h3>
          <ul className="space-y-2">
            {visibleSubcategories.map((option) => (
              <li key={option.href}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-800">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(option.href)}
                      onChange={() => onToggleSubcategory(option.href)}
                      className="h-4 w-4 rounded border-gray-800 text-black focus:ring-primary"
                    />
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-800">({option.count})</span>
                </label>
              </li>
            ))}
          </ul>
          {hasMoreSubcategories && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAllSubcategories((prev) => !prev)}
              className="mt-3 cursor-pointer border-white bg-primary text-white hover:bg-white/90 hover:shadow-2xl hover:text-primary hover:border-primary"
            >
              {showAllSubcategories ? "Less" : "View all"}
            </Button>
          )}
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <details className="w-full rounded-md border border-gray-200 bg-gray-200 p-3">
        <summary className="flex cursor-pointer items-center justify-between text-sm font-bold uppercase tracking-wide text-black list-none">
          <span>
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </span>
          <span className="text-gray-600 text-lg">&#8964;</span>
        </summary>

        <div className="border-t border-gray-300 mt-3 pt-1">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="mb-2 text-xs font-semibold cursor-pointer text-black hover:underline"
            >
              Clear all
            </button>
          )}
          {filterContent}
        </div>
      </details>
    );
  }

  return (
    <aside className="h-fit w-full max-w-[220px] p-3 rounded-md border border-gray-200 bg-gray-200 lg:sticky lg:top-24 lg:left-[calc((100vw-100%)/-2)] lg:w-[260px]">
      <div className="flex items-center justify-between border-b border-gray-200 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-black">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold cursor-pointer text-black hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      {filterContent}
    </aside>
  );
}