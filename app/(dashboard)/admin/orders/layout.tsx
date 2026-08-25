import type { ReactNode } from "react";
import { OrdersSubNav } from "./components/OrdersSubNav";
import { OrdersToolbar } from "./components/OrdersToolbar";

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-[#f5f6fb] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">Orders</h1>
            <p className="mt-1 text-xs font-medium text-slate-500">Manage shop orders and quote requests in one place.</p>
          </div>
        </header>

        <OrdersSubNav />
        <OrdersToolbar />

        {children}
      </div>
    </div>
  );
}
