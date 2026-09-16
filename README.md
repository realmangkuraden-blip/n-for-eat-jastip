# N for Eat Jastip

Website jastip makanan untuk **N for Eat Jastip**.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Lucide React
- Supabase-ready
- Vercel-ready

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Environment variables

Salin `.env.example` menjadi `.env.local` lalu isi:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

**Jangan commit `.env.local` atau service-role key ke GitHub.**

## Struktur utama
- `app/page.tsx` — homepage
- `app/menu/page.tsx` — katalog menu
- `components/MenuClient.tsx` — pencarian/filter dan keranjang
- `lib/products.ts` — data menu demo
- `.env.example` — template environment variables
- `.github/workflows/ci.yml` — build check otomatis

## Tahap berikutnya
Integrasi Supabase, checkout/order tracking, autentikasi admin, dashboard, koneksi WhatsApp, dan deployment Vercel akan dilanjutkan setelah starter ini terpasang.
