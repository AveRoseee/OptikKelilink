export const MARKETPLACE_PLATFORMS = [
  "SHOPEE",
  "TIKTOK_SHOP",
  "TOKOPEDIA",
] as const;

export type MarketplacePlatform = (typeof MARKETPLACE_PLATFORMS)[number];

export type ProductGender = "MEN" | "WOMEN" | "UNISEX" | "KIDS";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface MarketplaceLink {
  id?: string;
  platform: MarketplacePlatform;
  url: string;
  affiliateUrl?: string;
  isActive: boolean;
}

export interface ProductVariant {
  id?: string;
  colorName: string;
  colorHex: string;
  frameMaterial: string;
  lensType: string;
  sizeCode: string;
  model3dUrl?: string;
  model3dPoster?: string;
  materialOverrides?: Record<string, { color: string }>;
  isAvailable: boolean;
  marketplaceLinks: MarketplaceLink[];
}

export interface ProductSpecification {
  frameWidthMm?: number;
  lensWidthMm?: number;
  bridgeWidthMm?: number;
  templeLengthMm?: number;
  weightGrams?: number;
  warranty?: string;
  includedItems: string[];
}

export interface CatalogProduct {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  gender: ProductGender;
  basePrice: number;
  mainImageUrl?: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
  status: ProductStatus;
  category: { slug: string; name: string };
  collection?: { slug: string; name: string };
  variants: ProductVariant[];
  specification: ProductSpecification;
  marketplaceLinks: MarketplaceLink[];
}
