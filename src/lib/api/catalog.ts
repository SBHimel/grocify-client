import { GroceryCategory, GroceryProduct } from "@/types";

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

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsWithPagination {
  products: GroceryProduct[];
  pagination: PaginationMetadata;
}

/**
 * Fetch products with server-side pagination metadata (total, page, limit, totalPages).
 */
export const fetchProductsWithPagination = async (
  params?: GetProductsParams
): Promise<ProductsWithPagination> => {
  const defaultLimit = params?.limit || 12;
  const defaultPage = params?.page || 1;
  const defaultPagination: PaginationMetadata = {
    total: 0,
    page: defaultPage,
    limit: defaultLimit,
    totalPages: 1,
  };

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
    const products: GroceryProduct[] =
      json.success && Array.isArray(json.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

    const pagination: PaginationMetadata = json.pagination || json.meta || {
      total: products.length,
      page: defaultPage,
      limit: defaultLimit,
      totalPages: Math.ceil((products.length || 1) / defaultLimit) || 1,
    };

    return { products, pagination };
  } catch (error) {
    console.error("Express products pagination API error:", error);
    return { products: [], pagination: defaultPagination };
  }
};

/**
 * Fetch products from the real Grocify Express API with live MongoDB data.
 * Does not fall back to mock data so newly added products are never masked.
 */
export const fetchProducts = async (
  params?: GetProductsParams
): Promise<GroceryProduct[]> => {
  const result = await fetchProductsWithPagination(params);
  return result.products;
};

/**
 * Fetch a single product by ID or slug from live MongoDB.
 * Returns null if not found (allowing proper 404/not found display).
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
      return null;
    }

    const json = await res.json();
    return json.data || json || null;
  } catch (error) {
    console.error(`Error fetching product [${id}]:`, error);
    return null;
  }
};

/**
 * Fetch categories from the real Grocify Express API with live counts.
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

    return [];
  } catch (error) {
    console.error("Express categories API error:", error);
    return [];
  }
};
