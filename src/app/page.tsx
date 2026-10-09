import { CatalogBrowser } from "@/components/catalog-browser";
import { getCatalogProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getCatalogProducts();
  return <CatalogBrowser products={products} />;
}
