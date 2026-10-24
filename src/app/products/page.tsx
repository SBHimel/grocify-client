import React from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/ProductCard";
import { fetchProductsWithPagination, fetchCategories } from "@/lib/api/catalog";
import { Sparkles, Leaf, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Organic Grocery Catalog",
  description:
    "Browse certified organic produce, fruits, vegetables, dairy, bakery, and pantry essentials in BDT with 30-minute delivery.",
  openGraph: {
    title: "Organic Grocery Catalog | Grocify",
    description:
      "Browse certified organic produce, fruits, vegetables, dairy, bakery, and pantry essentials in BDT with 30-minute delivery.",
    url: "/products",
  },
};

interface ProductsPageProps {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const search = resolvedParams.search?.trim() || "";
  const categoryFilter = resolvedParams.category?.trim() || "";
  const sort = resolvedParams.sort?.trim() || "";
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);
  const pageSize = 12;

  // Connect to real Express/MongoDB API with server-side pagination
  const [{ products, pagination }, categories] = await Promise.all([
    fetchProductsWithPagination({
      search,
      category: categoryFilter,
      page: currentPage,
      limit: pageSize,
      sort,
    }),
    fetchCategories(),
  ]);

  const { total, totalPages } = pagination;
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  // Helper to build URL with preserved query parameters
  const buildFilterUrl = (params: { page?: number; category?: string; sort?: string; search?: string }) => {
    const q = new URLSearchParams();
    const finalSearch = params.search !== undefined ? params.search : search;
    const finalCategory = params.category !== undefined ? params.category : categoryFilter;
    const finalSort = params.sort !== undefined ? params.sort : sort;
    const finalPage = params.page !== undefined ? params.page : 1;

    if (finalSearch) q.set("search", finalSearch);
    if (finalCategory) q.set("category", finalCategory);
    if (finalSort) q.set("sort", finalSort);
    if (finalPage > 1) q.set("page", String(finalPage));

    const qs = q.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>Farm Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Explore All Fresh Groceries
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-xl">
              Directly from certified local organic farms. All prices in Bangladeshi Taka (৳).
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-[#e5dbc7] rounded-2xl p-1.5 shadow-2xs text-xs font-semibold">
            <span className="text-gray-400 pl-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <Link
              href={buildFilterUrl({ sort: "", page: 1 })}
              className={`px-2.5 py-1.5 rounded-xl transition-colors ${
                !sort ? "bg-[#14532D] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Newest
            </Link>
            <Link
              href={buildFilterUrl({ sort: "price_asc", page: 1 })}
              className={`px-2.5 py-1.5 rounded-xl transition-colors ${
                sort === "price_asc" ? "bg-[#14532D] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Price: Low → High
            </Link>
            <Link
              href={buildFilterUrl({ sort: "price_desc", page: 1 })}
              className={`px-2.5 py-1.5 rounded-xl transition-colors ${
                sort === "price_desc" ? "bg-[#14532D] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Price: High → Low
            </Link>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <Link
            href={buildFilterUrl({ category: "", page: 1 })}
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
                href={buildFilterUrl({ category: cat.slug, page: 1 })}
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

        {/* Search Notice & Counts */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600 bg-white border border-[#e5dbc7]/70 rounded-2xl px-4 py-3 shadow-2xs">
          <div>
            {search ? (
              <span>
                Search results for &ldquo;<strong>{search}</strong>&rdquo; —{" "}
                <Link href={buildFilterUrl({ search: "", page: 1 })} className="text-[#14532D] underline font-bold ml-1">
                  Clear search
                </Link>
              </span>
            ) : categoryFilter ? (
              <span>
                Filtered by &ldquo;<strong>{categories.find((c) => c.slug === categoryFilter || c.id === categoryFilter)?.name || categoryFilter}</strong>&rdquo;
              </span>
            ) : (
              <span>All certified farm produce</span>
            )}
          </div>
          <div className="font-semibold text-gray-500">
            {total > 0 ? (
              <>
                Showing <span className="text-gray-900 font-bold">{startItem}–{endItem}</span> of{" "}
                <span className="text-gray-900 font-bold">{total}</span> items (Page {currentPage} of {totalPages})
              </>
            ) : (
              "0 items found"
            )}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#e5dbc7] p-8">
            <Sparkles className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No grocery items found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find matching produce for your selection. Try browsing all categories or clear active filters.
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 text-xs font-bold text-white bg-[#14532D] hover:bg-[#166534] px-5 py-2.5 rounded-full transition-all"
            >
              View Full Catalog
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e5dbc7]/80">
                <p className="text-xs text-gray-500 font-medium">
                  Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
                  <strong className="text-gray-900">{totalPages}</strong> ({total} total products)
                </p>

                <div className="flex items-center gap-1.5">
                  {/* Previous Button */}
                  {currentPage > 1 ? (
                    <Link
                      href={buildFilterUrl({ page: currentPage - 1 })}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-gray-800 border border-[#e5dbc7] transition-all shadow-2xs hover:scale-102"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4 text-emerald-800" />
                      <span>Previous</span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </span>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === currentPage;
                      return (
                        <Link
                          key={pageNum}
                          href={buildFilterUrl({ page: pageNum })}
                          className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-[#14532D] text-white shadow-sm shadow-emerald-950/20 scale-105"
                              : "bg-white text-gray-700 hover:bg-emerald-50 border border-[#e5dbc7]"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  {currentPage < totalPages ? (
                    <Link
                      href={buildFilterUrl({ page: currentPage + 1 })}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-gray-800 border border-[#e5dbc7] transition-all shadow-2xs hover:scale-102"
                      aria-label="Next Page"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4 text-emerald-800" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
