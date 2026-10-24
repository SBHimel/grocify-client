import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Grocify account to track grocery deliveries and view order history.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
