'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Image as ImageIcon, Search } from 'lucide-react';
import { getClientData, hasFreshClientData, setClientData } from '@/lib/client-data-cache';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  images?: string[];
  imageCount?: number;
  publishedDate?: string;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(() => getClientData<BlogPost[]>('/api/blog') || []);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(() => !getClientData<BlogPost[]>('/api/blog'));
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (hasFreshClientData('/api/blog')) return;
    let active = true;
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog', { cache: 'no-store' });
        if (!response.ok) throw new Error('Les publications ne sont pas disponibles pour le moment.');
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error('La réponse du serveur est invalide.');
        setClientData('/api/blog', data as BlogPost[]);
        if (active) setPosts(data as BlogPost[]);
      } catch (error) {
        console.error('Erreur lors du chargement des publications :', error);
        if (active) setLoadError(error instanceof Error ? error.message : 'Erreur lors du chargement.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void fetchPosts();
    return () => { active = false; };
  }, []);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('fr');
    if (!query) return posts;
    return posts.filter((post) =>
      `${post.title} ${post.description || post.excerpt || post.content || ''}`
        .toLocaleLowerCase('fr')
        .includes(query)
    );
  }, [posts, search]);

  return (
    <main className="min-h-screen bg-[#FAF6F0] pb-20">
      <section className="border-b border-white/10 bg-[#123E3B] px-4 py-14 text-white sm:px-7 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb1c3]">Les nouvelles de l’ONG VISA</p>
          <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">Nos actualités et actions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#D3E2DF] sm:text-base">
            Retrouvez les nouvelles de l’association, nos rencontres et les actions menées auprès des femmes.
          </p>
          <label className="group relative mx-auto mt-8 block max-w-xl">
            <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#756B60] group-focus-within:text-[#9E2F55]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une publication..."
              aria-label="Rechercher une publication"
              className="w-full rounded-full border border-[#E2D7C7] bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-[#2A2521] outline-none focus:ring-2 focus:ring-[#9E2F55]"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-7 sm:py-14">
        {loading ? (
          <p className="rounded-xl border border-[#E2D7C7] bg-white p-12 text-center text-[#756B60]">Chargement des publications...</p>
        ) : loadError ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-white p-8 text-center text-sm text-red-800">{loadError}</p>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-[#E2D7C7] bg-white p-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-9 w-9 text-[#9E2F55]" />
            <h2 className="font-serif text-xl font-semibold text-[#2A2521]">
              {search ? 'Aucune publication trouvée' : 'Aucune actualité pour le moment'}
            </h2>
            <p className="mt-2 text-sm text-[#756B60]">
              {search ? 'Essayez avec un autre mot-clé.' : 'Revenez bientôt découvrir nos nouvelles.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => {
              const images = post.images?.length ? post.images : (post.image ? [post.image] : []);
              const description = post.description || post.excerpt || post.content || '';
              const date = formatDate(post.publishedDate);
              return (
                <article key={post.id || post.slug} className="group flex flex-col overflow-hidden rounded-xl border border-[#E2D7C7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/blog/${post.slug || post.id}`} className="relative block aspect-[16/10] overflow-hidden bg-[#F5EFE6]" aria-label={`Lire ${post.title}`}>
                    {images[0] ? (
                      <Image src={images[0]} alt={post.title} fill unoptimized loading={index === 0 ? 'eager' : 'lazy'} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#9E2F55]"><ImageIcon className="h-10 w-10" /></div>
                    )}
                    {(post.imageCount || images.length) > 1 && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-[#2A2521]/75 px-3 py-1 text-xs font-semibold text-white">
                        {post.imageCount || images.length} images
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {date && (
                      <p className="mb-3 flex items-center gap-2 text-xs font-medium text-[#756B60]">
                        <CalendarDays className="h-4 w-4 text-[#1F5A56]" /> {date}
                      </p>
                    )}
                    <h2 className="font-serif text-xl font-semibold leading-snug text-[#2A2521] group-hover:text-[#1F5A56]">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-[#514A43]">{description}</p>
                    <Link href={`/blog/${post.slug || post.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#9E2F55] hover:text-[#7A2143]">
                      Lire la publication <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
