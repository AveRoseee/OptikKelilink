import { getCatalogProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export async function FeaturedProducts() {
  const products = await getCatalogProducts();
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);

  if (!featured.length)
    return <p className="empty">Koleksi pilihan akan segera hadir.</p>;

  return (
    <div className="product-grid home-product-grid">
      {featured.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export function FeaturedProductsFallback() {
  return (
    <div
      className="product-grid home-product-grid"
      aria-label="Memuat koleksi pilihan"
      aria-busy="true"
    >
      {[0, 1, 2, 3].map((item) => (
        <div className="product-skeleton" key={item}>
          <span />
          <i />
          <b />
        </div>
      ))}
    </div>
  );
}
