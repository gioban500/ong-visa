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
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Banner Héro nettoyé des chevauchements négatifs de trop */}
      <section className="bg-[#0e7490] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-[#f472b6] font-bold text-xs uppercase tracking-widest block">
            PRÉVENTION & INFORMATIONS MÉDICALES
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            COMPRENDRE LES CANCERS FÉMININS
          </h1>
          <p className="text-slate-100 text-sm sm:text-base max-w-2xl mx-auto">
            Une information exacte et un dépistage régulier sont les armes les plus efficaces pour préserver votre santé.
          </p>

          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un cancer..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille des cartes avec un espacement propre */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium text-sm">Chargement des données...</p>
          </div>
        ) : filteredCancers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-2">
            <p className="text-slate-800 font-bold">Aucun résultat trouvé</p>
            <p className="text-slate-500 text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCancers.map((cancer, index) => (
              <div
                key={cancer.id || index}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                    {cancer.image ? (
                      <img
                        src={cancer.image}
                        alt={cancer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-black text-white text-xl p-4 text-center uppercase"
                        style={{ backgroundColor: cancer.color || '#ec4899' }}
                      >
                        {cancer.name}
                      </div>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-800 shadow-sm">
                      Focus {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h2 className="text-lg font-black text-slate-900 uppercase">
                      {cancer.name}
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3">
                      {cancer.shortDescription || cancer.description || 'Consultez la fiche détaillée.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/cancers/${cancer.id || slugify(cancer.name)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#ec4899] text-white font-bold py-3 px-4 rounded-xl transition-colors text-xs uppercase"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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