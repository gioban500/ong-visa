import { MetadataRoute } from 'next';

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

  // 2. Ajout dynamique des articles du blog si l'API répond
  try {
    const blogRes = await fetch(`${baseUrl}/api/blog`, { next: { revalidate: 3600 } });
    if (blogRes.ok) {
      const posts = await blogRes.json();
      const blogUrls: MetadataRoute.Sitemap = posts.map((post: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      routes.push(...blogUrls);
    }
  } catch (error) {
    console.error('Erreur génération sitemap blog:', error);
  }

  // 3. Ajout dynamique des fiches cancers si l'API répond
  try {
    const cancerRes = await fetch(`${baseUrl}/api/cancers`, { next: { revalidate: 3600 } });
    if (cancerRes.ok) {
      const cancers = await cancerRes.json();
      const cancerUrls: MetadataRoute.Sitemap = cancers.map((cancer: { id: string | number; updatedAt?: string }) => ({
        url: `${baseUrl}/cancers/${cancer.id}`,
        lastModified: cancer.updatedAt ? new Date(cancer.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
      routes.push(...cancerUrls);
    }
  } catch (error) {
    console.error('Erreur génération sitemap cancers:', error);
  }

  return routes;
}