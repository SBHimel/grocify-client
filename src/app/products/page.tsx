import React from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/ProductCard";
import { fetchProducts, fetchCategories } from "@/lib/api/catalog";
import { Sparkles, Leaf } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Products | Grocify Fresh Harvest",
  description: "Browse all certified organic produce, fruits, vegetables, dairy, bakery, and pantry essentials.",
};

interface ProductsPageProps {
  searchParams?: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const search = resolvedParams.search?.trim() || "";
  const categoryFilter = resolvedParams.category?.trim() || "";

  // Connect to real Express/MongoDB API with graceful fallback
  const [products, categories] = await Promise.all([
    fetchProducts({ search, category: categoryFilter }),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>Farm Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Explore All Fresh Groceries
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xl">
            Directly from certified local organic farms. Temperature-controlled packaging ensures peak freshness.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
              !categoryFilter
                ? "bg-[#14532D] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-emerald-50 border border-[#e5dbc7]"
            }`}
          >
            All Items
          </Link>
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat.id || categoryFilter === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#14532D] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-emerald-50 border border-[#e5dbc7]"
                }`}
              >
                {cat.name} {cat.itemCount !== undefined && cat.itemCount > 0 ? `(${cat.itemCount})` : ""}
              </Link>
            );
          })}
        </div>

        {/* Search Notice */}
        {search && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between">
            <span>
              Showing results for &ldquo;{search}&rdquo; ({products.length} found)
            </span>
            <Link href="/products" className="text-[#14532D] underline font-bold">
              Clear search
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#e5dbc7] p-8">
            <Sparkles className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No grocery items found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find matching produce for your search. Try browsing all categories or check our seasonal specials.
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 text-xs font-bold text-white bg-[#14532D] hover:bg-[#166534] px-5 py-2.5 rounded-full transition-all"
            >
              View Full Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
