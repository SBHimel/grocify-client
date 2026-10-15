"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, ChevronRight, Home, User } from "lucide-react";
import { useDashboardNav } from "@/context/DashboardNavContext";

interface DashboardTopNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

function getBreadcrumb(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    admin: "Owner Panel",
    seller: "Operations",
    buyer: "My Account",
    inventory: "Inventory",
    products: "Products",
    users: "Staff Directory",
    profile: "My Profile",
  };

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({
      label: labelMap[seg] || seg,
      href: path,
    });
  }

  return crumbs;
}

export default function DashboardTopNav({ user }: DashboardTopNavProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumb(pathname || "/dashboard");
  const { toggleMobile } = useDashboardNav();

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3.5 flex-shrink-0"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5dbc7",
        minHeight: "60px",
      }}
    >
      {/* Left: mobile menu button + breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile sidebar toggle button */}
        <button
          type="button"
          onClick={toggleMobile}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 transition-colors hover:bg-emerald-50 hover:text-emerald-800 text-gray-700"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-400 min-w-0">
          <Link href="/" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              {idx === crumbs.length - 1 ? (
                <span className="font-bold text-gray-800 truncate">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-gray-700 transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Mobile current page label */}
        <span className="sm:hidden font-bold text-gray-900 text-sm truncate">
          {crumbs[crumbs.length - 1]?.label || "Dashboard"}
        </span>
      </div>

      {/* Right: notifications + user avatar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Profile Link */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-gray-200 sm:ml-1 group"
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[#e5dbc7] group-hover:scale-105 transition-transform"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
            >
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight group-hover:text-emerald-800 transition-colors">
              {user?.name || "Staff"}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight capitalize">
              {user?.role || "customer"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
