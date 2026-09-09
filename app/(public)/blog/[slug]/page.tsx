import { Metadata } from 'next';
import BlogClient from './BlogClient';

// Permet de conserver les exports (types, fonctions) si d'autres fichiers les importaient
export * from './BlogClient';

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Gestion des métadonnées SEO (Côté Serveur)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ong-visa.vercel.app';

  try {
    const res = await fetch(`${siteUrl}/api/blog/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const event = await res.json();
      const title = event.title || 'Événement';
      const description = event.excerpt || 'Sensibilisation et dépistage';

      return {
        title: title,
        description: description,
        openGraph: {
          title: `${title} | ONG VISA`,
          description: description,
          images: event.image ? [{ url: event.image }] : [],
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    title: 'Événement & Sensibilisation',
  };
}

// 2. Affichage de ton composant client
export default function Page(props: Props) {
  return <BlogClient {...props} />;
}