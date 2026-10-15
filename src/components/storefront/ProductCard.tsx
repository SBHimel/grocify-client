"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, Star, Leaf, Check } from "lucide-react";
import { GroceryProduct } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: GroceryProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity, openCart } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.retailPrice
      ? Math.round(
          ((product.originalPrice - product.retailPrice) / product.originalPrice) * 100
        )
      : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(product.id, quantityInCart - 1);
  };

  // Format unit label nicely (e.g., "450 g packet" or "1 kg")
  const unitLabel =
    product.unit.sellUnit === product.unit.baseUnit
      ? `${product.unit.multiplier} ${product.unit.baseUnit}`
      : `${product.unit.multiplier} ${product.unit.baseUnit} / ${product.unit.sellUnit}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-[#e5dbc7] hover:border-emerald-400 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Badges */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f4f1e8] mb-3">
        <Image
          src={product.images[0] || ""}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white px-2 py-0.5 rounded-full shadow-sm">
              <Leaf className="w-2.5 h-2.5" />
              Organic
            </span>
          )}
          {product.isSeasonal && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-gray-950 px-2 py-0.5 rounded-full shadow-sm">
              Fresh Harvest
            </span>
          )}
        </div>

        {discountPercent && (
          <span className="absolute top-2.5 right-2.5 text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded-full shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Stock Pill */}
        <div className="absolute bottom-2 left-2">
          {product.currentStock > 10 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Only {product.currentStock} Left
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold text-emerald-700 capitalize">
              {product.categoryName}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1 text-gray-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount})</span>
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#14532D] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 mt-1 font-medium">
            {unitLabel}
          </p>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="pt-3 border-t border-[#f0ebde] flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#14532D]">
                ${product.retailPrice.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.retailPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Cart Button */}
          {quantityInCart > 0 ? (
            <div className="flex items-center bg-[#14532D] text-white rounded-xl p-1 shadow-sm">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#166534] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-xs">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#166534] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 bg-[#f0fdf4] hover:bg-[#14532D] text-[#14532D] hover:text-white border border-[#bbf7d0] hover:border-[#14532D] px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
