'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';

interface EventDetailProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailProps) {
  const { id } = use(params);

  // État du formulaire d'inscription
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Exemple de données statiques (à remplacer par ton appel DB/API)
  const event = {
    id,
    category: 'DÉPISTAGE',
    organizers: 'ONG VISA & Ministère de la Santé',
    title: 'GRANDE CAMPAGNE DE DÉPISTAGE GRATUIT',
    shortDescription: 'Une journée dédiée à la sensibilisation, au contrôle clinique gratuit du sein et au dépistage du col de l’utérus pour toutes les femmes.',
    date: '15 Octobre 2026',
    time: '08:00 - 17:00',
    location: 'Centre de Santé Communautaire d’Agoè-Nyivé, Lomé',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80',
    description: `Rejoignez-nous pour cette grande journée d'action communautaire. Nos équipes médicales spécialisées et bénévoles seront sur place pour offrir des examens cliniques gratuits, des conseils personnalisés ainsi que des ateliers pratiques d'autopalpation.\n\nDes dépliants d'information et un suivi médical personnalisé seront proposés à toutes les participantes. Venez nombreuses, le dépistage précoce sauve des lives !`
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: id,
          fullName,
          phone,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Inscription confirmée avec succès !' });
        setFullName('');
        setPhone('');
      } else {
        setMessage({ type: 'error', text: 'Une erreur est survenue lors de l\'inscription.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur réseau, veuillez réespérer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      
      {/* SECTION HERO SOMBRE */}
      <section className="bg-[#0f172a] text-white pt-6 pb-16 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Bouton Retour */}
          <Link 
            href="/evenements"
            className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            ← Retour à la liste des événements
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Détails Texte Hero */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 bg-[#ec4899] text-white text-xs font-bold rounded-md tracking-wider uppercase">
                  {event.category}
                </span>
                <span className="text-xs text-slate-300">
                  Organisé par : <strong className="text-white">{event.organizers}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
                {event.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {event.shortDescription}
              </p>

              {/* Box Info (Date, Horaire, Lieu) */}
              <div className="bg-[#1e293b]/80 border border-slate-700/60 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    DATE
                  </span>
                  <p className="font-bold text-white text-base sm:text-lg">{event.date}</p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    HORAIRE
                  </span>
                  <p className="font-bold text-white text-base sm:text-lg">{event.time}</p>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    LIEU & ADRESSE
                  </span>
                  <p className="font-bold text-white text-base sm:text-lg">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Image d'illustration */}
            <div className="lg:col-span-5">
              <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION DU BAS : À PROPOS & FORMULAIRE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* À Propos de cet Événement */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e7490] tracking-wide uppercase">
              À PROPOS DE CET ÉVÉNEMENT
            </h2>
            <div className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Formulaire S'inscrire */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-wide uppercase">
                S'INSCRIRE À CET ÉVÉNEMENT
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Réservez votre place pour bénéficier d'une prise en charge prioritaire.
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  NOM COMPLET
                </label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Akossiwa Mensah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e7490] transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  TÉLÉPHONE
                </label>
                <input 
                  type="tel"
                  required
                  placeholder="ex: +228 90 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e7490] transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0e7490] hover:bg-[#0c627a] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Inscription...' : 'Confirmer mon inscription'}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}