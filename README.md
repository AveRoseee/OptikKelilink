# Optik Kelilink

Optik Kelilink adalah aplikasi katalog kacamata berbasis Next.js. Pengunjung dapat melihat koleksi, mencari dan menyaring produk, memeriksa detail serta varian warna, lalu membuka toko di marketplace. Admin dapat masuk melalui Supabase Auth untuk mengelola produk dan melihat ringkasan klik marketplace.

Aplikasi ini **belum menyediakan keranjang, checkout, payment gateway, atau pemrosesan pesanan**. Tombol toko mengarahkan pelanggan ke marketplace.

## Fitur

### Katalog publik

- Beranda dengan kategori, produk pilihan, dan penjelasan cara memilih frame.
- Katalog dengan pencarian, filter bentuk/gender/warna/material/harga, dan pengurutan.
- Halaman detail produk dengan spesifikasi, pilihan warna, produk terkait, dan tautan marketplace.
- Viewer GLB interaktif untuk produk yang memiliki URL model. Jika model belum tersedia, halaman menampilkan ilustrasi frame.
- Pencatatan kunjungan produk, interaksi viewer, pergantian varian, dan klik marketplace.

### Dashboard admin

- Login dengan email dan kata sandi melalui Supabase Auth.
- Allowlist email admin melalui `ADMIN_EMAIL` atau daftar `ADMIN_EMAILS` yang dipisahkan koma.
- Ringkasan jumlah produk, status terbit/draft, klik marketplace, dan aktivitas tujuh hari.
- Daftar, cari, lihat, tambah, edit, dan hapus produk.
- Pengelolaan kategori, koleksi, spesifikasi, varian, status publikasi, URL gambar/model, dan URL Shopee/TikTok Shop/Tokopedia.

## Teknologi

- Next.js App Router, React, TypeScript, dan Tailwind CSS.
- PostgreSQL dengan Prisma ORM dan adapter `pg`.
- Supabase Auth dengan `@supabase/ssr` untuk sesi admin berbasis cookie.
- React Three Fiber, Drei, dan Three.js untuk model 3D GLB.
- Zod untuk validasi data server dan `qrcode.react` untuk QR marketplace.

## Struktur proyek

```text
src/
  app/
    page.tsx                    Beranda
    katalog/page.tsx            Katalog publik
    produk/[slug]/page.tsx      Detail produk publik
    admin/                      Login, dashboard, dan operasi produk admin
    api/analytics/route.ts      Endpoint pencatatan event katalog
    study-case/3d-viewer/       Halaman belajar viewer GLB
  components/
    admin/                      Shell, tabel, tombol hapus, dan form produk
    catalog-browser.tsx         Pencarian, filter, dan pengurutan katalog
    product-detail.tsx          Varian, viewer, spesifikasi, marketplace
    eyewear-viewer.tsx          Pembungkus viewer yang dimuat di client
    three-model-canvas.tsx      Canvas Three.js dan kontrol orbit/zoom
  data/demo-products.ts         Data katalog contoh
  lib/
    admin-auth.ts               Pemeriksaan admin dan allowlist email
    catalog.ts                  Query dan pemetaan data katalog
    prisma.ts                   Prisma Client untuk PostgreSQL
    supabase/server.ts          Klien Supabase server dan cookie
    track-event.ts              Pengiriman event analytics dari browser
  proxy.ts                      Refresh sesi Supabase pada rute admin
prisma/
  schema.prisma                 Model dan relasi database
  migrations/                   Migrasi SQL
  seed.ts                       Pengisian data contoh yang dijaga dengan flag
```

## Rute aplikasi

