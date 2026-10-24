import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { CustomerOrder } from "@/types";
import OrderFulfillmentDashboard from "@/components/dashboard/seller/OrderFulfillmentDashboard";

export const metadata: Metadata = {
  title: "Order Fulfillment",
  description: "Fulfill customer COD orders, track delivery stages, and manage order lifecycles.",
};

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

async function fetchAllOrders(token: string): Promise<CustomerOrder[]> {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/orders?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = (await res.json()) as {
      success: boolean;
      data?: { orders: CustomerOrder[] };
    };

    return json.data?.orders || [];
  } catch (error) {
    console.error("Failed to fetch orders on server:", error);
    return [];
  }
}

export default async function SellerOrdersPage() {
  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });

  if (!session?.user) {
    redirect("/signin?from=/dashboard/seller/orders");
  }

  const role = (session.user.role || "customer").toLowerCase();

  // Guard: Accessible to owner, manager, worker, seller, admin
  if (
    role !== "owner" &&
    role !== "manager" &&
    role !== "worker" &&
    role !== "seller" &&
    role !== "admin"
  ) {
    redirect("/");
  }

  const tokenResult = await auth.api.getToken({ headers: sessionHeaders }).catch(() => null);
  const token =
    typeof tokenResult === "string"
      ? tokenResult
      : typeof tokenResult === "object" &&
        tokenResult !== null &&
        "token" in tokenResult &&
        typeof tokenResult.token === "string"
      ? tokenResult.token
      : null;

  const initialOrders = token ? await fetchAllOrders(token) : [];

  return (
    <OrderFulfillmentDashboard
      initialOrders={initialOrders}
      userRole={role}
    />
  );
}
