"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/data/products";
import { useCartSidebar } from "@/components/shop/CartSidebarContext";
// REUSE: Only import your custom abstractions from firebase.ts
import {
  createDocument,
  updateDocument,
  getProductDocument,
  fetchActiveCoupon,
  getServerTimestamp
} from "@/lib/firebase";

type PaymentMethod = "card" | "paypal";

export default function CheckoutPage() {
  const { items, clearCart } = useCartSidebar();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [couponCode, setCouponCode] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // SECURE: Track verified server prices
  const [verifiedPrices, setVerifiedPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);

  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    deliveryEmail: "",
    instructions: "",
  });

  // SECURE: Verify pricing using the reusable `getProductDocument` wrapper
  useEffect(() => {
    async function fetchVerifiedPrices() {
      if (items.length === 0) {
        setLoadingPrices(false);
        return;
      }
      try {
        const pricesMap: Record<string, number> = {};

        await Promise.all(
          items.map(async (item) => {
            const productData = await getProductDocument(String(item.product.id));
            if (productData) {
              pricesMap[item.product.id] = productData.price;
            } else {
              pricesMap[item.product.id] = item.product.price; // Fallback
            }
          })
        );

        setVerifiedPrices(pricesMap);
      } catch (err) {
        console.error("Secure pricing verification failed:", err);
      } finally {
        setLoadingPrices(false);
      }
    }

    fetchVerifiedPrices();
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const actualPrice = verifiedPrices[item.product.id] ?? item.product.price;
      return sum + actualPrice * item.qty;
    }, 0);
  }, [items, verifiedPrices]);

  const total = useMemo(() => {
    if (!appliedCoupon) return subtotal;
    const discountVal = parseFloat(appliedCoupon.discountValue) || 0;
    if (appliedCoupon.type === "percentage") {
      return Math.max(0, subtotal - (subtotal * discountVal) / 100);
    } else {
      return Math.max(0, subtotal - discountVal);
    }
  }, [subtotal, appliedCoupon]);

  // REUSE: Check coupons with your custom reusable abstraction
  async function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setApplyingCoupon(true);
    setCouponError(null);

    try {
      const couponData = await fetchActiveCoupon(couponCode.trim());

      if (!couponData) {
        setCouponError("Invalid or expired coupon code.");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(couponData);
      setCouponError(null);
    } catch (error) {
      setCouponError("Error checking coupon. Please try again.");
    }
  }

  async function handlePlaceOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setStatusMessage("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    setStatusMessage(null);

    try {
      // SECURE DOUBLE CHECK: Verify data row snapshots again on execution
      const finalItems = await Promise.all(
        items.map(async (item) => {
          const productData = await getProductDocument(String(item.product.id));
          const truePrice = productData ? productData.price : item.product.price;

          return {
            productId: item.product.id,
            slug: item.product.slug,
            title: item.product.title,
            price: truePrice,
            qty: item.qty,
            lineTotal: truePrice * item.qty,
            image: item.product.heroImage,
          };
        })
      );

      const finalSubtotal = finalItems.reduce((sum, item) => sum + item.lineTotal, 0);
      let finalTotal = finalSubtotal;

      if (appliedCoupon) {
        const discountVal = parseFloat(appliedCoupon.discountValue) || 0;
        if (appliedCoupon.type === "percentage") {
          finalTotal = Math.max(0, finalSubtotal - (finalSubtotal * discountVal) / 100);
        } else {
          finalTotal = Math.max(0, finalSubtotal - discountVal);
        }
      }

      const orderNo = `WS${String(Math.floor(100000 + Math.random() * 900000))}`;
      const customerName = `${customerDetails.firstName} ${customerDetails.lastName}`.trim();

      // REUSE: Custom update usage handler from firebase.ts
      if (appliedCoupon) {
        const currentUsage = parseInt(appliedCoupon.usage) || 0;
        await updateDocument("coupons", appliedCoupon.id, {
          usage: currentUsage + 1,
        });
      }

      // REUSE: Create database records securely via helper
      const orderId = await createDocument("orders", {
        orderNo,
        customerName,
        customerEmail: customerDetails.email,
        company: customerDetails.company || null,
        deliveryEmail: customerDetails.deliveryEmail || customerDetails.email,
        instructions: customerDetails.instructions || null,
        paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Ready",
        subtotal: finalSubtotal,
        total: finalTotal,
        couponApplied: appliedCoupon ? { id: appliedCoupon.id, code: appliedCoupon.code, discountValue: appliedCoupon.discountValue } : null,
        items: finalItems,
        createdAt: getServerTimestamp(),
        updatedAt: getServerTimestamp(),
      });

      try {
        await fetch("/api/order/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "order_placed",
            orderId,
            customerEmail: customerDetails.email,
            orderType: paymentMethod,
          }),
        });
      } catch {
        // Notification failure protection fallback
      }

      clearCart();
      setAppliedCoupon(null);
      setCouponCode("");
      setCustomerDetails({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        deliveryEmail: "",
        instructions: "",
      });
      setStatusMessage(`Thank you! Your order ${orderNo} has been placed.`);
    } catch (error) {
      console.error("Checkout process pipeline error:", error);
      setStatusMessage("We could not complete your layout transaction.");
    } finally {
      setPlacingOrder(false);
    }
  }

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
              className="rounded-full border border-primary px-5 py-2 text-sm font-semibold cursor-pointer text-primary transition hover:bg-primary hover:text-white"
            >
              Back to Cart
            </Link>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            {loadingPrices ? (
              <div className="flex h-64 items-center justify-center sm:col-span-2">
                <p className="text-sm text-gray-500 font-medium">Verifying dynamic server pricing schema...</p>
              </div>
            ) : (
              <>
                <form className="space-y-8" onSubmit={handlePlaceOrder}>
                  {/* Customer Details */}
                  <div className="rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                        <input
                          required
                          type="text"
                          value={customerDetails.firstName}
                          onChange={(event) => setCustomerDetails((current) => ({ ...current, firstName: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                          placeholder="eg: Jason"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                        <input
                          required
                          type="text"
                          value={customerDetails.lastName}
                          onChange={(event) => setCustomerDetails((current) => ({ ...current, lastName: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                          placeholder="eg: Smith"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                          required
                          type="email"
                          value={customerDetails.email}
                          onChange={(event) => setCustomerDetails((current) => ({ ...current, email: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                          placeholder="eg: you@example.com"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Company</label>
                        <input
                          type="text"
                          value={customerDetails.company}
                          onChange={(event) => setCustomerDetails((current) => ({ ...current, company: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                          placeholder="eg: AH Digitizing"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
                    <div className="mt-4 grid gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Delivery Email</label>
                        <input
                          type="email"
                          value={customerDetails.deliveryEmail}
                          onChange={(event) => setCustomerDetails((current) => ({ ...current, deliveryEmail: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                          placeholder="eg: delivery@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Instructions</label>
                        <textarea
                          rows={4}
                          value={customerDetails.instructions}
                          onChange={(event) => setCustomerDetails((current) => ({ ...current, instructions: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                          placeholder="eg: Thread choices, specific dimensions, formatting..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
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
                            placeholder="eg: 1234 5678 9012 3456"
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
                            placeholder="eg: 123"
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
                          Scan to complete configuration instantly.
                        </p>
                      </div>
                    )}
                  </div>

                  {statusMessage ? (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                      {statusMessage}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full rounded-full cursor-pointer bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {placingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                </form>

                <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                  <div className="mt-4 space-y-4">
                    {items.map((item) => {
                      const truePrice = verifiedPrices[item.product.id] ?? item.product.price;
                      return (
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
                            {formatPrice(truePrice * item.qty)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coupon section */}
                  <div className="mt-6 rounded-2xl border border-gray-200 p-4">
                    <label className="text-sm font-semibold text-gray-900">Coupon Code</label>
                    <div className="mt-3 flex gap-3">
                      <input
                        type="text"
                        value={couponCode}
                        disabled={!!appliedCoupon || applyingCoupon}
                        onChange={(event) => setCouponCode(event.target.value)}
                        placeholder={appliedCoupon ? `Applied: ${appliedCoupon.code}` : "Enter coupon code"}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary disabled:bg-gray-50 disabled:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(""); } : handleApplyCoupon}
                        disabled={applyingCoupon}
                        className="rounded-xl border cursor-pointer border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:opacity-50"
                      >
                        {applyingCoupon ? "..." : appliedCoupon ? "Remove" : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-xs font-semibold text-red-500">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="mt-2 text-xs font-semibold text-emerald-600">
                        Success! Discount applied.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>
                          -{appliedCoupon.type === "percentage"
                            ? `${appliedCoupon.discountValue}%`
                            : formatPrice(parseFloat(appliedCoupon.discountValue))}
                        </span>
                      </div>
                    )}
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
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}