import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  MarketplacePlatform,
  ProductStatus,
} from "../src/generated/prisma/enums";
import { DEMO_PRODUCTS } from "../src/data/demo-products";

if (process.env.ALLOW_DEMO_SEED !== "true") {
  throw new Error(
    "Seed demo tidak dijalankan. Set ALLOW_DEMO_SEED=true hanya untuk database pengujian.",
  );
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Set DATABASE_URL di .env.local sebelum menjalankan seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const marketplacePlatforms = [
  { platform: MarketplacePlatform.SHOPEE, eventName: "click_shopee" },
  { platform: MarketplacePlatform.TIKTOK_SHOP, eventName: "click_tiktok_shop" },
  { platform: MarketplacePlatform.TOKOPEDIA, eventName: "click_tokopedia" },
] as const;

async function seedCatalog() {
  const collection = await prisma.collection.upsert({
    where: { slug: "everyday-essentials" },
    update: { name: "Everyday Essentials" },
    create: {
      slug: "everyday-essentials",
      name: "Everyday Essentials",
      description: "Koleksi contoh untuk pengujian katalog Kelilink.",
    },
  });

  const seededProducts: { id: string; variants: { id: string }[] }[] = [];

  for (const [index, item] of DEMO_PRODUCTS.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: item.category.slug },
      update: { name: item.category.name },
      create: { slug: item.category.slug, name: item.category.name },
    });

    // Include published, draft, and archived records to exercise dashboard filters.
    const status =
      index === 8
        ? ProductStatus.ARCHIVED
        : index === 9
          ? ProductStatus.DRAFT
          : item.status;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        brand: item.brand,
        description: item.description,
        gender: item.gender,
        basePrice: item.basePrice,
        isFeatured: item.isFeatured,
        status,
        categoryId: category.id,
        collectionId: collection.id,
      },
      create: {
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        description: item.description,
        gender: item.gender,
        basePrice: item.basePrice,
        isFeatured: item.isFeatured,
        status,
        categoryId: category.id,
        collectionId: collection.id,
      },
    });

    const variantRecords: { id: string }[] = [];
    for (const variant of item.variants) {
      const savedVariant = await prisma.productVariant.upsert({
        where: {
          productId_colorName_lensType_sizeCode: {
            productId: product.id,
            colorName: variant.colorName,
            lensType: variant.lensType,
            sizeCode: variant.sizeCode,
          },
        },
        update: {
          colorHex: variant.colorHex,
          frameMaterial: variant.frameMaterial,
          model3dUrl: variant.model3dUrl,
          model3dPoster: variant.model3dPoster,
          isAvailable: variant.isAvailable,
        },
        create: {
          productId: product.id,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          frameMaterial: variant.frameMaterial,
          lensType: variant.lensType,
          sizeCode: variant.sizeCode,
          model3dUrl: variant.model3dUrl,
          model3dPoster: variant.model3dPoster,
          isAvailable: variant.isAvailable,
        },
        select: { id: true },
      });
      variantRecords.push(savedVariant);
    }
    seededProducts.push({ id: product.id, variants: variantRecords });

    await prisma.specification.upsert({
      where: { productId: product.id },
      update: {
        frameWidthMm: item.specification.frameWidthMm,
        lensWidthMm: item.specification.lensWidthMm,
        bridgeWidthMm: item.specification.bridgeWidthMm,
        templeLengthMm: item.specification.templeLengthMm,
        weightGrams: item.specification.weightGrams,
        warranty: item.specification.warranty,
        includedItems: item.specification.includedItems,
      },
      create: {
        productId: product.id,
        frameWidthMm: item.specification.frameWidthMm,
        lensWidthMm: item.specification.lensWidthMm,
        bridgeWidthMm: item.specification.bridgeWidthMm,
        templeLengthMm: item.specification.templeLengthMm,
        weightGrams: item.specification.weightGrams,
        warranty: item.specification.warranty,
        includedItems: item.specification.includedItems,
      },
    });

    await prisma.productTranslation.upsert({
      where: { productId_locale: { productId: product.id, locale: "id" } },
      update: { name: item.name, description: item.description },
      create: {
        productId: product.id,
        locale: "id",
        name: item.name,
        description: item.description,
      },
    });

    // These reserved example.com URLs are for UI testing, not real shops.
    await prisma.marketplaceLink.deleteMany({
      where: { productId: product.id, variantId: null },
    });
    await prisma.marketplaceLink.createMany({
      data: marketplacePlatforms.map(({ platform }) => ({
        productId: product.id,
        platform,
        url: `https://example.com/demo/${platform.toLowerCase()}/${item.slug}`,
        isActive: status === ProductStatus.PUBLISHED,
      })),
    });
  }

  // Replace only this seed's analytics rows, so rerunning it won't inflate counts.
  await prisma.analyticsEvent.deleteMany({ where: { campaign: "demo-seed" } });
  const clicksByDay = [1, 3, 2, 4, 2, 5, 3];
  const analyticsEvents = clicksByDay.flatMap((clickCount, dayIndex) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - dayIndex));
    day.setHours(12, 0, 0, 0);

    return Array.from({ length: clickCount }, (_, clickIndex) => {
      const product =
        seededProducts[(dayIndex + clickIndex) % seededProducts.length];
      const marketplace =
        marketplacePlatforms[
          (dayIndex + clickIndex) % marketplacePlatforms.length
        ];
      return {
        eventName: marketplace.eventName,
        platform: marketplace.platform,
        productId: product.id,
        variantId: product.variants[clickIndex % product.variants.length]?.id,
        sessionId: `demo-session-${dayIndex}-${clickIndex}`,
        source: "demo-seed",
        campaign: "demo-seed",
        metadata: { demo: true },
        createdAt: new Date(day.getTime() + clickIndex * 60_000),
      };
    });
  });
  await prisma.analyticsEvent.createMany({ data: analyticsEvents });

  console.log(
    `Seed demo selesai: ${seededProducts.length} produk, ${analyticsEvents.length} event klik contoh.`,
  );
}

seedCatalog()
  .catch((error: unknown) => {
    console.error("Seed katalog gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
