"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Tag, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ProductItem {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  sku?: string;
  images?: string[];
  categoryName?: string;
  category?: string;
  price?: number;
  retailPrice?: number;
  compareAtPrice?: number;
  originalPrice?: number;
  currentStock?: number;
  quantity?: number;
  unit?: {
    baseUnit?: string;
    sellUnit?: string;
  };
  isActive?: boolean;
  status?: string;
}

interface ProductTableProps {
  productsData: {
    data?: ProductItem[];
    page?: number;
    totalPage?: number;
    totalCount?: number;
    limit?: number;
  };
  canDelete?: boolean;
}

export default function ProductTable({ productsData, canDelete = true }: ProductTableProps) {
  const router = useRouter();
  const products = productsData?.data || [];
  const page = productsData?.page || 1;
  const totalPages = productsData?.totalPage || 1;

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    const toastId = toast.loading(`Deactivating ${name}...`);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to deactivate product (${res.status})`);
      }

      toast.success(`"${name}" deactivated successfully!`, { id: toastId });
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error deleting product.";
      toast.error(msg, { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: "#f0fdf4" }}
        >
          <Tag className="w-7 h-7" style={{ color: "#14532D" }} />
        </div>
        <p className="text-sm font-bold text-gray-700">No products found</p>
        <p className="text-xs text-gray-400 mt-1">
          Add your first product to the catalog using the button above.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead
            className="text-[11px] font-bold uppercase tracking-wider text-gray-500"
            style={{ background: "#fdfbf7", borderBottom: "1px solid #e5dbc7" }}
          >
            <tr>
              <th className="py-3.5 px-5">#</th>
              <th className="py-3.5 px-5">Product Name</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Price</th>
              <th className="py-3.5 px-5">Stock</th>
              <th className="py-3.5 px-5">Status</th>
              {canDelete && <th className="py-3.5 px-5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product, index) => {
              const productId = product.id || product._id || "";
              const rowNum = (page - 1) * (productsData?.limit || 10) + index + 1;
              const isActive = product.isActive !== false && product.status !== "inactive";
              const price = product.retailPrice ?? product.price ?? 0;
              const comparePrice = product.originalPrice ?? product.compareAtPrice;
              const stock = product.currentStock ?? product.quantity ?? 0;
              const productName = product.name || product.title || "Unnamed Product";
              const isDeleting = deletingId === productId;

              return (
                <tr
                  key={productId || index}
                  className="hover:bg-emerald-50/30 transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono text-gray-400 text-[11px]">
                    {rowNum}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={productName}
                          className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border"
                          style={{ borderColor: "#e5dbc7" }}
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: "#f0fdf4" }}
                        >
                          <Tag className="w-4 h-4" style={{ color: "#14532D" }} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{productName}</p>
                        {product.sku && (
                          <p className="text-[10px] text-gray-400 font-mono">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: "#f0fdf4", color: "#14532D" }}
                    >
                      {product.categoryName || product.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-gray-900">
                    ${Number(price).toFixed(2)}
                    {comparePrice && comparePrice > price && (
                      <span className="ml-1.5 text-[10px] text-gray-400 line-through font-normal">
                        ${Number(comparePrice).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`font-bold ${
                        stock <= 5 ? "text-amber-700" : "text-gray-900"
                      }`}
                    >
                      {stock}
                    </span>
                    {product.unit?.baseUnit && (
                      <span className="text-gray-400 ml-1 text-[10px]">
                        {product.unit.baseUnit}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                      style={
                        isActive
                          ? { background: "#dcfce7", color: "#15803d" }
                          : { background: "#f1f5f9", color: "#64748b" }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isActive ? "#15803d" : "#94a3b8" }}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {canDelete && (
                    <td className="py-3.5 px-5 text-right">
                      {isActive && productId ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(productId, productName)}
                          disabled={isDeleting}
                          title="Deactivate product"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderTop: "1px solid #e5dbc7" }}
        >
          <p className="text-xs text-gray-400">
            Page <span className="font-bold text-gray-700">{page}</span> of{" "}
            <span className="font-bold text-gray-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/dashboard/seller/products?page=${page - 1}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-gray-100"
                style={{ color: "#14532D" }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </Link>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold opacity-40 cursor-not-allowed"
                style={{ color: "#94a3b8" }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <Link
                    key={p}
                    href={`/dashboard/seller/products?page=${p}`}
                    className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors"
                    style={
                      p === page
                        ? { background: "#14532D", color: "#ffffff" }
                        : { color: "#64748b" }
                    }
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {page < totalPages ? (
              <Link
                href={`/dashboard/seller/products?page=${page + 1}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-gray-100"
                style={{ color: "#14532D" }}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold opacity-40 cursor-not-allowed"
                style={{ color: "#94a3b8" }}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
