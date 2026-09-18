import type { MetadataRoute } from 'next';

const siteUrl = 'https://jastip-n-go-ecatalog.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/menu`, changeFrequency: 'daily', priority: 0.9 },
  ];
}
