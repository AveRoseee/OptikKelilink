"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Glasses, Search, Sparkles } from "lucide-react";
import type { CatalogProduct } from "@/types/catalog";

const price = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export function CatalogBrowser({ products }: { products: CatalogProduct[] }) {
  const categories = useMemo(
    () => ["Semua bentuk", ...new Set(products.map((p) => p.category.name))],
    [products],
  );
  const materials = useMemo(
    () => [
      "Semua bahan",
      ...new Set(
        products.flatMap((p) => p.variants.map((v) => v.frameMaterial)),
      ),
    ],
    [products],
  );
  const lenses = useMemo(
    () => [
      "Semua lensa",
      ...new Set(products.flatMap((p) => p.variants.map((v) => v.lensType))),
    ],
    [products],
  );
  const collections = useMemo(
    () => [
      "Semua koleksi",
      ...new Set(
        products.flatMap((p) => (p.collection ? [p.collection.name] : [])),
      ),
    ],
    [products],
  );
  const colors = useMemo(
    () => [
      "Semua warna",
      ...new Set(products.flatMap((p) => p.variants.map((v) => v.colorName))),
    ],
    [products],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua bentuk");
  const [gender, setGender] = useState("Semua gender");
  const [material, setMaterial] = useState("Semua bahan");
  const [lens, setLens] = useState("Semua lensa");
  const [collection, setCollection] = useState("Semua koleksi");
  const [color, setColor] = useState("Semua warna");
  const [maxPrice, setMaxPrice] = useState("0");

  const shown = products.filter((p) => {
    const text =
      `${p.name} ${p.category.name} ${p.brand} ${p.variants.map((v) => v.frameMaterial).join(" ")}`.toLowerCase();
    const variants = p.variants;
    return (
      text.includes(query.trim().toLowerCase()) &&
      (category === "Semua bentuk" || p.category.name === category) &&
      (gender === "Semua gender" || p.gender === gender) &&
      (material === "Semua bahan" ||
        variants.some((v) => v.frameMaterial === material)) &&
      (lens === "Semua lensa" || variants.some((v) => v.lensType === lens)) &&
      (color === "Semua warna" ||
        variants.some((v) => v.colorName === color)) &&
      (collection === "Semua koleksi" || p.collection?.name === collection) &&
      (maxPrice === "0" || p.basePrice <= Number(maxPrice))
    );
  });

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Glasses size={20} />
          </span>
          kelilink<span className="brand-dot">.</span>
        </Link>
        <nav>
          <a href="#koleksi">Koleksi</a>
          <a href="#tentang">Tentang</a>
        </nav>
        <a className="header-link" href="#katalog">
          Jelajahi frame <ArrowRight size={15} />
        </a>
      </header>
      <section className="hero" id="koleksi">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} /> FRAME PILIHAN, GAYA PERSONAL
          </p>
          <h1>
            Temukan frame
            <br />
            yang terasa <em>seperti kamu.</em>
          </h1>
          <p className="hero-description">
            Jelajahi bentuk, material, dan warna yang dirancang untuk menemani
            hari-harimu.
          </p>
          <a className="primary-button" href="#katalog">
            Lihat katalog <ArrowRight size={16} />
          </a>
          <p className="hero-note">— Kurasi frame untuk setiap cerita</p>
        </div>
        <div className="hero-art">
          <div className="hero-orb" />
          <Glasses className="hero-glasses" size={250} strokeWidth={0.8} />
          <span className="hero-sticker">
            MADE TO
            <br />
            BE YOURS
          </span>
          <small>01 / 10　 ·　 KELILINK STUDIO</small>
        </div>
      </section>
      <section className="catalog-section" id="katalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">KOLEKSI KELILINK</p>
            <h2>Frame untuk setiap versi dirimu</h2>
          </div>
          <span>{shown.length} gaya pilihan</span>
        </div>
        <div className="catalog-controls">
          <label className="search">
            <Search size={17} />
            <input
              aria-label="Cari produk"
              placeholder="Cari frame, bentuk, material..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="filter-row">
            <Filter
              value={category}
              onChange={setCategory}
              options={categories}
            />
            <Filter
              value={gender}
              onChange={setGender}
              options={["Semua gender", "UNISEX", "WOMEN", "MEN", "KIDS"]}
            />
            <Filter
              value={material}
              onChange={setMaterial}
              options={materials}
            />
            <Filter value={lens} onChange={setLens} options={lenses} />
            <Filter value={color} onChange={setColor} options={colors} />
            <Filter
              value={collection}
              onChange={setCollection}
              options={collections}
            />
            <Filter
              value={maxPrice}
              onChange={setMaxPrice}
              options={[
                ["0", "Semua harga"],
                ["450000", "Maks. Rp450 rb"],
                ["500000", "Maks. Rp500 rb"],
                ["600000", "Maks. Rp600 rb"],
              ]}
            />
          </div>
        </div>
        {shown.length ? (
          <div className="product-grid">
            {shown.map((p, i) => (
              <article className="product-card" key={p.slug}>
                <Link className="product-art" href={`/produk/${p.slug}`}>
                  <small>KL / {String(i + 1).padStart(2, "0")}</small>
                  {p.isFeatured && <b>Pilihan</b>}
                  <Glasses
                    size={126}
                    strokeWidth={1.15}
                    color={p.variants[0]?.colorHex}
                  />
                  <span className="view-link">
                    Lihat detail <ArrowRight size={14} />
                  </span>
                </Link>
                <div className="product-meta">
                  <small>
                    {p.category.name} · {p.variants[0]?.frameMaterial}
                  </small>
                  <div>
                    <h3>
                      <Link href={`/produk/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <strong>{price(p.basePrice)}</strong>
                  </div>
                  <p className="swatches">
                    {p.variants.map((v) => (
                      <i
                        key={v.colorName}
                        title={v.colorName}
                        style={{ backgroundColor: v.colorHex }}
                      />
                    ))}
                    <span>{p.variants.length} warna</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty">
            Tidak ada frame yang cocok. Coba ubah pencarian atau filter.
          </p>
        )}
      </section>
      <section className="about" id="tentang">
        <p className="eyebrow">PILIH DENGAN PERCAYA DIRI</p>
        <h2>Detail kecil. Perbedaan besar.</h2>
        <p>
          Kenali ukuran dan karakter setiap frame sebelum memilih toko
          favoritmu.
        </p>
      </section>
      <footer className="footer">
        <b>
          kelilink<span className="brand-dot">.</span>
        </b>
        <span>Katalog frame pilihan · Jakarta, Indonesia</span>
        <span>© 2026 Kelilink</span>
      </footer>
    </main>
  );
}

function Filter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: (string | [string, string])[];
}) {
  return (
    <select
      aria-label={typeof options[0] === "string" ? options[0] : options[0]?.[1]}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => {
        const [optionValue, label] =
          typeof option === "string" ? [option, option] : option;
        return (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
