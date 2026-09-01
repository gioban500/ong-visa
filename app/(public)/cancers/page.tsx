'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Heart, Shield, ArrowRight } from 'lucide-react';
import { Cancer } from '@/types/cancer';

export default function CancersPage() {
  const [cancers, setCancers] = useState<Cancer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCancers() {
      try {
        const res = await fetch('/api/cancers');
        if (res.ok) {
          const data = await res.json();
          setCancers(data);
        }
      } catch (error) {
        console.error('Erreur chargement cancers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCancers();
  }, []);

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const filteredCancers = cancers.filter((cancer) =>
    cancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cancer.shortDescription && cancer.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full bg-[#fdfbf7] min-h-screen pb-24">
      {/* Banner Héro */}
      <section className="bg-[#0f766e] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-pink-300 font-bold text-xs uppercase tracking-widest block">
            PRÉVENTION & INFORMATIONS MÉDICALES
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-emerald-50">
            COMPRENDRE LES CANCERS FÉMININS
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Une information exacte et un dépistage régulier sont les armes les plus efficaces pour préserver votre santé.
          </p>

          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un cancer..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-600 shadow-md text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille des cartes avec ombre renforcée et typographie agrandie */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/85 shadow-xl">
            <p className="text-stone-500 font-medium text-base">Chargement des données...</p>
          </div>
        ) : filteredCancers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/85 shadow-xl space-y-2">
            <p className="text-stone-900 font-bold text-xl">Aucun résultat trouvé</p>
            <p className="text-stone-500 text-base">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCancers.map((cancer, index) => (
              <div
                key={cancer.id || index}
                className="bg-white rounded-3xl border border-stone-200/85 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-52 bg-stone-100 overflow-hidden">
                    {cancer.image ? (
                      <img
                        src={cancer.image}
                        alt={cancer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-black text-white text-2xl p-4 text-center uppercase"
                        style={{ backgroundColor: cancer.color || '#0f766e' }}
                      >
                        {cancer.name}
                      </div>
                    )}
                    <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-stone-900 shadow-md">
                      Focus {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-6 space-y-3.5">
                    <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight leading-snug">
                      {cancer.name}
                    </h2>
                    <p className="text-stone-600 text-sm sm:text-base line-clamp-3 leading-relaxed">
                      {cancer.shortDescription || cancer.description || 'Consultez la fiche détaillée.'}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/cancers/${cancer.id || slugify(cancer.name)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold py-4 px-4 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-md"
                  >
                    <span>En savoir plus</span>
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