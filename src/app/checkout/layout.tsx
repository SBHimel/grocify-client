import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your farm-fresh grocery order with Cash on Delivery (COD).",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
