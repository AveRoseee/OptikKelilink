import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/admin/product-form";
import { updateProduct } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit Produk | Admin Kelilink" };
export const instant = false;
async function EditProductForm({ id }: { id: string }) {
  await requireAdmin();
  const [product, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        marketplaceLinks: { where: { variantId: null } },
        specification: true,
      },
    }),
    prisma.collection.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!product) notFound();
  const initial: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    description: product.description,
    gender: product.gender,
    basePrice: String(Number(product.basePrice)),
    mainImageUrl: product.mainImageUrl ?? "",
    status: product.status,
    isFeatured: product.isFeatured,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    collectionId: product.collectionId ?? "",
    variants: product.variants.map((v) => ({
      id: v.id,
      colorName: v.colorName,
      colorHex: v.colorHex,
      frameMaterial: v.frameMaterial,
      lensType: v.lensType,
      sizeCode: v.sizeCode,
      model3dUrl: v.model3dUrl ?? "",
      isAvailable: v.isAvailable,
    })),
    marketplaces: (["SHOPEE", "TIKTOK_SHOP", "TOKOPEDIA"] as const).map(
      (platform) => {
        const link = product.marketplaceLinks.find(
          (item) => item.platform === platform,
        );
        return {
          platform,
          url: link?.url ?? "",
          isActive: link?.isActive ?? false,
        };
      },
    ),
    frameWidthMm: product.specification?.frameWidthMm,
    lensWidthMm: product.specification?.lensWidthMm,
    bridgeWidthMm: product.specification?.bridgeWidthMm,
    templeLengthMm: product.specification?.templeLengthMm,
    weightGrams: product.specification?.weightGrams,
    warranty: product.specification?.warranty,
  };
  return (
    <ProductForm
      action={updateProduct.bind(null, product.id)}
      initial={initial}
      collections={collections}
    />
  );
}
async function EditProductRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Link className="admin-back-link" href={`/admin/produk/${id}`}>
        <ArrowLeft size={15} />
        Kembali ke detail
      </Link>
      <div className="admin-page-heading compact">
        <div>
          <p className="admin-eyebrow">KATALOG TOKO</p>
          <h1>Edit produk</h1>
          <p>Perbarui konten produk dan pilihan marketplace.</p>
        </div>
      </div>
      <EditProductForm id={id} />
    </>
  );
}
export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="admin-loading">
          <span className="admin-spinner" />
          Memuat data produk...
        </div>
      }
    >
      <EditProductRoute params={params} />
    </Suspense>
  );
}
