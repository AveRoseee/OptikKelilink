import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/">kelilink</Link>
          <p>Kacamata yang terasa pas, dilihat lebih dekat.</p>
        </div>
        <div className="footer-group">
          <b>Jelajahi</b>
          <Link href="/katalog">Semua kacamata</Link>
          <Link href="/katalog">Koleksi pilihan</Link>
        </div>
        <div className="footer-group">
          <b>Bantuan</b>
          <Link href="/#tentang">Cara memilih frame</Link>
          <Link href="/#tentang">Tentang Kelilink</Link>
        </div>
        <div className="footer-group">
          <b>Temukan kami</b>
          <span>Shopee · TikTok Shop · Tokopedia</span>
          <span>Jakarta, Indonesia</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Kelilink. Katalog kacamata pilihan.</span>
        <span>Informasi harga mengikuti toko marketplace.</span>
      </div>
    </footer>
  );
}
