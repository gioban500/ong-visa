'use client';

import { useState } from 'react';

type CancerFilter = 'tous' | 'sein' | 'col' | 'digestif_autres';

export default function EmotionalHero() {
  const [activeFilter, setActiveFilter] = useState<CancerFilter>('tous');

  return (
    <section className="pt-12 pb-14 border-b border-[#E1D6C6]">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="mb-6">
          <p className="font-serif italic text-[#6B6155] text-sm mb-1">
            ONG VISA · Dépistage, sensibilisation & accompagnement face aux cancers
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#2A2521] leading-tight max-w-[20ch]">
            Un espace d'écoute et d'information pour tous les cancers
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8 bg-[#F2EBDE] p-2 rounded-lg border border-[#E1D6C6] max-w-max">
          <span className="text-xs font-semibold text-[#6B6155] px-2">Sujet concerné :</span>
          {[
            { key: 'tous', label: "Vue d'ensemble" },
            { key: 'sein', label: 'Cancer du Sein' },
            { key: 'col', label: "Col de l'utérus & Gynéco" },
            { key: 'digestif_autres', label: 'Colorectal & Autres' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as CancerFilter)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                activeFilter === tab.key
                  ? 'bg-[#1F5A56] text-white shadow-sm'
                  : 'text-[#2A2521] hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {(activeFilter === 'tous' || activeFilter === 'sein') && (
            <div className="border border-[#E1D6C6] border-t-4 border-t-[#7A2143] bg-white rounded p-4">
              <span className="text-xs font-bold text-[#7A2143] uppercase tracking-wider block mb-1">Sein</span>
              <h3 className="font-serif font-semibold text-[#2A2521] text-base mb-1.5">Mammographie & Autopalpation</h3>
              <p className="text-xs text-[#6B6155] leading-relaxed">
                Repérer une bosse, un changement de peau ou du mamelon. Examen recommandé dès 50 ans (ou plus tôt selon antécédents).
              </p>
            </div>
          )}

          {(activeFilter === 'tous' || activeFilter === 'col') && (
            <div className="border border-[#E1D6C6] border-t-4 border-t-[#1F5A56] bg-white rounded p-4">
              <span className="text-xs font-bold text-[#1F5A56] uppercase tracking-wider block mb-1">Col de l'utérus</span>
              <h3 className="font-serif font-semibold text-[#2A2521] text-base mb-1.5">Frottis & Test HPV</h3>
              <p className="text-xs text-[#6B6155] leading-relaxed">
                Dépistage préventif essentiel de 25 à 65 ans pour détecter les lésions anormales avant toute évolution.
              </p>
            </div>
          )}

          {(activeFilter === 'tous' || activeFilter === 'digestif_autres') && (
            <div className="border border-[#E1D6C6] border-t-4 border-t-[#6B6155] bg-white rounded p-4">
              <span className="text-xs font-bold text-[#6B6155] uppercase tracking-wider block mb-1">Colorectal & Général</span>
              <h3 className="font-serif font-semibold text-[#2A2521] text-base mb-1.5">Test immunologique & Bilan</h3>
              <p className="text-xs text-[#6B6155] leading-relaxed">
                Dépistage à domicile dès 50 ans et surveillance des signes d'alerte universels (fatigue persistante, perte de poids inexpliquée).
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}