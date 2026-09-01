'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Heart, Shield, ArrowRight } from 'lucide-react';

interface Cancer {
  id: string;
  name: string;
  color?: string;
  image?: string;
  shortdescription?: string;
  description?: string;
  epidemiology?: string;
  riskpopulation?: string;
  riskfactors?: string[];
  symptoms?: string[];
  screening?: string[];
}

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
        console.error('Erreur lors de la récupération des cancers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCancers();
  }, []);

  const filteredCancers = cancers.filter((cancer) =>
    cancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cancer.shortdescription && cancer.shortdescription.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Banner Héro */}
      <section className="bg-[#0e7490] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-[#f472b6] font-bold text-xs uppercase tracking-widest block">
            PRÉVENTION & INFORMATIONS MÉDICALES
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
            COMPRENDRE LES CANCERS FÉMININS
          </h1>
          <p className="text-slate-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Une information exacte et un dépistage régulier sont les armes les plus efficaces pour préserver votre santé.
          </p>

          {/* Barre de recherche */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un cancer..."
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-pink-400/30 shadow-lg text-sm sm:text-base transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille principale ajustée en max-w-7xl */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">Chargement des données...</p>
          </div>
        ) : filteredCancers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 space-y-3">
            <p className="text-slate-700 font-bold text-lg">Aucun résultat trouvé</p>
            <p className="text-slate-500 text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCancers.map((cancer, index) => (
              <div
                key={cancer.id || index}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image / Couleur fixe avec ratio respecté */}
                  <div className="relative w-full h-64 overflow-hidden bg-slate-100">
                    {cancer.image ? (
                      <img
                        src={cancer.image}
                        alt={cancer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-black text-white text-2xl p-6 text-center uppercase tracking-wide"
                        style={{ backgroundColor: cancer.color || '#ec4899' }}
                      >
                        {cancer.name}
                      </div>
                    )}
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-slate-800 shadow-sm">
                      Focus {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Contenu textuel de la carte */}
                  <div className="p-6 space-y-3">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                      {cancer.name}
                    </h2>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {cancer.shortdescription || cancer.description || 'Consultez la fiche détaillée pour en savoir plus sur la prévention et le dépistage.'}
                    </p>
                  </div>
                </div>

                {/* Bouton du bas parfaitement aligné */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/cancers/${cancer.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#ec4899] text-white font-bold py-3.5 px-4 rounded-2xl transition-colors text-sm shadow-sm"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section d'accompagnement bas de page */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[#ec4899] font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              Soutien & Accompagnement
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              Besoin d'un conseil ou d'une orientation ?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nos équipes et bénévoles sont à votre disposition pour vous informer sur les campagnes de dépistage à venir.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-start md:justify-end">
            <Link
              href="/evenements"
              className="inline-flex items-center justify-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white font-bold px-6 py-4 rounded-2xl text-sm transition-colors text-center"
            >
              <Shield className="w-4 h-4" />
              Nos campagnes
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-4 rounded-2xl text-sm transition-colors text-center"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}