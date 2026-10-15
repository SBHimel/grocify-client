"use client";

import React from "react";
import { Leaf, Clock, ShieldCheck, Banknote } from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: Leaf,
    title: "100% Farm-Fresh Daily",
    description: "Sourced directly from certified organic growers with strict morning quality inspection.",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    icon: Clock,
    title: "30-Min Express Delivery",
    description: "Temperature-controlled insulated boxes keep milk ice-cold and veggies perfectly crisp.",
    color: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    icon: ShieldCheck,
    title: "Freshness Guaranteed",
    description: "100% satisfaction guarantee. Not thrilled with any item? Instant hassle-free refund.",
    color: "bg-green-50 text-green-800 border-green-200",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery (COD)",
    description: "Pay conveniently at your door after inspecting the freshness of your groceries.",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
];

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-10 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#e5dbc7]/70 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${feature.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
