import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/storefront/Hero";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { CategorySection } from "@/components/storefront/CategorySection";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { SeasonalBanner } from "@/components/storefront/SeasonalBanner";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, HeartHandshake, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Grocify | Farm-Fresh Organic Groceries Delivered in 30 Minutes",
  description:
    "Shop certified organic fruits, morning-picked vegetables, farm eggs, artisan bakery loaves, and cold-pressed juices. Enjoy 30-minute delivery and Cash on Delivery (COD).",
};

export default function StorefrontHomePage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Hero Section */}
      <Hero />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products Catalog */}
      <FeaturedProducts />

      {/* Seasonal Promotion Harvest Banner */}
      <SeasonalBanner />

      {/* Farm-to-Table Story & Direct Grower Partnership */}
      <section className="py-16 bg-[#f9f6ee] border-t border-[#e5dbc7]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-emerald-900">
                <Image
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                  alt="Organic local farmer inspecting fresh crops"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-bold flex items-center gap-1.5 text-amber-300">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Fair-Trade Certified Growers</span>
                  </p>
                  <p className="text-xs text-gray-200 mt-0.5">
                    Supporting over 85 family-owned local farms
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                <span>Our Farm-Direct Promise</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Cutting Out The Middleman For Healthier Families & Fairer Farms
              </h2>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Traditional supermarket produce travels thousands of miles and sits in chemical cold storage for weeks before reaching shelves. At Grocify, our morning harvest team collects crisp greens, ripe berries, and artisan breads directly from certified local growers before sunrise.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-[#e5dbc7]/80 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Harvested Under 24 Hours
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Items go from soil to your front doorstep in under a day.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-[#e5dbc7]/80 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Rigorous Safety Testing
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      100% pesticide residue inspection on every batch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
