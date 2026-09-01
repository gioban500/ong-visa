'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import type { Cancer } from '@/types/cancer';

export default function CancersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cancers, setCancers] = useState<Cancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch('/api/cancers').then((res) => res.json());
        setCancers(data);
      } catch (error) {
        console.error('Error fetching cancers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCancers = cancers.filter((cancer) =>
    cancer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-xl text-[#001731] font-semibold">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6]">
      {/* ============ BANNIÈRE VERTE SUPERIEURE ============ */}
      <section className="bg-[#0e5c54] text-white py-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-pink-400 font-bold text-xs sm:text-sm tracking-widest uppercase mb-3">
            PRÉVENTION & INFORMATIONS MÉDICALES
          </p>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">
            COMPRENDRE LES CANCERS FÉMININS
          </h1>
          <p className="text-slate-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Une information exacte et un dépistage régulier sont les armes les plus efficaces pour préserver votre santé.
          </p>

          {/* Barre de recherche */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un cancer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-slate-800 placeholder-slate-400 border-none shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base transition-all"
            />
          </div>
        </div>
      </section>

      {/* ============ GRILLE DES CANCERS ============ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCancers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600">
                Aucun cancer trouvé pour votre recherche.
              </p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              {filteredCancers.map((cancer, i) => (
                <div
                  key={cancer.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Image / Badge */}
                    <div className="relative h-60 w-full bg-slate-100">
                      {cancer.image ? (
                        <Image
                          src={cancer.image}
                          alt={cancer.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400"
                          style={{ backgroundColor: cancer.color || '#e2e8f0' }}
                        >
                          {cancer.name}
                        </div>
                      )}
                      <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                        Focus 0{i + 1}
                      </span>
                    </div>

                    {/* Titre & Description */}
                    <div className="p-8 text-center">
                      <h2 className="text-xl font-black text-[#001731] mb-4 uppercase tracking-tight">
                        {cancer.name}
                      </h2>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {cancer.shortDescription || cancer.description}
                      </p>
                    </div>
                  </div>

                  {/* Bouton avec ombre rose décalée */}
                  <div className="px-8 pb-8">
                    <Link
                      href={`/cancers/${cancer.id}`}
                      className="w-full bg-[#0e5c54] hover:bg-[#0b4741] text-white py-3.5 rounded-2xl font-bold text-sm text-center block transition-all shadow-[0_12px_20px_-4px_rgba(233,30,99,0.5)] active:translate-y-0.5"
                    >
                      En savoir plus
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}