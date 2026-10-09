import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  eventName: z.enum([
    "view_product",
    "interact_3d",
    "select_variant",
    "click_shopee",
    "click_tiktok_shop",
    "click_tokopedia",
  ]),
  productSlug: z.string().min(1).max(120),
  variantColor: z.string().max(80).optional(),
  platform: z.enum(["SHOPEE", "TIKTOK_SHOP", "TOKOPEDIA"]).optional(),
  source: z.string().max(40).optional(),
  campaign: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { tracked: false, reason: "database_not_configured" },
      { status: 202 },
    );
  }

  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid analytics event" },
      { status: 400 },
    );
  }

  const { eventName, productSlug, variantColor, platform, source, campaign } =
    parsed.data;
  const product = await prisma.product.findUnique({
    where: { slug: productSlug, status: "PUBLISHED" },
    select: {
      id: true,
      variants: {
        where: variantColor ? { colorName: variantColor } : undefined,
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.analyticsEvent.create({
    data: {
      eventName,
      productId: product.id,
      variantId: product.variants[0]?.id,
      platform,
      source,
      campaign,
    },
  });

  return NextResponse.json({ tracked: true }, { status: 201 });
}
