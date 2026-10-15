import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

export interface BatchData {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  purchaseId?: string;
  quantity: number;
  initialQuantity: number;
  unit: string;
  unitCost: number;
  expiryDate?: string;
  receivedDate: string;
  status: "available" | "expiring_soon" | "expired" | "quarantined" | "disposed";
  createdAt: string;
  updatedAt: string;
}

export interface StockMovementData {
  id: string;
  productId: string;
  productName: string;
  batchId?: string;
  batchNumber?: string;
  quantity: number;
  unit: string;
  movementType: string;
  referenceId?: string;
  notes?: string;
  performedBy?: {
    userId: string;
    email: string;
    name?: string;
    role: string;
  };
  createdAt: string;
}

export interface ExpiryInspectionData {
  quarantinedCount: number;
  expiringSoonCount: number;
  missingExpiryCount: number;
}

export interface ProductSimple {
  id: string;
  name: string;
  unit: {
    baseUnit: string;
    sellUnit: string;
    multiplier: number;
  };
  currentStock: number;
  minStockAlert: number;
}

/**
 * Get the JWT token for the current session to pass to the Express server.
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const sessionHeaders = await headers();
    const result = await auth.api.getToken({
      headers: sessionHeaders,
    });
    if (!result) return null;
    if (typeof result === "string") return result;
    if (typeof result === "object" && "token" in result && typeof result.token === "string") {
      return result.token;
    }
    return null;
  } catch (err) {
    console.error("Failed to retrieve auth token for inventory API:", err);
    return null;
  }
}

/**
 * Fetch all inventory batches with status, counts, and cost.
 */
export async function fetchInventoryBatches(token: string): Promise<BatchData[]> {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/batches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch batches: HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error in fetchInventoryBatches:", error);
    throw error;
  }
}

/**
 * Fetch stock movements audit log.
 */
export async function fetchStockMovements(token: string): Promise<StockMovementData[]> {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/movements?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch stock movements: HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error in fetchStockMovements:", error);
    throw error;
  }
}

/**
 * Fetch automated expiry inspection report.
 */
export async function fetchExpiryInspection(token: string): Promise<ExpiryInspectionData> {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/expiry-inspection`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch expiry inspection: HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.success && json.data
      ? json.data
      : { quarantinedCount: 0, expiringSoonCount: 0, missingExpiryCount: 0 };
  } catch (error) {
    console.error("Error in fetchExpiryInspection:", error);
    throw error;
  }
}

/**
 * Fetch available grocery products for the Add Batch selector.
 */
export async function fetchCatalogProducts(): Promise<ProductSimple[]> {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/products?limit=100`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error in fetchCatalogProducts:", error);
    return [];
  }
}

export { getAuthToken };
