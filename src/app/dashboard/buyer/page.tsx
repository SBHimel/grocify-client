import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Package, ArrowRight, User } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Account | Grocify",
  description: "View your Grocify account and explore fresh grocery offerings.",
};

export default async function BuyerHomePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/signin?from=/dashboard/buyer");
  }

  const accountLinks = [
    {
      icon: Package,
      label: "Browse Fresh Catalog",
      description: "Explore fresh vegetables, fruits, dairy, and artisanal staples.",
      href: "/products",
      accent: "#14532D",
      bg: "#f0fdf4",
    },
    {
      icon: User,
      label: "My Profile & Security",
      description: "Update your name, profile photo, and password.",
      href: "/dashboard/profile",
      accent: "#0369a1",
      bg: "#eff6ff",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
          Hello, {session.user.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to your Grocify customer account.
        </p>
      </div>

      {/* Account summary strip */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border"
        style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
        >
          {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-black text-gray-900">{session.user.name || "Customer"}</p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>
        <div className="sm:ml-auto">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "#dcfce7", color: "#14532D" }}
          >
            Verified Customer
          </span>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
          Shopping & Account
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accountLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group bg-white rounded-2xl border p-5 flex items-start gap-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{ borderColor: "#e5dbc7" }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: link.bg, color: link.accent }}
              >
                <link.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
              </div>
              <ArrowRight
                className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                style={{ color: "#94a3b8" }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
