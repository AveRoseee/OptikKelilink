import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Detail Produk | Admin Kelilink" };
export const instant = false;
const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
async function ProductDetail({ id }: { id: string }) {
  await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      collection: true,
      variants: { include: { gallery: true } },
      marketplaceLinks: { where: { variantId: null } },
      specification: true,
    },
  });
  if (!product) notFound();
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <Link className="admin-back-link" href="/admin/produk">
            <ArrowLeft size={15} />
            Semua produk
          </Link>
          <p className="admin-eyebrow">DETAIL PRODUK</p>
          <h1>{product.name}</h1>
          <p>
            {product.brand} · /{product.slug}
          </p>
        </div>
        <div className="admin-heading-actions">
          <Link
            className="admin-button secondary"
            href={`/admin/produk/${id}/edit`}
          >
            <Pencil size={15} />
            Edit
          </Link>
          <DeleteProductButton id={id} name={product.name} />
        </div>
      </div>
      <div className="admin-detail-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Informasi umum</h2>
              <p>Informasi katalog yang tersimpan.</p>
            </div>
            <span className={`admin-status ${product.status.toLowerCase()}`}>
              {product.status === "PUBLISHED"
                ? "Terbit"
                : product.status === "DRAFT"
                  ? "Draft"
                  : "Arsip"}
            </span>
          </div>
          <dl className="admin-detail-list">
            <div>
              <dt>Harga</dt>
              <dd>{rupiah(Number(product.basePrice))}</dd>
            </div>
            <div>
              <dt>Brand</dt>
              <dd>{product.brand}</dd>
            </div>
            <div>
              <dt>Kategori</dt>
              <dd>{product.category.name}</dd>
            </div>
            <div>
              <dt>Koleksi</dt>
              <dd>{product.collection?.name ?? "—"}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{product.gender}</dd>
            </div>
            <div>
              <dt>Produk pilihan</dt>
              <dd>{product.isFeatured ? "Ya" : "Tidak"}</dd>
            </div>
            <div className="detail-description">
              <dt>Deskripsi</dt>
              <dd>{product.description}</dd>
            </div>
          </dl>
        </section>
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Varian produk</h2>
              <p>{product.variants.length} pilihan tersedia.</p>
            </div>
          </div>
          {product.variants.map((v) => (
            <article className="admin-detail-variant" key={v.id}>
              <span
                className="admin-color-dot"
                style={{ background: v.colorHex }}
              />
              <div>
                <strong>
                  {v.colorName} · {v.sizeCode}
                </strong>
                <small>
                  {v.frameMaterial} · {v.lensType} ·{" "}
                  {v.isAvailable ? "Tersedia" : "Habis"}
                </small>
                {v.model3dUrl && (
                  <a href={v.model3dUrl} target="_blank" rel="noreferrer">
                    Model 3D <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Spesifikasi</h2>
              <p>Ukuran dan garansi.</p>
            </div>
          </div>
          <dl className="admin-detail-list">
            {[
              ["Lebar frame", product.specification?.frameWidthMm],
              ["Lebar lensa", product.specification?.lensWidthMm],
              ["Bridge", product.specification?.bridgeWidthMm],
              ["Panjang tangkai", product.specification?.templeLengthMm],
              ["Berat", product.specification?.weightGrams],
              ["Garansi", product.specification?.warranty],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <dt>{label}</dt>
                <dd>
                  {value
                    ? `${value}${typeof value === "number" && label !== "Berat" ? " mm" : label === "Berat" ? " g" : ""}`
                    : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Marketplace</h2>
              <p>Tombol outbound untuk pelanggan.</p>
            </div>
          </div>
          {product.marketplaceLinks.length ? (
            product.marketplaceLinks.map((link) => (
              <a
                className="admin-detail-marketplace"
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>{link.platform.replace("_", " ")}</span>
                <small className={link.isActive ? "active" : ""}>
                  {link.isActive ? "Aktif" : "Nonaktif"}
                </small>
                <ExternalLink size={14} />
              </a>
            ))
          ) : (
            <p className="admin-muted">Belum ada tautan marketplace.</p>
          )}
        </section>
      </div>
    </>
  );
}
async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="admin-loading">
          <span className="admin-spinner" />
          Memuat produk...
        </div>
      }
    >
      <ProductDetailRoute params={params} />
    </Suspense>
  );
}
