"use client";

import React, { useState } from "react";
import { Sparkles, Filter, ArrowRight } from "lucide-react";
import { GroceryCategory, GroceryProduct } from "@/types";
import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface FeaturedProductsProps {
  products?: GroceryProduct[];
  categories?: GroceryCategory[];
  initialCategoryId?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products = [],
  categories = [],
  initialCategoryId = "all",
}) => {
  const [activeTab, setActiveTab] = useState(initialCategoryId);

  const displayProducts = products;

  // Build filter tabs from all live categories
  const tabs = [
    { id: "all", label: "All Fresh" },
    ...categories.map((c) => ({ id: c.id, label: c.name, slug: c.slug })),
  ];

  const filteredProducts =
    activeTab === "all"
      ? displayProducts
      : displayProducts.filter(
          (p) =>
            p.categoryId === activeTab ||
            p.categoryName?.toLowerCase() === activeTab.toLowerCase() ||
            (p as any).slug?.includes(activeTab)
        );

  return (
    <section id="products" className="py-14 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct From Certified Farms</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Featured Fresh Produce
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hand-picked each morning. Zero cold-storage holding; maximum nutritional density.
            </p>
          </div>

          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start md:self-auto">
            ⚡ All items ready for immediate 30-min dispatch
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#14532D] text-white shadow-md shadow-emerald-950/20"
                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-[#e5dbc7]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid - Mobile 2-column, tablet 3-column, desktop 4-column */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#e5dbc7] p-6 space-y-3">
            <p className="text-gray-500 text-sm font-medium">
              No featured produce found under this aisle right now.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14532D] hover:underline"
            >
              <span>Explore all catalog items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
