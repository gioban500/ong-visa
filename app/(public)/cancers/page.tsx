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
      'Consultez la fiche détaillée pour comprendre les symptômes, facteurs de risque et dépistages recommandés.'
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
    <div className="w-full bg-[#FAF6F0] min-h-screen pb-24">
      {/* Banner Héro Deep Teal */}
      <section className="bg-[#123E3B] text-white pt-14 pb-18 px-4 sm:px-6 lg:px-8 text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ffb1c3] block">
            Information médicale & Prévention au Togo
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white leading-tight">
            Comprendre les Cancers Féminins
          </h1>
          <p className="text-[#D3E2DF] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Une information exacte et un dépistage régulier sont les armes les plus efficaces pour préserver votre santé.
          </p>

          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center group">
              <Search className="absolute left-4 w-5 h-5 text-stone-400 group-focus-within:text-[#9E2F55] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une pathologie (sein, col, ovaires...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-[#2A2521] placeholder-[#756B60] focus:outline-none focus:ring-2 focus:ring-[#9E2F55] border border-[#E2D7C7] shadow-sm text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille des cartes */}
      <section className="max-w-[1180px] mx-auto px-4 sm:px-7 pt-12">
        {loading ? (
          <div className="bg-white rounded-[4px] p-12 text-center border border-[#E2D7C7] shadow-sm">
            <p className="text-[#756B60] font-medium text-base animate-pulse">
              Chargement des fiches cliniques...
            </p>
          </div>
        ) : filteredCancers.length === 0 ? (
          <div className="bg-white rounded-[4px] p-12 text-center border border-[#E2D7C7] shadow-sm space-y-2">
            <p className="font-serif text-[#2A2521] font-semibold text-xl">Aucun résultat trouvé</p>
            <p className="text-[#756B60] text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCancers.map((cancer, index) => {
              const shortDesc = getShortDescription(cancer);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={cancer.id || index}
                  className={`bg-white rounded-[4px] border border-[#E2D7C7] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                    isEven ? 'border-t-4 border-t-[#9E2F55]' : 'border-t-4 border-t-[#1F5A56]'
                  }`}
                >
                  <div>
                    <div className="relative w-full h-52 bg-[#F5EFE6] overflow-hidden">
                      {cancer.image ? (
                        <img
                          src={cancer.image}
                          alt={cancer.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center font-serif text-white text-xl p-4 text-center font-semibold"
                          style={{ backgroundColor: cancer.color || (isEven ? '#9E2F55' : '#1F5A56') }}
                        >
                          {cancer.name}
                        </div>
                      )}
                      <span
                        className={`absolute top-3.5 right-3.5 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
                          isEven ? 'bg-[#9E2F55]' : 'bg-[#1F5A56]'
                        }`}
                      >
                        Fiche {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 space-y-2.5">
                      <h2 className="text-lg font-serif font-semibold text-[#2A2521] leading-snug group-hover:text-[#123E3B] transition-colors">
                        {cancer.name}
                      </h2>
                      <p className="text-[#514A43] text-[13.5px] leading-relaxed line-clamp-3">
                        {shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0">
                    <Link
                      href={`/cancers/${cancer.id || slugify(cancer.name)}`}
                      className={`w-full inline-flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 rounded-[4px] transition-all text-xs tracking-wide shadow-sm hover:opacity-95 ${
                        isEven ? 'bg-[#9E2F55] hover:bg-[#7A2143]' : 'bg-[#1F5A56] hover:bg-[#123E3B]'
                      }`}
                    >
                      <span>Consulter la fiche médicale</span>
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