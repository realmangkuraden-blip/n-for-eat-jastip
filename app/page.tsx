import Link from 'next/link';
import { ArrowRight, Clock, Heart, MessageCircle, Utensils } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const rupiah=(n:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);

export default async function Home(){
 const supabase=await createClient();
 const {data:featured}=await supabase.from('products').select('id,name,slug,selling_price,jastip_fee,image_url').eq('is_available',true).eq('is_featured',true).order('name').limit(6);
 const products=featured?.length?featured:(await supabase.from('products').select('id,name,slug,selling_price,jastip_fee,image_url').eq('is_available',true).order('name').limit(6)).data||[];
 return <main>
  <section className="container grid gap-8 py-10 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-16">
   <div>
    <span className="inline-flex rounded-full bg-[#d8f7f2] px-4 py-2 text-sm font-black">👨‍👩‍👧‍👦 Jastip yang nyaman untuk keluarga</span>
    <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Pilih Makanan.<br/><span className="text-[#ff6b45]">Kami yang Urus.</span></h1>
    <p className="mt-4 max-w-xl text-lg leading-7 text-[#6d625b]">Mau makan bareng keluarga tanpa ribet? Pilih menu favorit, atur jumlahnya, lalu checkout. Pesanan dilanjutkan lewat WhatsApp.</p>
    <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/menu" className="btn btn-primary gap-2">🍴 Pilih Menu <ArrowRight size={18}/></Link><a href="#cara-pesan" className="btn border bg-white">Cara pesan</a></div>
    <div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-[#6d625b]"><span>✓ Pilihan mudah</span><span>✓ Bisa untuk keluarga</span><span>✓ Konfirmasi WhatsApp</span></div>
   </div>
   <div className="soft-card relative flex min-h-[330px] items-center justify-center overflow-hidden">
    <div className="absolute -right-10 -top-10 text-8xl opacity-30">🧋</div><div className="absolute -bottom-8 -left-8 text-8xl opacity-30">🍟</div>
    <div className="text-center"><div className="text-8xl md:text-9xl">🍜🍗</div><div className="mt-4 text-xl font-black">Makan bareng jadi lebih simpel ❤️</div></div>
   </div>
  </section>

  <section className="container py-8">
   <div className="flex items-end justify-between gap-4"><div><span className="text-sm font-black text-[#ff6b45]">REKOMENDASI</span><h2 className="mt-1 text-3xl font-black">Menu Favorit</h2></div><Link href="/menu" className="text-sm font-black text-[#ff6b45]">Lihat semua →</Link></div>
   <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map(p=><Link href={"/menu/"+p.slug} className="product-card card p-4" key={p.id}>
    <div className="flex h-44 items-center justify-center overflow-hidden rounded-[18px] bg-[#fff0a8] text-6xl">{p.image_url?<img src={p.image_url} alt={p.name+' - GO JASTIP 4N'} className="h-full w-full object-cover"/>:'🍴'}</div>
    <h3 className="mt-3 font-black">{p.name}</h3><p className="mt-1 text-sm text-[#6d625b]">Harga + jastip</p><b className="mt-1 block text-[#ff6b45]">{rupiah(Number(p.selling_price)+Number(p.jastip_fee))}</b>
   </Link>)}</div>
  </section>

  <section className="container py-12">
   <div className="card p-7 md:p-9"><div className="md:flex md:items-end md:justify-between"><div><span className="text-sm font-black text-[#ff6b45]">GAMPANG BANGET</span><h2 className="mt-1 text-3xl font-black">Cara pesan untuk keluarga</h2></div><Link href="/menu" className="mt-4 inline-block font-black text-[#ff6b45] md:mt-0">Mulai pilih menu →</Link></div>
   <div id="cara-pesan" className="mt-7 grid gap-4 md:grid-cols-4">{[['🍴','Pilih menu','Cari makanan yang disukai.'],['➕','Atur jumlah','Tambah 1, 2, atau sesuai kebutuhan.'],['🛒','Cek keranjang','Pastikan semua pesanan sudah benar.'],['💬','Checkout & WhatsApp','Isi alamat lalu konfirmasi.']].map(([i,t,d],n)=><div className="rounded-2xl bg-[#e8f8f5] p-5" key={t}><div className="text-3xl">{i}</div><div className="mt-3 text-xs font-black text-[#ff6b45]">0{n+1}</div><b className="mt-1 block">{t}</b><p className="mt-1 text-sm text-[#6d625b]">{d}</p></div>)}</div></div>
  </section>

  <section id="tentang" className="container py-4"><div className="soft-card grid gap-6 p-7 md:grid-cols-[1fr_1fr] md:p-9"><div><h2 className="text-3xl font-black">Dibuat untuk pesanan yang praktis</h2><p className="mt-3 leading-7 text-[#6d625b]">Tidak perlu bingung. Pilih menu, tentukan jumlah, dan lihat total sebelum checkout.</p></div><div className="grid grid-cols-2 gap-3 text-sm font-bold"><div className="rounded-2xl bg-white p-4"><Clock className="mb-2"/>Praktis</div><div className="rounded-2xl bg-white p-4"><Utensils className="mb-2"/>Banyak pilihan</div><div className="rounded-2xl bg-white p-4"><MessageCircle className="mb-2"/>WhatsApp</div><div className="rounded-2xl bg-white p-4"><Heart className="mb-2"/>Ramah keluarga</div></div></div></section>
 </main>;
}
