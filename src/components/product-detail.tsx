"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Glasses, Rotate3D } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { EyewearViewer } from "@/components/eyewear-viewer";
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

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const activeLinks = [
    ...product.marketplaceLinks,
    ...(selectedVariant?.marketplaceLinks ?? []),
  ].filter((link) => link.isActive && link.url);
  const qrLink = activeLinks[0];

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
    <section className="detail">
      <p className="crumb">
        <Link href="/">Katalog</Link> / {product.category.name} / {product.name}
      </p>

      <div className="detail-layout">
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
            <Glasses
              className="viewer-glasses"
              size={250}
              strokeWidth={0.85}
              color={selectedVariant?.colorHex}
            />
          )}
          <p>
            <Rotate3D size={13} />
            {selectedVariant?.model3dUrl
              ? "Seret untuk memutar · pinch atau scroll untuk zoom"
              : "Ilustrasi sementara — file model 3D produk belum tersedia"}
          </p>
        </div>

        <div className="detail-copy">
          <p className="eyebrow">
            {product.category.name} · {selectedVariant?.frameMaterial}
          </p>
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          <strong className="price">{formatPrice(product.basePrice)}</strong>

          <p className="label">Pilih warna</p>
          <div className="variants">
            {product.variants.map((variant) => (
              <button
                type="button"
                key={variant.colorName}
                aria-pressed={selectedVariant?.colorName === variant.colorName}
                className={
                  selectedVariant?.colorName === variant.colorName
                    ? "variant selected"
                    : "variant"
                }
                onClick={() => selectVariant(variant.colorName)}
              >
                <i style={{ backgroundColor: variant.colorHex }} />
                {variant.colorName}
              </button>
            ))}
          </div>

          <p className="label">Pilih toko favoritmu</p>
          <div className="shops">
            {(["SHOPEE", "TIKTOK_SHOP", "TOKOPEDIA"] as const).map(
              (platform) => {
                const link = activeLinks.find(
                  (item) => item.platform === platform,
                );
                if (!link) {
                  return (
                    <span key={platform} className="disabled">
                      {marketplaceNames[platform]} · segera hadir
                    </span>
                  );
                }

                return (
                  <a
                    key={platform}
                    href={buildOutboundUrl(
                      link.affiliateUrl || link.url,
                      product.slug,
                      platform,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackOutbound(platform)}
                  >
                    Buka {marketplaceNames[platform]}
                  </a>
                );
              },
            )}
          </div>

          {qrLink && (
            <div className="marketplace-qr">
              <QRCodeSVG
                value={buildOutboundUrl(
                  qrLink.affiliateUrl || qrLink.url,
                  product.slug,
                  qrLink.platform,
                )}
                size={104}
                level="M"
              />
              <p>
                Pindai untuk membuka {marketplaceNames[qrLink.platform]} di
                ponsel
              </p>
            </div>
          )}

          <p className="note">
            Kamu akan melanjutkan ke marketplace. Harga dan ketersediaan akhir
            mengikuti informasi di toko.
          </p>

          <div className="specs">
            <Spec
              label="Bahan frame"
              value={selectedVariant?.frameMaterial ?? "—"}
            />
            <Spec
              label="Jenis lensa"
              value={selectedVariant?.lensType ?? "—"}
            />
            <Spec label="Ukuran" value={selectedVariant?.sizeCode ?? "—"} />
            <Spec label="Gender" value={product.gender.toLowerCase()} />
            <Spec
              label="Lebar lensa"
              value={
                product.specification.lensWidthMm
                  ? `${product.specification.lensWidthMm} mm`
                  : "—"
              }
            />
            <Spec
              label="Berat"
              value={
                product.specification.weightGrams
                  ? `${product.specification.weightGrams} g`
                  : "—"
              }
            />
          </div>
        </div>
      </div>

      <Link className="crumb back" href="/">
        <ArrowLeft size={14} /> Kembali melihat katalog
      </Link>

      <div className="mobile-store-bar">
        {qrLink ? (
          <a
            href={buildOutboundUrl(
              qrLink.affiliateUrl || qrLink.url,
              product.slug,
              qrLink.platform,
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound(qrLink.platform)}
          >
            Buka {marketplaceNames[qrLink.platform]}
          </a>
        ) : (
          <span>Tautan toko segera hadir</span>
        )}
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <small>{label}</small>
      <b>{value}</b>
    </div>
  );
}
