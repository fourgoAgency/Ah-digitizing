import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/data/products";

export type TurnaroundFilter = "all" | "fast";

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
  categoryOptions: CategoryOption[];
  selectedCategories: ProductCategory[];
  selectedSubcategories: string[];
  subcategoryOptions: SubcategoryOption[];
  turnaroundFilter: TurnaroundFilter;
  onClearAll: () => void;
  onToggleCategory: (slug: ProductCategory) => void;
  onToggleSubcategory: (slug: string) => void;
  onToggleTurnaround: () => void;
};

export default function AllProductsFilter({
  activeFilterCount,
  categoryOptions,
  selectedCategories,
  selectedSubcategories,
  subcategoryOptions,
  turnaroundFilter,
  onClearAll,
  onToggleCategory,
  onToggleSubcategory,
  onToggleTurnaround,
}: AllProductsFilterProps) {
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  const visibleSubcategories = useMemo(
    () => (showAllSubcategories ? subcategoryOptions : subcategoryOptions.slice(0, 7)),
    [showAllSubcategories, subcategoryOptions]
  );

  const hasMoreSubcategories = subcategoryOptions.length > 7;

  return (
    <aside className="h-fit p-3 rounded-md border border-gray-200 bg-primary lg:sticky lg:top-24 lg:left-[calc((100vw-100%)/-2)]">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-white hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

        <div>
          <h3 className="mb-2 mt-2 text-sm font-semibold text-white">Category</h3>
          <ul className="space-y-2">
            {categoryOptions.map((option) => (
              <li key={option.slug}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-100">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(option.slug)}
                      onChange={() => onToggleCategory(option.slug)}
                      className="h-4 w-4 rounded border-gray-300 text-white focus:ring-primary"
                    />
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-100">({option.count})</span>
                </label>
              </li>
            ))}
          </ul>

          <h3 className="mb-2 mt-4 text-sm font-semibold text-white">Sub Category</h3>
          <ul className="space-y-2">
            {visibleSubcategories.map((option) => (
              <li key={option.href}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-100">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(option.href)}
                      onChange={() => onToggleSubcategory(option.href)}
                      className="h-4 w-4 rounded border-gray-300 text-white focus:ring-primary"
                    />
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-100">({option.count})</span>
                </label>
              </li>
            ))}
          </ul>
          {hasMoreSubcategories && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAllSubcategories((previous) => !previous)}
              className="mt-3 border-white bg-white text-primary hover:bg-white/90 hover:text-primary"
            >
              {showAllSubcategories ? "Less" : "View all"}
            </Button>
          )}
        </div>

        <div className="border-t border-gray-200 mt-3 pt-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Delivery</h3>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-100">
            <input
              type="checkbox"
              checked={turnaroundFilter === "fast"}
              onChange={onToggleTurnaround}
              className="h-4 w-4 rounded border-gray-300 text-white focus:ring-primary"
            />
            Fast turnaround (8 hours or less)
          </label>
        </div>
    </aside>
  );
}
