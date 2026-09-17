'use client';

import { useState } from 'react';

type ZoneKey = 'sein' | 'col' | 'ovaire' | 'digestif' | 'general';

interface ZoneDetail {
  title: string;
  category: string;
  text: string;
  exam: string;
}

const zoneData: Record<ZoneKey, ZoneDetail> = {
  sein: {
    title: "Sein & Aisselles",
    category: "Gynécologie / Sénologie",
    text: "Recherche de nodules, écoulements ou rétractions de la peau. L'observation régulière permet de repérer un changement récent.",
    exam: "Mammographie / Échographie mammaire"
  },
  col: {
    title: "Col de l'utérus",
    category: "Gynécologie",
    text: "Prévention des lésions précancéreuses liées au virus HPV. Le dépistage permet de traiter la zone bien avant tout risque.",
    exam: "Frottis cervico-utérin / Test HPV"
  },
  ovaire: {
    title: "Ovaires & Pelvis",
    category: "Gynécologie",
    text: "Attention aux pesanteurs pelviennes, ballonnements ou saignements anormaux qui persistent plus de trois semaines.",
    exam: "Échographie pelvienne / Consultation spécialiste"
  },
  digestif: {
    title: "Côlon & Rectum",
    category: "Oncologie digestive",
    text: "Présence de sang dans les selles ou modification récente du transit (constipation/diarrhée) durant plusieurs semaines.",
    exam: "Test immunologique / Coloscopie"
  },
  general: {
    title: "Signes généraux & Ganglions",
    category: "Prévention globale",
    text: "Fatigue intense inexpliquée, perte de poids rapide sans régime, ou ganglions enflés et indolores depuis plusieurs semaines.",
    exam: "Bilan sanguin complet / Consultation de médecine générale"
  }
};

export default function AnatomyExplorer() {
  const [activeZone, setActiveZone] = useState<ZoneKey>('sein');

  return (
    <section id="comprendre" className="py-16 border-b border-[#E1D6C6]">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="max-w-2xl mb-8">
          <h2 className="font-serif text-3xl text-[#2A2521] mb-2">Mieux comprendre chaque zone</h2>
          <p className="text-[#6B6155] text-sm">
            Cliquez sur un organe ou une catégorie pour afficher les signes d'alerte spécifiques et les examens de contrôle associés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(zoneData) as ZoneKey[]).map((key) => {
              const isSelected = activeZone === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveZone(key)}
                  className={`text-left p-4 rounded border transition ${
                    isSelected
                      ? 'bg-[#123E3B] text-white border-[#123E3B]'
                      : 'bg-[#F2EBDE] text-[#2A2521] border-[#E1D6C6] hover:bg-[#ECE2D2]'
                  }`}
                >
                  <span className="text-[11px] opacity-75 uppercase block tracking-wider font-semibold">
                    {zoneData[key].category}
                  </span>
                  <span className="font-serif text-base font-medium block mt-0.5">
                    {zoneData[key].title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-white border border-[#E1D6C6] border-t-4 border-t-[#7A2143] rounded p-6 shadow-sm">
            <span className="inline-block text-xs font-bold text-[#7A2143] bg-[#F3DCE3] px-2.5 py-0.5 rounded-full mb-3">
              {zoneData[activeZone].category}
            </span>
            <h3 className="font-serif text-xl text-[#2A2521] font-semibold mb-2">
              {zoneData[activeZone].title}
            </h3>
            <p className="text-[#6B6155] text-sm leading-relaxed mb-5">
              {zoneData[activeZone].text}
            </p>
            <div className="pt-4 border-t border-[#E1D6C6]">
              <span className="text-xs font-semibold text-[#2A2521] block mb-1">
                Examen de référence :
              </span>
              <span className="text-xs text-[#1F5A56] font-medium block">
                {zoneData[activeZone].exam}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}