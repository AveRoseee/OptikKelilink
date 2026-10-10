"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  Gender,
  MarketplacePlatform,
  ProductStatus,
} from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const variantSchema = z.object({
  id: z.string().optional(),
  colorName: z.string().trim().min(1),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  frameMaterial: z.string().trim().min(1),
  lensType: z.string().trim().min(1),
  sizeCode: z.string().trim().min(1),
  model3dUrl: z.string().trim().optional(),
  isAvailable: z.boolean().default(true),
});
const marketplaceSchema = z.object({
  platform: z.enum(["SHOPEE", "TIKTOK_SHOP", "TOKOPEDIA"]),
  url: z.string().url().or(z.literal("")),
  isActive: z.boolean().default(false),
});
const productSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  brand: z.string().trim().min(1),
  description: z.string().trim().min(10),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]),
  basePrice: z.coerce.number().positive(),
  mainImageUrl: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean().default(false),
  categoryName: z.string().trim().min(1),
  categorySlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  collectionId: z.string().optional(),
  variants: z.array(variantSchema).min(1),
  marketplaces: z.array(marketplaceSchema),
  frameWidthMm: z.coerce.number().int().positive().optional(),
  lensWidthMm: z.coerce.number().int().positive().optional(),
  bridgeWidthMm: z.coerce.number().int().positive().optional(),
  templeLengthMm: z.coerce.number().int().positive().optional(),
  weightGrams: z.coerce.number().int().positive().optional(),
  warranty: z.string().trim().optional(),
});

export type ProductActionState = { error?: string };

function optionalNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return value == null || value === "" || !Number.isFinite(parsed)
    ? undefined
    : parsed;
}
function readForm(formData: FormData) {
  let variants: unknown = [];
  let marketplaces: unknown = [];
  try {
    variants = JSON.parse(String(formData.get("variantsJson") || "[]"));
    marketplaces = JSON.parse(String(formData.get("marketplacesJson") || "[]"));
  } catch {
    throw new Error("Data varian atau tautan marketplace tidak valid.");
  }
  return productSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    brand: formData.get("brand"),
    description: formData.get("description"),
    gender: formData.get("gender"),
    basePrice: formData.get("basePrice"),
    mainImageUrl: formData.get("mainImageUrl"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on",
    categoryName: formData.get("categoryName"),
    categorySlug: formData.get("categorySlug"),
    collectionId: formData.get("collectionId") || undefined,
    variants,
    marketplaces,
    frameWidthMm: optionalNumber(formData.get("frameWidthMm")),
    lensWidthMm: optionalNumber(formData.get("lensWidthMm")),
    bridgeWidthMm: optionalNumber(formData.get("bridgeWidthMm")),
    templeLengthMm: optionalNumber(formData.get("templeLengthMm")),
    weightGrams: optionalNumber(formData.get("weightGrams")),
    warranty: formData.get("warranty") || undefined,
  });
}

async function saveProduct(
  productId: string | undefined,
  input: z.infer<typeof productSchema>,
) {
  const txResult = await prisma.$transaction(async (tx) => {
    const category = await tx.category.upsert({
      where: { slug: input.categorySlug },
      create: { name: input.categoryName, slug: input.categorySlug },
      update: { name: input.categoryName },
    });
    const common = {
      name: input.name,
      slug: input.slug,
      brand: input.brand,
      description: input.description,
      gender: input.gender as Gender,
      basePrice: input.basePrice,
      mainImageUrl: input.mainImageUrl || null,
      thumbnailUrl: input.mainImageUrl || null,
      status: input.status as ProductStatus,
      isFeatured: input.isFeatured,
      categoryId: category.id,
      collectionId: input.collectionId || null,
    };
    const product = productId
      ? await tx.product.update({ where: { id: productId }, data: common })
      : await tx.product.create({ data: common });

    const ids = input.variants.flatMap((variant) =>
      variant.id ? [variant.id] : [],
    );
    if (productId)
      await tx.productVariant.deleteMany({
        where: { productId, ...(ids.length ? { id: { notIn: ids } } : {}) },
      });
    for (const variant of input.variants) {
      const values = {
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        frameMaterial: variant.frameMaterial,
        lensType: variant.lensType,
        sizeCode: variant.sizeCode,
        model3dUrl: variant.model3dUrl || null,
        isAvailable: variant.isAvailable,
      };
      if (variant.id && productId) {
        const updated = await tx.productVariant.updateMany({
          where: { id: variant.id, productId },
          data: values,
        });
        if (updated.count !== 1)
          throw new Error("Varian produk tidak ditemukan.");
      } else
        await tx.productVariant.create({
          data: { ...values, productId: product.id },
        });
    }

    await tx.marketplaceLink.deleteMany({
      where: { productId: product.id, variantId: null },
    });
    const links = input.marketplaces.filter((link) => link.url);
    if (links.length)
      await tx.marketplaceLink.createMany({
        data: links.map((link) => ({
          productId: product.id,
          platform: link.platform as MarketplacePlatform,
          url: link.url,
          isActive: link.isActive,
        })),
      });
    const spec = {
      frameWidthMm: input.frameWidthMm ?? null,
      lensWidthMm: input.lensWidthMm ?? null,
      bridgeWidthMm: input.bridgeWidthMm ?? null,
      templeLengthMm: input.templeLengthMm ?? null,
      weightGrams: input.weightGrams ?? null,
      warranty: input.warranty || null,
    };
    await tx.specification.upsert({
      where: { productId: product.id },
      create: { productId: product.id, ...spec },
      update: spec,
    });
    return { id: product.id, slug: product.slug };
  });
  revalidatePath("/admin");
  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
  revalidatePath(`/produk/${txResult.slug}`);
  return txResult;
}

export async function createProduct(
  _state: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  try {
    const saved = await saveProduct(undefined, readForm(formData));
    redirect(`/admin/produk/${saved.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return {
      error:
        error instanceof z.ZodError
          ? "Periksa kembali kolom wajib dan format tautan."
          : error instanceof Error
            ? error.message
            : "Produk gagal disimpan.",
    };
  }
}

export async function updateProduct(
  productId: string,
  _state: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  try {
    const saved = await saveProduct(productId, readForm(formData));
    redirect(`/admin/produk/${saved.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return {
      error:
        error instanceof z.ZodError
          ? "Periksa kembali kolom wajib dan format tautan."
          : error instanceof Error
            ? error.message
            : "Produk gagal disimpan.",
    };
  }
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("productId") ?? "");
  if (!id) return;
  const product = await prisma.product.delete({
    where: { id },
    select: { slug: true },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
  revalidatePath(`/produk/${product.slug}`);
  redirect("/admin/produk");
}
