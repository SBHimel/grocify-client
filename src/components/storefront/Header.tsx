"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
  Leaf,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS } from "@/data/mockGrocery";

interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalCount, subtotal, openCart } = useCart();
  const { data: session } = authClient.useSession();
  const user = session?.user as AuthUser | undefined;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? MOCK_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await authClient.signOut();
  };

  // Skip rendering if inside /dashboard (dashboard has its own layout)
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const roleLabel = (user?.role as string) || "customer";

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e2d9c8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Grocify Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-10 h-10 rounded-2xl bg-[#14532D] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#14532D] flex items-center gap-1">
                Grocify
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Organic
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#15803d] font-semibold -mt-1">
                Farm-to-Door Market
              </span>
            </div>
          </Link>

          {/* Search bar with live suggestions dropdown */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-lg relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search fresh fruits, veggies, dairy, organic honey..."
                className="w-full bg-[#f4f0e6] hover:bg-[#eee8dc] focus:bg-white text-gray-900 placeholder-gray-500 text-sm rounded-full pl-11 pr-10 py-2.5 border border-[#dfd5c2] focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Suggestion Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-2 border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 flex items-center justify-between">
                  <span>Matching Grocery Items</span>
                  <span>{searchResults.length} found</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No grocery items found for &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/#products`}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-emerald-50/60 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.categoryName} • ${product.retailPrice.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#14532D] bg-emerald-100 px-2 py-0.5 rounded-full">
                          In Stock
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Storefront Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
            <Link
              href="/"
              className={`hover:text-[#14532D] transition-colors ${
                pathname === "/" ? "text-[#14532D] font-bold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/#categories"
              className="hover:text-[#14532D] transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/#products"
              className="hover:text-[#14532D] transition-colors"
            >
              Fresh Produce
            </Link>
            <Link
              href="/#deals"
              className="hover:text-[#14532D] transition-colors flex items-center gap-1 text-amber-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Special Deals
            </Link>
          </nav>

          {/* Action Area: Auth & Cart Trigger */}
          <div className="flex items-center gap-3">
            {/* User Account / Better Auth */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                  aria-expanded={isUserMenuOpen}
                >
                  {/* Avatar: profile photo when available, initial letter as fallback */}
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User avatar"}
                      className="w-9 h-9 rounded-full object-cover shadow-sm border border-emerald-200"
                      onError={(e) => {
                        // If image URL is broken, fall back to initial letter
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = "none";
                        const fallback = el.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-9 h-9 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-sm shadow-sm"
                    style={{ display: user.image ? "none" : "flex" }}
                    aria-hidden={!!user.image}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate leading-tight">
                      {user.name || "Customer"}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 capitalize leading-tight">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden xl:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Role: {roleLabel}
                      </span>
                    </div>

                    {(() => {
                      const normalizedRole = roleLabel.toLowerCase();
                      const isStaff = normalizedRole === "owner" || normalizedRole === "admin" || normalizedRole === "manager" || normalizedRole === "worker" || normalizedRole === "seller";
                      const dashboardHref =
                        normalizedRole === "owner" || normalizedRole === "admin"
                          ? "/dashboard/admin"
                          : normalizedRole === "manager" || normalizedRole === "worker" || normalizedRole === "seller"
                          ? "/dashboard/seller"
                          : "/dashboard/buyer";
                      const linkText = isStaff ? "Staff Dashboard" : "My Account Dashboard";

                      return (
                        <Link
                          href={dashboardHref}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                          <span>{linkText}</span>
                        </Link>
                      );
                    })()}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="text-sm font-semibold text-gray-700 hover:text-[#14532D] px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider text-white bg-[#14532D] hover:bg-[#166534] px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2.5 bg-[#14532D] hover:bg-[#166534] text-white px-3.5 sm:px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all group cursor-pointer"
              aria-label={`View shopping cart with ${totalCount} items`}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse-subtle">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-emerald-200 font-medium leading-none">
                  Cart
                </span>
                <span className="text-xs font-bold text-white leading-tight">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries..."
              className="w-full bg-[#f4f0e6] text-gray-900 placeholder-gray-500 text-sm rounded-full pl-10 pr-4 py-2 border border-[#dfd5c2] outline-none"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#fdfbf7] border-b border-[#dfd5c2] px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2 text-base font-semibold text-gray-800">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Browse Categories
            </Link>
            <Link
              href="/#products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Fresh Produce Catalog
            </Link>
            <Link
              href="/#deals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 text-amber-700 font-bold transition-colors"
            >
              ⚡ Special Deals & Harvest Offers
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold transition-colors"
              >
                Go to Dashboard ({roleLabel})
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
