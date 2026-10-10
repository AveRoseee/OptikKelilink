"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Rotate3D } from "lucide-react";
import { EyewearViewer } from "@/components/eyewear-viewer";
import { FrameIllustration } from "@/components/frame-illustration";
import { ProductCard } from "@/components/product-card";
import { trackCatalogEvent } from "@/lib/track-event";
import type { CatalogProduct, MarketplacePlatform } from "@/types/catalog";

const marketplaceNames: Record<MarketplacePlatform, string> = {
  SHOPEE: "Shopee",
  TIKTOK_SHOP: "TikTok Shop",
  TOKOPEDIA: "Tokopedia",
};
const clickEvents: Record<
  MarketplacePlatform,
  "click_shopee" | "click_tiktok_shop" | "click_tokopedia"
> = {
  SHOPEE: "click_shopee",
  TIKTOK_SHOP: "click_tiktok_shop",
  TOKOPEDIA: "click_tokopedia",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildOutboundUrl(
  url: string,
  productSlug: string,
  platform: MarketplacePlatform,
) {
  try {
    const outbound = new URL(url);
    if (outbound.protocol !== "https:" && outbound.protocol !== "http:")
      return "#";
    outbound.searchParams.set("utm_source", "kelilink");
    outbound.searchParams.set("utm_medium", "catalog");
    outbound.searchParams.set("utm_campaign", productSlug);
    outbound.searchParams.set("utm_content", platform.toLowerCase());
    return outbound.toString();
  } catch {
    return "#";
  }
}

export function ProductDetail({
  product,
  relatedProducts,
}: {
  product: CatalogProduct;
  relatedProducts: CatalogProduct[];
}) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const activeLinks = [
    ...product.marketplaceLinks,
    ...(selectedVariant?.marketplaceLinks ?? []),
  ].filter((link) => link.isActive && link.url);

  useEffect(() => {
    trackCatalogEvent({ eventName: "view_product", productSlug: product.slug });
  }, [product.slug]);

  function trackOutbound(platform: MarketplacePlatform) {
    trackCatalogEvent({
      eventName: clickEvents[platform],
      productSlug: product.slug,
      variantColor: selectedVariant?.colorName,
      platform,
    });
  }

  function selectVariant(colorName: string) {
    const nextVariant = product.variants.find(
      (variant) => variant.colorName === colorName,
    );
    if (!nextVariant) return;
    setSelectedVariant(nextVariant);
    trackCatalogEvent({
      eventName: "select_variant",
      productSlug: product.slug,
      variantColor: nextVariant.colorName,
    });
  }

  return (
    <main>
      <section className="detail content-width">
        <p className="crumb">
          <Link href="/">Beranda</Link>
          <ChevronRight size={13} />
          <Link href="/katalog">Katalog</Link>
          <ChevronRight size={13} />
          <span>{product.name}</span>
        </p>
        <div className="detail-layout">
          <div className="detail-gallery">
            <div className="viewer">
              {selectedVariant?.model3dUrl ? (
                <EyewearViewer
                  src={selectedVariant.model3dUrl}
                  poster={selectedVariant.model3dPoster}
                  tint={selectedVariant.colorHex}
                  materialOverrides={selectedVariant.materialOverrides}
                  alt={`Model 3D ${product.name}, warna ${selectedVariant.colorName}`}
                  onInteract={() =>
                    trackCatalogEvent({
                      eventName: "interact_3d",
                      productSlug: product.slug,
                      variantColor: selectedVariant.colorName,
                    })
                  }
                />
              ) : (
                <FrameIllustration
                  category={product.category.slug}
                  color={selectedVariant?.colorHex}
                  className="detail-frame"
                  label={`Ilustrasi ${product.name}`}
                />
              )}
              <span className="viewer-badge">
                <Rotate3D size={14} /> Tampilan 3D
              </span>
              <div className="viewer-help">
                Seret untuk memutar · scroll untuk zoom
              </div>
            </div>
            <div className="gallery-thumbs" aria-label="Pilihan warna frame">
              {product.variants.map((variant) => (
                <button
                  type="button"
                  className={
                    selectedVariant?.colorName === variant.colorName
                      ? "gallery-thumb selected"
                      : "gallery-thumb"
                  }
                  key={variant.colorName}
                  aria-label={`Lihat warna ${variant.colorName}`}
                  aria-pressed={
                    selectedVariant?.colorName === variant.colorName
                  }
                  onClick={() => selectVariant(variant.colorName)}
                >
                  <FrameIllustration
                    category={product.category.slug}
                    color={variant.colorHex}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-copy">
            <p className="detail-category">
              {product.category.name} <span>·</span> {product.brand}
            </p>
            <h1>{product.name}</h1>
            <strong className="price">{formatPrice(product.basePrice)}</strong>
            <p className="description">{product.description}</p>

            <div className="variant-picker">
              <p className="label">
                Warna <span>{selectedVariant?.colorName}</span>
              </p>
              <div className="variants">
                {product.variants.map((variant) => (
                  <button
                    type="button"
                    key={variant.colorName}
                    className={
                      selectedVariant?.colorName === variant.colorName
                        ? "variant-swatch selected"
                        : "variant-swatch"
                    }
                    style={{ "--swatch": variant.colorHex } as CSSProperties}
                    aria-label={variant.colorName}
                    title={variant.colorName}
                    aria-pressed={
                      selectedVariant?.colorName === variant.colorName
                    }
                    onClick={() => selectVariant(variant.colorName)}
                  />
                ))}
              </div>
            </div>

            <div className="marketplace-block">
              <p className="label">Pilih toko</p>
              <div className="shops">
                {(["SHOPEE", "TIKTOK_SHOP", "TOKOPEDIA"] as const).map(
                  (platform) => {
                    const link = activeLinks.find(
                      (item) => item.platform === platform,
                    );
                    return link ? (
                      <a
                        key={platform}
                        className={`shop-button shop-${platform.toLowerCase()}`}
                        href={buildOutboundUrl(
                          link.affiliateUrl || link.url,
                          product.slug,
                          platform,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackOutbound(platform)}
                      >
                        Buka {marketplaceNames[platform]}{" "}
                        <ArrowRight size={14} />
                      </a>
                    ) : (
                      <span
                        key={platform}
                        className="shop-button shop-disabled"
                        aria-disabled="true"
                      >
                        {marketplaceNames[platform]} <small>Segera hadir</small>
                      </span>
                    );
                  },
                )}
              </div>
              <p className="marketplace-note">
                Kamu akan melanjutkan ke marketplace. Harga akhir mengikuti
                informasi di toko.
              </p>
            </div>

            <div className="specs">
              <h2>Detail produk</h2>
              <Spec
                label="Bahan frame"
                value={selectedVariant?.frameMaterial ?? "—"}
              />
              <Spec
                label="Jenis lensa"
                value={selectedVariant?.lensType ?? "—"}
              />
              <Spec
                label="Ukuran frame"
                value={selectedVariant?.sizeCode ?? "—"}
              />
              <Spec
                label="Lebar lensa"
                value={
                  product.specification.lensWidthMm
                    ? `${product.specification.lensWidthMm} mm`
                    : "—"
                }
              />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="related-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">PILIHAN LAIN</p>
                <h2>Mungkin kamu suka</h2>
              </div>
              <Link className="text-link" href="/katalog">
                Semua produk <ArrowRight size={15} />
              </Link>
            </div>
            <div className="product-grid related-grid">
              {relatedProducts.slice(0, 4).map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        )}
        <Link className="back-link" href="/katalog">
          <ArrowLeft size={15} /> Kembali ke katalog
        </Link>
      </section>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="spec-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
