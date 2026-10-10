import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { ProductTable } from "@/components/admin/product-table";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Produk | Admin Kelilink" };
export const instant = false;
async function ProductRows() {
  await requireAdmin();
  const rows = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });
  const data = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    status: row.status,
    basePrice: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(row.basePrice)),
    category: row.category.name,
    updatedAt: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
      row.updatedAt,
    ),
  }));
  return <ProductTable rows={data} />;
}
export default function AdminProductsPage() {
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">KATALOG TOKO</p>
          <h1>Produk</h1>
          <p>Kelola detail, varian, dan publikasi katalog kacamata.</p>
        </div>
        <Link className="admin-button primary" href="/admin/produk/tambah">
          <Plus size={16} />
          Tambah produk
        </Link>
      </div>
      <section className="admin-panel admin-list-panel">
        <Suspense
          fallback={
            <div className="admin-loading">
              <span className="admin-spinner" />
              Memuat produk...
            </div>
          }
        >
          <ProductRows />
        </Suspense>
      </section>
    </>
  );
}
