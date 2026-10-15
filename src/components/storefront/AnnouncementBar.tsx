"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Truck, ShieldCheck, Phone } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div className="bg-[#14532D] text-[#f0fdf4] text-xs font-medium py-2 px-4 border-b border-[#166534]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-6 overflow-x-auto py-0.5 no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Farm-Fresh & Organic Harvest</span>
          </div>
          <span className="hidden sm:inline text-emerald-400/50">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Express 30-Min Delivery</span>
          </div>
          <span className="hidden md:inline text-emerald-400/50">•</span>
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Free Delivery on Orders Over $35</span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-emerald-200">
          <a
            href="tel:+18004762439"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-amber-300" />
            <span>Support: (800) 476-2439</span>
          </a>
          <span className="text-emerald-400/50">•</span>
          <span className="text-amber-200 font-semibold">Cash on Delivery (COD)</span>
        </div>
      </div>
    </div>
  );
};
