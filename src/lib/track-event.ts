export type CatalogEventName =
  | "view_product"
  | "interact_3d"
  | "select_variant"
  | "click_shopee"
  | "click_tiktok_shop"
  | "click_tokopedia";

export function trackCatalogEvent(event: {
  eventName: CatalogEventName;
  productSlug: string;
  variantColor?: string;
  platform?: "SHOPEE" | "TIKTOK_SHOP" | "TOKOPEDIA";
}) {
  if (typeof window === "undefined") return;

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...event,
      source: event.platform?.toLowerCase() ?? "catalog",
      campaign: event.productSlug,
    }),
    keepalive: true,
  }).catch(() => {
    // Analytics should never interrupt browsing if tracking is unavailable.
  });
}
