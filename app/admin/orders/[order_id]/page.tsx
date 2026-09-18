'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const statuses = ['pending_payment','payment_submitted','payment_verified','processing','shopping','purchased','delivering','completed','cancelled']
const labels: Record<string,string> = {pending_payment:'Menunggu pembayaran',payment_submitted:'Bukti pembayaran dikirim',payment_verified:'Pembayaran terverifikasi',processing:'Diproses',shopping:'Sedang dibelikan',purchased:'Sudah dibeli',delivering:'Dikirim',completed:'Selesai',cancelled:'Dibatalkan'}
const rupiah=(n:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)
const wa=(phone:string)=>{const p=(phone||'').replace(/\\D/g,'');return p.startsWith('0')?'62'+p.slice(1):p}

export default function OrderDetailPage(){
 const supabase=createClient(); const router=useRouter(); const params=useParams<{order_id:string}>()
 const [user,setUser]=useState<any>(null); const [order,setOrder]=useState<any>(null); const [items,setItems]=useState<any[]>([]); const [history,setHistory]=useState<any[]>([]); const [payment,setPayment]=useState<any>(null); const [notes,setNotes]=useState(''); const [status,setStatus]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(true)
 async function load(){
  const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace('/admin/login');return}
  const {data:admin}=await supabase.from('admin_users').select('is_active,role').eq('user_id',user.id).maybeSingle(); if(!admin?.is_active){await supabase.auth.signOut();router.replace('/admin/login');return}
  setUser(user)
  const {data:orderData,error}=await supabase.from('orders').select('*').eq('id',params.order_id).maybeSingle()
  if(error||!orderData){setMsg(error?.message||'Pesanan tidak ditemukan.');setLoading(false);return}
  const [{data:orderItems},{data:orderHistory},{data:paymentData}]=await Promise.all([
   supabase.from('order_items').select('*').eq('order_id',params.order_id).order('created_at'),
   supabase.from('order_status_history').select('*').eq('order_id',params.order_id).order('created_at',{ascending:false}),
   supabase.from('payments').select('*,payment_methods(name,type,provider,account_name,account_number,qr_image_url,instructions)').eq('order_id',params.order_id).order('created_at',{ascending:false}).limit(1).maybeSingle()
  ])
  setOrder(orderData);setItems(orderItems||[]);setHistory(orderHistory||[]);setPayment(paymentData||null);setNotes(orderData.internal_notes||'');setStatus(orderData.status);setLoading(false)
 }
 useEffect(()=>{load()},[params.order_id])
 async function save(){
  if(!order||!user)return
  setMsg('Menyimpan…')
  if(status!==order.status){const {error}=await supabase.rpc('admin_update_order_status',{p_order_id:order.id,p_status:status,p_note:'Status diubah dari detail admin'});if(error){setMsg(error.message);return}}
  const {error:noteError}=await supabase.from('orders').update({internal_notes:notes}).eq('id',order.id)
  if(noteError){setMsg(noteError.message);return}
  setMsg('Pesanan berhasil diperbarui.');await load()
 }
 async function copyOrder(){try{await navigator.clipboard.writeText(order.order_number);setMsg('Nomor order disalin.')}catch{setMsg('Nomor order: '+order.order_number)}}
 if(loading)return <main className="container py-20 text-center">Memuat pesanan…</main>
 if(!order)return <main className="container py-10"><Link href="/admin">← Kembali</Link><p className="mt-6">{msg||'Pesanan tidak ditemukan.'}</p></main>
 const customerPhone=order.customer_phone||order.recipient_phone||''
 const whatsappUrl=customerPhone?'https://wa.me/'+wa(customerPhone)+'?text='+encodeURIComponent('Halo '+(order.customer_name||'')+', terkait pesanan '+order.order_number+' dari GO JASTIP 4N.'):'#'
 return <main className="container py-10">
  <Link href="/admin" className="text-sm">← Dashboard</Link>
  <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
   <div><p className="text-sm font-bold text-[#e97827]">GO JASTIP 4N · ORDER DETAIL</p><div className="flex items-center gap-2"><h1 className="text-3xl font-black">{order.order_number}</h1><button onClick={copyOrder} className="rounded-lg border px-2 py-1 text-xs">Salin</button></div><p className="text-sm opacity-60">{new Date(order.created_at).toLocaleString('id-ID')}</p></div>
   <div className="flex flex-wrap gap-2"><a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn border">WhatsApp Customer</a><button className="btn border" onClick={()=>window.print()}>Print</button><button className="btn btn-primary" onClick={save}>Simpan</button></div>
  </div>
  {msg&&<p className="mt-4 rounded-xl bg-black/5 p-3 text-sm">{msg}</p>}
  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
   <div className="space-y-6">
    <section className="card p-5"><h2 className="text-xl font-black">Customer & Pengiriman</h2><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Info label="Nama" value={order.customer_name}/><Info label="WhatsApp" value={order.customer_phone||'-'}/><Info label="Email" value={order.customer_email||'-'}/><Info label="Kota" value={order.delivery_city||'-'}/><Info label="Kecamatan" value={order.delivery_district||'-'}/><Info label="Kode Pos" value={order.delivery_postal_code||'-'}/><Info label="Penerima" value={order.recipient_name||order.customer_name}/><Info label="Telepon penerima" value={order.recipient_phone||order.customer_phone||'-'}/><div className="sm:col-span-2"><Info label="Alamat" value={order.delivery_address||'-'}/></div><div className="sm:col-span-2"><Info label="Patokan" value={order.delivery_landmark||'-'}/></div><div className="sm:col-span-2"><Info label="Catatan pengiriman" value={order.delivery_notes||'-'}/></div><div className="sm:col-span-2"><Info label="Catatan pelanggan" value={order.customer_notes||'-'}/></div></div></section>
    <section className="card overflow-hidden"><div className="border-b p-5"><h2 className="text-xl font-black">Item Pesanan</h2></div><div className="divide-y">{items.length===0?<p className="p-5 opacity-60">Tidak ada item.</p>:items.map(item=><div key={item.id} className="p-5"><div className="flex justify-between gap-4"><div><b>{item.product_name}</b><p className="text-sm opacity-60">{item.quantity} × {rupiah(Number(item.unit_price))} · Jastip {rupiah(Number(item.jastip_fee))}</p>{item.restaurant_name&&<p className="text-sm opacity-60">Toko: {item.restaurant_name}</p>}{item.note&&<p className="mt-1 text-sm">Catatan: {item.note}</p>}</div><b>{rupiah(Number(item.subtotal))}</b></div></div>)}</div></section>
    <section className="card p-5"><h2 className="text-xl font-black">Timeline Status</h2><div className="mt-4 space-y-4">{history.length===0?<p className="text-sm opacity-60">Belum ada riwayat.</p>:history.map(h=><div key={h.id} className="border-l-2 pl-4"><b>{labels[h.status]||h.status}</b><p className="text-xs opacity-50">{new Date(h.created_at).toLocaleString('id-ID')}</p>{h.note&&<p className="text-sm opacity-70">{h.note}</p>}</div>)}</div></section>
   </div>
   <aside className="space-y-6">
    <section className="card p-5"><h2 className="font-black">Status Operasional</h2><select className="mt-3 w-full rounded-xl border p-3" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{labels[s]}</option>)}</select><button onClick={save} className="btn btn-primary mt-3 w-full">Simpan Status</button></section>
    <section className="card p-5"><h2 className="font-black">Pembayaran</h2>{payment?<div className="mt-4 space-y-3 text-sm"><Info label="Status" value={payment.status||'-'}/><Info label="Nominal" value={rupiah(Number(payment.amount||0))}/><Info label="Metode" value={payment.payment_methods?.name||payment.payment_methods?.provider||'-'}/><Info label="Referensi" value={payment.reference_number||'-'}/><Info label="Dibayar" value={payment.paid_at?new Date(payment.paid_at).toLocaleString('id-ID'):'-'}/><Info label="Diverifikasi" value={payment.verified_at?new Date(payment.verified_at).toLocaleString('id-ID'):'-'}/>{payment.rejection_reason&&<Info label="Alasan penolakan" value={payment.rejection_reason}/>} {payment.proof_url?<a className="btn border block text-center" href={payment.proof_url} target="_blank" rel="noreferrer">Lihat Bukti Pembayaran</a>:<p className="text-xs opacity-50">Belum ada bukti pembayaran.</p>}</div>:<p className="mt-3 text-sm opacity-60">Belum ada data pembayaran.</p>}</section>
    <section className="card p-5"><h2 className="font-black">Ringkasan Order</h2><div className="mt-4 space-y-2 text-sm"><Row label="Subtotal" value={order.subtotal}/><Row label="Jastip" value={order.jastip_total}/><Row label="Delivery" value={order.delivery_fee}/><Row label="Biaya tambahan" value={order.additional_fee}/><Row label="Diskon" value={-Number(order.discount_total)}/><div className="border-t pt-3"><Row label="Total" value={order.total} bold/></div></div></section>
    <section className="card p-5"><h2 className="font-black">Catatan Internal</h2><textarea className="mt-3 min-h-36 w-full rounded-xl border p-3" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Catatan untuk tim internal…"/><p className="mt-2 text-xs opacity-50">Tidak ditampilkan kepada pelanggan.</p></section>
   </aside>
  </div>
 </main>
}
function Info({label,value}:{label:string;value:any}){return <div><p className="text-xs font-bold uppercase opacity-40">{label}</p><p className="mt-1 break-words">{value}</p></div>}
function Row({label,value,bold=false}:{label:string;value:number;bold?:boolean}){return <div className={`flex justify-between gap-4 ${bold?'text-lg font-black':''}`}><span>{label}</span><span>{rupiah(Number(value))}</span></div>}
