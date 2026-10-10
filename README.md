# Kelilink

MVP katalog kacamata dengan halaman katalog publik, detail produk 3D, dan dashboard admin untuk mengelola produk. Aplikasi ini tidak menyediakan cart, checkout, payment gateway, ataupun pemrosesan order.

## Menjalankan aplikasi

1. Install dependencies: `pnpm install`.
2. Salin `.env.example` menjadi `.env.local`, lalu isi `DATABASE_URL` dengan Supabase Session pooler dan `DIRECT_URL` dengan Direct connection. Pertahankan `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `ADMIN_EMAIL` dari project Auth yang sama.
3. Jalankan migrasi database yang sudah ada: `pnpm exec prisma migrate deploy`.
4. Buat user admin di **Supabase Dashboard → Authentication → Users**. Admin masuk menggunakan email dan password user tersebut.
5. Isi `ADMIN_EMAIL` di `.env.local` dengan email admin yang diizinkan. Untuk beberapa admin, gunakan `ADMIN_EMAILS` dan pisahkan email dengan koma. Jika keduanya kosong, akses dashboard ditolak.
6. Jalankan `pnpm dev`, kemudian buka `http://localhost:3000/admin/login`.

Dashboard memakai Supabase Auth dengan session berbasis cookie. `ADMIN_EMAIL` atau `ADMIN_EMAILS` menjadi allowlist admin; session yang valid saja tidak cukup untuk membuka dashboard atau menjalankan aksi CRUD.

## Fitur admin

- Dashboard ringkasan jumlah produk, status publikasi, dan event outbound marketplace.
- Daftar produk dengan pencarian, detail, edit, dan penghapusan.
- Form produk untuk nama, slug, brand, deskripsi, kategori, koleksi, harga, gender, dan status publikasi.
- Satu atau beberapa varian dengan warna, material, jenis lensa, ukuran, ketersediaan, dan URL model GLB.
- Spesifikasi ukuran, berat, serta garansi.
- URL outbound Shopee, TikTok Shop, dan Tokopedia.

Kategori dapat dibuat atau diperbarui langsung saat menyimpan produk. Upload foto dan model 3D belum menjadi bagian dari form ini; masukkan URL asset yang dapat diakses publik. Semua operasi CRUD menggunakan database PostgreSQL melalui Prisma.

## Data demo untuk pengujian

Untuk mengisi database pengujian, aktifkan guard seed sementara di PowerShell:

```powershell
$env:ALLOW_DEMO_SEED = "true"
pnpm db:seed
Remove-Item Env:ALLOW_DEMO_SEED
```

Seed membuat 10 produk (8 terbit, 1 draft, 1 arsip), 30 varian, spesifikasi, kategori, satu koleksi, tautan marketplace contoh, dan 20 event klik yang tersebar selama 7 hari agar grafik dashboard terisi. URL marketplace memakai `example.com` dan tidak menuju toko sungguhan. Seed aman dijalankan ulang untuk data contoh: event seed lama diganti, bukan ditambahkan berulang. Jalankan hanya pada database pengujian karena seed memperbarui slug demo yang sama.
