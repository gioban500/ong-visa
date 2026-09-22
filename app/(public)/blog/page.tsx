'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { BlogPost } from '@/types/cancer';

interface EventPost extends BlogPost {
  location?: string;
}

const MOCK_POSTS: EventPost[] = [
  {
    id: '1',
    title: 'Grande Campagne de Dépistage Gratuit',
    slug: 'campagne-depistage-sein',
    excerpt: "Une journée dédiée à la sensibilisation, au contrôle clinique gratuit du sein et au dépistage du col de l'utérus pour toutes les femmes.",
    content: 'Contenu détaillé de la campagne...',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    author: 'ONG VISA',
    publishedDate: '15 octobre 2026',
    readTime: 5,
    category: 'Événement',
    location: 'Lomé, Togo',
    tags: ['Dépistage', 'Lomé'],
  },
  {
    id: '2',
    title: 'Conférence Santé & Prévention Gynécologique',
    slug: 'conference-prevention-col-uterus',
    excerpt: 'Échanges avec des professionnels de santé sur les avancées de la prise en charge des cancers féminins au Togo.',
    content: 'Contenu détaillé de la conférence...',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Lawson',
    publishedDate: '28 novembre 2026',
    readTime: 4,
    category: 'Conférence',
    location: 'Palais des Congrès, Lomé',
    tags: ['Santé', 'Prévention'],
  },
  {
    id: '3',
    title: 'Caravane de Sensibilisation Régionale',
    slug: 'caravane-sensibilisation-regionale',
    excerpt: "Ateliers itinérants d'information et séances d'autopalpation guidées dans les zones périurbaines et rurales.",
    content: 'Contenu détaillé de la caravane...',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    author: 'Équipe VISA',
    publishedDate: '12 décembre 2026',
    readTime: 3,
    category: 'Sensibilisation',
    location: 'Région Maritime',
    tags: ['Caravane', 'Prévention'],
  },
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
    <div className="w-full bg-[#FAF6F0] min-h-screen pb-24">
      {/* Banner Héro */}
      <section className="bg-[#123E3B] text-white pt-14 pb-18 px-4 sm:px-7 text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ffb1c3] block">
            Actions communautaires & Rencontres
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-white leading-tight">
            Événements & Campagnes de Sensibilisation
          </h1>
          <p className="text-[#D3E2DF] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences médicales et tournées foraines partout au Togo.
          </p>

          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center group">
              <Search className="absolute left-4 w-5 h-5 text-stone-400 group-focus-within:text-[#9E2F55] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement, thème ou localité..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-[#2A2521] placeholder-[#756B60] focus:outline-none focus:ring-2 focus:ring-[#9E2F55] border border-[#E2D7C7] shadow-sm text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille d'événements */}
      <section className="max-w-[1180px] mx-auto px-4 sm:px-7 py-12">
        {loading ? (
          <div className="bg-white rounded-[4px] p-12 text-center border border-[#E2D7C7] shadow-sm">
            <p className="text-[#756B60] font-medium text-base animate-pulse">
              Chargement des événements...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-[4px] p-12 text-center border border-[#E2D7C7] shadow-sm space-y-2">
            <p className="font-serif text-[#2A2521] font-semibold text-xl">Aucun événement trouvé</p>
            <p className="text-[#756B60] text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={post.id || post.slug}
                  className={`bg-white rounded-[4px] border border-[#E2D7C7] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group ${
                    isEven ? 'border-t-4 border-t-[#9E2F55]' : 'border-t-4 border-t-[#1F5A56]'
                  }`}
                >
                  <div>
                    <div className="relative h-52 w-full bg-[#F5EFE6] overflow-hidden">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <span
                        className={`absolute top-3.5 right-3.5 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
                          isEven ? 'bg-[#9E2F55]' : 'bg-[#1F5A56]'
                        }`}
                      >
                        {post.category || 'Campagne'}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#756B60]">
                        {post.publishedDate && (
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#1F5A56]" />
                            {post.publishedDate}
                          </span>
                        )}
                        {post.location && (
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#9E2F55]" />
                            {post.location}
                          </span>
                        )}
                      </div>

                      <h2 className="font-serif text-lg font-semibold text-[#2A2521] leading-snug group-hover:text-[#123E3B] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-[#514A43] text-[13.5px] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0">
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className={`w-full inline-flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 rounded-[4px] transition-all text-xs tracking-wide shadow-sm hover:opacity-95 ${
                        isEven ? 'bg-[#9E2F55] hover:bg-[#7A2143]' : 'bg-[#1F5A56] hover:bg-[#123E3B]'
                      }`}
                    >
                      <span>Participer / Détails</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}