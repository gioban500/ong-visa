'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, HeartHandshake, CheckCircle2, Users, User, Clock } from 'lucide-react';
import { BlogPost } from '@/types/cancer'; // Ajuste le chemin vers tes types si nécessaire

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog_posts/${id}`);
        if (res.ok) {
          const item = await res.json();
          setPost({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || String(item.id),
            excerpt: item.excerpt || item.shortdescription || item.description || '',
            content: item.content || item.description || '',
            image: item.image || '',
            author: item.author || 'ONG VISA',
            publishedDate: item.publishedDate || item.published_date || item.created_at || item.date || '',
            readTime: item.readTime || item.read_time || 5,
            category: item.category || 'Événement',
            tags: Array.isArray(item.tags) ? item.tags : [],
          });
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l’événement:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-sm font-medium">Chargement de l'événement...</p>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Header Sombre */}
      <section className="bg-[#0f172a] text-white pt-8 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux événements
          </Link>

          <div className="space-y-3">
            <span className="text-[#ec4899] font-bold text-xs uppercase tracking-widest block">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {post.image && (
            <div className="md:col-span-5 h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className={post.image ? 'md:col-span-7 space-y-6' : 'md:col-span-12 space-y-6'}>
            <div className="flex flex-wrap gap-4">
              {post.publishedDate && (
                <div className="flex items-center gap-2 bg-pink-50 text-[#ec4899] px-4 py-2 rounded-xl text-sm font-bold border border-pink-100">
                  <Calendar className="w-4 h-4" />
                  <span>{post.publishedDate}</span>
                </div>
              )}

              {post.author && (
                <div className="flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-100">
                  <User className="w-4 h-4 text-[#0e7490]" />
                  <span>{post.author}</span>
                </div>
              )}

              {post.readTime > 0 && (
                <div className="flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-100">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{post.readTime} min de lecture</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Présentation de l'événement</h2>
              {post.excerpt && (
                <p className="text-slate-700 font-semibold text-base leading-relaxed italic border-l-4 border-[#ec4899] pl-3">
                  {post.excerpt}
                </p>
              )}
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line pt-2">
                {post.content}
              </p>
            </div>

            {/* Redirection vers le contact avec pré-remplissage via Query Param */}
            <div className="pt-4">
              <Link
                href={`/contact?event=${encodeURIComponent(post.id)}`}
                className="inline-flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white font-bold px-8 py-4 rounded-2xl text-sm transition-colors shadow-md"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Participer à cet événement</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Détails complémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-[#0e7490]">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold uppercase tracking-wide">
                Informations pratiques
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0e7490] mt-2 shrink-0" />
                <span>Accès libre et ouvert à toutes et tous</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0e7490] mt-2 shrink-0" />
                <span>Séances d'information avec nos équipes médicales</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-[#ec4899]">
              <Users className="w-6 h-6" />
              <h3 className="text-lg font-extrabold uppercase tracking-wide">
                Public concerné
              </h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Toute personne souhaitant se faire dépister ou s'informer sur la prévention des cancers féminins.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}