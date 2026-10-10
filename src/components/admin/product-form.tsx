"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ProductActionState } from "@/app/admin/actions";

type Variant = {
  id?: string;
  colorName: string;
  colorHex: string;
  frameMaterial: string;
  lensType: string;
  sizeCode: string;
  model3dUrl: string;
  isAvailable: boolean;
};
type Marketplace = {
  platform: "SHOPEE" | "TIKTOK_SHOP" | "TOKOPEDIA";
  url: string;
  isActive: boolean;
};
export type ProductFormValues = {
  name: string;
  slug: string;
  brand: string;
  description: string;
  gender: string;
  basePrice: string;
  mainImageUrl: string;
  status: string;
  isFeatured: boolean;
  categoryName: string;
  categorySlug: string;
  collectionId: string;
  variants: Variant[];
  marketplaces: Marketplace[];
  frameWidthMm?: number | null;
  lensWidthMm?: number | null;
  bridgeWidthMm?: number | null;
  templeLengthMm?: number | null;
  weightGrams?: number | null;
  warranty?: string | null;
};
const emptyVariant: Variant = {
  colorName: "Hitam",
  colorHex: "#132f55",
  frameMaterial: "Acetate",
  lensType: "Demo lens",
  sizeCode: "M",
  model3dUrl: "",
  isAvailable: true,
};
const platforms: Marketplace["platform"][] = [
  "SHOPEE",
  "TIKTOK_SHOP",
  "TOKOPEDIA",
];
const emptyState: ProductActionState = {};

