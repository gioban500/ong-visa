'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, Heart, Shield } from 'lucide-react';
import { BlogPost } from '@/types/cancer'; // Ajuste le chemin vers tes types si nécessaire

export default function EventsBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog_posts');
        if (res.ok) {
          const rawData = await res.json();
          // Normalisation pour correspondre à l'interface BlogPost
          const formattedData: BlogPost[] = rawData.map((item: any) => ({
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
          }));
          setPosts(formattedData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Banner Héro */}
      <section className="bg-[#0f172a] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-[#ec4899] font-bold text-xs uppercase tracking-widest block">
            AGENDA & MOBILISATION
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
            TOUS NOS ÉVÉNEMENTS
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences scientifiques et activités itinérantes partout au Togo.
          </p>

          {/* Recherche */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement ou un lieu..."
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-pink-400/30 shadow-lg text-sm sm:text-base transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille principale max-w-7xl */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">Chargement des événements...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 space-y-3">
            <p className="text-slate-700 font-bold text-lg">Aucun événement trouvé</p>
            <p className="text-slate-500 text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image fixe verrouillée */}
                  <div className="relative w-full h-64 overflow-hidden bg-slate-100">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center font-bold text-white text-lg p-4 text-center">
                        {post.title}
                      </div>
                    )}

                    {post.publishedDate && (
                      <span className="absolute top-4 right-4 bg-[#ec4899] text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
                        {post.publishedDate}
                      </span>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6 space-y-3">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase line-clamp-2">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Lien vers la route /blog/[id] */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/blog/${post.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#ec4899] text-white font-bold py-3.5 px-4 rounded-2xl transition-colors text-sm shadow-sm"
                  >
                    <span>Voir l'événement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer section */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[#ec4899] font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              Rejoignez l'initiative
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              Vous souhaitez participer ou être partenaire ?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nous sommes à votre disposition pour toute information sur nos prochaines campagnes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-start md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white font-bold px-6 py-4 rounded-2xl text-sm transition-colors text-center"
            >
              <Shield className="w-4 h-4" />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}