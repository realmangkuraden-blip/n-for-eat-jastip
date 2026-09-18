import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

const siteUrl = 'https://jastip-n-go-ecatalog.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GO JASTIP 4N — Jastip Makanan Lokal',
    template: '%s | GO JASTIP 4N',
  },
  description:
    'GO JASTIP 4N adalah layanan jasa titip makanan lokal. Pilih menu, checkout online, konfirmasi pesanan lewat WhatsApp, dan kami proses pesananmu.',
  keywords: [
    'GO JASTIP 4N',
    'jastip makanan',
    'jasa titip makanan',
    'jastip makanan lokal',
    'pesan makanan',
    'titip makanan',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'GO JASTIP 4N',
    title: 'GO JASTIP 4N — Jastip Makanan Lokal',
    description:
      'Titip makanan favoritmu dengan mudah. Pilih menu, checkout, lalu lanjutkan pesanan lewat WhatsApp.',
  },
  twitter: {
    card: 'summary',
    title: 'GO JASTIP 4N — Jastip Makanan Lokal',
    description:
      'Layanan jastip makanan lokal dengan pemesanan online dan konfirmasi WhatsApp.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GO JASTIP 4N',
  url: siteUrl,
  description: 'Layanan jasa titip makanan lokal dengan pemesanan online.',
  inLanguage: 'id-ID',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="sticky top-0 z-20 border-b bg-[#fffaf1]/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-black">
            GO JASTIP <span className="text-[#e97827]">4N</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/#cara-pesan">Cara Pesan</Link>
            <Link href="/order">Lacak Pesanan</Link>
          </nav>
          <Link className="btn btn-primary" href="/menu">Pesan Sekarang</Link>
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t bg-white py-10">
        <div className="container">
          <b>GO JASTIP 4N</b>
          <p className="text-sm opacity-70">Titip makanan favoritmu, kami yang urus.</p>
        </div>
      </footer>
    </>
  );
}
