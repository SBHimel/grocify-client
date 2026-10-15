"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Copy, Check, ArrowRight } from "lucide-react";

export const SeasonalBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("HARVEST20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="deals" className="py-10 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-forest text-white shadow-xl p-8 sm:p-12 lg:p-16">
          {/* Subtle Background Pattern & Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Limited Seasonal Harvest Offer</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Get 20% Off Your First Basket of Farm Produce
              </h2>

              <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Enjoy peak-season strawberries, crisp orchard apples, creamy avocados, and stone-ground sourdough. Use code at checkout for orders over $30.
              </p>

              {/* Promo code badge & CTA */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex items-center bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 px-4 py-2.5 gap-3">
                  <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                    Promo Code:
                  </span>
                  <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                    HARVEST20
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 hover:text-amber-300 transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>

                <a
                  href="#products"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-sm px-6 py-3 rounded-2xl shadow-md transition-all hover:scale-102"
                >
                  <span>Claim Harvest Deal</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Visual Callout */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80"
                  alt="Summer Fresh Produce Basket"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-black bg-amber-400 text-gray-950 px-2.5 py-1 rounded-full shadow-sm">
                  ★ Sourced 100% Locally
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