export function ProductForm({
  action,
  initial,
  collections = [],
}: {
  action: (
    state: ProductActionState,
    data: FormData,
  ) => Promise<ProductActionState>;
  initial?: ProductFormValues;
  collections?: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  const [variants, setVariants] = useState<Variant[]>(
    initial?.variants?.length ? initial.variants : [{ ...emptyVariant }],
  );
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>(
    initial?.marketplaces?.length
      ? initial.marketplaces
      : platforms.map((platform) => ({ platform, url: "", isActive: false })),
  );
  const variantsJson = useMemo(() => JSON.stringify(variants), [variants]);
  const marketplacesJson = useMemo(
    () => JSON.stringify(marketplaces),
    [marketplaces],
  );
  const field = (
    name: keyof ProductFormValues,
    value?: string | number | boolean | null,
  ) => value ?? initial?.[name] ?? "";
  return (
    <form className="admin-product-form" action={formAction}>
      <input type="hidden" name="variantsJson" value={variantsJson} />
      <input type="hidden" name="marketplacesJson" value={marketplacesJson} />
      <div className="admin-form-columns">
        <div className="admin-form-main">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Informasi produk</h2>
                <p>Data utama yang tampil di halaman katalog.</p>
              </div>
              <span className="admin-step">01</span>
            </div>
            <div className="admin-form-grid">
              <label className="admin-field wide">
                Nama produk
                <input
                  name="name"
                  required
                  defaultValue={field("name") as string}
                  placeholder="Contoh: Frame Aria"
                />
              </label>
              <label className="admin-field">
                Brand
                <input
                  name="brand"
                  required
                  defaultValue={field("brand") as string}
                  placeholder="Kelilink"
                />
              </label>
              <label className="admin-field">
                Slug
                <input
                  name="slug"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  defaultValue={field("slug") as string}
                  placeholder="frame-aria"
                />
                <small>Gunakan huruf kecil dan tanda hubung.</small>
              </label>
              <label className="admin-field wide">
                Deskripsi
                <textarea
                  name="description"
                  required
                  minLength={10}
                  rows={4}
                  defaultValue={field("description") as string}
                  placeholder="Jelaskan bentuk, material, dan karakter frame..."
                />
              </label>
              <label className="admin-field">
                Gender
                <select
                  name="gender"
                  defaultValue={field("gender", "UNISEX") as string}
                >
                  <option value="UNISEX">Unisex</option>
                  <option value="MEN">Pria</option>
                  <option value="WOMEN">Wanita</option>
                  <option value="KIDS">Anak-anak</option>
                </select>
              </label>
              <label className="admin-field">
                Harga (Rp)
                <input
                  type="number"
                  name="basePrice"
                  min="1"
                  step="1000"
                  required
                  defaultValue={field("basePrice") as string}
                  placeholder="350000"
                />
              </label>
              <label className="admin-field">
                Nama kategori
                <input
                  name="categoryName"
                  required
                  defaultValue={field("categoryName") as string}
                  placeholder="Kacamata hitam"
                />
              </label>
              <label className="admin-field">
                Slug kategori
                <input
                  name="categorySlug"
                  required
                  defaultValue={field("categorySlug") as string}
                  placeholder="kacamata-hitam"
                />
              </label>
              <label className="admin-field wide">
                Koleksi
                <select
                  name="collectionId"
                  defaultValue={field("collectionId") as string}
                >
                  <option value="">Tanpa koleksi</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field wide">
                URL foto utama
                <input
                  type="url"
                  name="mainImageUrl"
                  defaultValue={field("mainImageUrl") as string}
                  placeholder="https://..."
                />
              </label>
            </div>
          </section>
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Varian & model 3D</h2>
                <p>Setiap warna atau ukuran dicatat sebagai varian katalog.</p>
              </div>
              <button
                type="button"
                className="admin-button secondary small"
                onClick={() =>
                  setVariants([...variants, { ...emptyVariant, colorName: "" }])
                }
              >
                <Plus size={14} />
                Tambah varian
              </button>
            </div>
            <div className="admin-variant-list">
              {variants.map((variant, index) => (
                <article className="admin-variant" key={variant.id ?? index}>
                  <div className="admin-variant-title">
                    <strong>Varian {index + 1}</strong>
                    <button
                      type="button"
                      aria-label="Hapus varian"
                      disabled={variants.length < 2}
                      onClick={() =>
                        setVariants(variants.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {variant.id && <input type="hidden" value={variant.id} />}
                  <div className="admin-form-grid">
                    <label className="admin-field">
                      Warna
                      <input
                        value={variant.colorName}
                        required
                        onChange={(e) =>
                          setVariants(
                            variants.map((v, i) =>
                              i === index
                                ? { ...v, colorName: e.target.value }
                                : v,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-field">
                      Kode warna
                      <input
                        type="color"
                        value={variant.colorHex}
                        onChange={(e) =>
                          setVariants(
                            variants.map((v, i) =>
                              i === index
                                ? { ...v, colorHex: e.target.value }
                                : v,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-field">
                      Material frame
                      <input
                        value={variant.frameMaterial}
                        required
                        onChange={(e) =>
                          setVariants(
                            variants.map((v, i) =>
                              i === index
                                ? { ...v, frameMaterial: e.target.value }
                                : v,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-field">
                      Jenis lensa
                      <input
                        value={variant.lensType}
                        required
                        onChange={(e) =>
                          setVariants(
                            variants.map((v, i) =>
                              i === index
                                ? { ...v, lensType: e.target.value }
                                : v,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-field">
                      Ukuran
                      <input
                        value={variant.sizeCode}
                        required
                        onChange={(e) =>
                          setVariants(
                            variants.map((v, i) =>
                              i === index
                                ? { ...v, sizeCode: e.target.value }
                                : v,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-field">
                      URL model GLB
                      <input
                        type="url"
                        value={variant.model3dUrl}
                        placeholder="https://.../model.glb"
                        onChange={(e) =>
                          setVariants(
                            variants.map((v, i) =>
                              i === index
                                ? { ...v, model3dUrl: e.target.value }
                                : v,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-check">
                      <input
                        type="checkbox"
                        checked={variant.isAvailable}
                        onChange={(e) =>
                          setVariants(
                            variants.map((v, i) =>
                              i === index
                                ? { ...v, isAvailable: e.target.checked }
                                : v,
                            ),
                          )
                        }
                      />
                      Varian tersedia
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Spesifikasi frame</h2>
                <p>Ukuran dalam milimeter dan berat dalam gram.</p>
              </div>
              <span className="admin-step">02</span>
            </div>
            <div className="admin-form-grid">
              {[
                ["frameWidthMm", "Lebar frame"],
                ["lensWidthMm", "Lebar lensa"],
                ["bridgeWidthMm", "Lebar bridge"],
                ["templeLengthMm", "Panjang tangkai"],
                ["weightGrams", "Berat (gram)"],
              ].map(([name, label]) => (
                <label className="admin-field" key={name}>
                  {label}
                  <input
                    type="number"
                    min="1"
                    name={name}
                    defaultValue={
                      field(name as keyof ProductFormValues) as string
                    }
                  />
                </label>
              ))}
              <label className="admin-field wide">
                Garansi
                <input
                  name="warranty"
                  defaultValue={field("warranty") as string}
                  placeholder="Garansi 1 tahun"
                />
              </label>
            </div>
          </section>
        </div>
        <aside className="admin-form-aside">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Publikasi</h2>
                <p>Atur status tampilan produk.</p>
              </div>
            </div>
            <label className="admin-field">
              Status
              <select
                name="status"
                defaultValue={field("status", "DRAFT") as string}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Terbit</option>
                <option value="ARCHIVED">Arsip</option>
              </select>
            </label>
            <label className="admin-check featured">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={Boolean(field("isFeatured", false))}
              />
              Tampilkan sebagai pilihan
            </label>
          </section>
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Tautan marketplace</h2>
                <p>URL tujuan tombol outbound.</p>
              </div>
            </div>
            {marketplaces.map((link, index) => (
              <div className="admin-marketplace" key={link.platform}>
                <strong>{link.platform.replace("_", " ")}</strong>
                <input
                  type="url"
                  aria-label={`URL ${link.platform}`}
                  value={link.url}
                  placeholder="https://..."
                  onChange={(e) =>
                    setMarketplaces(
                      marketplaces.map((v, i) =>
                        i === index ? { ...v, url: e.target.value } : v,
                      ),
                    )
                  }
                />
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={link.isActive}
                    onChange={(e) =>
                      setMarketplaces(
                        marketplaces.map((v, i) =>
                          i === index
                            ? { ...v, isActive: e.target.checked }
                            : v,
                        ),
                      )
                    }
                  />
                  Aktif
                </label>
              </div>
            ))}
          </section>
          {state.error && (
            <p className="admin-form-error" role="alert">
              {state.error}
            </p>
          )}
          <div className="admin-form-actions">
            <button
              className="admin-button primary"
              type="submit"
              disabled={pending}
            >
              {pending
                ? "Menyimpan..."
                : initial
                  ? "Simpan perubahan"
                  : "Simpan produk"}
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}
