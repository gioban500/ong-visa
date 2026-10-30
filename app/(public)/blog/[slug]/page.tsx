import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getBlogPostSummaryBySlug } from '@/lib/db';

// Permet de conserver les exports (types, fonctions) si d'autres fichiers les importaient
export * from './BlogClient';

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Gestion des métadonnées SEO (Côté Serveur)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getBlogPostSummaryBySlug(slug);
    if (post?.published === true) {
      const title = typeof post.title === 'string' ? post.title : 'Actualité';
      const description = typeof post.description === 'string'
        ? post.description
        : typeof post.excerpt === 'string'
          ? post.excerpt
          : 'Actualités et actions de l’ONG VISA';
      const postImages = Array.isArray(post.images) ? post.images : [];
      const firstImage = postImages[0] || post.image;
      const image = typeof firstImage === 'string' && /^https?:\/\//i.test(firstImage)
        ? firstImage
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
    title: 'Actualités | ONG VISA',
  };
}

// 2. Affichage de ton composant client
export default function Page(props: Props) {
  return <BlogClient {...props} />;
}