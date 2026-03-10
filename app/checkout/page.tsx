"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, formatPrice } from "@/data/products";

const checkoutItems = [
  { product: products[0], qty: 1 },
  { product: products[2], qty: 2 },
].filter((item) => item.product);

type PaymentMethod = "card" | "paypal";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const total = subtotal;

  return (
    <main className="bg-[#f1f2f4] pb-16">
      <section className="mx-auto w-full max-w-7xl px-4 pt-10">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Checkout
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
            </div>
            <Link
              href="/cart"
              className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Back to Cart
            </Link>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <form className="space-y-8">
              <div className="rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Ali"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Khan"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Company</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                      placeholder="AH Digitizing"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
                <div className="mt-4 grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Delivery Email</label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                      placeholder="delivery@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Instructions</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Thread colors, sizes, format preferences..."
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                <div className="mt-4 grid gap-3">
                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    Credit / Debit Card
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                    />
                    PayPal
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Card Number</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">CCV</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="mt-5 rounded-2xl border border-dashed border-gray-200 p-4 text-center">
                    <p className="text-sm font-semibold text-gray-700">Scan PayPal QR</p>
                    <div className="mt-3 flex justify-center">
                      <Image
                        src="/checkout/paypal-qr.svg"
                        alt="PayPal QR"
                        width={180}
                        height={180}
                      />
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                      Open PayPal app and scan to complete payment.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Place Order
              </button>
            </form>

            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.product.heroImage}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-500">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.product.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 text-sm text-gray-600">
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
              <p className="mt-4 text-xs text-gray-500">
                We will confirm details by email before production begins.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
