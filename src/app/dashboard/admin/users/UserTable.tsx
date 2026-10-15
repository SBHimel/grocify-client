"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldAlert, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface UserItem {
  id: string;
  name?: string;
  email: string;
  role: "owner" | "manager" | "worker" | "customer";
  createdAt?: string;
}

interface UserTableProps {
  initialUsers: UserItem[];
  currentUserId?: string;
}

export default function UserTable({ initialUsers, currentUserId }: UserTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    if (userId === currentUserId && newRole !== "owner") {
      if (!window.confirm("Warning: You are changing your own role away from Owner. Are you sure?")) {
        return;
      }
    }

    setUpdatingId(userId);
    const toastId = toast.loading(`Updating ${userName}'s role to ${newRole}...`);

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to update role (${res.status})`);
      }

      toast.success(`${userName}'s role updated to ${newRole}!`, { id: toastId });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error updating role.";
      toast.error(msg, { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            Owner
          </span>
        );
      case "manager":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
            <Shield className="w-3 h-3 text-blue-700" />
            Manager
          </span>
        );
      case "worker":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
            <UserCheck className="w-3 h-3 text-amber-700" />
            Worker
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
            Customer
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-600">
        <thead
          className="text-[11px] font-bold uppercase tracking-wider text-gray-500"
          style={{ background: "#fdfbf7", borderBottom: "1px solid #e5dbc7" }}
        >
          <tr>
            <th className="py-3.5 px-5">User</th>
            <th className="py-3.5 px-5">Email</th>
            <th className="py-3.5 px-5">Current Role</th>
            <th className="py-3.5 px-5">Change Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => {
            const isUpdating = updatingId === u.id;
            const displayName = u.name || "Unnamed User";

            return (
              <tr key={u.id} className="hover:bg-emerald-50/30 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{displayName}</p>
                      {u.id === currentUserId && (
                        <span className="text-[10px] font-bold text-emerald-800">
                          (You)
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 font-mono text-gray-600 text-xs">
                  {u.email}
                </td>
                <td className="py-3.5 px-5">{getRoleBadge(u.role)}</td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      disabled={isUpdating}
                      onChange={(e) => handleRoleChange(u.id, e.target.value, displayName)}
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white focus:border-[#14532D] outline-none disabled:opacity-50"
                    >
                      <option value="owner">Owner</option>
                      <option value="manager">Manager</option>
                      <option value="worker">Worker</option>
                      <option value="customer">Customer</option>
                    </select>
                    {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
