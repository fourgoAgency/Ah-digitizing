"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const filterOptions = ["all", "Paid", "Pending", "Ready", "Shipped", "Received", "Assigned to Designer", "Completed"] as const;

export function OrdersToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  function updateQuery(key: string, nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue && nextValue !== "all") params.set(key, nextValue);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <select value={searchParams.get("status") || "all"} onChange={(event) => updateQuery("status", event.target.value)} className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-500 outline-none focus:border-blue-500">
        {filterOptions.map((option) => <option key={option} value={option}>{option === "all" ? "Filter" : option}</option>)}
      </select>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
        <input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") updateQuery("q", value.trim()); }} placeholder="Search order ID or customer..." className="h-10 w-80 max-w-full rounded border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500" />
      </div>
      <button type="button" onClick={() => updateQuery("q", value.trim())} className="h-10 rounded bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">Search</button>
    </div>
  );
}