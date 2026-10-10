import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tambah Produk | Admin Kelilink" };
export const instant = false;
async function ProductCreateForm() {
  await requireAdmin();
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return <ProductForm action={createProduct} collections={collections} />;
}
export default function CreateProductPage() {
  return (
    <>
      <Link className="admin-back-link" href="/admin/produk">
        <ArrowLeft size={15} />
        Kembali ke produk
      </Link>
      <div className="admin-page-heading compact">
        <div>
          <p className="admin-eyebrow">KATALOG TOKO</p>
          <h1>Tambah produk</h1>
          <p>Isi informasi dasar, varian, dan tujuan marketplace.</p>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="admin-loading">
            <span className="admin-spinner" />
            Menyiapkan formulir...
          </div>
        }
      >
        <ProductCreateForm />
      </Suspense>
    </>
  );
}
