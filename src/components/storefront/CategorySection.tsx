"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { GroceryCategory } from "@/types";
import { MOCK_CATEGORIES } from "@/data/mockGrocery";

interface CategorySectionProps {
  categories?: GroceryCategory[];
  onSelectCategory?: (categoryId: string) => void;
  selectedCategory?: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  const displayCategories = categories && categories.length > 0 ? categories : MOCK_CATEGORIES;
  return (
    <section id="categories" className="py-14 bg-[#f9f6ee] border-y border-[#e5dbc7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Shop By Fresh Aisle</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Explore Farm Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              From crisp morning greens to stone-ground bakery loaves, explore our 100% farm-sourced departments.
            </p>
          </div>

          <a
            href="#products"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#14532D] hover:text-[#166534] group"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((category) => {
            const isSelected = selectedCategory === category.id || selectedCategory === category.slug;
            return (
              <a
                key={category.id}
                href={`/products?category=${category.slug}`}
                onClick={(e) => {
                  if (onSelectCategory) {
                    e.preventDefault();
                    onSelectCategory(category.id);
                  }
                }}
                className={`group relative rounded-2xl overflow-hidden bg-white border p-3 sm:p-4 transition-all duration-300 text-left cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 ${
                  isSelected
                    ? "border-[#14532D] ring-2 ring-[#14532D]/30"
                    : "border-[#e5dbc7] hover:border-emerald-400"
                }`}
              >
                {/* Category Thumbnail */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={category.image || ""}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                    {category.itemCount}+ Items
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#14532D] transition-colors flex items-center justify-between">
                    <span>{category.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#14532D] group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
