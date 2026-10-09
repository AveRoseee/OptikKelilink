import Link from "next/link";
import { notFound } from "next/navigation";
import { Glasses } from "lucide-react";
import { ProductDetail } from "@/components/product-detail";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Glasses size={20} />
          </span>
          kelilink<span className="brand-dot">.</span>
        </Link>
        <Link className="header-link" href="/">
          Kembali ke katalog
        </Link>
      </header>
      <ProductDetail product={product} />
      <footer className="footer">
        <b>
          kelilink<span className="brand-dot">.</span>
        </b>
        <span>Katalog frame pilihan · Jakarta, Indonesia</span>
        <span>© 2026 Kelilink</span>
      </footer>
    </main>
  );
}
