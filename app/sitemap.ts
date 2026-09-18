import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
const siteUrl = 'https://jastip-n-go-ecatalog.vercel.app'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('slug,updated_at').eq('is_available',true).not('slug','is',null)
  return [{ url:siteUrl, changeFrequency:'daily', priority:1 }, { url:siteUrl + '/menu', changeFrequency:'daily', priority:0.9 }, ...(products ?? []).map(product => ({ url:siteUrl + '/menu/' + product.slug, lastModified:product.updated_at ? new Date(product.updated_at) : undefined, changeFrequency:'daily' as const, priority:0.8 }))]
}