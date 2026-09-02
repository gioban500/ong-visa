'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/cancer';

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Campagne Nationale de Dépistage du Cancer du Sein',
    slug: 'campagne-depistage-sein',
    excerpt: 'Séance de sensibilisation, consultations gynécologiques et dépistage gratuit au CMS Agoè-Nyivé.',
    content: 'Contenu détaillé de la campagne...',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    author: 'ONG VISA',
    publishedDate: '15 Octobre 2026',
    readTime: 5,
    category: 'Événement',
    tags: ['Dépistage', 'Lomé']
  },
  {
    id: '2',
    title: 'Conférence Scientifique & Prévention du Col de l\'Utérus',
    slug: 'conference-prevention-col-uterus',
    excerpt: 'Rencontre avec des spécialistes pour échanger sur la vaccination HPV et le dépistage précoce.',
    content: 'Contenu détaillé de la conférence...',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Lawson',
    publishedDate: '02 Novembre 2026',
    readTime: 4,
    category: 'Conférence',
    tags: ['Santé', 'Prévention']
  }
];

export default function BlogEventsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
        console.error('Erreur lors du chargement du blog:', error);
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
      post.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full bg-[#fdfbf7] min-h-screen pb-24">
      {/* Bannière */}
      <section className="bg-[#0f766e] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-pink-300 font-bold text-xs uppercase tracking-widest block">
            AGENDA & MOBILISATION
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-emerald-50">
            TOUS NOS ÉVÉNEMENTS
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences scientifiques et activités itinérantes partout au Togo.
          </p>

          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article, un événement..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-600 shadow-md text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/85 shadow-xl">
            <p className="text-stone-500 font-medium text-base">Chargement des événements...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/85 shadow-xl space-y-2">
            <p className="text-stone-900 font-bold text-xl">Aucun événement trouvé</p>
            <p className="text-stone-500 text-base">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id || post.slug}
                className="bg-white rounded-3xl border border-stone-200/85 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {post.image && (
                    <div className="h-52 w-full bg-stone-100 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-3.5">
                    {post.category && (
                      <span className="inline-block bg-emerald-100 text-[#0f766e] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    )}
                    
                    <h3 className="text-xl font-black text-stone-900 leading-snug">{post.title}</h3>
                    
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      {post.publishedDate && (
                        <div className="flex items-center gap-1.5 text-pink-600 font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.publishedDate}</span>
                        </div>
                      )}
                      {post.author && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{post.author}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold py-4 px-4 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-md"
                  >
                    <span>Détails de l'article</span>
                    <ArrowRight className="w-4 h-4" />
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