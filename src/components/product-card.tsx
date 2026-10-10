import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogProduct } from "@/types/catalog";
import { FrameIllustration } from "@/components/frame-illustration";

const price = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function ProductCard({ product }: { product: CatalogProduct }) {
  const color = product.variants[0]?.colorHex ?? "#173e70";
  return (
    <article className="product-card">
      <Link
        className="product-art"
        href={`/produk/${product.slug}`}
        aria-label={`Lihat ${product.name}`}
      >
        <FrameIllustration
          category={product.category.slug}
          color={color}
          label={product.name}
        />
        <span className="product-open">
          <ArrowUpRight size={16} />
        </span>
      </Link>
      <div className="product-meta">
        <span className="product-category">{product.category.name}</span>
        <div className="product-title-row">
          <h3>
            <Link href={`/produk/${product.slug}`}>{product.name}</Link>
          </h3>
          <strong>{price(product.basePrice)}</strong>
        </div>
        <div
          className="swatches"
          aria-label={`${product.variants.length} pilihan warna`}
        >
          {product.variants.slice(0, 4).map((variant) => (
            <i
              key={variant.colorName}
              title={variant.colorName}
              style={{ backgroundColor: variant.colorHex }}
            />
          ))}
          <span>{product.variants.length} warna</span>
        </div>
      </div>
    </article>
  );
}
