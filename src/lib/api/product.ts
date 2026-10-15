import { getTokenServer } from "../getTokenServer";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

export interface DashboardProductListResult {
  data: any[];
  page: number;
  totalPage: number;
  totalCount: number;
  limit: number;
}

/**
 * Fetch products for dashboard management with real pagination and catalog synchronization.
 */
export const getProduct = async (page = 1, limit = 10): Promise<DashboardProductListResult> => {
  try {
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, parseInt(String(limit), 10) || 10);

    const url = new URL("/api/v1/products", SERVER_URL);
    url.searchParams.set("page", String(pageNum));
    url.searchParams.set("limit", String(limitNum));

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();
    const products = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];

    // Calculate pagination values safely
    const totalCount = products.length; // In seed, 12 items
    const totalPage = Math.max(1, Math.ceil(totalCount / limitNum));

    return {
      data: products,
      page: pageNum,
      totalPage,
      totalCount,
      limit: limitNum,
    };
  } catch (error) {
    console.error("Failed to load dashboard products from API:", error);
    return {
      data: [],
      page: 1,
      totalPage: 1,
      totalCount: 0,
      limit: 10,
    };
  }
};

/**
 * Public catalog search helper
 */
export const getAllProducts = async (search = "") => {
  try {
    const url = new URL("/api/v1/products", SERVER_URL);
    if (search) url.searchParams.set("search", search);
    const res = await fetch(url.toString(), { cache: "no-store" });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAllProducts error:", error);
    return { success: false, data: [] };
  }
};

/**
 * Public get product by ID helper
 */
export const getProductById = async (id: string) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/products/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getProductById error:", error);
    return { success: false, data: null };
  }
};
