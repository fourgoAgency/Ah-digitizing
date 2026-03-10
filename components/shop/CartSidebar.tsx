"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { products, formatPrice } from "@/data/products";

type CartSidebarProps = {
  open: boolean;
  onClose: () => void;
};

type CartLine = {
  product: (typeof products)[number];
  qty: number;
};

const initialItems: CartLine[] = [
  { product: products[0], qty: 1 },
  { product: products[2], qty: 2 },
].filter((item) => item.product);

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const [items, setItems] = useState<CartLine[]>(initialItems);

  const increaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== id) return item;
        const nextQty = Math.max(1, item.qty - 1);
        return { ...item, qty: nextQty };
      })
    );
  };

  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [items]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-overlay"
            className="fixed inset-0 z-[120] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            key="cart-panel"
            className="fixed right-0 top-0 z-[130] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Your Cart
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  Items {items.length}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                aria-label="Close cart sidebar"
              >
                Close
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-xl border border-gray-200 p-3"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.product.heroImage}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.product.categoryLabel}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-gray-400">
                          Qty {item.qty}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
                        <button
                          type="button"
                          className="h-6 w-6 rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                          aria-label="Decrease quantity"
                          onClick={() => decreaseQty(item.product.id)}
                        >
                          -
                        </button>
                        <span className="min-w-[1.2rem] text-center text-xs font-semibold text-gray-700">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="h-6 w-6 rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                          aria-label="Increase quantity"
                          onClick={() => increaseQty(item.product.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-gray-500 transition hover:text-gray-900"
                        onClick={() => deleteItem(item.product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
                  Your cart is empty. Browse the shop to add items.
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/cart"
                  className="flex-1 rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                  onClick={onClose}
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
                  onClick={onClose}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

