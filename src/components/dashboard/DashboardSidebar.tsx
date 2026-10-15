"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  User,
  X,
  ArrowRight,
} from "lucide-react";
import { useDashboardNav } from "@/context/DashboardNavContext";

interface NavItem {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  href: string;
  badge?: string;
}

interface SidebarSection {
  title?: string;
  items: NavItem[];
}

function getSidebarSections(role: string): SidebarSection[] {
  const normalised = role.toLowerCase();

  // OWNER: Full business control
  if (normalised === "owner" || normalised === "admin") {
    return [
      {
        title: "Management",
        items: [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
          { icon: Users, label: "Users & Staff", href: "/dashboard/admin/users" },
          { icon: User, label: "My Profile", href: "/dashboard/profile" },
        ],
      },
      {
        title: "Store Operations",
        items: [
          { icon: Package, label: "Products", href: "/dashboard/seller/products" },
          { icon: Layers, label: "Batch Inventory", href: "/dashboard/seller/inventory" },
        ],
      },
    ];
  }

  // MANAGER: Day-to-day operations
  if (normalised === "manager" || normalised === "seller") {
    return [
      {
        title: "Operations",
        items: [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard/seller" },
          { icon: Package, label: "Products", href: "/dashboard/seller/products" },
          { icon: Layers, label: "Batch Inventory", href: "/dashboard/seller/inventory" },
          { icon: User, label: "My Profile", href: "/dashboard/profile" },
        ],
      },
    ];
  }

  // WORKER: Restricted operational access (view products and view inventory)
  if (normalised === "worker") {
    return [
      {
        title: "Staff Workstation",
        items: [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard/seller" },
          { icon: Package, label: "Product Catalog", href: "/dashboard/seller/products" },
          { icon: Layers, label: "Inventory Levels", href: "/dashboard/seller/inventory" },
          { icon: User, label: "My Profile", href: "/dashboard/profile" },
        ],
      },
    ];
  }

  // CUSTOMER: Personal account
  return [
    {
      title: "My Account",
      items: [
        { icon: LayoutDashboard, label: "Account Overview", href: "/dashboard/buyer" },
        { icon: User, label: "My Profile", href: "/dashboard/profile" },
      ],
    },
  ];
}

function getRoleLabel(role: string): string {
  switch (role.toLowerCase()) {
    case "owner":
    case "admin":
      return "Owner";
    case "manager":
    case "seller":
      return "Manager";
    case "worker":
      return "Staff Worker";
    default:
      return "Customer";
  }
}

interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const { isMobileOpen, closeMobile } = useDashboardNav();
  const role = (user?.role || "customer").toLowerCase();
  const sections = getSidebarSections(role);
  const roleLabel = getRoleLabel(role);

  const sidebarContent = (
    <div
      className="flex flex-col h-full w-full"
      style={{
        background: "linear-gradient(180deg, #052e16 0%, #14532d 55%, #166534 100%)",
      }}
    >
      {/* Header / Logo */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span className="text-white font-black text-sm">G</span>
          </div>
          <div>
            <p className="text-white font-black text-base leading-tight tracking-tight">Grocify</p>
            <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.45)" }}>
              Management Back-Office
            </p>
          </div>
        </div>

        {/* Close button for mobile drawer */}
        <button
          type="button"
          onClick={closeMobile}
          className="lg:hidden p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={section.title || idx}>
            {section.title && (
              <p
                className="text-[10px] font-bold uppercase tracking-wider px-3 mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 hover:bg-white/10"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    <item.icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <div
        className="p-4 space-y-2 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <Link
          href="/"
          onClick={closeMobile}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>← Back to Storefront</span>
        </Link>

        <Link
          href="/dashboard/profile"
          onClick={closeMobile}
          className="flex items-center gap-3 p-3 rounded-2xl transition-colors hover:bg-white/15"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "Profile"}
              className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border border-white/20"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">
              {user?.name || "Staff Member"}
            </p>
            <p
              className="text-[10px] truncate leading-tight"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {user?.email}
            </p>
          </div>
          <span
            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.18)", color: "#ffffff" }}
          >
            {roleLabel}
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 xl:w-72 h-full flex-shrink-0"
        style={{
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Visible on < lg when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Slide-in Drawer */}
          <div
            className="relative flex-1 flex flex-col max-w-xs w-full h-full shadow-2xl z-10 animate-in slide-in-from-left duration-250"
            style={{ borderRight: "1px solid rgba(255,255,255,0.15)" }}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}