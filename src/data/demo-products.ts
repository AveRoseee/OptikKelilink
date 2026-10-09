import type { CatalogProduct, ProductVariant } from "@/types/catalog";

const variantColors = [
  { colorName: "Onyx Black", colorHex: "#242321" },
  { colorName: "Classic Havana", colorHex: "#76533d" },
  { colorName: "Champagne Gold", colorHex: "#c3a36b" },
];

/**
 * Temporary development catalog.
 * Replace these fictional products and empty marketplace links with approved brand data.
 */
function makeVariants(
  frameMaterial: string,
  lensType: string,
): ProductVariant[] {
  return variantColors.map((color) => ({
    ...color,
    frameMaterial,
    lensType,
    sizeCode: "52-18-145",
    isAvailable: true,
    materialOverrides: {
      Frame: { color: color.colorHex },
      Temple: { color: color.colorHex },
    },
    marketplaceLinks: [],
  }));
}

function makeProduct(input: {
  slug: string;
  name: string;
  description: string;
  gender: CatalogProduct["gender"];
  basePrice: number;
  category: CatalogProduct["category"];
  frameMaterial: string;
  lensType: string;
  isFeatured?: boolean;
  lensWidthMm: number;
  bridgeWidthMm: number;
}): CatalogProduct {
  return {
    ...input,
    id: input.slug,
    brand: "Kelilink",
    status: "PUBLISHED",
    isFeatured: input.isFeatured ?? false,
    category: input.category,
    variants: makeVariants(input.frameMaterial, input.lensType),
    specification: {
      frameWidthMm: input.lensWidthMm * 2 + input.bridgeWidthMm,
      lensWidthMm: input.lensWidthMm,
      bridgeWidthMm: input.bridgeWidthMm,
      templeLengthMm: 145,
      weightGrams: input.frameMaterial === "Titanium" ? 18 : 25,
      warranty: "Garansi contoh 1 tahun",
      includedItems: ["Kotak kacamata", "Kain microfiber"],
    },
    marketplaceLinks: [],
  };
}

export const DEMO_PRODUCTS: CatalogProduct[] = [
  makeProduct({
    slug: "aviator-classic",
    name: "Aviator Classic",
    description:
      "Siluet aviator ringan dengan garis bersih untuk pemakaian harian.",
    gender: "UNISEX",
    basePrice: 489000,
    category: { slug: "aviator", name: "Aviator" },
    frameMaterial: "Metal",
    lensType: "UV400",
    isFeatured: true,
    lensWidthMm: 58,
    bridgeWidthMm: 14,
  }),
  makeProduct({
    slug: "round-studio",
    name: "Round Studio",
    description: "Frame bulat dengan proporsi seimbang dan sentuhan klasik.",
    gender: "UNISEX",
    basePrice: 429000,
    category: { slug: "round", name: "Round" },
    frameMaterial: "Acetate",
    lensType: "Blue light",
    isFeatured: true,
    lensWidthMm: 49,
    bridgeWidthMm: 20,
  }),
  makeProduct({
    slug: "wayfarer-daily",
    name: "Wayfarer Daily",
    description:
      "Bentuk wayfarer serbaguna dengan frame acetate yang terasa solid.",
    gender: "MEN",
    basePrice: 459000,
    category: { slug: "wayfarer", name: "Wayfarer" },
    frameMaterial: "Acetate",
    lensType: "UV400",
    isFeatured: true,
    lensWidthMm: 54,
    bridgeWidthMm: 18,
  }),
  makeProduct({
    slug: "cat-eye-line",
    name: "Cat-Eye Line",
    description:
      "Sudut naik yang halus memberi karakter tanpa terasa berlebihan.",
    gender: "WOMEN",
    basePrice: 439000,
    category: { slug: "cat-eye", name: "Cat-eye" },
    frameMaterial: "Acetate",
    lensType: "Blue light",
    lensWidthMm: 52,
    bridgeWidthMm: 17,
  }),
  makeProduct({
    slug: "rectangle-form",
    name: "Rectangle Form",
    description: "Frame persegi panjang tipis untuk tampilan modern dan rapi.",
    gender: "UNISEX",
    basePrice: 399000,
    category: { slug: "rectangle", name: "Rectangle" },
    frameMaterial: "Stainless steel",
    lensType: "UV400",
    lensWidthMm: 55,
    bridgeWidthMm: 17,
  }),
  makeProduct({
    slug: "browline-modern",
    name: "Browline Modern",
    description: "Kontras material pada bagian atas frame memberi aksen tegas.",
    gender: "UNISEX",
    basePrice: 479000,
    category: { slug: "browline", name: "Browline" },
    frameMaterial: "Acetate and metal",
    lensType: "Blue light",
    lensWidthMm: 52,
    bridgeWidthMm: 19,
  }),
  makeProduct({
    slug: "oval-soft",
    name: "Oval Soft",
    description:
      "Kurva oval lembut dengan bobot ringan untuk penggunaan panjang.",
    gender: "WOMEN",
    basePrice: 419000,
    category: { slug: "oval", name: "Oval" },
    frameMaterial: "Titanium",
    lensType: "UV400",
    lensWidthMm: 50,
    bridgeWidthMm: 19,
  }),
  makeProduct({
    slug: "square-atelier",
    name: "Square Atelier",
    description: "Frame kotak dengan sudut membulat untuk gaya sehari-hari.",
    gender: "UNISEX",
    basePrice: 449000,
    category: { slug: "square", name: "Square" },
    frameMaterial: "Acetate",
    lensType: "Blue light",
    lensWidthMm: 53,
    bridgeWidthMm: 18,
  }),
  makeProduct({
    slug: "sport-light",
    name: "Sport Light",
    description: "Frame ringan dan stabil untuk aktivitas luar ruang.",
    gender: "MEN",
    basePrice: 529000,
    category: { slug: "sport", name: "Sport" },
    frameMaterial: "TR90",
    lensType: "Polarized",
    lensWidthMm: 60,
    bridgeWidthMm: 16,
  }),
  makeProduct({
    slug: "minimal-titanium",
    name: "Minimal Titanium",
    description: "Konstruksi titanium ramping dengan tampilan minimal.",
    gender: "UNISEX",
    basePrice: 649000,
    category: { slug: "minimal", name: "Minimal" },
    frameMaterial: "Titanium",
    lensType: "UV400",
    lensWidthMm: 51,
    bridgeWidthMm: 19,
  }),
];
