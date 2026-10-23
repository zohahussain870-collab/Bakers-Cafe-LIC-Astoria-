export interface ProductImageDTO {
  id: string;
  url: string;
  alt: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariantDTO {
  id: string;
  name: string;
  priceAdjustment: number;
  isAvailable: boolean;
  sku?: string | null;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  prepTime: string;
  availability: "AVAILABLE" | "MADE_TO_ORDER" | "UNAVAILABLE" | string;
  stock: number;
  isStockTracked: boolean;
  allergens?: string | null;
  ingredients?: string | null;
  isFeatured: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  isPublished: boolean;
  _count?: {
    products: number;
  };
}

export interface CartItem {
  id: string; // unique item key e.g. `${productId}-${variantId || 'base'}`
  productId: string;
  productName: string;
  productSlug: string;
  variantId?: string | null;
  variantName?: string | null;
  unitPrice: number; // PKR
  quantity: number;
  image?: string;
  customizationNote?: string;
}

export interface BusinessSettingsDTO {
  id: string;
  businessName: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  mapsUrl: string;
  googleRating: number;
  ratingCount: number;
  defaultCurrency: string;
  timezone: string;
  isOnlineOrderingEnabled: boolean;
  isWhatsAppOrderingEnabled: boolean;
  isTakeoutEnabled: boolean;
  isDeliveryEnabled: boolean;
  deliveryFee: number;
  minOrderValue: number;
  defaultPrepTime: string;
  listedAvailability: string;
  temporaryClosureNotice?: string | null;
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
}
