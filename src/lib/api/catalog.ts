import { GroceryCategory, GroceryProduct } from "@/types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/data/mockGrocery";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

export interface GetProductsParams {
  search?: string;
  category?: string;
  isFeatured?: boolean;
  isOrganic?: boolean;
  isSeasonal?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch products from the real Grocify Express API with graceful fallback.
 */
export const fetchProducts = async (
  params?: GetProductsParams
): Promise<GroceryProduct[]> => {
  try {
    const url = new URL("/api/v1/products", SERVER_URL);

    if (params?.search) url.searchParams.set("search", params.search);
    if (params?.category) url.searchParams.set("category", params.category);
    if (params?.isFeatured) url.searchParams.set("isFeatured", "true");
    if (params?.isOrganic) url.searchParams.set("isOrganic", "true");
    if (params?.isSeasonal) url.searchParams.set("isSeasonal", "true");
    if (params?.sort) url.searchParams.set("sort", params.sort);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }

    if (Array.isArray(json)) {
      return json;
    }

    return MOCK_PRODUCTS;
  } catch (error) {
    // Graceful offline/loading fallback using typed mock data
    console.warn("Express products API unreachable or errored, using mock fallback:", error);
    let filtered = [...MOCK_PRODUCTS];

    if (params?.category) {
      filtered = filtered.filter(
        (p) => p.categoryId === params.category || p.slug === params.category
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }
};

/**
 * Fetch a single product by ID or slug.
 */
export const fetchProductById = async (
  id: string
): Promise<GroceryProduct | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      // Try legacy endpoint compatibility
      const legacyRes = await fetch(`${SERVER_URL}/product/${id}`, {
        cache: "no-store",
      });
      if (legacyRes.ok) {
        const legacyJson = await legacyRes.json();
        return legacyJson.data || legacyJson;
      }
      throw new Error(`Product not found via API (${res.status})`);
    }

    const json = await res.json();
    return json.data || json;
  } catch {
    // Graceful fallback to mock data
    return (
      MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id) || null
    );
  }
};

/**
 * Fetch categories from the real Grocify Express API with graceful fallback.
 */
export const fetchCategories = async (): Promise<GroceryCategory[]> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }

    return MOCK_CATEGORIES;
  } catch (error) {
    console.warn("Express categories API unreachable, using mock fallback:", error);
    return MOCK_CATEGORIES;
  }
};
