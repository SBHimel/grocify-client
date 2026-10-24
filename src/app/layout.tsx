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
import { AiChatbotWidget } from "@/components/storefront/AiChatbotWidget";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Grocify — Farm-Fresh Organic Groceries Delivered in 30 Mins",
    template: "%s | Grocify",
  },
  description:
    "Shop certified organic farm produce, fresh fruits, vegetables, dairy, and artisanal groceries delivered to your door in 30 minutes with Cash on Delivery (COD).",
  applicationName: "Grocify",
  authors: [{ name: "Grocify" }],
  keywords: [
    "grocery delivery",
    "organic produce",
    "farm fresh vegetables",
    "fresh fruits",
    "cash on delivery grocery",
    "fast grocery delivery",
    "Grocify",
  ],
  icons: {
    icon: [
      { url: "/assets/grocify_logo.png", type: "image/png" },
    ],
    shortcut: "/assets/grocify_logo.png",
    apple: [
      { url: "/assets/grocify_logo.png", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "/",
    siteName: "Grocify",
    title: "Grocify — Farm-Fresh Organic Groceries Delivered in 30 Mins",
    description:
      "Shop certified organic farm produce, fresh fruits, vegetables, dairy, and artisanal groceries delivered to your door in 30 minutes with Cash on Delivery (COD).",
    images: [
      {
        url: "/assets/grocify_logo.png",
        width: 800,
        height: 800,
        alt: "Grocify — Farm-to-Door Grocery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grocify — Farm-Fresh Organic Groceries Delivered in 30 Mins",
    description:
      "Shop certified organic farm produce, fresh fruits, vegetables, dairy, and artisanal groceries delivered to your door in 30 minutes with Cash on Delivery (COD).",
    images: ["/assets/grocify_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
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
          <AiChatbotWidget />
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
