'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { BlogPost } from '@/types/cancer';

interface EventPost extends BlogPost {
  location?: string;
}

const MOCK_POSTS: EventPost[] = [
  {
    id: '1',
    title: 'GRANDE CAMPAGNE DE DÉPISTAGE GRATUIT',
    slug: 'campagne-depistage-sein',
    excerpt: 'Une journée dédiée à la sensibilisation, au contrôle clinique gratuit du sein et au dépistage du col de l\'utérus pour toutes les femmes.',
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
    excerpt: 'Ateliers itinérants d\'information et séances d\'autopalpation guidées dans les zones rurales.',
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
    <div className="w-full bg-[#f8fafc] min-h-screen pb-24">
      {/* BANNIÈRE SOMBRE HERO */}
      <section className="bg-[#0b1329] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-pink-500 font-extrabold text-xs uppercase tracking-widest block">
            AGENDA ET MOBILISATION
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            TOUS NOS ÉVÉNEMENTS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences scientifiques, et activités itinérantes partout au Togo.
          </p>

          {/* Champ de Recherche */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement ou lieu..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#17233d] border border-slate-700/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e] text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GRILLE D'ÉVÉNEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
            <p className="text-slate-500 font-medium text-base animate-pulse">Chargement des événements...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-2">
            <p className="text-slate-900 font-bold text-xl">Aucun événement trouvé</p>
            <p className="text-slate-500 text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id || post.slug}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image avec Badge Date en superposition */}
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                    {/* Badge Rose Date */}
                    {post.publishedDate && (
                      <div className="absolute top-4 right-4 bg-pink-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
                        {post.publishedDate}
                      </div>
                    )}
                  </div>

                  {/* Contenu de la Carte */}
                  <div className="p-6 space-y-3">
                    {/* Lieu / Sous-titre */}
                    <p className="text-[#0f766e] font-extrabold text-[11px] uppercase tracking-wider">
                      {post.location || post.category || 'TOGO'}
                    </p>

                    {/* Titre */}
                    <h3 className="text-lg font-black text-slate-900 uppercase leading-snug">
                      {post.title}
                    </h3>

                    {/* Extrait */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bouton d'Action */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="w-full inline-flex items-center justify-center bg-[#0f766e] hover:bg-[#115e59] text-white font-bold py-3.5 px-4 rounded-xl transition-all text-xs tracking-wide shadow-md shadow-teal-900/10"
                  >
                    Voir les détails & Participer
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