import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join Grocify for 30-minute organic grocery delivery and exclusive seasonal harvest discounts.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
