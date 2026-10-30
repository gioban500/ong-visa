'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Image as ImageIcon } from 'lucide-react';
import { getClientData, hasFreshClientData, setClientData } from '@/lib/client-data-cache';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  imageCount?: number;
  publishedDate?: string;
}

function formatDate(value?: string) {
  if (!value) return null;
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoDate) return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR');
}

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  return <BlogDetailContent key={slug} slug={slug} />;
}

function BlogDetailContent({ slug }: { slug: string }) {
  const cacheKey = `/api/blog/${encodeURIComponent(slug)}`;
  const [post, setPost] = useState<BlogPost | null>(() => getClientData<BlogPost>(cacheKey) || null);
  const [loading, setLoading] = useState(() => !getClientData<BlogPost>(cacheKey));
  const [loadError, setLoadError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageSize, setImageSize] = useState<{ src: string; width: number; height: number } | null>(null);

  useEffect(() => {
    if (hasFreshClientData(cacheKey)) return;

    let active = true;
    async function fetchPost() {
      try {
        const response = await fetch(cacheKey, { cache: 'no-store' });
        if (response.status === 404) {
          if (active) setPost(null);
          return;
        }
        if (!response.ok) throw new Error('Cette publication ne peut pas être chargée pour le moment.');
        const item: BlogPost = await response.json();
        setClientData(cacheKey, item);
        if (active) {
          setPost(item);
          setSelectedImageIndex(0);
          setImageSize(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la publication :', error);
        if (active) setLoadError(error instanceof Error ? error.message : 'Erreur lors du chargement.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void fetchPost();
    return () => { active = false; };
  }, [cacheKey]);

  if (loading) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-[#FAF6F0] text-sm text-[#756B60]">Chargement de la publication...</main>;
  }
  if (!post && !loadError) notFound();

  const imageCount = post?.imageCount || (post?.image ? 1 : 0);
  const selectedImage = imageCount > 0
    ? `/api/blog/${encodeURIComponent(slug)}/images/${selectedImageIndex}`
    : '';
  const description = post?.description || post?.excerpt || post?.content || '';
  const date = formatDate(post?.publishedDate);

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-4 py-8 sm:px-7 sm:py-10">
      <article className="mx-auto max-w-[860px]">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1F5A56] hover:text-[#123E3B]">
          <ArrowLeft className="h-4 w-4" /> Retour aux actualités
        </Link>

        {loadError ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-white p-8 text-center text-sm text-red-800">{loadError}</p>
        ) : post && (
          <div>
            <header className="mb-6">
              <h1 className="text-2xl font-medium leading-tight text-[#353535] sm:text-4xl">
                {post.title}
              </h1>
              {date && (
                <p className="mt-3 flex items-center gap-3 pl-0.5 text-sm italic text-[#77736D]">
                  <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#8D8982]" />
                  <time dateTime={post.publishedDate || undefined}>{date}</time>
                </p>
              )}
            </header>

            {selectedImage ? (
              <div className="relative flex max-w-full justify-center overflow-hidden rounded-xl bg-[#E4DED3] shadow-[0_8px_24px_rgba(42,37,33,0.12)]">
                <Image
                  src={selectedImage}
                  alt={post.title}
                  width={imageSize?.src === selectedImage ? imageSize.width : 1}
                  height={imageSize?.src === selectedImage ? imageSize.height : 1}
                  unoptimized
                  loading="eager"
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    setImageSize({ src: selectedImage, width: naturalWidth, height: naturalHeight });
                  }}
                  style={{ width: 'auto', height: 'auto' }}
                  className="max-h-[560px] max-w-full object-contain"
                />
                {imageCount > 1 && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#242424]/80 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                    <ImageIcon aria-hidden="true" className="h-3.5 w-3.5" />
                    {imageCount} photos
                  </span>
                )}
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-[#E4DED3] text-[#9E2F55]">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}

            {imageCount > 1 && (
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2" aria-label="Galerie photos">
                {Array.from({ length: imageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Afficher la photo ${index + 1} sur ${imageCount}`}
                    aria-pressed={selectedImageIndex === index}
                    className={`relative h-[68px] w-[90px] shrink-0 overflow-hidden rounded-md border-2 transition sm:h-[76px] sm:w-[100px] ${
                      selectedImageIndex === index
                        ? 'border-[#1F8A52] ring-2 ring-[#1F8A52]/20'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={`/api/blog/${encodeURIComponent(slug)}/images/${index}`}
                      alt=""
                      fill
                      unoptimized
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {description && (
              <p className="mt-8 whitespace-pre-line text-[14px] leading-relaxed text-[#353535]">
                {description}
              </p>
            )}
          </div>
        )}
      </article>
    </main>
  );
}
