'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const money = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)

type Product = {
  id: string
  name: string
  slug: string | null
  description: string | null
  image_url: string | null
  cost_price: number
  selling_price: number
  jastip_fee: number
  stock: number | null
  category_id: string | null
  is_available: boolean
  is_featured: boolean
}

export default function Products() {
  const supabase = createClient()
  const [items, setItems] = useState<Product[]>([])
  const [cats, setCats] = useState<any[]>([])
  const [form, setForm] = useState<any>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    selling_price: '',
    jastip_fee: '',
    cost_price: '0',
    stock: '',
    category_id: '',
    is_available: true,
    is_featured: false,
  })
  const [edit, setEdit] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  async function load() {
    const [{ data: products, error: productError }, { data: categories }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id,name').order('sort_order'),
    ])

    if (productError) setMsg(productError.message)
    setItems((products || []) as Product[])
    setCats(categories || [])
  }

  useEffect(() => {
    load()
  }, [])

  function start(product: Product) {
    setEdit(product.id)
    setForm({
      ...product,
      selling_price: String(product.selling_price),
      jastip_fee: String(product.jastip_fee),
      cost_price: String(product.cost_price),
      stock: product.stock == null ? '' : String(product.stock),
      image_url: product.image_url || '',
    })
    setMsg('')
  }

  function resetForm() {
    setEdit(null)
    setForm({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      selling_price: '',
      jastip_fee: '',
      cost_price: '0',
      stock: '',
      category_id: '',
      is_available: true,
      is_featured: false,
    })
    setMsg('')
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMsg('File harus berupa gambar.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg('Ukuran gambar maksimal 5 MB.')
      return
    }

    setUploading(true)
    setMsg('Mengunggah gambar…')

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `products/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from('product-images').upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      setMsg(`Upload gagal: ${error.message}`)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setForm((current: any) => ({ ...current, image_url: data.publicUrl }))
    setMsg('Gambar berhasil diunggah.')
    setUploading(false)
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setMsg('Menyimpan…')

    const payload = {
      name: form.name,
      slug:
        form.slug ||
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      description: form.description || null,
      image_url: form.image_url || null,
      cost_price: Number(form.cost_price || 0),
      selling_price: Number(form.selling_price),
      jastip_fee: Number(form.jastip_fee || 0),
      stock: form.stock === '' ? null : Number(form.stock),
      category_id: form.category_id || null,
      is_available: !!form.is_available,
      is_featured: !!form.is_featured,
    }

    const query = edit
      ? supabase.from('products').update(payload).eq('id', edit)
      : supabase.from('products').insert(payload)

    const { error } = await query

    if (error) {
      setMsg(error.message)
      return
    }

    setMsg('Produk tersimpan.')
    resetForm()
    await load()
  }

  return (
    <main className="container py-10">
      <div className="flex justify-between">
        <div>
          <Link href="/admin" className="text-sm">← Dashboard</Link>
          <h1 className="mt-2 text-3xl font-black">Produk</h1>
          <p className="mt-1 text-sm opacity-60">Kelola menu, harga, stok, kategori, dan foto produk.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[390px_1fr]">
        <form onSubmit={save} className="card space-y-3 p-5">
          <h2 className="font-black">{edit ? 'Edit Produk' : 'Tambah Produk'}</h2>

          <div className="rounded-2xl border p-3">
            <label className="block text-sm font-bold">Foto Produk</label>
            {form.image_url ? (
              <img
                src={form.image_url}
                alt={form.name || 'Preview produk'}
                className="mt-2 h-40 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mt-2 flex h-40 items-center justify-center rounded-xl bg-black/5 text-sm opacity-50">
                Belum ada foto
              </div>
            )}
            <label className="btn mt-3 block w-full cursor-pointer border text-center">
              {uploading ? 'Mengunggah…' : 'Pilih Foto'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={uploadImage}
                disabled={uploading}
              />
            </label>
            <p className="mt-1 text-xs opacity-50">JPG, PNG, atau WebP · maksimal 5 MB</p>
          </div>

          {['name', 'slug', 'description', 'cost_price', 'selling_price', 'jastip_fee', 'stock'].map((key) => (
            <label key={key} className="block text-sm font-bold">
              {key}
              <input
                required={key === 'name' || key === 'selling_price'}
                type={['cost_price', 'selling_price', 'jastip_fee', 'stock'].includes(key) ? 'number' : 'text'}
                className="mt-1 w-full rounded-xl border p-2 font-normal"
                value={form[key] ?? ''}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              />
            </label>
          ))}

          <label className="block text-sm font-bold">
            Kategori
            <select
              className="mt-1 w-full rounded-xl border p-2 font-normal"
              value={form.category_id || ''}
              onChange={(event) => setForm({ ...form, category_id: event.target.value })}
            >
              <option value="">Tanpa kategori</option>
              {cats.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(event) => setForm({ ...form, is_available: event.target.checked })}
            />
            Tersedia
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(event) => setForm({ ...form, is_featured: event.target.checked })}
            />
            Featured
          </label>

          {msg && <p className="text-sm opacity-70">{msg}</p>}

          <button className="btn btn-primary w-full" disabled={uploading}>
            {edit ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>

          {edit && (
            <button type="button" className="btn w-full border" onClick={resetForm}>
              Batal
            </button>
          )}
        </form>

        <div className="space-y-3">
          {items.map((product) => (
            <div key={product.id} className="card flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-black/5" />
                )}
                <div className="min-w-0">
                  <b>{product.name}</b>
                  <p className="text-sm opacity-60">
                    {money(Number(product.selling_price))} + {money(Number(product.jastip_fee))} · stok {product.stock ?? '∞'}
                  </p>
                </div>
              </div>
              <button className="btn shrink-0 border" onClick={() => start(product)}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
