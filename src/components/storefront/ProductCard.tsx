"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Star, Leaf } from "lucide-react";
import { GroceryProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/currency";

interface ProductCardProps {
  product: GroceryProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.retailPrice
      ? Math.round(
          ((product.originalPrice - product.retailPrice) / product.originalPrice) * 100
        )
      : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart - 1);
  };

  // Format unit label nicely (e.g., "450 g packet" or "1 kg")
  const unitLabel =
    product.unit.sellUnit === product.unit.baseUnit
      ? `${product.unit.multiplier} ${product.unit.baseUnit}`
      : `${product.unit.multiplier} ${product.unit.baseUnit} / ${product.unit.sellUnit}`;

  const detailUrl = `/products/${product.id}`;
  const firstImage = product.images?.[0]?.trim();
  const displayImage = firstImage && firstImage.length > 0 ? firstImage : "/assets/grocify_logo.png";

  return (
    <div className="group relative bg-white rounded-2xl border border-[#e5dbc7] hover:border-emerald-400 p-2.5 sm:p-4 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Clickable Overlay Link to Product Details */}
      <Link
        href={detailUrl}
        className="absolute inset-0 z-0"
        aria-label={`View details for ${product.name}`}
      />

      {/* Top Media Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f4f1e8] mb-2.5 sm:mb-3 pointer-events-none">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.isOrganic && (
            <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
              <Leaf className="w-2.5 h-2.5" />
              Organic
            </span>
          )}
          {product.isSeasonal && (
            <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-gray-950 px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
              Fresh
            </span>
          )}
        </div>

        {discountPercent && (
          <span className="absolute top-2 right-2 text-[10px] sm:text-xs font-black bg-red-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Stock Indicator */}
        <div className="absolute bottom-2 left-2">
          {product.currentStock > 10 ? (
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-800 bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-800 bg-amber-50/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {product.currentStock} Left
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2 pointer-events-none">
        <div>
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400 mb-0.5">
            <span className="font-semibold text-emerald-700 capitalize truncate max-w-[65%]">
              {product.categoryName}
            </span>
            {product.rating !== undefined && product.rating > 0 && (
              <span className="flex items-center gap-0.5 text-gray-700 font-bold shrink-0">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                {product.reviewCount !== undefined && (
                  <span className="text-gray-400 font-normal text-[10px] sm:text-xs">
                    ({product.reviewCount})
                  </span>
                )}
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#14532D] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">
            {unitLabel}
          </p>
        </div>

        {/* Price & Add to Cart Controls (interactive z-10) */}
        <div className="pt-2 sm:pt-3 border-t border-[#f0ebde] flex items-center justify-between gap-1.5 sm:gap-2 mt-auto pointer-events-auto relative z-10">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#14532D]">
                {formatBDT(product.retailPrice)}
              </span>
              {product.originalPrice && product.originalPrice > product.retailPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatBDT(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Cart Button */}
          {quantityInCart > 0 ? (
            <div className="flex items-center bg-[#14532D] text-white rounded-xl p-0.5 sm:p-1 shadow-xs">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg hover:bg-[#166534] transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="w-5 sm:w-7 text-center font-bold text-[11px] sm:text-xs">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg hover:bg-[#166534] transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1 bg-[#f0fdf4] hover:bg-[#14532D] text-[#14532D] hover:text-white border border-[#bbf7d0] hover:border-[#14532D] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl font-bold text-[11px] sm:text-xs shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
