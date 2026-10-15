"use client";

import React, { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { GroceryProduct } from "@/types";
import { useCart } from "@/context/CartContext";

export const ProductDetailCartActions: React.FC<{ product: GroceryProduct }> = ({
  product,
}) => {
  const { addToCart, updateQuantity, getItemQuantity, openCart } = useCart();
  const quantityInCart = getItemQuantity(product.id);
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAdd = () => {
    addToCart(product, selectedQty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-4">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-white hover:text-black transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-sm text-gray-900">
            {selectedQty}
          </span>
          <button
            type="button"
            onClick={() => setSelectedQty(selectedQty + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-white hover:text-black transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          {addedNotice ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Added to Basket!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span>Add to Basket (${(product.retailPrice * selectedQty).toFixed(2)})</span>
            </>
          )}
        </button>

        {/* Quick View Cart */}
        {quantityInCart > 0 && (
          <button
            type="button"
            onClick={openCart}
            className="text-xs font-bold text-[#14532D] bg-emerald-50 border border-emerald-200 px-3.5 py-3.5 rounded-2xl hover:bg-emerald-100 transition-colors"
          >
            Basket ({quantityInCart})
          </button>
        )}
      </div>

      {addedNotice && (
        <p className="text-xs font-semibold text-emerald-700 animate-in fade-in">
          ✓ {selectedQty} {product.unit.sellUnit}(s) added. Click basket to review or checkout.
        </p>
      )}
    </div>
  );
};
