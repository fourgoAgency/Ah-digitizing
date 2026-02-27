import { Funnel, Search, SlidersHorizontal } from "lucide-react";
import { CustomDropdown } from "@/app/get-quote/components/CustomDropdown";

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
  const categoryOptions = ["All", "Embroidery", "Vector", "Reviews"];
  const sortOptions = ["Newest First", "Oldest First", "Title A-Z", "Title Z-A"];

  const sortLabelMap: Record<string, string> = {
    newest: "Newest First",
    oldest: "Oldest First",
    "title-asc": "Title A-Z",
    "title-desc": "Title Z-A",
  };

  const sortValueMap: Record<string, string> = {
    "Newest First": "newest",
    "Oldest First": "oldest",
    "Title A-Z": "title-asc",
    "Title Z-A": "title-desc",
  };

  return (
    <div className="rounded-2xl border border-[#dfe3ea] bg-white p-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-10">
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

        <div className="xl:col-span-3">
          <CustomDropdown
            id="blog-category-filter"
            placeholder="All Categories"
            options={categoryOptions}
            value={selectedCategory}
            allowTyping={false}
            onSelectAction={onCategoryChange}
          />
        </div>

        <div className="xl:col-span-3">
          <CustomDropdown
            id="blog-sort-filter"
            placeholder="Sort by"
            options={sortOptions}
            value={sortLabelMap[sortBy] ?? "Newest First"}
            allowTyping={false}
            onSelectAction={(label) => onSortChange(sortValueMap[label] ?? "newest")}
          />
        </div>
      </div>
    </div>
  );
}
