/**
 * Grocify Next.js 16 Route Guard Proxy
 *
 * Runs at the network boundary (Node.js runtime in Next.js 16) to protect
 * application routes based on the Better Auth session cookie.
 *
 * Access Rules:
 * - Public routes (/, /signin, /signup, /api/auth/*) pass through unconditionally.
 * - Any /dashboard route requires an authenticated session. Unauthenticated users
 *   are redirected to /signin with a ?from= parameter.
 * - /dashboard (root) redirects to the appropriate dashboard for the user's role.
 * - Legacy and new admin/owner routes (/dashboard/admin, /dashboard/owner) require "owner".
 * - Legacy and new seller/manager routes (/dashboard/seller, /dashboard/manager) require "owner" or "manager".
 * - Worker routes (/dashboard/worker) require "owner", "manager", or "worker".
 * - Customer/buyer routes (/dashboard/buyer, /dashboard/customer) require an authenticated account.
 * - Unauthorized role access redirects safely to the home storefront (/).
 */
import { NextRequest, NextResponse } from "next/server";

type GrocifyRole = "owner" | "manager" | "worker" | "customer";

interface SessionUser {
  id: string;
  email: string;
  role?: GrocifyRole | string;
}

interface AuthSession {
  user?: SessionUser;
}

/**
 * Fetch session from the Better Auth /get-session endpoint.
 * Returns null if unauthenticated or if the request fails.
 */
async function getSession(req: NextRequest): Promise<AuthSession | null> {
  try {
    const authBaseUrl =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.BETTER_AUTH_URL ||
      req.nextUrl.origin ||
      "http://localhost:3000";

    const sessionEndpoint = new URL("/api/auth/get-session", authBaseUrl);

    const response = await fetch(sessionEndpoint.toString(), {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as AuthSession;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- 1. Public routes: always accessible without session ---
  const publicPrefixes = ["/signin", "/signup", "/api/auth"];
  if (pathname === "/" || publicPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // --- 2. Dashboard access control ---
  if (pathname.startsWith("/dashboard")) {
    const session = await getSession(req);

    if (!session?.user) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signInUrl);
    }

    const rawRole = (session.user.role || "customer").toLowerCase();

    // Map legacy roles if present in older session cookies
    let role = rawRole;
    if (role === "admin") role = "owner";
    if (role === "buyer") role = "customer";
    if (role === "seller") role = "manager";

    // Direct /dashboard access -> redirect to role home
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      if (role === "owner") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      if (role === "manager" || role === "worker") {
        return NextResponse.redirect(new URL("/dashboard/seller", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }

    // Owner-only routes: /dashboard/owner, /dashboard/admin
    if (pathname.startsWith("/dashboard/owner") || pathname.startsWith("/dashboard/admin")) {
      if (role !== "owner") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Manager, Owner & Worker routes: /dashboard/manager, /dashboard/seller
    if (pathname.startsWith("/dashboard/manager") || pathname.startsWith("/dashboard/seller")) {
      if (role !== "owner" && role !== "manager" && role !== "worker") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Worker, Manager & Owner routes: /dashboard/worker
    if (pathname.startsWith("/dashboard/worker")) {
      if (role !== "owner" && role !== "manager" && role !== "worker") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Customer & Buyer routes: /dashboard/customer, /dashboard/buyer
    if (pathname.startsWith("/dashboard/customer") || pathname.startsWith("/dashboard/buyer")) {
      // Any authenticated user can access customer views
      return NextResponse.next();
    }

    // Any other /dashboard subpath requires at least authentication
    return NextResponse.next();
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
