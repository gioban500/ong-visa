import { Metadata } from 'next';
import CancerClient from './CancerClient';

export * from './CancerClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cleanId = decodeURIComponent(id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ong-visa.vercel.app';

  try {
    const res = await fetch(`${siteUrl}/api/cancers/${cleanId}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const cancer = await res.json();
      return {
        title: `Comprendre le ${cancer.name || 'Cancer'}`,
        description: cancer.shortDescription || cancer.description,
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    title: 'Information Cancer',
  };
}

export default function Page(props: Props) {
  return <CancerClient {...props} />;
}