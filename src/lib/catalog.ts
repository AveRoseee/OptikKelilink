import "server-only";

import { DEMO_PRODUCTS } from "@/data/demo-products";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CatalogProduct,
  MarketplaceLink,
  ProductVariant,
} from "@/types/catalog";

const productInclude = {
  category: true,
  collection: true,
  variants: {
    where: { isAvailable: true },
    orderBy: { createdAt: "asc" },
    include: { marketplaceLinks: true },
  },
  marketplaceLinks: true,
  specification: true,
} satisfies Prisma.ProductInclude;

type CatalogRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function jsonObject(
  value: unknown,
): Record<string, { color: string }> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return undefined;
  return value as Record<string, { color: string }>;
}

function mapMarketplace(
  link: CatalogRow["marketplaceLinks"][number],
): MarketplaceLink {
  return {
    id: link.id,
    platform: link.platform,
    url: link.url,
    affiliateUrl: link.affiliateUrl ?? undefined,
    isActive: link.isActive,
  };
}

function mapProduct(row: CatalogRow): CatalogProduct {
  const variants: ProductVariant[] = row.variants.map((variant) => ({
    id: variant.id,
    colorName: variant.colorName,
    colorHex: variant.colorHex,
    frameMaterial: variant.frameMaterial,
    lensType: variant.lensType,
    sizeCode: variant.sizeCode,
    model3dUrl: variant.model3dUrl ?? undefined,
    model3dPoster: variant.model3dPoster ?? undefined,
    materialOverrides: jsonObject(variant.materialOverrides),
    isAvailable: variant.isAvailable,
    marketplaceLinks: variant.marketplaceLinks.map(mapMarketplace),
  }));

  const includedItems = row.specification?.includedItems;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    description: row.description,
    gender: row.gender,
    basePrice: Number(row.basePrice),
    mainImageUrl: row.mainImageUrl ?? undefined,
    thumbnailUrl: row.thumbnailUrl ?? undefined,
    isFeatured: row.isFeatured,
    status: row.status,
    category: { slug: row.category.slug, name: row.category.name },
    collection: row.collection
      ? { slug: row.collection.slug, name: row.collection.name }
      : undefined,
    variants,
    specification: {
      frameWidthMm: row.specification?.frameWidthMm ?? undefined,
      lensWidthMm: row.specification?.lensWidthMm ?? undefined,
      bridgeWidthMm: row.specification?.bridgeWidthMm ?? undefined,
      templeLengthMm: row.specification?.templeLengthMm ?? undefined,
      weightGrams: row.specification?.weightGrams ?? undefined,
      warranty: row.specification?.warranty ?? undefined,
      includedItems: Array.isArray(includedItems)
        ? includedItems.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
    },
    marketplaceLinks: row.marketplaceLinks.map(mapMarketplace),
  };
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  if (!process.env.DATABASE_URL) return DEMO_PRODUCTS;

  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: productInclude,
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });
  return rows.map(mapProduct);
}

export async function getCatalogProduct(
  slug: string,
): Promise<CatalogProduct | undefined> {
  if (!process.env.DATABASE_URL) {
    return DEMO_PRODUCTS.find((product) => product.slug === slug);
  }

  const row = await prisma.product.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: productInclude,
  });
  return row ? mapProduct(row) : undefined;
}
