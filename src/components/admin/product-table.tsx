"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Pencil, Search } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

type Row = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  status: string;
  basePrice: string;
  category: string;
  updatedAt: string;
};
const statusLabel: Record<string, string> = {
  PUBLISHED: "Terbit",
  DRAFT: "Draft",
  ARCHIVED: "Arsip",
};
export function ProductTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      rows.filter((row) =>
        `${row.name} ${row.brand} ${row.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [rows, query],
  );
  return (
    <>
      <label className="admin-search">
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama produk, brand, kategori..."
        />
      </label>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Diubah</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  <small>
                    {row.brand} · /{row.slug}
                  </small>
                </td>
                <td>{row.category}</td>
                <td>{row.basePrice}</td>
                <td>
                  <span className={`admin-status ${row.status.toLowerCase()}`}>
                    {statusLabel[row.status] ?? row.status}
                  </span>
                </td>
                <td>{row.updatedAt}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link
                      aria-label="Lihat produk"
                      href={`/admin/produk/${row.id}`}
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      aria-label="Edit produk"
                      href={`/admin/produk/${row.id}/edit`}
                    >
                      <Pencil size={15} />
                    </Link>
                    <DeleteProductButton id={row.id} name={row.name} compact />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="admin-empty">
            {rows.length
              ? "Tidak ada produk yang cocok."
              : "Belum ada produk. Tambahkan produk pertama Anda."}
          </div>
        )}
      </div>
    </>
  );
}
