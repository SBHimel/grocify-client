import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Grocify | Farm-Fresh Organic Groceries Delivered in 30 Mins",
    template: "%s | Grocify",
  },
  description:
    "Shop certified organic farm produce, fresh fruits, vegetables, dairy, and artisanal groceries delivered to your door in 30 minutes with Cash on Delivery (COD).",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fdfbf7] text-[#0f172a]">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e5dbc7",
                borderRadius: "1rem",
                fontSize: "13px",
                fontWeight: "600",
                boxShadow: "0 10px 25px -5px rgba(20, 83, 45, 0.1), 0 8px 10px -6px rgba(20, 83, 45, 0.1)",
              },
              success: {
                iconTheme: {
                  primary: "#14532D",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
