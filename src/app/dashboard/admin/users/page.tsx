import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Users, ShieldAlert } from "lucide-react";
import UserTable from "./UserTable";

export const metadata: Metadata = {
  title: "Staff & User Roles | Grocify Back-Office",
  description: "Manage staff roles, access levels, and customer accounts.",
};

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

async function fetchUsers(token?: string) {
  if (!token) return [];
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });

  if (!session?.user) {
    redirect("/signin?from=/dashboard/admin/users");
  }

  const role = (session.user.role || "customer").toLowerCase();
  if (role !== "owner" && role !== "admin") {
    redirect("/");
  }

  const tokenResult = await auth.api.getToken({ headers: sessionHeaders }).catch(() => null);
  const token =
    typeof tokenResult === "string"
      ? tokenResult
      : typeof tokenResult === "object" && tokenResult && "token" in tokenResult
      ? (tokenResult as any).token
      : undefined;

  const users = await fetchUsers(token);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b"
        style={{ borderColor: "#e5dbc7" }}
      >
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5"
            style={{ background: "#f0fdf4", color: "#14532D" }}
          >
            <Users className="w-3.5 h-3.5" />
            Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Staff & User Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Assign canonical roles: Owner, Manager, Worker, and Customer.
          </p>
        </div>
      </div>

      {/* Safety notice */}
      <div
        className="flex items-start gap-3 p-4 rounded-2xl border text-xs"
        style={{ background: "#eff6ff", borderColor: "#bfdbfe", color: "#1e40af" }}
      >
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
        <div>
          <p className="font-bold">Last-Owner Protection Enabled</p>
          <p className="font-normal mt-0.5 text-blue-900/80">
            The server automatically prevents the demotion of the final remaining Owner to maintain continuous system administration.
          </p>
        </div>
      </div>

      {/* Table card */}
      <div
        className="bg-white rounded-3xl border shadow-sm overflow-hidden"
        style={{ borderColor: "#e5dbc7" }}
      >
        <div
          className="p-5 sm:p-6 border-b flex items-center justify-between"
          style={{ borderColor: "#f0fdf4" }}
        >
          <div>
            <h2 className="text-base font-black text-gray-900">User Directory</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Registered Better Auth user accounts saved in MongoDB.
            </p>
          </div>
        </div>
        <UserTable initialUsers={users} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
