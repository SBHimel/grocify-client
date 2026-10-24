"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Leaf, Sparkles } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  isOrganic?: boolean;
  isSeasonal?: boolean;
  discountPercent?: number | null;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  name,
  isOrganic,
  isSeasonal,
  discountPercent,
}) => {
  const validImages = (images ?? []).filter((url) => typeof url === "string" && url.trim() !== "");
  const safeImages = validImages.length > 0 ? validImages : ["/assets/grocify_logo.png"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeIndex = Math.min(selectedIndex, safeImages.length - 1);
  const activeImage = safeImages[activeIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#f4f1e8] border border-[#f0ebde] group shadow-xs">
        <Image
          src={activeImage}
          alt={`${name} - View ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10 pointer-events-none">
          {isOrganic && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-emerald-700 text-white px-3 py-1 rounded-full shadow-sm">
              <Leaf className="w-3.5 h-3.5" />
              100% Organic
            </span>
          )}
          {isSeasonal && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-amber-400 text-gray-950 px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              Fresh Harvest
            </span>
          )}
        </div>

        {discountPercent && (
          <span className="absolute top-4 right-4 text-xs font-black bg-red-600 text-white px-3 py-1 rounded-full shadow-sm z-10 pointer-events-none">
            Save {discountPercent}%
          </span>
        )}

        {/* Previous / Next Arrow Controls (visible when multiple images) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10 hover:scale-105"
              aria-label="Previous product image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10 hover:scale-105"
              aria-label="Next product image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter pill */}
            <div className="absolute bottom-3 right-3 text-[11px] font-bold text-gray-800 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs pointer-events-none">
              {activeIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {/* Multi-Image Thumbnail Strip */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {safeImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#14532D] ring-2 ring-[#14532D]/30 shadow-md scale-98"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-[#e5dbc7]"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
