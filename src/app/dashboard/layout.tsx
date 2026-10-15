import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopNav from "@/components/dashboard/DashboardTopNav";
import { DashboardNavProvider } from "@/context/DashboardNavContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/signin?from=/dashboard");
  }

  return (
    <DashboardNavProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "var(--brand-cream-50)" }}
      >
        {/* Sidebar (Desktop persistent + Mobile slide-over drawer) */}
        <DashboardSidebar user={session.user} />

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Top navigation bar with responsive toggle */}
          <DashboardTopNav user={session.user} />

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardNavProvider>
  );
}
