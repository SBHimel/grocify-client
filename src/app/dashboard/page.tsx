import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?from=/dashboard");
  }

  const role = (session.user.role || "customer").toLowerCase();

  if (role === "owner" || role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "manager" || role === "worker" || role === "seller") {
    redirect("/dashboard/seller");
  } else {
    redirect("/dashboard/buyer");
  }
}
