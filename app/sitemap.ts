import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const siteUrl = 'https://jastip-n-go-ecatalog.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id,updated_at')
    .eq('is_available', true);

  const productUrls = (products ?? []).map((product) => ({
    url: `${siteUrl}/menu#product-${product.id}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/menu`, changeFrequency: 'daily', priority: 0.9 },
    ...productUrls,
  ];
}
