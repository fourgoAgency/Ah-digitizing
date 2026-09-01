"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/orders", label: "Shop Orders" },
  { href: "/admin/orders/get-quote", label: "Order Form" },
  { href: "/admin/orders/get-free-quote", label: "Quote Requests" },
] as const;

export function OrdersSubNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-5 flex flex-wrap gap-2 rounded-md bg-white p-2 shadow-sm ring-1 ring-slate-100">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
