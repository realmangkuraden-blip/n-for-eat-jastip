'use client';

import { useMemo, useState } from 'react';
import { ShoppingBag, Search, Plus, Minus, Trash2 } from 'lucide-react';
import { products, rupiah, Product } from '@/lib/products';

export default function MenuClient() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Semua');
  const [cart, setCart] = useState<Record<string, number>>({});
  const cats = ['Semua','Makanan','Snack','Dessert','Minuman'];
  const filtered = useMemo(() => products.filter(p => (cat === 'Semua' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [q, cat]);
  const items = Object.entries(cart).map(([id, qty]) => ({ p: products.find(x => x.id === id)!, qty })).filter(x => x.p);
  const subtotal = items.reduce((s, x) => s + x.p.price * x.qty, 0);
  const jastip = subtotal ? 10000 : 0;
  const total = subtotal + jastip;
  const add = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id: string) => setCart(c => { const n = (c[id] || 0) - 1; const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });
  const checkout = () => {
    const text = `Halo N for Eat Jastip 👋%0A%0ASaya ingin melakukan pemesanan.%0A%0APesanan:%0A${items.map(x => `${x.qty}x ${x.p.name} - ${rupiah(x.p.price*x.qty)}`).join('%0A')}%0A%0ASubtotal: ${rupiah(subtotal)}%0ABiaya Jastip: ${rupiah(jastip)}%0ATotal: ${rupiah(total)}%0A%0ANama:%0AAlamat:%0ACatatan:`;
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6280000000000'}?text=${text}`, '_blank');
  };
  return <div className="container py-10">
    <div className="mb-8"><h1 className="text-4xl font-black">Menu Jastip 🍴</h1><p className="mt-2 opacity-70">Pilih makanan favoritmu, lalu lanjut pesan via WhatsApp.</p></div>
    <div className="mb-6 flex flex-col gap-3 md:flex-row"><div className="flex flex-1 items-center gap-2 rounded-full border bg-white px-4"><Search size={18}/><input className="w-full bg-transparent py-3 outline-none" placeholder="Cari makanan..." value={q} onChange={e=>setQ(e.target.value)}/></div><div className="flex gap-2 overflow-auto">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`rounded-full px-4 py-2 text-sm font-bold ${cat===c?'bg-[#e97827] text-white':'border bg-white'}`}>{c}</button>)}</div></div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(p=><ProductCard key={p.id} p={p} onAdd={()=>add(p.id)}/>)}</div>
    {items.length>0 && <aside className="fixed bottom-5 left-1/2 z-30 w-[calc(100%-24px)] max-w-lg -translate-x-1/2 rounded-3xl border bg-white p-5 shadow-2xl"><div className="mb-3 flex items-center justify-between"><b className="flex items-center gap-2"><ShoppingBag size={19}/> Keranjang</b><span>{rupiah(total)}</span></div>{items.map(x=><div key={x.p.id} className="flex items-center justify-between border-t py-2 text-sm"><span>{x.p.name} × {x.qty}</span><span className="flex items-center gap-2"><button onClick={()=>dec(x.p.id)} className="rounded-full border p-1"><Minus size={13}/></button><button onClick={()=>add(x.p.id)} className="rounded-full border p-1"><Plus size={13}/></button><button onClick={()=>setCart(c=>{const y={...c};delete y[x.p.id];return y})}><Trash2 size={15}/></button></span></div>)}<button onClick={checkout} className="btn btn-primary mt-3 w-full">💬 Checkout via WhatsApp</button></aside>}
  </div>;
}

function ProductCard({p,onAdd}:{p:Product;onAdd:()=>void}) {
  return <article className="card overflow-hidden"><div className="flex h-44 items-center justify-center bg-[#fff1dc] text-7xl">{p.emoji}</div><div className="p-5"><div className="mb-1 text-xs font-bold uppercase opacity-50">{p.store} · {p.category}</div><h2 className="text-xl font-black">{p.name}</h2><p className="my-2 text-sm opacity-70">{p.description}</p><div className="flex items-center justify-between"><b className="text-lg text-[#e97827]">{rupiah(p.price)}</b><button onClick={onAdd} disabled={!p.available} className="btn btn-primary gap-1 disabled:opacity-40"><Plus size={17}/> Tambah</button></div></div></article>;
}
