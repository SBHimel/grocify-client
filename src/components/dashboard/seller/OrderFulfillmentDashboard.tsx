"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  XCircle,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  RefreshCw,
  X,
  FileText,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import type { CustomerOrder, OrderStatus } from "@/types";
import { formatBDT } from "@/lib/currency";

interface OrderFulfillmentDashboardProps {
  initialOrders: CustomerOrder[];
  userRole: string;
}

export const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    bg: string;
    color: string;
    border: string;
    nextStatus?: OrderStatus;
    nextLabel?: string;
  }
> = {
  pending: {
    label: "Pending",
    bg: "#fefce8",
    color: "#854d0e",
    border: "#fef08a",
    nextStatus: "confirmed",
    nextLabel: "Confirm Order",
  },
  confirmed: {
    label: "Confirmed",
    bg: "#eff6ff",
    color: "#1d4ed8",
    border: "#bfdbfe",
    nextStatus: "preparing",
    nextLabel: "Start Preparing",
  },
  preparing: {
    label: "Preparing",
    bg: "#f0fdf4",
    color: "#15803d",
    border: "#bbf7d0",
    nextStatus: "out_for_delivery",
    nextLabel: "Dispatch for Delivery",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    bg: "#fff7ed",
    color: "#c2410c",
    border: "#fed7aa",
    nextStatus: "delivered",
    nextLabel: "Mark Delivered",
  },
  delivered: {
    label: "Delivered",
    bg: "#dcfce7",
    color: "#14532d",
    border: "#86efac",
  },
  cancelled: {
    label: "Cancelled",
    bg: "#fef2f2",
    color: "#b91c1c",
    border: "#fecaca",
  },
};

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function OrderFulfillmentDashboard({
  initialOrders,
  userRole,
}: OrderFulfillmentDashboardProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const canManage =
    userRole === "owner" ||
    userRole === "manager" ||
    userRole === "admin" ||
    userRole === "seller";

  // Calculate stats
  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const inProgress = orders.filter(
      (o) =>
        o.status === "confirmed" ||
        o.status === "preparing" ||
        o.status === "out_for_delivery"
    ).length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    return {
      total: orders.length,
      pending,
      inProgress,
      delivered,
      cancelled,
    };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = order.customerName.toLowerCase().includes(q);
        const matchesPhone = order.customerPhone.toLowerCase().includes(q);
        const matchesAddress = order.deliveryAddress.toLowerCase().includes(q);
        const matchesItem = order.items.some((i) =>
          i.productName.toLowerCase().includes(q)
        );
        return (
          matchesNumber ||
          matchesCustomer ||
          matchesPhone ||
          matchesAddress ||
          matchesItem
        );
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Refresh orders from API
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/orders?limit=50", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load orders.");
      const json = await res.json();
      if (json.success && json.data?.orders) {
        setOrders(json.data.orders);
        toast.success("Orders refreshed.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to refresh.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Status transition handler
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!canManage) {
      toast.error("Only owners and managers can update order status.");
      return;
    }

    if (newStatus === "cancelled") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order? This cannot be undone."
      );
      if (!confirmed) return;
    }

    setIsUpdatingId(orderId);
    const toastId = toast.loading(`Updating order status to ${STATUS_CONFIG[newStatus]?.label || newStatus}...`);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update order status.");
      }

      const updatedOrder = json.data as CustomerOrder;

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: updatedOrder?.updatedAt } : o))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      toast.success(`Order updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}!`, { id: toastId });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error updating order status.";
      toast.error(message, { id: toastId });
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2"
            style={{ background: "#fefce8", color: "#854d0e" }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Fulfillment Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track customer orders, advance fulfillment stages, and manage COD deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm bg-white hover:bg-gray-50 transition-all shadow-xs self-start sm:self-auto cursor-pointer disabled:opacity-50"
          style={{ borderColor: "#e5dbc7", color: "#14532d" }}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing…" : "Refresh Orders"}</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          className="bg-white rounded-2xl border p-4 sm:p-5 shadow-xs"
          style={{ borderColor: "#e5dbc7" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Total Orders
            </span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#f0fdf4", color: "#14532d" }}
            >
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {stats.total}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">all-time customer orders</p>
        </div>

        <div
          className="bg-white rounded-2xl border p-4 sm:p-5 shadow-xs"
          style={{ borderColor: "#fef08a" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Pending Action
            </span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#fefce8", color: "#854d0e" }}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">
            {stats.pending}
          </p>
          <p className="text-xs text-amber-600/80 mt-0.5">awaiting confirmation</p>
        </div>

        <div
          className="bg-white rounded-2xl border p-4 sm:p-5 shadow-xs"
          style={{ borderColor: "#bfdbfe" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              In Progress
            </span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#eff6ff", color: "#1d4ed8" }}
            >
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">
            {stats.inProgress}
          </p>
          <p className="text-xs text-blue-600/80 mt-0.5">confirmed / preparing / out</p>
        </div>

        <div
          className="bg-white rounded-2xl border p-4 sm:p-5 shadow-xs"
          style={{ borderColor: "#bbf7d0" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Delivered
            </span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#f0fdf4", color: "#15803d" }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2">
            {stats.delivered}
          </p>
          <p className="text-xs text-emerald-600/80 mt-0.5">successfully completed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="bg-white rounded-2xl border p-4 shadow-xs space-y-4"
        style={{ borderColor: "#e5dbc7" }}
      >
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number, customer name, phone, address, or item…"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2"
            style={{
              borderColor: "#e5dbc7",
              background: "#fdfbf7",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { key: "all", label: "All Orders", count: stats.total },
            { key: "pending", label: "Pending", count: stats.pending },
            { key: "confirmed", label: "Confirmed", count: orders.filter((o) => o.status === "confirmed").length },
            { key: "preparing", label: "Preparing", count: orders.filter((o) => o.status === "preparing").length },
            { key: "out_for_delivery", label: "Out for Delivery", count: orders.filter((o) => o.status === "out_for_delivery").length },
            { key: "delivered", label: "Delivered", count: stats.delivered },
            { key: "cancelled", label: "Cancelled", count: stats.cancelled },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-[#14532D] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active ? "bg-white/20 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div
          className="text-center py-16 px-4 rounded-3xl border bg-white"
          style={{ borderColor: "#e5dbc7" }}
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#f0fdf4" }}
          >
            <Package className="w-8 h-8" style={{ color: "#14532d" }} />
          </div>
          <h2 className="text-lg font-black text-gray-900 mb-1">No orders found</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-4">
            {searchQuery || statusFilter !== "all"
              ? "No orders match the selected filters. Try adjusting your search query or status filter."
              : "No customer orders have been placed yet. As customers check out, their orders will appear here for fulfillment."}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#14532D] border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const isUpdating = isUpdatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                style={{ borderColor: "#e5dbc7" }}
              >
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Order Info & Customer */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      <Package className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-black text-gray-950">
                          {order.orderNumber}
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                          style={{
                            background: statusCfg.bg,
                            color: statusCfg.color,
                            borderColor: statusCfg.border,
                          }}
                        >
                          {statusCfg.label}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateStr}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                        <span className="font-bold text-gray-900">{order.customerName}</span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {order.customerPhone}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total, Action & Status Selector */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 flex-shrink-0">
                    <div className="text-left lg:text-right pr-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        COD Total
                      </span>
                      <span className="text-base sm:text-lg font-black" style={{ color: "#14532D" }}>
                        {formatBDT(order.totalAmount)}
                      </span>
                    </div>

                    {/* Quick Stage Progression Button */}
                    {canManage && statusCfg.nextStatus && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, statusCfg.nextStatus!)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs text-white shadow-xs hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>{statusCfg.nextLabel}</span>
                      </button>
                    )}

                    {/* Status Dropdown */}
                    {canManage && (
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-50"
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {STATUS_CONFIG[st]?.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-2 rounded-xl border text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ borderColor: "#e5dbc7" }}
                    >
                      Details
                    </button>
                  </div>
                </div>

                {/* Items Preview Strip */}
                <div
                  className="px-4 sm:px-5 py-2.5 bg-[#fdfbf7] border-t flex flex-wrap items-center gap-2 text-xs"
                  style={{ borderColor: "#f3ede0" }}
                >
                  <span className="text-[11px] font-bold text-gray-500">
                    Items ({order.items.length}):
                  </span>
                  {order.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border text-gray-800"
                      style={{ borderColor: "#e5dbc7" }}
                    >
                      <span className="font-bold text-[#14532D]">{item.quantity}×</span>
                      <span>{item.productName}</span>
                      <span className="text-[10px] text-gray-400">({item.unit})</span>
                    </span>
                  ))}
                  {order.notes && (
                    <span className="ml-auto text-[11px] text-amber-700 italic flex items-center gap-1 truncate max-w-xs">
                      <FileText className="w-3 h-3 text-amber-600 flex-shrink-0" />
                      Note: {order.notes}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-3xl border shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            style={{ borderColor: "#e5dbc7" }}
          >
            {/* Modal Header */}
            <div
              className="p-5 sm:p-6 border-b flex items-center justify-between"
              style={{ borderColor: "#f3ede0", background: "#fdfbf7" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-base font-black text-gray-950">
                    {selectedOrder.orderNumber}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                    style={{
                      background: STATUS_CONFIG[selectedOrder.status]?.bg,
                      color: STATUS_CONFIG[selectedOrder.status]?.color,
                      borderColor: STATUS_CONFIG[selectedOrder.status]?.border,
                    }}
                  >
                    {STATUS_CONFIG[selectedOrder.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Placed on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Status progression stepper */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Fulfillment Status Flow
                </h3>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  {(["pending", "confirmed", "preparing", "out_for_delivery", "delivered"] as OrderStatus[]).map(
                    (step, idx) => {
                      const stepOrder = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
                      const currentIdx = stepOrder.indexOf(selectedOrder.status);
                      const stepIdx = stepOrder.indexOf(step);
                      const isComplete = currentIdx >= stepIdx && selectedOrder.status !== "cancelled";
                      const isCurrent = selectedOrder.status === step;

                      return (
                        <div
                          key={step}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                            isCurrent
                              ? "bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-500/20"
                              : isComplete
                              ? "bg-gray-50 border-gray-200 text-gray-700"
                              : "bg-gray-50/50 border-gray-100 text-gray-400"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                              isComplete ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isComplete ? <Check className="w-3 h-3" /> : idx + 1}
                          </span>
                          <span className="capitalize leading-tight">
                            {STATUS_CONFIG[step]?.label}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
                {selectedOrder.status === "cancelled" && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>This order has been cancelled.</span>
                  </div>
                )}
              </div>

              {/* Customer & Delivery details */}
              <div
                className="p-4 rounded-2xl border bg-[#fdfbf7] space-y-3"
                style={{ borderColor: "#e5dbc7" }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Customer Name</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Phone Number</span>
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block font-medium">Delivery Address</span>
                    <span className="font-semibold text-gray-800 leading-relaxed">
                      {selectedOrder.deliveryAddress}
                    </span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block font-medium">Customer Delivery Notes</span>
                      <span className="italic text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg block border border-amber-200 mt-1">
                        &quot;{selectedOrder.notes}&quot;
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Order Items Breakdown
                </h3>
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: "#f3ede0" }}
                >
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                        <th className="py-2.5 px-3 text-left">Product</th>
                        <th className="py-2.5 px-3 text-center">Unit</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3 font-bold text-gray-900">
                            {item.productName}
                          </td>
                          <td className="py-2.5 px-3 text-center text-gray-500">
                            {item.unit}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-[#14532D]">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-right text-gray-600">
                            {formatBDT(item.unitPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                            {formatBDT(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="mt-3 space-y-1.5 p-3 rounded-xl bg-gray-50 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatBDT(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {selectedOrder.deliveryFee === 0 ? "Free" : formatBDT(selectedOrder.deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-gray-200">
                    <span>Total (COD)</span>
                    <span style={{ color: "#14532D" }}>
                      {formatBDT(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div
              className="p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3"
              style={{ borderColor: "#f3ede0", background: "#fdfbf7" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold">Change Status:</span>
                <select
                  value={selectedOrder.status}
                  disabled={isUpdatingId === selectedOrder.id || !canManage}
                  onChange={(e) =>
                    handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer disabled:opacity-50"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_CONFIG[st]?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  style={{ borderColor: "#e5dbc7" }}
                >
                  Close
                </button>

                {canManage && STATUS_CONFIG[selectedOrder.status]?.nextStatus && (
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateStatus(
                        selectedOrder.id,
                        STATUS_CONFIG[selectedOrder.status].nextStatus!
                      )
                    }
                    disabled={isUpdatingId === selectedOrder.id}
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white shadow-xs hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                    style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
                  >
                    {isUpdatingId === selectedOrder.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>{STATUS_CONFIG[selectedOrder.status]?.nextLabel}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
