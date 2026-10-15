import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Users,
  Package,
  Layers,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  User,
} from "lucide-react";
import Link from "next/link";
import { getProduct } from "@/lib/api/product";

export const metadata: Metadata = {
  title: "Owner Overview | Grocify Back-Office",
  description: "Executive control panel for Grocify owner.",
};

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

async function getStats(token?: string) {
  try {
    const productsRes = await getProduct(1, 1);
    const totalProducts = productsRes.totalCount || productsRes.data?.length || 0;

    let totalBatches = 0;
    let totalUsers = 0;

    if (token) {
      const [batchesRes, usersRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/v1/batches`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }).catch(() => null),
        fetch(`${SERVER_URL}/api/v1/users`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }).catch(() => null),
      ]);

      if (batchesRes?.ok) {
        const bJson = await batchesRes.json();
        totalBatches = Array.isArray(bJson.data) ? bJson.data.length : 0;
      }

      if (usersRes?.ok) {
        const uJson = await usersRes.json();
        totalUsers = Array.isArray(uJson.data) ? uJson.data.length : 0;
      }
    }

    return { totalProducts, totalBatches, totalUsers };
  } catch {
    return { totalProducts: 0, totalBatches: 0, totalUsers: 0 };
  }
}

export default async function AdminDashboardHomePage() {
  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });

  if (!session?.user) {
    redirect("/signin?from=/dashboard/admin");
  }

  const role = (session.user.role || "customer").toLowerCase();
  if (role !== "owner" && role !== "admin") {
    redirect("/");
  }

  const tokenResult = await auth.api.getToken({ headers: sessionHeaders }).catch(() => null);
  const token =
    typeof tokenResult === "string"
      ? tokenResult
      : typeof tokenResult === "object" && tokenResult && "token" in tokenResult
      ? (tokenResult as any).token
      : undefined;

  const stats = await getStats(token);

  const activeLinks = [
    {
      icon: Package,
      label: "Product Catalog",
      description: "Manage grocery products, unit conversions, and pricing.",
      href: "/dashboard/seller/products",
      accent: "#14532D",
      bg: "#f0fdf4",
    },
    {
      icon: Layers,
      label: "Batch Inventory",
      description: "Receive stock batches, FEFO allocation, and expiry inspection.",
      href: "/dashboard/seller/inventory",
      accent: "#0369a1",
      bg: "#eff6ff",
    },
    {
      icon: Users,
      label: "User & Role Management",
      description: "Manage staff assignments with Last-Owner protection.",
      href: "/dashboard/admin/users",
      accent: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      icon: User,
      label: "My Profile",
      description: "Manage your administrator account, photo, and password.",
      href: "/dashboard/profile",
      accent: "#b45309",
      bg: "#fffbeb",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <div
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2"
          style={{ background: "#f0fdf4", color: "#14532D" }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Owner Access
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
          Welcome back, {session.user.name?.split(" ")[0] || "Owner"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Executive management overview for Grocify. Real-time metrics from MongoDB.
        </p>
      </div>

      {/* KPI summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Catalog Products",
            value: stats.totalProducts,
            sub: "in MongoDB catalog",
            icon: Package,
            color: "#14532D",
            bg: "#f0fdf4",
          },
          {
            label: "Active Batches",
            value: stats.totalBatches,
            sub: "FEFO inventory lots",
            icon: Layers,
            color: "#0369a1",
            bg: "#eff6ff",
          },
          {
            label: "Total Users",
            value: stats.totalUsers,
            sub: "staff & customer accounts",
            icon: Users,
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border p-5 flex items-center justify-between shadow-sm"
            style={{ borderColor: "#e5dbc7" }}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {kpi.label}
              </p>
              <p className="text-2xl font-black mt-1" style={{ color: kpi.color }}>
                {kpi.value}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{kpi.sub}</p>
            </div>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: kpi.bg, color: kpi.color }}
            >
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick-access cards */}
      <div>
        <h2 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
          Management Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white rounded-2xl border p-5 flex items-start gap-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{ borderColor: "#e5dbc7" }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: link.bg, color: link.accent }}
              >
                <link.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
              </div>
              <ArrowRight
                className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                style={{ color: "#94a3b8" }}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Roadmap note */}
      <div
        className="flex items-start gap-3 p-4 rounded-2xl border text-xs"
        style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-bold">Planned Roadmap — Phase 7</p>
          <p className="font-normal mt-0.5 text-amber-800/80">
            Suppliers, purchases, supplier payments, customer orders, and financial reports are scheduled for the next phase.
          </p>
        </div>
      </div>
    </div>
  );
}
