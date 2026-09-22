'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StickyActionBar() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <aside aria-label="Bandeau d'assistance rapide" className="fixed bottom-0 left-0 right-0 z-40 bg-white/96 backdrop-blur-md border-t border-[#E2D7C7] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] py-2.5">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[13.5px] font-semibold text-[#2A2521] flex items-center gap-2">
          <span className="text-[#9E2F55] text-sm animate-pulse">●</span>
          <span>Besoin d'aide maintenant ou d'une question sur un dépistage ?</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/#centres"
            className="bg-[#9E2F55] hover:bg-[#7A2143] text-white px-3.5 py-1.5 rounded-[4px] text-[13px] font-semibold transition-colors shadow-sm"
          >
            Trouver un centre
          </Link>
          <Link
            href="/#autopalpation"
            className="border border-[#1F5A56] text-[#123E3B] hover:bg-[#EBF3F1] px-3.5 py-1.5 rounded-[4px] text-[13px] font-semibold transition-colors"
          >
            Apprendre les gestes
          </Link>
          <button
            onClick={() => setClosed(true)}
            aria-label="Fermer ce bandeau"
            className="text-lg text-[#756B60] hover:text-[#2A2521] px-1.5 transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </aside>
  );
}