'use client';

import { useState } from 'react';

export default function StickyActionBar() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-[#E1D6C6] shadow-[0_-6px_18px_rgba(42,37,33,0.06)] py-3">
      <div className="max-w-[1120px] mx-auto px-7 flex flex-wrap justify-between items-center gap-4 relative pr-10 md:pr-7">
        <span className="font-serif text-sm text-[#2A2521] font-medium shrink-0">
          Une question sur un dépistage ou un symptôme ?
        </span>
        <div className="flex flex-wrap gap-2.5">
          <a
            href="#acces"
            className="bg-[#7A2143] hover:bg-[#5E1833] text-white px-4 py-2 rounded text-xs font-semibold transition"
          >
            Trouver un centre partenaire
          </a>
          <a
            href="#ecoute"
            className="border border-[#1F5A56] text-[#123E3B] hover:bg-[#F2EBDE] px-4 py-2 rounded text-xs font-semibold transition"
          >
            Écrire à un conseiller
          </a>
        </div>
        <button
          onClick={() => setClosed(true)}
          aria-label="Fermer ce bandeau"
          className="absolute right-4 top-2 md:relative md:right-auto md:top-auto text-xl text-[#6B6155] hover:text-[#7A2143]"
        >
          ×
        </button>
      </div>
    </div>
  );
}