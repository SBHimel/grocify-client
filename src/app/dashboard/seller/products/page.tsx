import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProduct } from "@/lib/api/product";
import { fetchCategories } from "@/lib/api/catalog";
import { Package } from "lucide-react";
import ProductTable from "./ProductTable";
import AddProductModal from "@/components/dashboard/seller/AddProductModal";

export const metadata: Metadata = {
  title: "Product Catalog Management | Grocify Back-Office",
  description: "Browse, create, update, and manage Grocify fresh grocery products.",
};

interface SellerProductPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function SellerProductPage({ searchParams }: SellerProductPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/signin?from=/dashboard/seller/products");
  }

  const role = (session.user.role || "customer").toLowerCase();
  if (role !== "owner" && role !== "manager" && role !== "worker" && role !== "seller" && role !== "admin") {
    redirect("/");
  }

  const isStaff = role === "worker";
  const canDelete = !isStaff; // workers have restricted read-only catalog access

  const resolvedParams = searchParams ? await searchParams : {};
  const page = resolvedParams?.page ? parseInt(resolvedParams.page, 10) : 1;

  const [productsData, categoriesData] = await Promise.all([
    getProduct(page, 10),
    fetchCategories(),
  ]);

  const categoryOptions = categoriesData.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b"
        style={{ borderColor: "#e5dbc7" }}
      >
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5"
            style={{ background: "#f0fdf4", color: "#14532D" }}
          >
            <Package className="w-3.5 h-3.5" />
            Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage grocery products, pricing, categories, and stock levels.
          </p>
        </div>
        {!isStaff && <AddProductModal categories={categoryOptions} />}
      </div>

      {/* Table card */}
      <div
        className="bg-white rounded-3xl border shadow-sm overflow-hidden"
        style={{ borderColor: "#e5dbc7" }}
      >
        <div
          className="p-5 sm:p-6 border-b flex items-center justify-between"
          style={{ borderColor: "#f0fdf4" }}
        >
          <div>
            <h2 className="text-base font-black text-gray-900">All Products</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live catalog items synchronized with MongoDB.
            </p>
          </div>
        </div>
        <ProductTable productsData={productsData} canDelete={canDelete} />
      </div>
    </div>
  );
}
