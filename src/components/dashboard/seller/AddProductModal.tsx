"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2, Upload, AlertCircle, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { uploadToImgBB } from "@/lib/imgUpload";

interface CategoryOption {
  id: string;
  name: string;
}

interface AddProductModalProps {
  categories?: CategoryOption[];
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "fresh-fruits", name: "Fresh Fruits" },
  { id: "crisp-veggies", name: "Crisp Veggies" },
  { id: "dairy-eggs", name: "Dairy & Eggs" },
  { id: "artisan-bakery", name: "Artisan Bakery" },
  { id: "pantry-staples", name: "Pantry Staples" },
  { id: "organic-beverages", name: "Organic Beverages" },
  { id: "meat-poultry", name: "Meat & Poultry" },
  { id: "healthy-snacks", name: "Healthy Snacks" },
];

export default function AddProductModal({ categories = DEFAULT_CATEGORIES }: AddProductModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [description, setDescription] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [baseUnit, setBaseUnit] = useState("piece");
  const [sellUnit, setSellUnit] = useState("piece");
  const [multiplier, setMultiplier] = useState("1");
  const [currentStock, setCurrentStock] = useState("10");
  const [minStockAlert, setMinStockAlert] = useState("5");
  const [isOrganic, setIsOrganic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading product image to ImgBB...");

    try {
      const result = await uploadToImgBB(file);
      setImageUrl(result.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters.";
    }

    const price = parseFloat(retailPrice);
    if (isNaN(price) || price < 0) {
      errors.retailPrice = "Please enter a valid non-negative retail price.";
    }

    if (!categoryId) {
      errors.categoryId = "Please select a category.";
    }

    if (!baseUnit.trim()) {
      errors.baseUnit = "Base unit is required (e.g. piece, kg, g).";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the form fields highlighted in red.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating product in catalog...");

    try {
      const payload = {
        name: name.trim(),
        categoryId,
        description: description.trim(),
        retailPrice: parseFloat(retailPrice),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        unit: {
          baseUnit: baseUnit.trim(),
          sellUnit: sellUnit.trim() || baseUnit.trim(),
          multiplier: parseFloat(multiplier) || 1,
        },
        currentStock: parseInt(currentStock, 10) || 0,
        minStockAlert: parseInt(minStockAlert, 10) || 5,
        isOrganic,
        isFeatured,
        images: imageUrl ? [imageUrl] : ["/assets/grocify_logo.png"],
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to create product (${res.status})`);
      }

      toast.success(`Product "${name}" created successfully!`, { id: toastId });

      // Reset form
      setName("");
      setDescription("");
      setRetailPrice("");
      setOriginalPrice("");
      setImageUrl("");
      setFieldErrors({});

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred while creating product.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
        style={{ background: "#14532D" }}
      >
        <PlusCircle className="w-4 h-4" />
        Add Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border max-h-[90vh] overflow-y-auto"
            style={{ borderColor: "#e5dbc7" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-950">Add Grocery Product</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Save a new product to MongoDB with ImgBB-hosted imagery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="e.g. Organic Hass Avocados"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border bg-gray-50/50 outline-none transition-all ${
                    fieldErrors.name
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-[#14532D] focus:bg-white"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Retail Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={retailPrice}
                    onChange={(e) => {
                      setRetailPrice(e.target.value);
                      if (fieldErrors.retailPrice) setFieldErrors((prev) => ({ ...prev, retailPrice: "" }));
                    }}
                    placeholder="4.99"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border bg-gray-50/50 outline-none transition-all ${
                      fieldErrors.retailPrice
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-[#14532D] focus:bg-white"
                    }`}
                  />
                  {fieldErrors.retailPrice && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.retailPrice}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Organic, pesticide-free, delivered chilled within 24h..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none resize-none"
                />
              </div>

              {/* Unit conversions & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Base Unit
                  </label>
                  <input
                    type="text"
                    value={baseUnit}
                    onChange={(e) => setBaseUnit(e.target.value)}
                    placeholder="piece, kg, g"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 bg-gray-50/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Sell Unit
                  </label>
                  <input
                    type="text"
                    value={sellUnit}
                    onChange={(e) => setSellUnit(e.target.value)}
                    placeholder="pack, box"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 bg-gray-50/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 bg-gray-50/50 outline-none"
                  />
                </div>
              </div>

              {/* Image Upload with ImgBB */}
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#14532D]" />
                    Product Image (Hosted on ImgBB)
                  </label>
                  {isUploading && (
                    <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </span>
                  )}
                </div>

                {imageUrl ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[#e5dbc7]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{imageUrl}</p>
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="text-[11px] text-red-600 hover:underline font-semibold"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={isUploading}
                      id="product-image-file"
                      className="hidden"
                    />
                    <label
                      htmlFor="product-image-file"
                      className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                      Select Image to Upload
                    </label>
                    <p className="text-[10px] text-gray-400 text-center mt-1.5">
                      JPG, PNG, WEBP up to 10MB. Uploads directly using your ImgBB key.
                    </p>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOrganic}
                    onChange={(e) => setIsOrganic(e.target.checked)}
                    className="rounded text-[#14532D] focus:ring-[#14532D]"
                  />
                  <span>100% Organic</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#14532D] focus:ring-[#14532D]"
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#14532D" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
