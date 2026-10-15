import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserCheck } from "lucide-react";
import ProfileForm from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile & Account Security | Grocify Back-Office",
  description: "View and update your personal information, profile photo, and password.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?from=/dashboard/profile");
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email,
    role: (session.user as any).role || "customer",
    image: (session.user as any).image || "",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b"
        style={{ borderColor: "#e5dbc7" }}
      >
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5"
            style={{ background: "#f0fdf4", color: "#14532D" }}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Account Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            My Profile & Security
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal profile details, photo avatar, and account password.
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <ProfileForm user={user} />
    </div>
  );
}
