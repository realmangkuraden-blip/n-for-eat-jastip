# N for Eat Jastip

Website jastip makanan untuk **N for Eat Jastip**.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Lucide React
- Supabase Postgres + RLS
- Supabase Edge Functions
- Vercel-ready

## Status implementasi
- Homepage dan katalog membaca data Supabase
- Search/filter kategori
- Keranjang client-side dengan localStorage
- Checkout tanpa wajib login
- Server-side validasi harga, ketersediaan, dan biaya jastip
- Pembuatan order `NFE-YYYYMMDD-XXXX`
- Order items + status history
- Tracking order dengan nomor order + nomor WhatsApp
- Edge Functions `create-order` dan `track-order`
- GitHub Actions build check

## Menjalankan lokal
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`.

## Environment variables
Salin `.env.example` menjadi `.env.local` lalu isi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kfufhkubdjxztszvhaxt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```
**Jangan commit `.env.local` atau service-role key ke GitHub.**

## Struktur utama
- `app/page.tsx` — homepage
- `app/menu/page.tsx` — katalog
- `app/checkout/page.tsx` — checkout dan pembuatan order
- `app/order/page.tsx` — pencarian order
- `app/order/[order_number]/page.tsx` — tracking order
- `app/api/products/route.ts` — endpoint produk aktif
- `components/MenuClient.tsx` — katalog dan keranjang
- `lib/supabase/` — Supabase clients
- `supabase/migrations/` — migration/seed SQL

## Supabase
Project: `N-for-Eat-Jastip` (`kfufhkubdjxztszvhaxt`).
Katalog memakai public-read RLS. Checkout menggunakan Edge Function server-side agar total order tidak dipercaya dari browser.

Edge Functions aktif:
- `create-order`
- `track-order`

## Berikutnya
1. Admin Auth + dashboard.
2. CRUD produk/kategori.
3. Upload gambar produk via Supabase Storage.
4. Manajemen status order oleh admin/operator.
5. Deployment Vercel dan konfigurasi environment production.
