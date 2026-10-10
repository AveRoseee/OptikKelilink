import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<ProductFallback />}>
        <ProductContent params={params} />
      </Suspense>
      <SiteFooter />
    </>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, products] = await Promise.all([
    getCatalogProduct(slug),
    getCatalogProducts(),
  ]);
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      relatedProducts={products.filter((item) => item.slug !== product.slug)}
    />
  );
}

function ProductFallback() {
  return (
    <main
      className="detail content-width"
      aria-label="Memuat detail produk"
      aria-busy="true"
    >
      <div className="detail-layout">
        <div className="detail-skeleton-viewer" />
        <div className="detail-skeleton-copy">
          <span />
          <b />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </main>
  );
}
