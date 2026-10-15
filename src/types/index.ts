/**
 * Grocify Domain Type Definitions
 * Phase 1 Foundation
 */

export type UserRole = "owner" | "manager" | "worker" | "customer";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt?: string;
}

export type UnitOfMeasure = "kg" | "g" | "piece" | "packet" | "box" | "carton" | "litre" | "ml";

export interface ProductUnitConversion {
  baseUnit: UnitOfMeasure;
  sellUnit: UnitOfMeasure;
  multiplier: number; // e.g. 1 carton = 24 bottles
}

export interface GroceryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  itemCount?: number;
  color?: string;
}

export interface GroceryProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  barcode?: string;
  sku?: string;
  description: string;
  retailPrice: number;
  originalPrice?: number;
  unit: ProductUnitConversion;
  images: string[];
  isActive: boolean;
  minStockAlert: number;
  currentStock: number;
  isOrganic?: boolean;
  isFeatured?: boolean;
  isSeasonal?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: GroceryProduct;
  quantity: number;
}

export type BatchStatus = "available" | "expiring_soon" | "expired" | "quarantined" | "disposed";

export interface InventoryBatch {
  id: string;
  productId: string;
  batchNumber: string;
  purchaseId: string;
  quantity: number;
  unitCost: number;
  expiryDate?: string;
  status: BatchStatus;
  receivedDate: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod";

export interface OrderItem {
  productId: string;
  productName: string;
  unit: UnitOfMeasure;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}
