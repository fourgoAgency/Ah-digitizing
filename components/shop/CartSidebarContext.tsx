"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import CartSidebar from "@/components/shop/CartSidebar";
import type { Product } from "@/data/products";

export type CartLine = {
  product: Product;
  qty: number;
};

type CartSidebarContextValue = {
  openCart: () => void;
  closeCart: () => void;
  items: CartLine[];
  addItem: (product: Product, qty?: number) => void;
};

const CartSidebarContext = createContext<CartSidebarContextValue | null>(null);

export function CartSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartLine[]>([]);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { product, qty }];
    });
  }, []);

  const increaseQty = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }, []);

  const decreaseQty = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== id) return item;
        const nextQty = Math.max(1, item.qty - 1);
        return { ...item, qty: nextQty };
      })
    );
  }, []);

  const deleteItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      openCart,
      closeCart,
      items,
      addItem,
    }),
    [openCart, closeCart, items, addItem]
  );

  return (
    <CartSidebarContext.Provider value={value}>
      {children}
      <CartSidebar
        open={open}
        onClose={closeCart}
        items={items}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        deleteItem={deleteItem}
      />
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
