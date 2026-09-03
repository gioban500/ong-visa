'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { BlogPost } from '@/types/cancer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface EventData extends BlogPost {
  organizer?: string;
  time?: string;
  location?: string;
}

const MOCK_POSTS: Record<string, EventData> = {
  'campagne-depistage-sein': {
    id: '1',
    title: 'Campagne Nationale de Dépistage du Cancer du Sein',
    slug: 'campagne-depistage-sein',
    excerpt: 'Séance de sensibilisation, consultations gynécologiques et dépistage gratuit au CMS Agoè-Nyivé.',
    content: `Dans le cadre de la lutte contre les cancers féminins au Togo, l'ONG VISA organise une grande journée de dépistage gratuit du cancer du sein et du col de l'utérus.
    
Nos équipes médicales et bénévoles seront sur place pour accueillir les femmes, réaliser les examens cliniques, et fournir des conseils de prévention essentiels.
    
L'événement est entièrement gratuit et ouvert à toutes les femmes de Lomé et ses environs.`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    author: 'ONG VISA',
    organizer: 'Comité Médical ONG VISA',
    publishedDate: '15 Octobre 2026',
    time: '08h00 - 16h00',
    location: 'CMS Agoè-Nyivé, Lomé, Togo',
    readTime: 5,
    category: 'DÉPISTAGE',
    tags: ['Dépistage', 'Lomé']
  },
  'conference-prevention-col-uterus': {
    id: '2',
    title: 'CONFÉRENCE SANTÉ & PRÉVENTION',
    slug: 'conference-prevention-col-uterus',
    excerpt: 'Échanges avec des professionnels de santé sur les avancées de la prise en charge des cancers féminins au Togo.',
    content: `Cette conférence annuelle réunit oncologues, gynécologues, chercheurs et associations de patients pour débattre des nouveaux protocoles de traitement et des stratégies d'amélioration de l'accès aux soins de santé en Afrique de l'Ouest.`,
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=80',
    author: 'Dr. Lawson',
    organizer: 'Comité Scientifique ONG VISA',
    publishedDate: '28 novembre 2026',
    time: '14h00 - 18h00',
    location: 'Avenue de la Présidence, Lomé, Togo',
    readTime: 4,
    category: 'CONFÉRENCE',
    tags: ['Santé', 'Prévention']
  }
};

export default function EventDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // Formulaire d'inscription & états de soumission
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
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
            organizer: item.organizer || item.author || 'Comité Scientifique ONG VISA',
            publishedDate: item.publishedDate || item.published_date || item.created_at || item.date || 'Date à préciser',
            time: item.time || item.horaire || '09h00 - 17h00',
            location: item.location || item.lieu || 'Lomé, Togo',
            readTime: Number(item.readTime || item.read_time) || 5,
            category: (item.category || 'ÉVÉNEMENT').toUpperCase(),
            tags: Array.isArray(item.tags) ? item.tags : [],
          });
        } else {
          setPost(MOCK_POSTS[slug] || MOCK_POSTS['conference-prevention-col-uterus']);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        setPost(MOCK_POSTS[slug] || MOCK_POSTS['conference-prevention-col-uterus']);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          phone: phone,
          eventId: post?.id || '',
          eventTitle: post?.title || '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Erreur lors de l'inscription :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de la validation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1329] text-white flex items-center justify-center">
        <p className="text-sm font-medium animate-pulse">Chargement de l'événement...</p>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
      {/* HEADER HERO SOMBRE */}
      <section className="bg-[#0b1329] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Bouton Retour */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la liste des événements</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Colonne Gauche : Détails de l'événement */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="bg-pink-600 text-white font-extrabold uppercase px-3 py-1 rounded-md tracking-wider">
                  {post.category}
                </span>
                <span className="text-slate-300 font-medium text-xs">
                  Organisé par : <strong className="text-white font-semibold">{post.organizer}</strong>
                </span>
              </div>

              {/* Titre & Sous-titre */}
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight text-white">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                  {post.excerpt}
                </p>
              )}

              {/* Encadré Récapitulatif : Date, Horaire, Lieu */}
              <div className="bg-[#132039] border border-slate-700/60 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    DATE
                  </span>
                  <p className="text-white font-bold text-sm">{post.publishedDate}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    HORAIRE
                  </span>
                  <p className="text-white font-bold text-sm">{post.time}</p>
                </div>

                <div className="sm:col-span-2 space-y-1 pt-3 border-t border-slate-700/50">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    LIEU ET ADRESSE
                  </span>
                  <p className="text-white font-bold text-sm">{post.location}</p>
                </div>
              </div>

            </div>

            {/* Colonne Droite : Image de l'événement */}
            <div className="lg:col-span-5 flex justify-center">
              {post.image && (
                <div className="w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION DU BAS : CONTENU ET FORMULAIRE D'INSCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Carte Gauche : À propos de cet événement */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#0f766e] uppercase tracking-wide">
              À PROPOS DE CET ÉVÉNEMENT
            </h2>
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
              <p>{post.content}</p>
            </div>
          </div>

          {/* Carte Droite : Formulaire d'inscription */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                S'INSCRIRE À CET ÉVÉNEMENT
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Réservez votre place pour bénéficier d'une prise en charge prioritaire.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-slate-900 font-bold text-base">Inscription confirmée !</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Merci <span className="font-semibold">{fullName}</span>. Vos informations ont été transmises aux organisateurs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {submitError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    NOM COMPLET
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex : Akossiwa Mensah"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-slate-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    TÉLÉPHONE
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ex : +228 90 12 34 56"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white font-bold py-4 px-6 rounded-xl transition shadow-md shadow-teal-900/10 text-sm mt-4 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Inscription en cours...' : 'Confirmer mon inscription'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}