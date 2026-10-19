import { Metadata } from 'next';
import CancerClient from './CancerClient';
import { getCancerById } from '@/lib/db';

export const revalidate = false;

export * from './CancerClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cleanId = decodeURIComponent(id);

  try {
    const cancer = await getCancerById(cleanId);
    if (cancer) {
      const name = typeof cancer.name === 'string' ? cancer.name : 'Cancer';
      const description = typeof cancer.shortDescription === 'string'
        ? cancer.shortDescription
        : typeof cancer.description === 'string'
          ? cancer.description
          : undefined;
      return {
        title: `Comprendre le ${name}`,
        description,
      };
    }
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées des cancers:', error);
  }

  return {
    title: 'Information Cancer',
  };
}

export default function Page(props: Props) {
  return <CancerClient {...props} />;
}