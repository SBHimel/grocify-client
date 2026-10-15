"use client";
/**
 * Grocify Sign Up Page
 *
 * Security: No role field is presented or submitted. The server always
 * assigns "customer" as the default role via Better Auth additionalFields.
 * Client-supplied role values are rejected at the server (input: false).
 */
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // IMPORTANT: Only name, email, and password are sent.
    // Role is never accepted from the client — the server always assigns "customer".
    const result = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Registration failed. Please try again.");
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Create an account</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Join Grocify to start shopping fresh groceries.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="signup-name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              autoComplete="name"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="signup-email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="signup-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* No role selector — all public registrations are "customer" by design */}

          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/signin" className="font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}