'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, HeartHandshake, CheckCircle2, Users, User, Clock } from 'lucide-react';
import { BlogPost } from '@/types/cancer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// MOCK_POSTS indexé par slug pour servir de fallback exact
const MOCK_POSTS: Record<string, BlogPost> = {
  'campagne-depistage-sein': {
    id: '1',
    title: 'Campagne Nationale de Dépistage du Cancer du Sein',
    slug: 'campagne-depistage-sein',
    excerpt: 'Séance de sensibilisation, consultations gynécologiques et dépistage gratuit au CMS Agoè-Nyivé.',
    content: `Dans le cadre de la lutte contre les cancers féminins au Togo, l'ONG VISA organise une grande journée de dépistage gratuit du cancer du sein et du col de l'utérus.
    
    Nos équipes médicales et bénévoles seront sur place pour accueillir les femmes, réaliser les examens cliniques, et fournir des conseils de prévention essentiels.
    
    L'événement est entièrement gratuit et ouvert à toutes les femmes de Lomé et ses environs.`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    author: 'ONG VISA',
    publishedDate: '15 Octobre 2026',
    readTime: 5,
    category: 'Événement',
    tags: ['Dépistage', 'Lomé']
  },
  'conference-prevention-col-uterus': {
    id: '2',
    title: 'Conférence Scientifique & Prévention du Col de l\'Utérus',
    slug: 'conference-prevention-col-uterus',
    excerpt: 'Rencontre avec des spécialistes pour échanger sur la vaccination HPV et le dépistage précoce.',
    content: `Une conférence d'information animée par des médecins spécialistes pour sensibiliser le grand public et les professionnels de santé à l'importance du dépistage précoce et du vaccin HPV.`,
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Lawson',
    publishedDate: '02 Novembre 2026',
    readTime: 4,
    category: 'Conférence',
    tags: ['Santé', 'Prévention']
  }
};

export default function EventDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        // Appelle la route API basée sur le slug (/api/blog/[slug])
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const item = await res.json();
          setPost({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || slug,
            excerpt: item.excerpt || item.shortdescription || item.description || '',
            content: item.content || item.description || '',
            image: item.image || '',
            author: item.author || 'ONG VISA',
            publishedDate: item.publishedDate || item.published_date || item.created_at || item.date || '',
            readTime: Number(item.readTime || item.read_time) || 5,
            category: item.category || 'Événement',
            tags: Array.isArray(item.tags) ? item.tags : [],
          });
        } else {
          setPost(MOCK_POSTS[slug] || null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l’événement:', error);
        setPost(MOCK_POSTS[slug] || null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f766e] text-white flex items-center justify-center">
        <p className="text-sm font-medium animate-pulse">Chargement de l'événement...</p>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full bg-[#fdfbf7] min-h-screen pb-20">
      {/* Header Sombre */}
      <section className="bg-[#0f766e] text-white pt-10 pb-20 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-emerald-100 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux événements
          </Link>

          <div className="space-y-3">
            <span className="text-pink-300 font-extrabold text-xs uppercase tracking-widest block">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {post.image && (
            <div className="md:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className={post.image ? 'md:col-span-7 space-y-6' : 'md:col-span-12 space-y-6'}>
            <div className="flex flex-wrap gap-3">
              {post.publishedDate && (
                <div className="flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-xl text-xs font-bold border border-pink-100">
                  <Calendar className="w-4 h-4" />
                  <span>{post.publishedDate}</span>
                </div>
              )}

              {post.author && (
                <div className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200/60">
                  <User className="w-4 h-4 text-[#0f766e]" />
                  <span>{post.author}</span>
                </div>
              )}

              {post.readTime > 0 && (
                <div className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200/60">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span>{post.readTime} min de lecture</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-stone-900">Présentation de l'événement</h2>
              {post.excerpt && (
                <p className="text-stone-700 font-medium text-base leading-relaxed italic border-l-4 border-pink-500 pl-4 py-1 bg-pink-50/50 rounded-r-xl">
                  {post.excerpt}
                </p>
              )}
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base whitespace-pre-line pt-2">
                {post.content}
              </p>
            </div>

            {/* Redirection vers Contact */}
            <div className="pt-4">
              <Link
                href={`/contact?event=${encodeURIComponent(post.id || post.slug)}`}
                className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Participer à cet événement</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Détails complémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-4">
            <div className="flex items-center gap-3 text-[#0f766e]">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-lg font-black uppercase tracking-wide">
                Informations pratiques
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0f766e] mt-2 shrink-0" />
                <span>Accès gratuit et ouvert à toutes et tous</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0f766e] mt-2 shrink-0" />
                <span>Séances d'information avec nos équipes médicales qualifiées</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-4">
            <div className="flex items-center gap-3 text-pink-600">
              <Users className="w-6 h-6" />
              <h3 className="text-lg font-black uppercase tracking-wide">
                Public concerné
              </h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              Toute personne souhaitant se faire dépister ou s'informer sur la prévention des cancers féminins au Togo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}