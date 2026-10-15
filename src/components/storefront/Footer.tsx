"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle,
} from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#052e16] text-[#e2d9c8] border-t border-[#14532D]">
      {/* Top Banner Feature */}
      <div className="border-b border-emerald-900/60 py-8 bg-[#042612]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-700/50">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Join the Fresh Harvest Club
                </h3>
                <p className="text-xs text-emerald-200">
                  Receive weekly seasonal harvest updates, secret farm discounts & healthy recipe ideas.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex items-center w-full max-w-md gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-emerald-950/80 border border-emerald-800 text-white placeholder-emerald-300/50 text-xs rounded-full pl-4 pr-3 py-3 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs px-5 py-3 rounded-full transition-colors shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {subscribed && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Thank you! You are subscribed to Grocify Fresh Harvest newsletter.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                <Leaf className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">
                  Grocify
                </span>
                <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-semibold -mt-1">
                  Farm-to-Door Market
                </span>
              </div>
            </Link>

            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Wholesome, farm-fresh produce and artisanal groceries delivered to your door in 30 minutes. Sourced with integrity from certified local farms.
            </p>

            <div className="space-y-2 text-xs text-emerald-200/70 pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Deliveries: 7:00 AM – 10:00 PM Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Customer Care: +1 (800) 476-2439</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Central Distribution Hub, Suite 104</span>
              </div>
            </div>
          </div>

          {/* Column 2: Grocery Aisles */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Fresh Aisles
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <a href="#products" className="hover:text-amber-300 transition-colors">
                  Organic Fruits & Berries
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-amber-300 transition-colors">
                  Crisp Morning Vegetables
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-amber-300 transition-colors">
                  Pasture Eggs & Farm Milk
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-amber-300 transition-colors">
                  Artisanal Sourdough & Loaves
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-amber-300 transition-colors">
                  Cold-Pressed Fresh Juices
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-amber-300 transition-colors">
                  Organic Honey & Olive Oils
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <span className="hover:text-amber-300 cursor-pointer">
                  How 30-Min Delivery Works
                </span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">
                  Cash on Delivery (COD) Inspection
                </span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">
                  100% Freshness Guarantee & Refunds
                </span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">
                  Local Farmer Partnership Program
                </span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">
                  Food Safety & Organic Standards
                </span>
              </li>
              <li>
                <Link href="/signin" className="hover:text-amber-300 transition-colors">
                  Staff & Employee Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Guarantees */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quality Assurance
            </h4>

            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Pesticide Assurance</span>
              </div>
              <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                Every batch of produce undergoes rigorous residue testing prior to early morning dispatch.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-1">
              <span className="text-[11px] font-bold text-white block">
                Primary Payment Accepted:
              </span>
              <span className="inline-block text-xs font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                💵 Cash on Delivery (COD)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <p>© 2026 Grocify Inc. All rights reserved. Farm-to-Door Grocery Platform.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-emerald-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-emerald-200 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-emerald-200 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
