"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products, formatPrice } from "@/data/products";

type CartLine = {
  product: (typeof products)[number];
  qty: number;
};

const initialItems: CartLine[] = [
  { product: products[0], qty: 1 },
  { product: products[2], qty: 2 },
].filter((item) => item.product);

export default function CartPage() {
  const [items, setItems] = useState<CartLine[]>(initialItems);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [items]
  );
  const total = subtotal;

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

  return (
    <main className="bg-[#f1f2f4] pb-16">
      <section className="mx-auto w-full max-w-7xl px-4 pt-10">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Cart
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            </div>
            <Link
              href="/shop"
              className="rounded-full border cursor-pointer border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-32">
                    <Image
                      src={item.product.heroImage}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 180px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product.categoryLabel}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-gray-400">
                          Qty {item.qty}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(item.product.price * item.qty)}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                        <button
                          type="button"
                          className="h-7 w-7 cursor-pointer rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                          aria-label="Decrease quantity"
                          onClick={() => decreaseQty(item.product.id)}
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-gray-700">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="h-7 w-7 cursor-pointer rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                          aria-label="Increase quantity"
                          onClick={() => increaseQty(item.product.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-semibold cursor-pointer text-gray-500 transition hover:text-gray-900"
                        onClick={() => deleteItem(item.product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
                  Your cart is empty. Browse the shop to add items.
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Processing</span>
                  <span className="font-semibold text-gray-900">$0.00</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="block rounded-full bg-primary px-4 py-2 cursor-pointer text-center text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/get-free-quote"
                  className="block rounded-full border border-primary cursor-pointer px-4 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Request Free Quote
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

