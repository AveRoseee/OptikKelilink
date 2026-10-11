import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  ExternalLink,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getMarketplaceActivityForLastSevenDays } from "@/lib/admin-analytics";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard Admin | Optik Kelilink" };
export const instant = false;
const idr = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

async function DashboardData() {
  await requireAdmin();
  const [total, published, drafts, clicks, recent, bars] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.product.count({ where: { status: "DRAFT" } }),
    prisma.analyticsEvent.count({
      where: {
        eventName: {
          in: ["click_shopee", "click_tiktok_shop", "click_tokopedia"],
        },
      },
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    }),
    getMarketplaceActivityForLastSevenDays(),
  ]);
  const max = Math.max(1, ...bars.map((bar) => bar.count));
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">RINGKASAN TOKO</p>
          <h1>Dashboard</h1>
          <p>Ringkasan katalog dan aktivitas outbound marketplace.</p>
        </div>
        <Link className="admin-button primary" href="/admin/produk/tambah">
          <Plus size={16} />
          Tambah produk
        </Link>
      </div>
      <div className="admin-stats">
        <article>
          <span className="admin-stat-icon">
            <Box size={18} />
          </span>
          <p>Total produk</p>
          <strong>{total}</strong>
          <small>Seluruh status katalog</small>
        </article>
        <article>
          <span className="admin-stat-icon green">
            <ShoppingBag size={18} />
          </span>
          <p>Produk terbit</p>
          <strong>{published}</strong>
          <small>Terlihat di katalog publik</small>
        </article>
        <article>
          <span className="admin-stat-icon amber">
            <Box size={18} />
          </span>
          <p>Draft</p>
          <strong>{drafts}</strong>
          <small>Belum ditampilkan</small>
        </article>
        <article>
          <span className="admin-stat-icon violet">
            <ExternalLink size={18} />
          </span>
          <p>Klik marketplace</p>
          <strong>{clicks}</strong>
          <small>Data event yang tercatat</small>
        </article>
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-activity-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Aktivitas marketplace</h2>
              <p>Event klik marketplace selama 7 hari terakhir</p>
            </div>
            <span className="admin-period">7 hari</span>
          </div>
          <div className="admin-chart">
            {bars.map((bar) => (
              <div className="admin-chart-column" key={bar.label}>
                <span>{bar.count}</span>
                <div>
                  <i
                    style={{
                      height: `${Math.max(8, (bar.count / max) * 100)}%`,
                    }}
                  />
                </div>
                <small>{bar.label}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-panel admin-shortcuts">
          <div className="admin-panel-heading">
            <div>
              <h2>Akses cepat</h2>
              <p>Kelola katalog dengan cepat.</p>
            </div>
          </div>
          <Link href="/admin/produk">
            <span className="admin-shortcut-icon">
              <Box size={17} />
            </span>
            <span>
              <strong>Daftar produk</strong>
              <small>Lihat dan kelola katalog</small>
            </span>
            <ArrowUpRight size={15} />
          </Link>
          <Link href="/admin/produk/tambah">
            <span className="admin-shortcut-icon">
              <Plus size={17} />
            </span>
            <span>
              <strong>Tambah produk</strong>
              <small>Masukkan produk baru</small>
            </span>
            <ArrowUpRight size={15} />
          </Link>
          <Link href="/katalog" target="_blank">
            <span className="admin-shortcut-icon">
              <ExternalLink size={17} />
            </span>
            <span>
              <strong>Buka katalog publik</strong>
              <small>Pratinjau pengalaman pelanggan</small>
            </span>
            <ArrowDownRight size={15} />
          </Link>
        </section>
      </div>
      <section className="admin-panel admin-recent">
        <div className="admin-panel-heading">
          <div>
            <h2>Produk terbaru</h2>
            <p>Produk yang terakhir dibuat atau diperbarui.</p>
          </div>
          <Link href="/admin/produk" className="admin-text-link">
            Lihat semua <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <small>{product.brand}</small>
                  </td>
                  <td>{product.category.name}</td>
                  <td>{idr(Number(product.basePrice))}</td>
                  <td>
                    <span
                      className={`admin-status ${product.status.toLowerCase()}`}
                    >
                      {product.status === "PUBLISHED"
                        ? "Terbit"
                        : product.status === "DRAFT"
                          ? "Draft"
                          : "Arsip"}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="admin-view-link"
                      href={`/admin/produk/${product.id}`}
                    >
                      Lihat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && (
            <div className="admin-empty">
              Belum ada produk. Mulai dengan membuat produk pertama.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function DashboardFallback() {
  return (
    <div className="admin-loading">
      <span className="admin-spinner" />
      Memuat ringkasan katalog...
    </div>
  );
}
export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardData />
    </Suspense>
  );
}
