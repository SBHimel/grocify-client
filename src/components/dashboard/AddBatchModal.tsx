"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ProductSimple } from "@/lib/api/inventory";

interface AddBatchModalProps {
  products: ProductSimple[];
}

export function AddBatchModal({ products }: AddBatchModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [productId, setProductId] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("piece");
  const [unitCost, setUnitCost] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [purchaseId, setPurchaseId] = useState("");

  const handleProductChange = (pId: string) => {
    setProductId(pId);
    const selected = products.find((p) => p.id === pId);
    if (selected && selected.unit) {
      setUnit(selected.unit.baseUnit || "piece");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!productId || !batchNumber.trim() || !quantity || !unitCost) {
      setErrorMsg("Please fill in all required fields (Product, Batch #, Quantity, Unit Cost).");
      return;
    }

    const numQty = parseFloat(quantity);
    const numCost = parseFloat(unitCost);

    if (isNaN(numQty) || numQty <= 0) {
      setErrorMsg("Quantity must be a positive number.");
      return;
    }

    if (isNaN(numCost) || numCost < 0) {
      setErrorMsg("Unit cost cannot be negative.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inventory/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          batchNumber: batchNumber.trim(),
          quantity: numQty,
          unit,
          unitCost: numCost,
          expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
          purchaseId: purchaseId.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to add batch (${res.status})`);
      }

      setSuccessMsg(`Batch ${batchNumber} created successfully! Stock has been updated.`);
      setBatchNumber("");
      setQuantity("");
      setUnitCost("");
      setExpiryDate("");
      setPurchaseId("");

      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg(null);
        router.refresh();
      }, 1200);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-[#166534] transition-all shadow-sm active:scale-95"
      >
        <PlusCircle className="w-4 h-4" />
        Add Inventory Batch
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e5dbc7] text-left">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-950">Receive New Stock Batch</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Record inventory batch with optional expiry and weighted unit cost.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                >
                  <option value="">-- Choose Grocery Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit?.baseUnit || "unit"} • In stock: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Batch Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g. BATCH-2026-001"
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PO / Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={purchaseId}
                    onChange={(e) => setPurchaseId(e.target.value)}
                    placeholder="e.g. PO-8890"
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    required
                  >
                    <option value="piece">piece</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="packet">packet</option>
                    <option value="box">box</option>
                    <option value="carton">carton</option>
                    <option value="litre">litre</option>
                    <option value="ml">ml</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Cost/Unit ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    placeholder="e.g. 2.45"
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Items without an expiry date will not be auto-quarantined. Perishables will follow FEFO.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-[#166534] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Receiving...
                    </>
                  ) : (
                    "Save Batch"
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
