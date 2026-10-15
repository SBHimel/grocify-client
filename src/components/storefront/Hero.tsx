"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, ShieldCheck, Heart, Leaf } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#e5dbc7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Organic Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold shadow-sm">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span>100% Certified Organic • Daily Morning Harvest</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.12]">
              Farm-Fresh Groceries,{" "}
              <span className="text-[#14532D] underline decoration-emerald-400 decoration-wavy decoration-2">
                Delivered in 30 Mins.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Skip the crowded supermarket queues. Enjoy sun-ripened organic fruits, crisp farm vegetables, dairy, and wholesome pantry staples hand-inspected and delivered straight from local growers to your kitchen table.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#14532D] hover:bg-[#166534] text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all"
              >
                <span>Shop Fresh Produce</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#categories"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-base px-7 py-3.5 rounded-full border border-emerald-200 shadow-sm hover:shadow transition-all"
              >
                <span>Explore 8+ Categories</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#dfd5c2]/80 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-0.5">
                <p className="text-2xl sm:text-3xl font-black text-[#14532D]">30m</p>
                <p className="text-xs font-semibold text-gray-500">Fast Express Delivery</p>
              </div>
              <div className="space-y-0.5 border-x border-[#dfd5c2]/80 px-2 sm:px-4">
                <p className="text-2xl sm:text-3xl font-black text-[#14532D]">100%</p>
                <p className="text-xs font-semibold text-gray-500">Freshness Guaranteed</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl sm:text-3xl font-black text-[#14532D]">4.9★</p>
                <p className="text-xs font-semibold text-gray-500">Customer Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visuals & Seasonal Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Grocery Visual Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-emerald-900">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh organic fruits and vegetables"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white mb-1 shadow-sm">
                    Today&apos;s Fresh Harvest
                  </span>
                  <p className="text-lg font-bold">100% Pesticide-Free Greens & Berries</p>
                  <p className="text-xs text-gray-200">Inspected this morning at 5:30 AM</p>
                </div>
              </div>

              {/* Floating Floating Deal Badge */}
              <div className="absolute -top-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-emerald-100 flex items-center gap-3 animate-pulse-subtle">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-950">Save up to 25%</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">Seasonal Summer Deals</p>
                </div>
              </div>

              {/* Floating Fast Delivery Badge */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-950">Cold-Chain Insulated</p>
                  <p className="text-[11px] text-gray-500 font-medium">Ice-chilled packaging</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
