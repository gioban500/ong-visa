import { MetadataRoute } from 'next';
import { getBlogPosts, getCancers } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ong-visa.vercel.app';

  // 1. Pages statiques
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cancers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Ajout dynamique des articles du blog
  try {
    const posts = await getBlogPosts();
    const blogUrls: MetadataRoute.Sitemap = posts.flatMap(post => {
      if (typeof post.slug !== 'string' || !post.slug || post.published !== true) return [];
      return [{
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: typeof post.updatedAt === 'string' ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }];
    });
    routes.push(...blogUrls);
  } catch (error) {
    console.error('Erreur génération sitemap blog:', error);
  }

  // 3. Ajout dynamique des fiches cancers
  try {
    const cancers = await getCancers();
    const cancerUrls: MetadataRoute.Sitemap = cancers.flatMap(cancer => {
      if (typeof cancer.id !== 'string' && typeof cancer.id !== 'number') return [];
      return [{
        url: `${baseUrl}/cancers/${cancer.id}`,
        lastModified: typeof cancer.updatedAt === 'string' ? new Date(cancer.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }];
    });
    routes.push(...cancerUrls);
  } catch (error) {
    console.error('Erreur génération sitemap cancers:', error);
  }

  return routes;
}