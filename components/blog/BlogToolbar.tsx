import { Funnel, Search, SlidersHorizontal } from "lucide-react";

type BlogToolbarProps = {
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
  onToggleSortDirection: () => void;
};

export default function BlogToolbar({
  searchTerm,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
  onToggleSortDirection,
}: BlogToolbarProps) {
  return (
    <div className="rounded-2xl border border-[#dfe3ea] bg-white p-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
        <label className="relative block xl:col-span-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-[#f8fafc] pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-primary"
          />
        </label>

        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-11 rounded-lg border border-[#dfe3ea] bg-[#f8fafc] px-3 text-sm text-slate-700 outline-none transition focus:border-primary xl:col-span-3"
        >
          <option value="All">All Categories</option>
          <option>Embroidery</option>
          <option>Vector</option>
          <option>Reviews</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-11 rounded-lg border border-[#dfe3ea] bg-[#f8fafc] px-5 text-sm text-slate-700 outline-none transition focus:border-primary xl:col-span-3"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>

        <div className="flex items-center justify-end gap-2 xl:col-span-2">
          <button
            type="button"
            aria-label="Reset filters"
            onClick={onReset}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#dfe3ea] bg-[#f8fafc] text-slate-500 transition hover:text-primary"
          >
            <Funnel className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Toggle sort direction"
            onClick={onToggleSortDirection}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#dfe3ea] bg-[#f8fafc] text-slate-500 transition hover:text-primary"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