| Rute | Kegunaan |
| --- | --- |
| `/` | Beranda dan produk pilihan |
| `/katalog` | Pencarian, filter, dan pengurutan katalog |
| `/produk/[slug]` | Detail produk, varian, viewer, dan tautan toko |
| `/study-case/3d-viewer` | Contoh mandiri viewer model GLB |
| `/admin/login` | Login admin |
| `/admin` | Dashboard ringkasan dan aktivitas marketplace |
| `/admin/produk` | Daftar dan pencarian produk admin |
| `/admin/produk/tambah` | Form produk baru |
| `/admin/produk/[id]` | Detail produk di dashboard |
| `/admin/produk/[id]/edit` | Edit produk |
| `POST /api/analytics` | Validasi dan penyimpanan event katalog |

## Alur data

1. Halaman server meminta data melalui `src/lib/catalog.ts`.
2. Jika `DATABASE_URL` tersedia, katalog membaca produk berstatus `PUBLISHED` dari PostgreSQL lewat Prisma. Di mode development, jika database gagal diakses, fungsi katalog mencatat peringatan dan memakai `DEMO_PRODUCTS`. Di luar development, error database diteruskan.
3. Komponen katalog memfilter data di browser. Halaman detail mengirim event browser ke `/api/analytics`; endpoint memvalidasi payload dengan Zod dan menyimpan event ke `AnalyticsEvent`.
4. Form admin mengirim data ke Server Action. Server memeriksa admin, memvalidasi data dengan Zod, kemudian menyimpan produk, kategori, varian, tautan marketplace, dan spesifikasi dalam transaksi Prisma.

## Model data utama

- `Product` menyimpan identitas, harga, deskripsi, status, kategori, dan koleksi.
- `ProductVariant` menyimpan warna, bahan, jenis lensa, ukuran, ketersediaan, dan URL GLB.
- `MarketplaceLink` menyimpan URL toko, platform, dan status aktif. Tautan dapat terkait produk atau varian.
- `Specification` menyimpan ukuran, berat, garansi, serta barang yang disertakan.
- `Category`, `Collection`, dan `ProductTranslation` mendukung pengelompokan dan konten produk.
- `ProductMedia` disiapkan untuk galeri media; form admin saat ini belum menyediakan unggah atau pengelolaan galeri.
- `AnalyticsEvent` menyimpan event katalog dan klik marketplace.

## Menyiapkan lingkungan lokal

### Prasyarat

- Node.js yang sesuai dengan versi Next.js/Prisma dalam `package.json`.
- pnpm `12.10.1` (tercantum pada `package.json`).
- Database PostgreSQL yang bisa diakses dari mesin pengembangan.
- Project Supabase dengan Auth jika ingin menggunakan dashboard admin.

### Instalasi

1. Install dependensi:

   ```bash
   pnpm install
   ```

2. Salin `.env.example` menjadi `.env.local`.
3. Isi `DATABASE_URL` dengan koneksi Supabase Session pooler (port 5432) atau PostgreSQL yang sesuai. Isi `DIRECT_URL` dengan koneksi langsung untuk menjalankan migrasi. Jangan commit `.env` atau `.env.local`.
4. Untuk admin, isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `ADMIN_EMAIL`. `ADMIN_EMAILS` dapat digunakan sebagai daftar beberapa email, dipisahkan koma.
5. Buat user email/kata sandi di Supabase Dashboard → Authentication → Users. Email user harus cocok dengan allowlist aplikasi.
6. Buat Prisma Client dan terapkan migrasi:

   ```bash
   pnpm db:generate
   pnpm exec prisma migrate deploy
   ```

   Untuk membuat migrasi baru saat pengembangan schema, gunakan `pnpm db:migrate` pada database pengembangan.
7. Jalankan aplikasi:

   ```bash
   pnpm dev
   ```

   Buka `http://localhost:3000`. Halaman admin tersedia di `/admin/login`.

`DATABASE_URL` dan `DIRECT_URL` adalah rahasia. Jangan menyalin nilai aslinya ke issue, dokumentasi, commit, atau tangkapan layar.

## Data demo

