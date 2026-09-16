# N for Eat Jastip

Website jastip makanan untuk **N for Eat Jastip**.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Lucide React
- Supabase Postgres + RLS
- Vercel-ready

## Status implementasi
- Homepage membaca menu featured dari Supabase
- Katalog membaca produk aktif dari Supabase
- Search dan filter kategori
- Keranjang client-side
- Checkout WhatsApp
- Seed menu awal di `supabase/migrations/`
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
- `app/page.tsx` — homepage dengan data featured dari Supabase
- `app/menu/page.tsx` — katalog menu
- `app/api/products/route.ts` — endpoint produk aktif
- `components/MenuClient.tsx` — pencarian/filter dan keranjang
- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — server client
- `supabase/migrations/` — migration/seed SQL

## Supabase

Project yang digunakan: `N-for-Eat-Jastip` (`kfufhkubdjxztszvhaxt`).
Tabel `products` dan `categories` sudah memiliki policy public read untuk katalog. Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY` di kode browser atau environment variable `NEXT_PUBLIC_*`.

## Tahap berikutnya
1. Checkout server-side dan pembuatan order `NFE-YYYYMMDD-XXXX`.
2. Halaman tracking `/order/[order_number]`.
3. Auth admin dan dashboard `/admin`.
4. CRUD produk/kategori dan upload gambar ke Supabase Storage.
5. Deployment dan environment variables di Vercel.
