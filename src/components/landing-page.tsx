import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Ruler,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { FrameIllustration } from "@/components/frame-illustration";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const categories = [
  { name: "Aviator", slug: "aviator" },
  { name: "Rectangle", slug: "rectangle" },
  { name: "Cat-eye", slug: "cat-eye" },
  { name: "Kacamata 3D", slug: "round" },
];

export function LandingPage({
  featuredProducts,
}: {
  featuredProducts: ReactNode;
}) {
  return (
    <main>
      <SiteHeader />
      <section className="hero-wrap">
        <div className="hero">
          <div className="hero-copy">
            <p className="hero-kicker">Kacamata pilihan, untuk gaya harian</p>
            <h1>
              Lihat lebih jelas,
              <br />
              tampil lebih percaya diri.
            </h1>
            <p className="hero-description">
              Temukan frame yang cocok dengan gayamu. Lihat setiap detailnya
              dalam tampilan 3D sebelum memilih toko favorit.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/katalog">
                Jelajahi Produk <ArrowRight size={15} />
              </Link>
              <Link className="button-secondary" href="/#tentang">
                Cara memilih
              </Link>
            </div>
          </div>
          <div className="hero-visual" aria-label="Pilihan frame Kelilink">
            <div className="hero-visual-note">
              <span /> Detail dalam tampilan 3D
            </div>
            <FrameIllustration
              className="hero-frame"
              category="round"
              color="#173e70"
              label="Ilustrasi frame kacamata"
            />
            <span className="hero-visual-caption">Koleksi pilihan · 2026</span>
          </div>
        </div>
      </section>

      <section
        className="category-section content-width"
        aria-labelledby="categories-title"
      >
        <div className="section-heading">
          <div>
            <p className="section-kicker">TEMUKAN GAYAMU</p>
            <h2 id="categories-title">Belanja menurut kategori</h2>
          </div>
          <Link className="text-link" href="/katalog">
            Lihat semua <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              className="category-tile"
              href="/katalog"
              key={category.slug + index}
            >
              <span className="category-number">0{index + 1}</span>
              <FrameIllustration
                category={category.slug}
                color={index === 2 ? "#9b5d35" : "#17467f"}
              />
              <span className="category-name">
                {category.name}
                <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section" id="koleksi">
        <div className="content-width">
          <div className="section-heading">
            <div>
              <p className="section-kicker">PILIHAN KELILINK</p>
              <h2>Koleksi pilihan</h2>
            </div>
            <Link className="text-link" href="/katalog">
              Jelajahi katalog <ArrowUpRight size={15} />
            </Link>
          </div>
          {featuredProducts}
        </div>
      </section>

      <section className="promise-section content-width" id="tentang">
        <div className="promise-heading">
          <p className="section-kicker">MEMILIH JADI LEBIH MUDAH</p>
          <h2>
            Kenali setiap detail
            <br />
            sebelum memilih.
          </h2>
        </div>
        <div className="promise-list">
          <article>
            <span>
              <ScanLine size={19} />
            </span>
            <div>
              <h3>Visual lebih nyata</h3>
              <p>
                Putar model 3D untuk melihat bentuk frame dari berbagai sisi.
              </p>
            </div>
          </article>
          <article>
            <span>
              <Ruler size={19} />
            </span>
            <div>
              <h3>Ukuran lebih jelas</h3>
              <p>
                Bandingkan ukuran dan detail material sebelum menentukan
                pilihan.
              </p>
            </div>
          </article>
          <article>
            <span>
              <ShieldCheck size={19} />
            </span>
            <div>
              <h3>Pilih toko tepercaya</h3>
              <p>Lanjutkan langsung ke toko resmi di marketplace pilihanmu.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="closing-cta content-width">
        <div>
          <p className="section-kicker">KELILINK EYEWEAR</p>
          <h2>Belum yakin ukuran yang cocok?</h2>
          <p>Jelajahi koleksi dan temukan frame untukmu.</p>
        </div>
        <Link className="button-light" href="/katalog">
          Cari frame pilihan <ArrowRight size={15} />
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
