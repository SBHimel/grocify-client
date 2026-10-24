"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  MapPin,
  Phone,
  User,
  Truck,
  CheckCircle2,
  ChevronLeft,
  Package,
  AlertCircle,
} from "lucide-react";
import type { CustomerOrder } from "@/types";
import { validateProductUnitConversion } from "@/lib/unit-validation";
import { formatBDT } from "@/lib/currency";

// ─── Status badge helpers ────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  pending: { label: "Pending", bg: "#fefce8", color: "#854d0e" },
  confirmed: { label: "Confirmed", bg: "#eff6ff", color: "#1d4ed8" },
  preparing: { label: "Preparing", bg: "#f0fdf4", color: "#15803d" },
  out_for_delivery: { label: "Out for Delivery", bg: "#fff7ed", color: "#c2410c" },
  delivered: { label: "Delivered", bg: "#f0fdf4", color: "#14532d" },
  cancelled: { label: "Cancelled", bg: "#fef2f2", color: "#b91c1c" },
};

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, totalCount, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    customerName: session?.user?.name || "",
    customerPhone: "",
    deliveryAddress: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<CustomerOrder | null>(null);

  const totalAmount = Math.round((subtotal + deliveryFee) * 100) / 100;
  const FREE_DELIVERY_THRESHOLD = 35;

  const invalidUnitItems = items.filter(
    (item) => !validateProductUnitConversion(item.product.name, item.product.unit).isValid
  );

  // A valid MongoDB ObjectId is exactly 24 hex characters
  const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
  const invalidIdItems = items.filter((item) => !OBJECT_ID_RE.test(item.product.id));

  // ── if cart is empty and order not placed ──
  if (!placedOrder && totalCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24 px-4" style={{ background: "#FDFBF7" }}>
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "#f0fdf4" }}
          >
            <ShoppingCart className="w-10 h-10" style={{ color: "#14532d" }} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some fresh groceries before checking out.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
          >
            Browse Fresh Catalog
          </Link>
        </div>
      </div>
    );
  }

  // ── Order placed success view ──
  if (placedOrder) {
    const statusCfg = STATUS_CONFIG[placedOrder.status] || STATUS_CONFIG.pending;
    return (
      <div className="min-h-screen py-12 px-4" style={{ background: "#FDFBF7" }}>
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#dcfce7" }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: "#14532d" }} />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Order Placed! 🎉</h1>
            <p className="text-gray-500 mt-1">
              We&apos;ve received your order and will prepare it shortly.
            </p>
          </div>

          <div
            className="bg-white rounded-3xl border p-6 shadow-sm space-y-4"
            style={{ borderColor: "#e5dbc7" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-gray-900 text-sm">Order Number</span>
              <span className="font-mono text-sm font-bold" style={{ color: "#14532d" }}>
                {placedOrder.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-black text-gray-900 text-sm">Status</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-black text-gray-900 text-sm">Payment</span>
              <span className="text-sm text-gray-700 font-semibold">Cash on Delivery</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-black text-gray-900 text-sm">Total</span>
              <span className="text-lg font-black" style={{ color: "#14532d" }}>
                {formatBDT(placedOrder.totalAmount)}
              </span>
            </div>
            <div className="pt-2 border-t" style={{ borderColor: "#f3ede0" }}>
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Delivering to:</strong> {placedOrder.deliveryAddress}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/buyer/orders"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
            >
              <Package className="w-4 h-4" />
              View My Orders
            </Link>
            <Link
              href="/products"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold border transition-all hover:bg-gray-50"
              style={{ borderColor: "#e5dbc7", color: "#374151" }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout form ──
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to place an order.");
      router.push("/signin?from=/checkout");
      return;
    }

    if ((session.user as { role?: string }).role !== "customer") {
      toast.error("Only customer accounts can place orders.");
      return;
    }

    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!form.customerPhone.trim() || !/^\+?[\d\s\-()]{7,20}$/.test(form.customerPhone.trim())) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!form.deliveryAddress.trim() || form.deliveryAddress.trim().length < 10) {
      toast.error("Delivery address must be at least 10 characters.");
      return;
    }

    // Validate that all products have a real MongoDB ObjectId (not mock/stale data)
    if (invalidIdItems.length > 0) {
      toast.error(
        `Your cart contains stale items ("${invalidIdItems[0].product.name}") that are no longer linked to real products. Please clear your cart and add fresh items from the shop.`
      );
      return;
    }

    // Validate that each product has a valid, defined unit conversion
    for (const item of items) {
      const check = validateProductUnitConversion(item.product.name, item.product.unit);
      if (!check.isValid) {
        toast.error(check.message || "Invalid product unit conversion.");
        return;
      }
    }

    setSubmitting(true);
    const toastId = toast.loading("Placing your order…");

    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        notes: form.notes.trim() || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as { success: boolean; data?: CustomerOrder; message?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to place order.");
      }

      toast.success("Order placed successfully! 🎉", { id: toastId });
      clearCart();
      setPlacedOrder(data.data!);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#FDFBF7" }}>
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors"
          style={{ color: "#14532d" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-black text-gray-950 mb-8 tracking-tight">Checkout</h1>

        {!session?.user && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl border mb-6"
            style={{ background: "#fefce8", borderColor: "#fde047" }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#854d0e" }} />
            <p className="text-sm" style={{ color: "#854d0e" }}>
              <strong>You&apos;re not signed in.</strong>{" "}
              <Link href="/signin?from=/checkout" className="underline font-bold">
                Sign in
              </Link>{" "}
              to place an order.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left: Checkout Form ── */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contact Details */}
              <div
                className="bg-white rounded-3xl border p-6 shadow-sm"
                style={{ borderColor: "#e5dbc7" }}
              >
                <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: "#14532d" }} />
                  Contact Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="customerName">
                      Full Name *
                    </label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      required
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="e.g. John Smith"
                      className="w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2"
                      style={{
                        borderColor: "#e5dbc7",
                        background: "#fdfbf7",
                        "--tw-ring-color": "#14532d40",
                      } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="customerPhone">
                      Phone Number *
                    </label>
                    <input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      required
                      value={form.customerPhone}
                      onChange={handleChange}
                      placeholder="e.g. +44 7911 123456"
                      className="w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2"
                      style={{
                        borderColor: "#e5dbc7",
                        background: "#fdfbf7",
                        "--tw-ring-color": "#14532d40",
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div
                className="bg-white rounded-3xl border p-6 shadow-sm"
                style={{ borderColor: "#e5dbc7" }}
              >
                <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: "#14532d" }} />
                  Delivery Address
                </h2>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  required
                  rows={3}
                  value={form.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Street, City, Postcode"
                  className="w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2 resize-none"
                  style={{
                    borderColor: "#e5dbc7",
                    background: "#fdfbf7",
                    "--tw-ring-color": "#14532d40",
                  } as React.CSSProperties}
                />
              </div>

              {/* Payment Method */}
              <div
                className="bg-white rounded-3xl border p-6 shadow-sm"
                style={{ borderColor: "#e5dbc7" }}
              >
                <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" style={{ color: "#14532d" }} />
                  Payment Method
                </h2>
                <div
                  className="flex items-center gap-3 p-4 rounded-xl border-2"
                  style={{ borderColor: "#14532d", background: "#f0fdf4" }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: "#14532d" }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#14532d" }} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives.</p>
                  </div>
                </div>
              </div>

              {/* Order Notes (optional) */}
              <div
                className="bg-white rounded-3xl border p-6 shadow-sm"
                style={{ borderColor: "#e5dbc7" }}
              >
                <h2 className="text-base font-black text-gray-900 mb-4">
                  Order Notes{" "}
                  <span className="text-xs font-medium text-gray-400">(optional)</span>
                </h2>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special delivery instructions…"
                  className="w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2 resize-none"
                  style={{
                    borderColor: "#e5dbc7",
                    background: "#fdfbf7",
                    "--tw-ring-color": "#14532d40",
                  } as React.CSSProperties}
                />
              </div>

              {/* Mobile submit (visible below lg) */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={submitting || !session?.user || invalidUnitItems.length > 0 || invalidIdItems.length > 0}
                  className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
                >
                  {submitting ? "Placing Order…" : `Place Order · ${formatBDT(totalAmount)}`}
                </button>
              </div>
            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-3xl border p-6 shadow-sm sticky top-6"
              style={{ borderColor: "#e5dbc7" }}
            >
              <h2 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" style={{ color: "#14532d" }} />
                Order Summary
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#dcfce7", color: "#14532d" }}
                >
                  {totalCount} item{totalCount !== 1 ? "s" : ""}
                </span>
              </h2>

              {/* Items */}
              {invalidIdItems.length > 0 && (
                <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Stale Cart Items</p>
                      <p className="mt-0.5 leading-relaxed text-red-800">
                        {invalidIdItems.length === 1
                          ? `"${invalidIdItems[0].product.name}" is`
                          : `${invalidIdItems.length} items are`}{" "}
                        no longer linked to real products.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { clearCart(); router.push("/products"); }}
                    className="self-start text-xs font-bold underline text-red-700 hover:text-red-900 transition-colors"
                  >
                    Clear cart &amp; shop again →
                  </button>
                </div>
              )}
              {invalidUnitItems.length > 0 && (
                <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Incompatible Product Unit</p>
                    <p className="mt-0.5 leading-relaxed text-amber-800">
                      {validateProductUnitConversion(invalidUnitItems[0].product.name, invalidUnitItems[0].product.unit).message}
                    </p>
                    <p className="mt-1 font-semibold text-amber-700">
                      Please remove this item from your basket to submit your order.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start gap-3">
                    {item.product.images?.[0]?.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.images[0].trim()}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border"
                        style={{ borderColor: "#f3ede0" }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: "#f0fdf4" }}
                      >
                        <Package className="w-5 h-5" style={{ color: "#14532d" }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {formatBDT(item.product.retailPrice)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {formatBDT(item.product.retailPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div
                className="border-t pt-4 space-y-2"
                style={{ borderColor: "#f3ede0" }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-bold">
                    {deliveryFee === 0 ? (
                      <span style={{ color: "#14532d" }}>Free</span>
                    ) : (
                      formatBDT(deliveryFee)
                    )}
                  </span>
                </div>
                {subtotal < FREE_DELIVERY_THRESHOLD && (
                  <p className="text-xs text-gray-400">
                    Add {formatBDT(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery.
                  </p>
                )}
                <div
                  className="flex justify-between pt-3 border-t"
                  style={{ borderColor: "#f3ede0" }}
                >
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-xl" style={{ color: "#14532d" }}>
                    {formatBDT(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Desktop submit */}
              <button
                type="button"
                onClick={handleSubmit as unknown as React.MouseEventHandler}
                disabled={submitting || !session?.user || invalidUnitItems.length > 0 || invalidIdItems.length > 0}
                className="hidden lg:flex w-full mt-5 py-4 rounded-2xl font-black text-white text-base items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
              >
                <Phone className="w-4 h-4" />
                {submitting ? "Placing Order…" : "Place Order (COD)"}
              </button>

              {!session?.user && (
                <Link
                  href="/signin?from=/checkout"
                  className="flex w-full mt-3 py-3 rounded-2xl font-bold text-white text-sm items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "#374151" }}
                >
                  Sign In to Order
                </Link>
              )}

              <p className="text-center text-xs text-gray-400 mt-4">
                🔒 Your order is secure. Pay cash on delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
