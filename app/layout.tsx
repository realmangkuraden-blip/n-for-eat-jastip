import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'N for Eat Jastip — Titip Makanan Favoritmu',
  description: 'Jasa titip makanan praktis dengan pemesanan melalui WhatsApp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-[#fffaf1]/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-black">N for Eat <span className="text-[#e97827]">JASTIP</span></Link>
          <nav className="hidden gap-6 md:flex"><Link href="/">Home</Link><Link href="/menu">Menu</Link><Link href="/#cara-pesan">Cara Pesan</Link><Link href="/#tentang">Tentang Kami</Link></nav>
          <Link className="btn btn-primary" href="/menu">Pesan Sekarang</Link>
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t bg-white py-10"><div className="container"><b>N for Eat Jastip</b><p className="text-sm opacity-70">Titip makanan favoritmu, kami yang urus.</p></div></footer>
    </>
  );
}
