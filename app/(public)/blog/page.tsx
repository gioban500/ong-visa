'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function EvenementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          // Fallback avec les données de tes maquettes si l'API n'est pas encore prête
          setEvents([
            {
              id: '1',
              title: 'GRANDE CAMPAGNE DE DÉPISTAGE GRATUIT',
              date: '15 Octobre 2026',
              location: 'LOMÉ, TOGO',
              description: 'Une journée dédiée à la sensibilisation, au contrôle clinique gratuit du sein et au dépistage du col de l’utérus pour toutes les femmes.',
              image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80'
            },
            {
              id: '2',
              title: 'CONFÉRENCE SANTÉ & PRÉVENTION',
              date: '28 Novembre 2026',
              location: 'PALAIS DES CONGRÈS, LOMÉ',
              description: 'Échanges avec des professionnels de santé sur les avancées de la prise en charge des cancers féminins au Togo.',
              image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80'
            },
            {
              id: '3',
              title: 'CARAVANE DE SENSIBILISATION RÉGIONALE',
              date: '12 Décembre 2026',
              location: 'RÉGION MARITIME',
              description: 'Ateliers itinérants d’information et séances d’autopalpation guidées dans les zones rurales.',
              image: 'https://images.unsplash.com/photo-1511632765466-a01725530126?auto=format&fit=crop&q=80'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();
    return (
      event.title?.toLowerCase().includes(term) ||
      event.location?.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="text-xl font-semibold">Chargement des événements...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Banner / Header Dark */}
      <section className="bg-[#0f172a] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-[#ec4899] font-bold text-xs uppercase tracking-widest">
            AGENDA & MOBILISATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            TOUS NOS ÉVÉNEMENTS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Retrouvez l'ensemble de nos campagnes de dépistage, conférences scientifiques, et activités itinérantes partout au Togo.
          </p>

          {/* Barre de Recherche */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un événement ou lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e7490] transition-all text-sm"
            />
          </div>
        </div>
      </section>

      {/* Grid d'Événements */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            Aucun événement ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  {/* Visuel + Badge Date */}
                  <div className="relative h-52 w-full">
                    <img
                      src={event.image || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 bg-[#ec4899] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {event.date}
                    </span>
                  </div>

                  {/* Contenu textuel */}
                  <div className="p-6 space-y-3">
                    <span className="text-xs font-bold text-[#0e7490] uppercase tracking-wider block">
                      {event.location}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-snug uppercase">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Bouton d'action principal */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/evenements/${event.id}`}
                    className="block w-full text-center bg-[#0e7490] hover:bg-[#0c627a] text-white font-bold py-3.5 px-4 rounded-xl transition-colors text-sm"
                  >
                    Voir les détails & Participer
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