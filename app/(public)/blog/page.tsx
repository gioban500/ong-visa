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
    <div className="w-full bg-[#fdfbf7] min-h-screen pb-24">
      {/* Bannière Événements */}
      <section className="bg-[#0f766e] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center shadow-md">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-pink-300 font-bold text-xs uppercase tracking-widest block">
            AGENDA & MOBILISATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-emerald-50">
            TOUS NOS ÉVÉNEMENTS
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences scientifiques et activités itinérantes partout au Togo.
          </p>

          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement ou un lieu..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-600 shadow-sm text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conteneur principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-lg">
            <p className="text-stone-500 font-medium text-sm">Chargement des événements...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-lg space-y-2">
            <p className="text-stone-900 font-bold text-lg">Aucun événement trouvé</p>
            <p className="text-stone-500 text-sm">Essayez de modifier votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {evt.image && (
                    <div className="h-52 w-full bg-stone-100 overflow-hidden">
                      <img 
                        src={evt.image} 
                        alt={evt.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-3.5">
                    <h3 className="text-lg font-bold text-stone-900 leading-snug">{evt.title}</h3>
                    
                    {evt.date && (
                      <div className="flex items-center gap-2 text-xs text-pink-600 font-semibold">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                    )}
                    
                    {evt.location && (
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                        <MapPin className="w-4 h-4 shrink-0 text-stone-400" />
                        <span>{evt.location}</span>
                      </div>
                    )}
                    
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${evt.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold py-3.5 px-4 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-sm"
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