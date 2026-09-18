'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const money = (n:number) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)
type Product={id:string;name:string;image_url:string|null;selling_price:number;jastip_fee:number;stock:number|null;category_id:string|null}
type Category={id:string;name:string}

export default function Products(){
 const [supabase]=useState(()=>createClient()),[items,setItems]=useState<Product[]>([]),[cats,setCats]=useState<Category[]>([]),[form,setForm]=useState<any>({name:'',image_url:'',selling_price:'',jastip_fee:'',stock:'',category_ids:[] as string[]}),[edit,setEdit]=useState<string|null>(null),[msg,setMsg]=useState(''),[uploading,setUploading]=useState(false)

 async function load(){
  const [{data:products,error:productError},{data:categories}]=await Promise.all([
   supabase.from('products').select('*').order('created_at',{ascending:false}),
   supabase.from('categories').select('id,name').order('sort_order')
  ])
  if(productError)setMsg(productError.message)
  setItems((products||[]) as Product[]);setCats((categories||[]) as Category[])
 }
 useEffect(()=>{load()},[])

 async function start(product:Product){
  const {data}=await supabase.from('product_categories').select('category_id').eq('product_id',product.id)
  setEdit(product.id);setForm({name:product.name,image_url:product.image_url||'',selling_price:String(product.selling_price),jastip_fee:String(product.jastip_fee),stock:product.stock==null?'':String(product.stock),category_ids:(data||[]).map(x=>x.category_id)})
  setMsg('')
 }
 function resetForm(){setEdit(null);setForm({name:'',image_url:'',selling_price:'',jastip_fee:'',stock:'',category_ids:[]});setMsg('')}

 async function uploadImage(event:ChangeEvent<HTMLInputElement>){
  const file=event.target.files?.[0];event.target.value='';if(!file)return
  if(!file.type.startsWith('image/')){setMsg('File harus berupa gambar.');return}
  if(file.size>5*1024*1024){setMsg('Ukuran gambar maksimal 5 MB.');return}
  setUploading(true);setMsg('Mengunggah foto…')
  const ext=file.name.split('.').pop()?.toLowerCase()||'jpg',path='products/'+crypto.randomUUID()+'.'+ext
  const {error}=await supabase.storage.from('product-images').upload(path,file,{contentType:file.type,cacheControl:'3600',upsert:false})
  if(error){setMsg('Upload gagal: '+error.message);setUploading(false);return}
  const {data}=supabase.storage.from('product-images').getPublicUrl(path)
  setForm((current:any)=>({...current,image_url:data.publicUrl}));setMsg('Foto berhasil diunggah.');setUploading(false)
 }

 async function save(event:FormEvent){
  event.preventDefault();setMsg('Menyimpan…')
  const name=String(form.name||'').trim(),selling=Number(form.selling_price),fee=Number(form.jastip_fee||0),stock=form.stock===''?null:Number(form.stock)
  const categoryIds=Array.isArray(form.category_ids)?form.category_ids:[]
  if(!name||!Number.isFinite(selling)||selling<0||!Number.isFinite(fee)||fee<0||(stock!==null&&(!Number.isInteger(stock)||stock<0))){setMsg('Periksa nama, harga, jastip fee, dan stok.');return}
  const payload={name,image_url:form.image_url||null,selling_price:selling,jastip_fee:fee,stock,category_id:categoryIds[0]||null}
  let productId=edit
  if(edit){const {error}=await supabase.from('products').update(payload).eq('id',edit);if(error){setMsg(error.message);return}}
  else{
   const {data,error}=await supabase.from('products').insert({...payload,slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),is_available:true,is_featured:false}).select('id').single()
   if(error||!data){setMsg(error?.message||'Produk gagal dibuat.');return};productId=data.id
  }
  if(productId){
   const {error:deleteError}=await supabase.from('product_categories').delete().eq('product_id',productId)
   if(deleteError){setMsg(deleteError.message);return}
   if(categoryIds.length){const {error:insertError}=await supabase.from('product_categories').insert(categoryIds.map((category_id:string)=>({product_id:productId,category_id})));if(insertError){setMsg(insertError.message);return}}
  }
  setMsg('Produk tersimpan.');resetForm();await load()
 }

 function toggleCategory(id:string){setForm((f:any)=>({...f,category_ids:f.category_ids.includes(id)?f.category_ids.filter((x:string)=>x!==id):[...f.category_ids,id]}))}

 return <main className="container py-10"><div><Link href="/admin" className="text-sm">← Dashboard</Link><h1 className="mt-2 text-3xl font-black">Produk</h1><p className="mt-1 text-sm opacity-60">Satu produk dapat masuk ke beberapa kategori.</p></div>
 <div className="mt-6 grid gap-6 lg:grid-cols-[390px_1fr]"><form onSubmit={save} className="card space-y-3 p-5"><h2 className="font-black">{edit?'Edit Produk':'Tambah Produk'}</h2>
 <div className="rounded-2xl border p-3"><label className="block text-sm font-bold">Foto Produk</label>{form.image_url?<img src={form.image_url} alt={form.name||'Preview produk'} className="mt-2 h-40 w-full rounded-xl object-cover"/>:<div className="mt-2 flex h-40 items-center justify-center rounded-xl bg-black/5 text-sm opacity-50">Belum ada foto</div>}<label className="btn mt-3 block w-full cursor-pointer border text-center">{uploading?'Mengunggah…':'Pilih Foto'}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadImage} disabled={uploading}/></label><p className="mt-1 text-xs opacity-50">JPG, PNG, atau WebP · maksimal 5 MB</p></div>
 {([['name','Nama Produk'],['selling_price','Harga'],['jastip_fee','Jastip Fee'],['stock','Stock']] as [string,string][]).map(([key,label])=><label key={key} className="block text-sm font-bold">{label}<input required={key==='name'||key==='selling_price'} min={['selling_price','jastip_fee','stock'].includes(key)?'0':undefined} step="1" type={['selling_price','jastip_fee','stock'].includes(key)?'number':'text'} className="mt-1 w-full rounded-xl border p-2 font-normal" value={form[key]??''} onChange={event=>setForm({...form,[key]:event.target.value})}/></label>)}
 <div><div className="text-sm font-bold">Kategori</div><div className="mt-1 grid max-h-48 gap-2 overflow-auto rounded-xl border p-3 sm:grid-cols-2">{cats.map(category=><label key={category.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.category_ids.includes(category.id)} onChange={()=>toggleCategory(category.id)}/><span>{category.name}</span></label>)}</div><p className="mt-1 text-xs opacity-50">Pilih satu atau beberapa kategori.</p></div>
 {msg&&<p className="text-sm opacity-70">{msg}</p>}<button className="btn btn-primary w-full" disabled={uploading}>{edit?'Simpan Perubahan':'Tambah Produk'}</button>{edit&&<button type="button" className="btn w-full border" onClick={resetForm}>Batal</button>}</form>
 <div className="space-y-3">{items.map(product=><div key={product.id} className="card flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3">{product.image_url?<img src={product.image_url} alt={product.name} className="h-16 w-16 shrink-0 rounded-xl object-cover"/>:<div className="h-16 w-16 shrink-0 rounded-xl bg-black/5"/>}<div className="min-w-0"><b>{product.name}</b><p className="text-sm opacity-60">{money(Number(product.selling_price))} + {money(Number(product.jastip_fee))} · stok {product.stock??'∞'}</p></div></div><button type="button" className="btn shrink-0 border" onClick={()=>start(product)}>Edit</button></div>)}</div></div></main>
}
