import Link from "next/link";
import { ArrowUpRight, Glasses } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Kelilink, beranda">
          <span className="brand-mark">
            <Glasses size={18} strokeWidth={1.8} />
          </span>
          <span>kelilink</span>
        </Link>
        <nav className="main-nav" aria-label="Navigasi utama">
          <Link href="/katalog">Kacamata</Link>
          <Link href="/katalog">Lensa</Link>
          <Link href="/#tentang">Cara memilih</Link>
          <Link href="/#tentang">Tentang kami</Link>
        </nav>
        <Link className="header-cta" href="/katalog">
          Jelajahi Produk <ArrowUpRight size={14} />
        </Link>
      </div>
    </header>
  );
}
