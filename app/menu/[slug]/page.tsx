import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AddToCartButton from '@/components/AddToCartButton'

const siteUrl = 'https://jastip-n-go-ecatalog.vercel.app'
const rupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
type Product = { id:string; name:string; slug:string; description:string|null; image_url:string|null; selling_price:number; jastip_fee:number; is_available:boolean; category:{name:string;slug:string}|null }

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select('id,name,slug,description,image_url,selling_price,jastip_fee,is_available,category:categories(name,slug)').eq('slug', slug).eq('is_available', true).maybeSingle()
  if (error || !data) return null
  return data as unknown as Product
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Menu tidak ditemukan' }
  const description = product.description || 'Pesan ' + product.name + ' melalui GO JASTIP 4N. Harga ' + rupiah(Number(product.selling_price) + Number(product.jastip_fee)) + '.'
  return { title: product.name, description, alternates: { canonical: '/menu/' + product.slug }, openGraph: { type:'website', url: siteUrl + '/menu/' + product.slug, title: product.name + ' | GO JASTIP 4N', description, ...(product.image_url ? { images:[product.image_url] } : {}) }, robots:{index:true,follow:true} }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const price = Number(product.selling_price), fee = Number(product.jastip_fee), total = price + fee
  const category = Array.isArray(product.category) ? product.category[0] : product.category
  const productSchema = { '@context':'https://schema.org', '@type':'Product', name:product.name, description:product.description || undefined, image:product.image_url ? [product.image_url] : undefined, url:siteUrl + '/menu/' + product.slug, category:category?.name || 'Makanan', offers:{ '@type':'Offer', priceCurrency:'IDR', price:total, availability:'https://schema.org/InStock', url:siteUrl + '/menu/' + product.slug } }
  const breadcrumbSchema = { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem', position:1, name:'Home', item:siteUrl },{ '@type':'ListItem', position:2, name:'Menu', item:siteUrl + '/menu' },{ '@type':'ListItem', position:3, name:product.name, item:siteUrl + '/menu/' + product.slug }] }
  return <main className="container py-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <nav className="mb-6 text-sm opacity-60"><Link href="/">Home</Link> / <Link href="/menu">Menu</Link> / <span>{product.name}</span></nav>
    <article className="card grid overflow-hidden md:grid-cols-2">
      <div className="flex min-h-[320px] items-center justify-center bg-[#fff1dc]">{product.image_url ? <img src={product.image_url} alt={product.name} className="h-full max-h-[520px] w-full object-cover" /> : <span className="text-8xl">🍴</span>}</div>
      <div className="p-7 md:p-10"><div className="text-sm font-bold uppercase opacity-50">{category?.name || 'Menu GO JASTIP 4N'}</div><h1 className="mt-2 text-4xl font-black">{product.name}</h1><p className="mt-4 leading-7 opacity-70">{product.description || 'Pesan menu ini melalui GO JASTIP 4N.'}</p><div className="mt-7 space-y-2 text-sm opacity-70"><div>Harga makanan: <b>{rupiah(price)}</b></div><div>Jasa titip: <b>{rupiah(fee)}</b></div></div><div className="mt-5 text-2xl font-black text-[#e97827]">{rupiah(total)}</div><AddToCartButton productId={product.id} /><Link href="/menu" className="btn mt-3 block w-full border text-center">← Kembali ke Menu</Link></div>
    </article>
  </main>
}