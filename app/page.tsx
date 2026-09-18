import Link from 'next/link';
import { ArrowRight, Clock, Heart, MessageCircle, Utensils } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const rupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default async function Home() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from('products')
    .select('id,name,slug,selling_price,jastip_fee,image_url')
    .eq('is_available', true)
    .eq('is_featured', true)
    .order('name')
    .limit(6);

  const products = featured && featured.length > 0 ? featured : (await supabase
    .from('products')
    .select('id,name,slug,selling_price,jastip_fee,image_url')
    .eq('is_available', true)
    .order('name')
    .limit(6)).data || [];

  return <main>
    <section className="container grid gap-10 py-16 md:grid-cols-2 md:items-center">
      <div><span className="rounded-full bg-[#ffe3c5] px-4 py-2 text-sm font-bold">🍴 Jastip makanan lokal</span>
        <h1 className="mt-6 text-5xl font-black leading-tight md:text-6xl">Mau Makan Enak <span className="text-[#e97827]">Tanpa Ribet?</span></h1>
        <p className="mt-5 max-w-xl text-lg opacity-70">Titip makanan favoritmu, biar GO JASTIP 4N yang urus. Pilih menu, checkout, dan lanjutkan pesanan lewat WhatsApp.</p>
        <div className="mt-7 flex gap-3"><Link href="/menu" className="btn btn-primary gap-2">Lihat Menu <ArrowRight size={18}/></Link><a href="#cara-pesan" className="btn border bg-white">Cara Pesan</a></div>
      </div>
      <div className="card flex min-h-[360px] items-center justify-center bg-[#fff1dc] text-9xl">🍜🍗🧋</div>
    </section>
    <section className="container py-10"><div className="flex items-end justify-between gap-4"><h2 className="text-3xl font-black">Menu Favorit</h2><Link href="/menu" className="text-sm font-bold text-[#e97827]">Lihat semua →</Link></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map(p=><Link href={"/menu/"+p.slug} className="card p-5 transition hover:-translate-y-0.5" key={p.id}>
        <div className="flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-[#fff1dc] text-6xl">{p.image_url?<img src={p.image_url} alt={p.name+' - GO JASTIP 4N'} className="h-full w-full object-cover"/>:'🍴'}</div>
        <h3 className="mt-3 font-black">{p.name}</h3><p className="text-sm opacity-60">Menu GO JASTIP 4N</p><b className="text-[#e97827]">{rupiah(Number(p.selling_price) + Number(p.jastip_fee))}</b>
      </Link>)}</div>
    </section>
    <section id="cara-pesan" className="container py-14"><h2 className="text-3xl font-black">Cara Pesan</h2><div className="mt-6 grid gap-4 md:grid-cols-4">{[['🍴','Pilih makanan'],['🛒','Masukkan keranjang'],['💬','Kirim WhatsApp'],['🛵','Kami proses & antar']].map(([i,t],n)=><div className="card p-5" key={t}><div className="text-3xl">{i}</div><div className="mt-3 text-sm opacity-50">0{n+1}</div><b>{t}</b></div>)}</div></section>
    <section id="tentang" className="container py-10"><div className="card grid gap-8 p-8 md:grid-cols-2"><div><h2 className="text-3xl font-black">Kenapa GO JASTIP 4N?</h2><p className="mt-3 opacity-70">Layanan jastip yang dibuat sederhana supaya kamu bisa fokus memilih makanan yang ingin dinikmati.</p></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-[#fff1dc] p-4"><Clock/> Cepat & praktis</div><div className="rounded-2xl bg-[#fff1dc] p-4"><Utensils/> Banyak pilihan</div><div className="rounded-2xl bg-[#fff1dc] p-4"><MessageCircle/> Via WhatsApp</div><div className="rounded-2xl bg-[#fff1dc] p-4"><Heart/> Friendly</div></div></div></section>
  </main>;
}
