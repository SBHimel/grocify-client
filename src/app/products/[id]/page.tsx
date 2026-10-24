import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchProductById } from "@/lib/api/catalog";
import { fetchProductReviews } from "@/lib/api/reviews";
import { ProductImageGallery } from "@/components/storefront/ProductImageGallery";
import { ProductDetailCartActions } from "@/components/storefront/ProductDetailCartActions";
import { ProductReviewsSection } from "@/components/storefront/ProductReviewsSection";
import { formatBDT } from "@/lib/currency";
import {
  Leaf,
  ShieldCheck,
  Truck,
  Banknote,
  Star,
  ArrowLeft,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Produce Not Found",
      description: "The requested grocery product could not be found in the catalog.",
      robots: { index: false, follow: false },
    };
  }

  const primaryImage = product.images?.[0]?.trim() || "/assets/grocify_logo.png";
  const title = product.name;
  const description =
    product.description?.trim().slice(0, 160) ||
    `Order fresh ${product.name} delivered to your door in 30 minutes with Cash on Delivery from Grocify.`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} | Grocify`,
      description,
      url: `/products/${product.slug || product.id}`,
      images: [
        {
          url: primaryImage,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Grocify`,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-[#fdfbf7] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#e5dbc7] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <Leaf className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-black text-gray-950">
            Grocery Item Not Found
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The requested produce item may have been updated, renamed, or is currently out of season.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#166534] text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Groceries</span>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch verified reviews for this product
  const reviews = await fetchProductReviews(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.retailPrice
      ? Math.round(
          ((product.originalPrice - product.retailPrice) / product.originalPrice) * 100
        )
      : null;

  const unitLabel =
    product.unit.sellUnit === product.unit.baseUnit
      ? `${product.unit.multiplier} ${product.unit.baseUnit}`
      : `${product.unit.multiplier} ${product.unit.baseUnit} / ${product.unit.sellUnit}`;

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#14532D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>
        </div>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-3xl border border-[#e5dbc7] shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-14 items-start">
            {/* Left: Multi-Image Product Gallery */}
            <div className="lg:col-span-6">
              <ProductImageGallery
                images={product.images}
                name={product.name}
                isOrganic={product.isOrganic}
                isSeasonal={product.isSeasonal}
                discountPercent={discountPercent}
              />
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    {product.categoryName || "Fresh Produce"}
                  </span>
                  {product.sku && (
                    <span className="text-[11px] font-mono text-gray-400">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs">
                  {product.rating !== undefined && product.rating > 0 && (
                    <div className="flex items-center gap-1 font-bold text-gray-800">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">
                        ({product.reviewCount ?? reviews.length} verified buyer reviews)
                      </span>
                    </div>
                  )}

                  <span className="text-gray-300">•</span>

                  {product.currentStock > 10 ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      In Stock ({product.currentStock} units ready)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Few Remaining ({product.currentStock} left)
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Unit Box */}
              <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e5dbc7]/80 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 block font-semibold uppercase tracking-wider">
                    Retail Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-[#14532D]">
                      {formatBDT(product.retailPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.retailPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatBDT(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-400 block font-semibold uppercase tracking-wider">
                    Package Unit
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {unitLabel}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Product Description & Freshness Notes
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Interactive Cart Stepper and Add Button */}
              <ProductDetailCartActions product={product} />

              {/* Guarantee Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#f0ebde]">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>30-Min Fast Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>100% Freshness Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Cash on Delivery (COD)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Ratings Section */}
        <ProductReviewsSection
          productId={product.id}
          initialReviews={reviews}
          productRating={product.rating}
          productReviewCount={product.reviewCount}
        />
      </div>
    </div>
  );
}
