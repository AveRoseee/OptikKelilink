import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEMO_PRODUCTS } from "../src/data/demo-products";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Set DATABASE_URL in .env.local before running the seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function seedCatalog() {
  const collection = await prisma.collection.upsert({
    where: { slug: "everyday-essentials" },
    update: {},
    create: {
      slug: "everyday-essentials",
      name: "Everyday Essentials",
      description: "Contoh koleksi produk untuk pengembangan lokal.",
    },
  });

  for (const item of DEMO_PRODUCTS) {
    const category = await prisma.category.upsert({
      where: { slug: item.category.slug },
      update: { name: item.category.name },
      create: { slug: item.category.slug, name: item.category.name },
    });

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        brand: item.brand,
        description: item.description,
        gender: item.gender,
        basePrice: item.basePrice,
        isFeatured: item.isFeatured,
        status: item.status,
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
        status: item.status,
        categoryId: category.id,
        collectionId: collection.id,
      },
    });

    for (const variant of item.variants) {
      await prisma.productVariant.upsert({
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
      });
    }

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
  }
}

seedCatalog()
  .then(() => console.log("Seed katalog contoh selesai."))
  .catch((error: unknown) => {
    console.error("Seed katalog gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
