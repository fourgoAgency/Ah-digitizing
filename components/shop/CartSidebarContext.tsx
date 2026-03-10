"use client";

import { createContext, useContext, useMemo, useState } from "react";
import CartSidebar from "@/components/shop/CartSidebar";

type CartSidebarContextValue = {
  openCart: () => void;
  closeCart: () => void;
};

const CartSidebarContext = createContext<CartSidebarContextValue | null>(null);

export function CartSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    }),
    []
  );

  return (
    <CartSidebarContext.Provider value={value}>
      {children}
      <CartSidebar open={open} onClose={() => setOpen(false)} />
    </CartSidebarContext.Provider>
  );
}

export function useCartSidebar() {
  const context = useContext(CartSidebarContext);
  if (!context) {
    throw new Error("useCartSidebar must be used within CartSidebarProvider");
  }
  return context;
}
