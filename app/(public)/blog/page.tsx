'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventItem {
  id: string | number;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  image?: string;
}

export default function BlogEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events'); // ajuste la route si ton endpoint s'appelle /api/blog ou /api/articles
        if (res.ok) {
          const data = await res.json();
          // S'assure de récupérer le tableau même s'il est empaqueté dans une clé { events: [...] }
          setEvents(Array.isArray(data) ? data : data.events || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((evt) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      evt.title?.toLowerCase().includes(query) ||
      evt.location?.toLowerCase().includes(query) ||
      evt.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Banner Événements */}
      <section className="bg-[#0b1329] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-[#ec4899] font-bold text-xs uppercase tracking-widest block">
            AGENDA & MOBILISATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            TOUS NOS ÉVÉNEMENTS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences scientifiques et activités itinérantes partout au Togo.
          </p>

          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement ou un lieu..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conteneur principal (sans chevauchement cassé) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium text-sm">Chargement des événements...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-2">
            <p className="text-slate-800 font-bold text-lg">Aucun événement trouvé</p>
            <p className="text-slate-500 text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {evt.image && (
                    <div className="h-48 w-full bg-slate-100">
                      <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">{evt.title}</h3>
                    {evt.date && (
                      <div className="flex items-center gap-2 text-xs text-pink-600 font-semibold">
                        <Calendar className="w-4 h-4" />
                        <span>{evt.date}</span>
                      </div>
                    )}
                    {evt.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-4 h-4" />
                        <span>{evt.location}</span>
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/blog/${evt.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#ec4899] text-white font-bold py-3 px-4 rounded-xl transition-colors text-xs uppercase"
                  >
                    <span>Détails de l'événement</span>
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