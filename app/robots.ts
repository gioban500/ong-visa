import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ong-visa.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // On interdit aux robots d'indexer les routes API et l'admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}