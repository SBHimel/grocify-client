"use client";
/**
 * Grocify Sign In Page
 */
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Sign in failed. Please check your credentials.");
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Sign in to Grocify</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Welcome back! Enter your credentials to continue.
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
            <label htmlFor="signin-email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="signin-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              required
              placeholder="Your password"
              autoComplete="current-password"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            id="signin-submit"
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Grocify?{" "}
          <a href="/signup" className="font-medium hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}