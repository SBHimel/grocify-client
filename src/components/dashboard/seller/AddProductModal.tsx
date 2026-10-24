"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2, Upload, AlertCircle, X, Image as ImageIcon, Plus } from "lucide-react";
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
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s) to ImgBB...`);

    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadToImgBB(file);
        uploadedUrls.push(result.url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`, { id: toastId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput.trim());
      setImages((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
    } catch {
      toast.error("Please enter a valid HTTP/HTTPS image URL.");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
        isSeasonal,
        images: images.length > 0 ? images : ["/assets/grocify_logo.png"],
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
      setImages([]);
      setUrlInput("");
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
                  Save a new product to MongoDB with multi-image gallery support.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
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
                    Retail Price (৳) <span className="text-red-500">*</span>
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

              {/* Original Compare Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Original / Compare-At Price (৳){" "}
                  <span className="text-gray-400 font-normal">(optional, for discount badge)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="5.99"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none"
                />
              </div>

              {/* Unit Conversion Fields */}
              <div className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-[#e5dbc7]/70 space-y-3">
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Unit Conversion Settings
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Base Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={baseUnit}
                      onChange={(e) => setBaseUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 bg-white"
                    >
                      <option value="piece">Piece</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="packet">Packet</option>
                      <option value="box">Box</option>
                      <option value="carton">Carton</option>
                      <option value="litre">Litre</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Sell Unit</label>
                    <select
                      value={sellUnit}
                      onChange={(e) => setSellUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 bg-white"
                    >
                      <option value="piece">Piece</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="packet">Packet</option>
                      <option value="box">Box</option>
                      <option value="carton">Carton</option>
                      <option value="litre">Litre</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Multiplier
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.001"
                      value={multiplier}
                      onChange={(e) => setMultiplier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Min Stock Alert Ceiling
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description & Tasting Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh morning-harvest produce notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none"
                />
              </div>

              {/* Multi-Image Gallery Manager */}
              <div className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-[#e5dbc7]/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800">
                    Product Gallery Images ({images.length})
                  </label>
                  {isUploading && (
                    <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading to ImgBB...
                    </span>
                  )}
                </div>

                {/* Added Images Thumbnail Strip */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                    {images.map((img, idx) =>
                      img && img.trim() !== "" ? (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-xl overflow-hidden border border-[#e5dbc7] bg-white shadow-2xs"
                        >
                          <img
                            src={img}
                            alt={`Product view ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#14532D] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                {/* Upload or Add URL Controls */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFilesChange}
                      disabled={isUploading}
                      id="product-images-files"
                      className="hidden"
                    />
                    <label
                      htmlFor="product-images-files"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-xl bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>Upload Files to ImgBB</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Or paste external image URL..."
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-gray-200 bg-white outline-none focus:border-[#14532D]"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
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
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeasonal}
                    onChange={(e) => setIsSeasonal(e.target.checked)}
                    className="rounded text-[#14532D] focus:ring-[#14532D]"
                  />
                  <span>Fresh Harvest Seasonal</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