Seed demo hanya berjalan jika `ALLOW_DEMO_SEED=true`, sebagai pengaman agar tidak dijalankan tanpa sengaja. Gunakan **database pengujian saja**. Di PowerShell:

```powershell
$env:ALLOW_DEMO_SEED = "true"
pnpm db:seed
Remove-Item Env:ALLOW_DEMO_SEED
```

Seed membuat 10 produk (8 terbit, 1 draft, 1 arsip), 30 varian, spesifikasi, kategori, satu koleksi, tiga tautan marketplace contoh untuk tiap produk, serta 20 event klik tersebar selama tujuh hari. Tautan memakai `example.com` dan bukan toko sungguhan. Seed aman dijalankan ulang untuk tujuan demo: ia memperbarui slug demo yang sama, mengganti tautan demo produk dan menghapus event dengan campaign `demo-seed` sebelum membuat ulang event contoh. Jangan jalankan pada database produksi.

## Skrip yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `pnpm dev` | Server pengembangan Next.js |
| `pnpm build` | Build produksi |
| `pnpm start` | Menjalankan build produksi |
| `pnpm lint` | ESLint |
| `pnpm db:validate` | Validasi schema Prisma |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:migrate` | Migrasi development (`prisma migrate dev`) |
| `pnpm exec prisma migrate deploy` | Terapkan migrasi yang sudah ada |
| `pnpm db:seed` | Seed demo; wajib mengaktifkan `ALLOW_DEMO_SEED=true` |

## Aset dan batasan saat ini

- Produk contoh di `src/data/demo-products.ts` adalah data fiktif untuk pengembangan.
- Model studi kasus `/study-case/3d-viewer` mengambil GLB contoh dari Khronos Group melalui URL eksternal. Model produk Kelilink sendiri perlu disediakan lewat URL publik.
- Form admin menerima URL foto dan URL GLB, tetapi belum mengunggah file. Variabel Supabase Storage ada di `.env.example`, tetapi alur penyimpanan/upload Storage belum dibuat.
- Skema mempunyai `ProductMedia`, namun galeri media belum dikelola lewat form admin.
- Tidak ada autentikasi pelanggan, cart, checkout, pembayaran, atau pemrosesan order.
- README dan `.env.example` boleh masuk Git; `.env`, `.env.local`, `node_modules`, `.next`, dan `src/generated/prisma` diabaikan Git.

## Belajar dari kode

Urutan yang disarankan:

1. Mulai dari `src/app/page.tsx`, `src/components/landing-page.tsx`, lalu `/katalog` untuk memahami App Router dan komposisi komponen.
2. Ikuti data publik dari `src/lib/catalog.ts` ke `src/lib/prisma.ts` dan `prisma/schema.prisma`.
3. Pelajari `src/components/catalog-browser.tsx` dan `product-card.tsx` untuk state React, filter, dan daftar produk.
4. Buka `src/components/product-detail.tsx`, `eyewear-viewer.tsx`, dan `three-model-canvas.tsx` untuk interaksi varian dan rendering 3D.
5. Telusuri login admin dari `src/app/admin/login` ke `auth-actions.ts`, `lib/admin-auth.ts`, dan `lib/supabase/server.ts`.
6. Ikuti simpan produk dari `components/admin/product-form.tsx` ke `src/app/admin/actions.ts`, lalu ke transaksi Prisma.
7. Lihat pencatatan event pada `src/lib/track-event.ts`, `src/app/api/analytics/route.ts`, dan grafik dashboard admin.
8. Gunakan `/study-case/3d-viewer` untuk bereksperimen dengan GLB tanpa mengubah produk katalog.

## Panduan Word

Panduan belajar yang lebih rinci tersedia di [`docs/Panduan_Belajar_Kode_Kelilink.docx`](docs/Panduan_Belajar_Kode_Kelilink.docx). Dokumen itu membahas peta folder, alur request, autentikasi, CRUD, data Prisma, viewer 3D, analytics, setup lokal, glosarium, dan latihan.
