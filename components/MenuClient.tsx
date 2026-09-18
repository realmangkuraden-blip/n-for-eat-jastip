'use client';
import { useEffect,useMemo,useState } from 'react';
import { ShoppingBag,Search,Plus,Minus,Trash2,ChevronRight } from 'lucide-react';
import Link from 'next/link';
type Category={name:string;slug:string};
type Product={id:string;name:string;slug:string;description:string|null;selling_price:number;jastip_fee:number;is_available:boolean;image_url:string|null;categories:Category[]};
const rupiah=(n:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const emojiFor=(c?:string|null)=>({Makanan:'🍜',Snack:'🍟',Dessert:'🍰',Minuman:'🧋','Paket Hemat':'🍱',Promo:'🔥'} as Record<string,string>)[c||'']||'🍴';

export default function MenuClient(){
 const [products,setProducts]=useState<Product[]>([]),[q,setQ]=useState(''),[cat,setCat]=useState('Semua'),[cart,setCart]=useState<Record<string,number>>({}),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{const raw=localStorage.getItem('nfe-cart');if(raw)try{setCart(JSON.parse(raw))}catch{};fetch('/api/products').then(r=>r.ok?r.json():Promise.reject(new Error('Gagal memuat menu'))).then(setProducts).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
 useEffect(()=>{localStorage.setItem('nfe-cart',JSON.stringify(cart))},[cart]);
 const cats=useMemo(()=>['Semua',...Array.from(new Set(products.flatMap(p=>p.categories.map(c=>c.name))))],[products]);
 const filtered=useMemo(()=>products.filter(p=>(cat==='Semua'||p.categories.some(c=>c.name===cat))&&p.name.toLowerCase().includes(q.toLowerCase())),[products,q,cat]);
 const items=Object.entries(cart).map(([id,qty])=>({p:products.find(x=>x.id===id)!,qty})).filter(x=>x.p),subtotal=items.reduce((s,x)=>s+Number(x.p.selling_price)*x.qty,0),jastip=items.reduce((s,x)=>s+Number(x.p.jastip_fee)*x.qty,0),total=subtotal+jastip,totalQty=items.reduce((s,x)=>s+x.qty,0);
 const add=(id:string)=>setCart(c=>({...c,[id]:(c[id]||0)+1})); const dec=(id:string)=>setCart(c=>{const n=(c[id]||0)-1,x={...c};if(n<=0)delete x[id];else x[id]=n;return x});
 return <div className="safe-bottom container py-8 md:py-10">
  <div className="mb-6"><div className="text-sm font-black text-[#e97827]">GO JASTIP 4N</div><h1 className="mt-1 text-4xl font-black">Pilih Menu 🍴</h1><p className="mt-2 text-[#756b64]">Pilih makanan, atur jumlah, lalu lihat keranjang di bawah.</p></div>
  <div className="sticky top-[64px] z-10 -mx-1 mb-7 rounded-3xl border bg-[#fffaf1]/95 p-3 backdrop-blur">
   <div className="flex items-center gap-2 rounded-2xl border bg-white px-4"><Search size={18} className="shrink-0 opacity-60"/><input aria-label="Cari makanan" className="w-full bg-transparent py-3 outline-none" placeholder="Cari makanan favorit..." value={q} onChange={e=>setQ(e.target.value)}/></div>
   <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${cat===c?'bg-[#e97827] text-white shadow-sm':'border bg-white'}`}>{c}</button>)}</div>
  </div>
  {loading&&<div className="card p-8 text-center">Memuat menu...</div>}{error&&<div className="card p-8 text-center text-red-600">{error}</div>}{!loading&&!error&&filtered.length===0&&<div className="card p-8 text-center">Menu yang dicari belum tersedia.</div>}
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(p=>{const qty=cart[p.id]||0;return <article className="product-card card overflow-hidden" key={p.id}>
   <Link href={"/menu/"+p.slug} className="block"><div className="flex h-48 items-center justify-center bg-[#fff1dc] text-7xl">{p.image_url?<img src={p.image_url} alt={p.name+' - GO JASTIP 4N'} className="h-full w-full object-cover" loading="lazy"/>:emojiFor(p.categories[0]?.name)}</div></Link>
   <div className="p-5"><div className="mb-1 text-xs font-black uppercase tracking-wide text-[#9b8f87]">{p.categories.length?p.categories.map(c=>c.name).join(' · '):'Menu'}</div><Link href={"/menu/"+p.slug} className="text-xl font-black hover:text-[#e97827]">{p.name}</Link>{p.description&&<p className="my-2 line-clamp-2 text-sm text-[#756b64]">{p.description}</p>}<div className="text-xs text-[#8b8078]">Harga {rupiah(Number(p.selling_price))} + jastip {rupiah(Number(p.jastip_fee))}</div>
   <div className="mt-4 flex items-center justify-between gap-3"><div><b className="text-lg text-[#e97827]">{rupiah(Number(p.selling_price)+Number(p.jastip_fee))}</b><div className="text-[11px] text-[#9b8f87]">per porsi/item</div></div>
   {qty===0?<button onClick={()=>add(p.id)} disabled={!p.is_available} className="btn btn-primary gap-1 px-5"><Plus size={18}/> Tambah</button>:<div className="flex items-center gap-2 rounded-full border bg-[#fff8ed] p-1"><button aria-label={`Kurangi ${p.name}`} onClick={()=>dec(p.id)} className="rounded-full bg-white p-2 shadow-sm"><Minus size={15}/></button><b className="min-w-7 text-center">{qty}</b><button aria-label={`Tambah ${p.name}`} onClick={()=>add(p.id)} className="rounded-full bg-[#e97827] p-2 text-white shadow-sm"><Plus size={15}/></button></div>}</div></div>
  </article>})}</div>
  {items.length>0&&<aside className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-20px)] max-w-xl -translate-x-1/2 rounded-3xl border bg-white/95 p-4 shadow-2xl backdrop-blur"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="rounded-2xl bg-[#fff1dc] p-3"><ShoppingBag size={20}/></div><div><b className="block">{totalQty} item di keranjang</b><span className="text-sm text-[#756b64]">{rupiah(total)}</span></div></div><Link href="/checkout" className="btn btn-primary gap-1 px-5">Checkout <ChevronRight size={17}/></Link></div><div className="mt-3 max-h-24 space-y-1 overflow-auto border-t pt-2">{items.map(x=><div key={x.p.id} className="flex items-center justify-between text-sm"><span className="truncate pr-3">{x.p.name} × {x.qty}</span><button aria-label={`Hapus ${x.p.name}`} onClick={()=>setCart(c=>{const y={...c};delete y[x.p.id];return y})}><Trash2 size={15} className="opacity-50"/></button></div>)}</div></aside>}
 </div>;
}
