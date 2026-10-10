import { Suspense } from "react";
import { CatalogBrowser } from "@/components/catalog-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Katalog Kacamata",
  description: "Jelajahi bentuk, warna, dan detail frame kacamata Kelilink.",
};

export default function CatalogPage() {
  return (
    <main>
      <SiteHeader />
      <section className="catalog-page content-width">
        <div className="catalog-title-row">
          <div>
            <p className="section-kicker">KOLEKSI KELILINK</p>
            <h1>Katalog Kacamata</h1>
            <p>
              Temukan frame dengan bentuk dan warna yang paling cocok untukmu.
            </p>
          </div>
        </div>
        <Suspense fallback={<CatalogFallback />}>
          <CatalogProducts />
        </Suspense>
      </section>
      <SiteFooter />
    </main>
  );
}

async function CatalogProducts() {
  const products = await getCatalogProducts();
  return <CatalogBrowser products={products} />;
}

function CatalogFallback() {
  return (
    <div
      className="catalog-layout"
      aria-label="Memuat katalog"
      aria-busy="true"
    >
      <aside className="filter-sidebar catalog-filter-skeleton">
        <span />
        <span />
        <span />
        <span />
        <span />
      </aside>
      <div className="catalog-product-grid product-grid">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div className="product-skeleton" key={item}>
            <span />
            <i />
            <b />
          </div>
        ))}
      </div>
    </div>
  );
}
