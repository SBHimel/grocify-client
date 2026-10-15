import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  fetchInventoryBatches,
  fetchStockMovements,
  fetchExpiryInspection,
  fetchCatalogProducts,
  getAuthToken,
  BatchData,
  StockMovementData,
} from "@/lib/api/inventory";
import { AddBatchModal } from "@/components/dashboard/AddBatchModal";
import {
  Layers,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowDownUp,
  PackageCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Inventory & Batch Management | Grocify Back-Office",
  description: "Monitor grocery inventory batches, FEFO allocation, expiry alerts, and stock movements.",
};

const getStatusBadge = (status: BatchData["status"]) => {
  switch (status) {
    case "available":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Available
        </span>
      );
    case "expiring_soon":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
          Expiring Soon
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          Expired
        </span>
      );
    case "quarantined":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
          Quarantined
        </span>
      );
    case "disposed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
          Depleted / Disposed
        </span>
      );
    default:
      return null;
  }
};

const formatMovementType = (type: string) => {
  switch (type) {
    case "purchase_received":
      return <span className="text-emerald-700 font-bold">Purchase Received</span>;
    case "sale_fefo_out":
      return <span className="text-blue-700 font-bold">FEFO Sale Out</span>;
    case "sale_allocation":
      return <span className="text-indigo-700 font-bold">Sale Allocation</span>;
    case "quarantine":
      return <span className="text-purple-700 font-bold">Quarantine</span>;
    case "disposal":
      return <span className="text-red-700 font-bold">Disposal</span>;
    case "adjustment_in":
      return <span className="text-teal-700 font-bold">Adjustment In</span>;
    case "adjustment_out":
      return <span className="text-orange-700 font-bold">Adjustment Out</span>;
    default:
      return <span>{type}</span>;
  }
};

export default async function InventoryPage() {
  // Enforce Owner or Manager access
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?from=/dashboard/seller/inventory");
  }

  const role = (session.user.role || "customer").toLowerCase();
  if (role !== "owner" && role !== "manager" && role !== "seller" && role !== "admin") {
    redirect("/");
  }

  const token = await getAuthToken();

  let batches: BatchData[] = [];
  let movements: StockMovementData[] = [];
  let expiryReport = { quarantinedCount: 0, expiringSoonCount: 0, missingExpiryCount: 0 };
  let products = await fetchCatalogProducts();
  let errorState: string | null = null;

  if (!token) {
    errorState = "Unable to generate authentication token for inventory service.";
  } else {
    try {
      const [fetchedBatches, fetchedMovements, fetchedExpiry] = await Promise.all([
        fetchInventoryBatches(token),
        fetchStockMovements(token),
        fetchExpiryInspection(token),
      ]);
      batches = fetchedBatches;
      movements = fetchedMovements;
      expiryReport = fetchedExpiry;
    } catch (err) {
      errorState = err instanceof Error ? err.message : "Failed to load inventory data from server.";
    }
  }

  // Calculate high-level summary metrics
  const totalBatches = batches.length;
  const activeBatches = batches.filter((b) => b.quantity > 0 && b.status !== "quarantined");
  const totalItemsCount = activeBatches.reduce((acc, b) => acc + b.quantity, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e5dbc7]/60">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Store Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Batch Inventory & Stock Movements
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time FEFO batch allocation, expiry tracking, and audit movements for Grocify produce.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AddBatchModal products={products} />
        </div>
      </div>

      {errorState && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div>
            <p className="font-bold">Inventory API Error</p>
            <p className="font-normal text-red-600 mt-0.5">{errorState}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Batches */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5dbc7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Batches</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{activeBatches.length}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{totalBatches} total recorded</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#14532D] flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5dbc7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Expiring Soon (7d)</p>
            <h3 className="text-2xl font-black text-amber-700 mt-1">{expiryReport.expiringSoonCount}</h3>
            <p className="text-[11px] text-amber-600/80 mt-0.5">FEFO prioritized</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Quarantined / Expired */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5dbc7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Quarantined Stock</p>
            <h3 className="text-2xl font-black text-red-700 mt-1">{expiryReport.quarantinedCount}</h3>
            <p className="text-[11px] text-red-600/80 mt-0.5">Excluded from sale</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Missing Expiry Warnings */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5dbc7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">No Expiry Date</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{expiryReport.missingExpiryCount}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Inspection warning</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Batch Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#e5dbc7] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-gray-900">Current Inventory Batches</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Individual received purchase lots with FEFO expiration sequencing and unit costs.
            </p>
          </div>
          <span className="text-xs font-bold text-[#14532D] bg-emerald-50 px-3 py-1 rounded-full">
            {batches.length} Batches
          </span>
        </div>

        {batches.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <PackageCheck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-bold text-gray-600">No inventory batches recorded yet</p>
            <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">
              Click &quot;Add Inventory Batch&quot; above to receive your first stock lot into MongoDB.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-[#fdfbf7] text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-[#e5dbc7]">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Batch Number</th>
                  <th className="py-3.5 px-4">Remaining / Initial</th>
                  <th className="py-3.5 px-4">Unit Cost</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {batch.productName}
                      {batch.purchaseId && (
                        <span className="block text-[10px] text-gray-400 font-normal">
                          Ref: {batch.purchaseId}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-700">
                      {batch.batchNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">{batch.quantity}</span>
                      <span className="text-gray-400"> / {batch.initialQuantity} {batch.unit}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      ${batch.unitCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {batch.expiryDate ? (
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{new Date(batch.expiryDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">No Expiry</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(batch.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Movement Audit Log */}
      <div className="bg-white rounded-3xl border border-[#e5dbc7] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-[#14532D]" />
              <h2 className="text-base font-black text-gray-900">Stock Movement Audit Trail</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Immutable ledger of all purchases, FEFO deductions, adjustments, and quarantine events.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
            {movements.length} Events
          </span>
        </div>

        {movements.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ArrowDownUp className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-bold text-gray-600">No stock movements recorded yet</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Movements are logged automatically when receiving stock or performing sales.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-[#fdfbf7] text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-[#e5dbc7]">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Product & Batch</th>
                  <th className="py-3.5 px-4">Movement Type</th>
                  <th className="py-3.5 px-4">Quantity Change</th>
                  <th className="py-3.5 px-4">Performed By</th>
                  <th className="py-3.5 px-4">Notes / Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((move) => (
                  <tr key={move.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(move.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900 block">{move.productName}</span>
                      {move.batchNumber && (
                        <span className="text-[10px] text-gray-500 font-mono">
                          Batch: {move.batchNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {formatMovementType(move.movementType)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={
                          move.quantity > 0
                            ? "text-emerald-700"
                            : move.quantity < 0
                            ? "text-red-700"
                            : "text-gray-700"
                        }
                      >
                        {move.quantity > 0 ? `+${move.quantity}` : move.quantity} {move.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {move.performedBy ? (
                        <div>
                          <span className="font-bold text-gray-900 block text-[11px]">
                            {move.performedBy.name || move.performedBy.email}
                          </span>
                          <span className="text-[10px] text-gray-400 capitalize">
                            Role: {move.performedBy.role}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">System Process</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px] max-w-xs truncate">
                      {move.notes || move.referenceId || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
