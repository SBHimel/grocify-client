import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, ChevronRight, Clock } from "lucide-react";
import type { CustomerOrder } from "@/types";
import { formatBDT } from "@/lib/currency";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your Grocify order history and track deliveries.",
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "#fefce8", color: "#854d0e" },
  confirmed: { label: "Confirmed", bg: "#eff6ff", color: "#1d4ed8" },
  preparing: { label: "Preparing", bg: "#f0fdf4", color: "#15803d" },
  out_for_delivery: { label: "Out for Delivery", bg: "#fff7ed", color: "#c2410c" },
  delivered: { label: "Delivered", bg: "#f0fdf4", color: "#14532d" },
  cancelled: { label: "Cancelled", bg: "#fef2f2", color: "#b91c1c" },
};

async function fetchMyOrders(token: string): Promise<CustomerOrder[]> {
  try {
    const serverUrl =
      process.env.SERVER_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "http://localhost:5000";
    const res = await fetch(`${serverUrl}/api/v1/orders?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json() as {
      success: boolean;
      data?: { orders: CustomerOrder[] };
    };
    return json.data?.orders || [];
  } catch {
    return [];
  }
}

export default async function BuyerOrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/signin?from=/dashboard/buyer/orders");
  }

  const tokenResult = await auth.api.getToken({ headers: await headers() });
  const token =
    typeof tokenResult === "string"
      ? tokenResult
      : typeof tokenResult === "object" &&
        tokenResult !== null &&
        "token" in tokenResult &&
        typeof tokenResult.token === "string"
      ? tokenResult.token
      : null;

  const orders = token ? await fetchMyOrders(token) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length === 0 ? "No orders yet." : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
        >
          <ShoppingCart className="w-4 h-4" />
          Shop Again
        </Link>
      </div>

      {orders.length === 0 ? (
        <div
          className="text-center py-16 rounded-3xl border"
          style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#dcfce7" }}
          >
            <Package className="w-8 h-8" style={{ color: "#14532d" }} />
          </div>
          <h2 className="text-lg font-black text-gray-900 mb-2">No orders yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            Start shopping for fresh groceries and your orders will appear here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
          >
            Browse Fresh Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: "#e5dbc7" }}
              >
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "#f0fdf4" }}
                  >
                    <Package className="w-6 h-6" style={{ color: "#14532d" }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-black text-gray-900 text-sm font-mono">
                        {order.orderNumber}
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {date} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} · COD
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{order.deliveryAddress}</p>
                  </div>

                  {/* Total & link */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-base font-black" style={{ color: "#14532d" }}>
                        {formatBDT(order.totalAmount)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Item preview strip */}
                <div
                  className="px-5 pb-4 pt-0 flex flex-wrap gap-1.5"
                  style={{ borderTop: "1px solid #f3ede0" }}
                >
                  {order.items.slice(0, 4).map((item, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "#f0fdf4", color: "#166534" }}
                    >
                      {item.quantity}× {item.productName}
                    </span>
                  ))}
                  {order.items.length > 4 && (
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "#f3ede0", color: "#6b7280" }}
                    >
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
