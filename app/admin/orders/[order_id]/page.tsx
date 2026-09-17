'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const statuses = ['pending_payment','payment_submitted','payment_verified','processing','shopping','purchased','delivering','completed','cancelled']
const labels: Record<string,string> = {pending_payment:'Menunggu pembayaran',payment_submitted:'Bukti pembayaran dikirim',payment_verified:'Pembayaran terverifikasi',processing:'Diproses',shopping:'Sedang dibelikan',purchased:'Sudah dibeli',delivering:'Dikirim',completed:'Selesai',cancelled:'Dibatalkan'}
const rupiah=(n:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)

export default function OrderDetailPage(){
 const supabase=createClient(); const router=useRouter(); const params=useParams<{order_id:string}>()
 const [user,setUser]=useState<any>(null); const [order,setOrder]=useState<any>(null); const [items,setItems]=useState<any[]>([]); const [history,setHistory]=useState<any[]>([]); const [notes,setNotes]=useState(''); const [status,setStatus]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(true)

 async function load(){
  const {data:{user}}=await supabase.auth.getUser()
  if(!user){router.replace('/admin/login');return}
  const {data:admin}=await supabase.from('admin_users').select('is_active').eq('user_id',user.id).maybeSingle()
  if(!admin?.is_active){await supabase.auth.signOut();router.replace('/admin/login');return}
  setUser(user)
  const {data:orderData,error}=await supabase.from('orders').select('*').eq('id',params.order_id).maybeSingle()
  if(error||!orderData){setMsg(error?.message||'Pesanan tidak ditemukan.');setLoading(false);return}
  const [{data:orderItems},{data:orderHistory}]=await Promise.all([
   supabase.from('order_items').select('*').eq('order_id',params.order_id).order('created_at'),
   supabase.from('order_status_history').select('*').eq('order_id',params.order_id).order('created_at',{ascending:false}),
  ])
  setOrder(orderData); setItems(orderItems||[]); setHistory(orderHistory||[]); setNotes(orderData.internal_notes||''); setStatus(orderData.status); setLoading(false)
 }
 useEffect(()=>{load()},[params.order_id])

 async function save(){
  if(!order||!user)return
  setMsg('Menyimpan…')
  if(status!==order.status){
   const {error}=await supabase.from('orders').update({status}).eq('id',order.id)
   if(error){setMsg(error.message);return}
   const {error:historyError}=await supabase.from('order_status_history').insert({order_id:order.id,status,note:'Status diubah dari detail admin',changed_by:user.id})
   if(historyError){setMsg(historyError.message);return}
  }
  const {error:noteError}=await supabase.from('orders').update({internal_notes:notes}).eq('id',order.id)
  if(noteError){setMsg(noteError.message);return}
  setMsg('Pesanan berhasil diperbarui.')
  await load()
 }

 if(loading)return <main className="container py-20 text-center">Memuat pesanan…</main>
 if(!order)return <main className="container py-10"><Link href="/admin">← Kembali</Link><p className="mt-6">{msg||'Pesanan tidak ditemukan.'}</p></main>

 return <main className="container py-10">
  <Link href="/admin" className="text-sm">← Dashboard</Link>
  <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-sm font-bold text-[#e97827]">ORDER DETAIL</p><h1 className="text-3xl font-black">{order.order_number}</h1><p className="text-sm opacity-60">{new Date(order.created_at).toLocaleString('id-ID')}</p></div><div className="flex gap-2"><button className="btn border" onClick={()=>window.print()}>Print</button><button className="btn btn-primary" onClick={save}>Simpan</button></div></div>
  {msg&&<p className="mt-4 text-sm opacity-70">{msg}</p>}

  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
   <div className="space-y-6">
    <section className="card p-5"><h2 className="text-xl font-black">Customer & Pengiriman</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm"><Info label="Nama" value={order.customer_name}/><Info label="WhatsApp" value={order.customer_phone}/><Info label="Email" value={order.customer_email||'-'}/><Info label="Kota" value={order.delivery_city}/><Info label="Penerima" value={order.recipient_name||order.customer_name}/><Info label="Telepon penerima" value={order.recipient_phone||order.customer_phone}/><div className="sm:col-span-2"><Info label="Alamat" value={order.delivery_address}/></div><div className="sm:col-span-2"><Info label="Patokan" value={order.delivery_landmark||'-'}/></div><div className="sm:col-span-2"><Info label="Catatan pengiriman" value={order.delivery_notes||'-'}/></div><div className="sm:col-span-2"><Info label="Catatan pelanggan" value={order.customer_notes||'-'}/></div></div></section>

    <section className="card overflow-hidden"><div className="border-b p-5"><h2 className="text-xl font-black">Item Pesanan</h2></div><div className="divide-y">{items.map(item=><div key={item.id} className="p-5"><div className="flex justify-between gap-4"><div><b>{item.product_name}</b><p className="text-sm opacity-60">{item.quantity} × {rupiah(Number(item.unit_price))} · Jastip {rupiah(Number(item.jastip_fee))}</p>{item.note&&<p className="mt-1 text-sm">Catatan: {item.note}</p>}</div><b>{rupiah(Number(item.subtotal))}</b></div></div>)}</div></section>

    <section className="card p-5"><h2 className="text-xl font-black">Timeline Status</h2><div className="mt-4 space-y-4">{history.map(h=><div key={h.id} className="border-l-2 pl-4"><b>{labels[h.status]||h.status}</b><p className="text-xs opacity-50">{new Date(h.created_at).toLocaleString('id-ID')}</p>{h.note&&<p className="text-sm opacity-70">{h.note}</p>}</div>)}</div></section>
   </div>

   <aside className="space-y-6">
    <section className="card p-5"><h2 className="font-black">Status</h2><select className="mt-3 w-full rounded-xl border p-3" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{labels[s]}</option>)}</select></section>
    <section className="card p-5"><h2 className="font-black">Ringkasan Pembayaran</h2><div className="mt-4 space-y-2 text-sm"><Row label="Subtotal" value={order.subtotal}/><Row label="Jastip" value={order.jastip_total}/><Row label="Delivery" value={order.delivery_fee}/><Row label="Biaya tambahan" value={order.additional_fee}/><Row label="Diskon" value={-Number(order.discount_total)}/><div className="border-t pt-3"><Row label="Total" value={order.total} bold/></div></div></section>
    <section className="card p-5"><h2 className="font-black">Catatan Internal</h2><textarea className="mt-3 min-h-36 w-full rounded-xl border p-3" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Catatan untuk tim internal…"/><p className="mt-2 text-xs opacity-50">Tidak ditampilkan kepada pelanggan.</p></section>
   </aside>
  </div>
 </main>
}
function Info({label,value}:{label:string;value:any}){return <div><p className="text-xs font-bold uppercase opacity-40">{label}</p><p className="mt-1">{value}</p></div>}
function Row({label,value,bold=false}:{label:string;value:number;bold?:boolean}){return <div className={`flex justify-between gap-4 ${bold?'text-lg font-black':''}`}><span>{label}</span><span>{rupiah(Number(value))}</span></div>}
