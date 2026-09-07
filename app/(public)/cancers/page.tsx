'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
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

  const getShortDescription = (cancer: Cancer): string => {
    return (
      cancer.shortDescription ||
      (cancer as unknown as { shortdescription?: string }).shortdescription ||
      'Consultez la fiche détaillée.'
    );
  };

  const filteredCancers = cancers.filter((cancer) => {
    const desc = getShortDescription(cancer);
    return (
      cancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="w-full bg-[#faf9f6] min-h-screen pb-24">
      {/* Banner Héro Original Unicolore */}
      <section className="bg-[#0e5c54] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center shadow-md">
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            COMPRENDRE LES CANCERS FÉMININS
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Une information exacte et un dépistage régulier sont les armes les plus efficaces pour préserver votre santé.
          </p>

          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center group">
              <Search className="absolute left-4 w-5 h-5 text-stone-400 group-focus-within:text-[#e91e63] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un cancer..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e91e63] shadow-lg text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille des cartes avec animations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xl">
            <p className="text-stone-500 font-medium text-base animate-pulse">Chargement des données...</p>
          </div>
        ) : filteredCancers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xl space-y-2">
            <p className="text-stone-900 font-bold text-xl">Aucun résultat trouvé</p>
            <p className="text-stone-500 text-base">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCancers.map((cancer, index) => {
              const shortDesc = getShortDescription(cancer);

              return (
                <div
                  key={cancer.id || index}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-pink-500/20 transition-all duration-300 overflow-hidden flex flex-col justify-between group transform hover:-translate-y-2"
                >
                  <div>
                    <div className="relative w-full h-56 bg-stone-100 overflow-hidden">
                      {cancer.image ? (
                        <img
                          src={cancer.image}
                          alt={cancer.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center font-black text-white text-2xl p-4 text-center uppercase"
                          style={{ backgroundColor: cancer.color || '#0e5c54' }}
                        >
                          {cancer.name}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-[0_4px_14px_rgba(233,30,99,0.4)]">
                        Focus {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="p-6 space-y-3.5">
                      <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight leading-snug group-hover:text-[#0e5c54] transition-colors">
                        {cancer.name}
                      </h2>
                      <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                        {shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/cancers/${cancer.id || slugify(cancer.name)}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#0e5c54] hover:bg-[#0b4741] text-white font-bold py-3.5 px-4 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-lg shadow-[#e91e63]/25 hover:shadow-xl hover:shadow-[#e91e63]/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>En savoir plus</span>
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