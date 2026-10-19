import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getBlogPostBySlug } from '@/lib/db';

// Permet de conserver les exports (types, fonctions) si d'autres fichiers les importaient
export * from './BlogClient';

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Gestion des métadonnées SEO (Côté Serveur)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const event = await getBlogPostBySlug(slug);
    if (event) {
      const title = typeof event.title === 'string' ? event.title : 'Événement';
      const description = typeof event.excerpt === 'string' ? event.excerpt : 'Sensibilisation et dépistage';
      const image = typeof event.image === 'string' && /^https?:\/\//i.test(event.image)
        ? event.image
        : undefined;
      return {
        title: title,
        description: description,
        openGraph: {
          title: `${title} | ONG VISA`,
          description: description,
          images: image ? [{ url: image }] : [],
        },
      };
    }
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées du blog:', error);
  }

  return {
    title: 'Événement & Sensibilisation',
  };
}

// 2. Affichage de ton composant client
export default function Page(props: Props) {
  return <BlogClient {...props} />;
}