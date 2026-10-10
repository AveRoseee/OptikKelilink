"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowDownWideNarrow,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { CatalogProduct } from "@/types/catalog";
import { ProductCard } from "@/components/product-card";

const genders = [
  { value: "UNISEX", label: "Unisex" },
  { value: "WOMEN", label: "Wanita" },
  { value: "MEN", label: "Pria" },
  { value: "KIDS", label: "Anak-anak" },
];

export function CatalogBrowser({ products }: { products: CatalogProduct[] }) {
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category.name))],
    [products],
  );
  const colors = useMemo(() => {
    const values = products.flatMap((product) =>
      product.variants.map((variant) => ({
        name: variant.colorName,
        hex: variant.colorHex,
      })),
    );
    return values.filter(
      (color, index) =>
        values.findIndex((item) => item.name === color.name) === index,
    );
  }, [products]);
  const materials = useMemo(
    () => [
      ...new Set(
        products.flatMap((product) =>
          product.variants.map((variant) => variant.frameMaterial),
        ),
      ),
    ],
    [products],
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [budget, setBudget] = useState("0");
  const [sort, setSort] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const shown = products.filter((product) => {
    const searchText = (
      product.name +
      " " +
      product.category.name +
      " " +
      product.brand
    ).toLowerCase();
    return (
      searchText.includes(query.trim().toLowerCase()) &&
      (!category || product.category.name === category) &&
      (!gender || product.gender === gender) &&
      (!material ||
        product.variants.some(
          (variant) => variant.frameMaterial === material,
        )) &&
      (!color ||
        product.variants.some((variant) => variant.colorName === color)) &&
      (budget === "0" || product.basePrice <= Number(budget))
    );
  });
  const sorted = [...shown].sort((first, second) => {
    if (sort === "price-low") return first.basePrice - second.basePrice;
    if (sort === "price-high") return second.basePrice - first.basePrice;
    if (sort === "name") return first.name.localeCompare(second.name);
    return Number(second.isFeatured) - Number(first.isFeatured);
  });
  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setGender("");
    setColor("");
    setMaterial("");
    setBudget("0");
  };
  const hasFilters = Boolean(
    query || category || gender || color || material || budget !== "0",
  );

  return (
    <div className="catalog-layout">
      <aside
        className={
          showMobileFilters ? "filter-sidebar filters-open" : "filter-sidebar"
        }
        aria-label="Filter katalog"
      >
        <div className="filter-heading">
          <h2>
            <SlidersHorizontal size={16} /> Filter
          </h2>
          <button
            className="mobile-filter-button"
            type="button"
            aria-expanded={showMobileFilters}
            onClick={() => setShowMobileFilters((open) => !open)}
          >
            {showMobileFilters ? "Tutup" : "Atur filter"}
          </button>
          {hasFilters && (
            <button type="button" onClick={clearFilters}>
              Reset
            </button>
          )}
        </div>
        <label className="catalog-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari kacamata"
            aria-label="Cari kacamata"
          />
          {query && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={() => setQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </label>
        <FilterGroup title="Bentuk">
          <label className="check-row">
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => setCategory("")}
            />{" "}
            Semua bentuk
          </label>
          {categories.map((value) => (
            <label className="check-row" key={value}>
              <input
                type="radio"
                name="category"
                checked={category === value}
                onChange={() => setCategory(value)}
              />{" "}
              {value}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup title="Untuk siapa">
          {genders.map((item) => (
            <label className="check-row" key={item.value}>
              <input
                type="radio"
                name="gender"
                checked={gender === item.value}
                onChange={() =>
                  setGender(gender === item.value ? "" : item.value)
                }
              />{" "}
              {item.label}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup title="Warna">
          <div className="filter-colors">
            {colors.map((item) => (
              <button
                type="button"
                key={item.name}
                aria-label={item.name}
                aria-pressed={color === item.name}
                title={item.name}
                className={
                  color === item.name ? "filter-color selected" : "filter-color"
                }
                style={{ "--swatch": item.hex } as CSSProperties}
                onClick={() => setColor(color === item.name ? "" : item.name)}
              />
            ))}
            {color && (
              <button
                type="button"
                className="color-clear"
                onClick={() => setColor("")}
              >
                Hapus
              </button>
            )}
          </div>
        </FilterGroup>
        <FilterGroup title="Material">
          <select
            aria-label="Pilih material frame"
            value={material}
            onChange={(event) => setMaterial(event.target.value)}
          >
            <option value="">Semua material</option>
            {materials.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup title="Rentang harga">
          <select
            aria-label="Pilih rentang harga"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          >
            <option value="0">Semua harga</option>
            <option value="450000">Hingga Rp450.000</option>
            <option value="500000">Hingga Rp500.000</option>
            <option value="600000">Hingga Rp600.000</option>
          </select>
        </FilterGroup>
      </aside>

      <div className="catalog-results">
        <div className="results-toolbar">
          <p>
            <strong>{sorted.length}</strong> produk ditemukan
          </p>
          <label>
            <ArrowDownWideNarrow size={16} />
            <select
              aria-label="Urutkan produk"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="featured">Pilihan Kelilink</option>
              <option value="name">Nama A–Z</option>
              <option value="price-low">Harga terendah</option>
              <option value="price-high">Harga tertinggi</option>
            </select>
          </label>
        </div>
        {sorted.length ? (
          <div className="product-grid catalog-product-grid">
            {sorted.map((product) => (
              <ProductCard product={product} key={product.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Belum ada frame yang cocok</h2>
            <p>Coba ubah kata pencarian atau pilihan filter.</p>
            <button
              className="button-primary"
              type="button"
              onClick={clearFilters}
            >
              Hapus semua filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
