'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/cancer';

interface EventPost extends BlogPost {
  location?: string;
}

const MOCK_POSTS: EventPost[] = [
  {
    id: '1',
    title: 'GRANDE CAMPAGNE DE DÉPISTAGE GRATUIT',
    slug: 'campagne-depistage-sein',
    excerpt: "Une journée dédiée à la sensibilisation, au contrôle clinique gratuit du sein et au dépistage du col de l'utérus pour toutes les femmes.",
    content: 'Contenu détaillé de la campagne...',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    author: 'ONG VISA',
    publishedDate: '15 octobre 2026',
    readTime: 5,
    category: 'Événement',
    location: 'LOMÉ, TOGO',
    tags: ['Dépistage', 'Lomé']
  },
  {
    id: '2',
    title: 'CONFÉRENCE SANTÉ & PRÉVENTION',
    slug: 'conference-prevention-col-uterus',
    excerpt: 'Échanges avec des professionnels de santé sur les avancées de la prise en charge des cancers féminins au Togo.',
    content: 'Contenu détaillé de la conférence...',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Lawson',
    publishedDate: '28 novembre 2026',
    readTime: 4,
    category: 'Conférence',
    location: 'PALAIS DES CONGRÈS, LOMÉ',
    tags: ['Santé', 'Prévention']
  },
  {
    id: '3',
    title: 'CARAVANE DE SENSIBILISATION RÉGIONALE',
    slug: 'caravane-sensibilisation-regionale',
    excerpt: "Ateliers itinérants d'information et séances d'autopalpation guidées dans les zones rurales.",
    content: 'Contenu détaillé de la caravane...',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    author: 'Équipe VISA',
    publishedDate: '12 décembre 2026',
    readTime: 3,
    category: 'Sensibilisation',
    location: 'RÉGION MARITIME',
    tags: ['Caravane', 'Prévention']
  }
];

export default function BlogEventsPage() {
  const [posts, setPosts] = useState<EventPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          const fetchedData = Array.isArray(data) ? data : data.posts || data.articles || [];
          setPosts(fetchedData.length > 0 ? fetchedData : MOCK_POSTS);
        } else {
          setPosts(MOCK_POSTS);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      post.title?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.location?.toLowerCase().includes(query) ||
      post.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full bg-[#faf9f6] min-h-screen pb-24">
      {/* BANNIÈRE ORIGINALE BLEU NUIT UNIFORME */}
      <section className="bg-[#0f172a] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center shadow-md">
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            TOUS NOS ÉVÉNEMENTS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences scientifiques, et activités itinérantes partout au Togo.
          </p>

          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center group">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#e91e63] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement ou lieu..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#1e293b] border border-slate-700/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e91e63] shadow-lg text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GRILLE D'ÉVÉNEMENTS AVEC ANIMATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium text-base animate-pulse">Chargement des événements...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-2">
            <p className="text-slate-900 font-bold text-xl">Aucun événement trouvé</p>
            <p className="text-slate-500 text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id || post.slug}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-pink-500/20 transition-all duration-300 overflow-hidden flex flex-col justify-between group transform hover:-translate-y-2"
              >
                <div>
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    {post.publishedDate && (
                      <div className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(233,30,99,0.4)] backdrop-blur-md">
                        {post.publishedDate}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <p className="text-[#0e5c54] font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                      📍 {post.location || post.category || 'TOGO'}
                    </p>

                    <h3 className="text-lg font-black text-slate-900 uppercase leading-snug group-hover:text-[#e91e63] transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0e5c54] hover:bg-[#0b4741] text-white font-bold py-3.5 px-4 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-lg shadow-[#e91e63]/25 hover:shadow-xl hover:shadow-[#e91e63]/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Voir les détails</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}