"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    amountUntilFreeDelivery,
  } = useCart();

  const [checkoutNotice, setCheckoutNotice] = useState(false);

  if (!isCartOpen) return null;

  const total = subtotal + deliveryFee;
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  const handleCheckoutClick = () => {
    setCheckoutNotice(true);
    setTimeout(() => setCheckoutNotice(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#fdfbf7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#14532D] text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">
                Your Fresh Basket
              </h2>
              <p className="text-xs text-gray-500">
                {totalCount} {totalCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-[#f0fdf4] border-b border-emerald-100 p-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <Truck className="w-4 h-4 text-emerald-600" />
              {amountUntilFreeDelivery === 0
                ? "🎉 You unlocked FREE Express Delivery!"
                : `Add $${amountUntilFreeDelivery.toFixed(2)} more for FREE delivery`}
            </span>
            <span className="text-emerald-700 font-bold">
              {freeDeliveryProgress}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-emerald-200/60 overflow-hidden">
            <div
              className="h-full bg-[#14532D] rounded-full transition-all duration-500"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#f4f1e8] text-emerald-800 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Your basket is empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Explore our farm-fresh fruits, crisp veggies, dairy, and artisanal sourdough to fill your cart.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#166534] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="py-4 flex gap-3.5 items-center">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  <Image
                    src={product.images[0] || ""}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    ${product.retailPrice.toFixed(2)} / {product.unit.sellUnit}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-black rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-gray-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-black rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-gray-900">
                    ${(product.retailPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#fdfbf7] space-y-3">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Estimated Delivery</span>
                <span className="font-semibold text-gray-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-950 pt-2 border-t border-gray-200">
                <span>Estimated Total</span>
                <span className="text-base text-[#14532D]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* COD Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Cash on Delivery (COD) supported upon delivery inspection.</span>
            </div>

            {checkoutNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Storefront UI preview: Full COD checkout flow will activate in Phase 10!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm py-3 rounded-2xl shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors py-1"
              >
                Clear Entire Basket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
