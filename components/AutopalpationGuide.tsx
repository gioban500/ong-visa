'use client';

import { useState } from 'react';

const steps = [
  {
    icon: "🗓️",
    title: "Choisir le bon moment",
    text: "Idéalement quelques jours après la fin des règles pour la poitrine. Pour une observation générale du corps, fixez une date régulière chaque mois.",
    tip: "Astuce : associez cette vérification à un repère mensuel simple."
  },
  {
    icon: "🪞",
    title: "Observer devant un miroir",
    text: "Examinez l'aspect de la peau, la symétrie, ou toute modification visible (rougeur, gonflement, rétraction) au niveau du torse ou du col.",
    tip: "L'objectif est d'apprendre à connaître son corps au naturel."
  },
  {
    icon: "🚿",
    title: "Palper debout ou sous la douche",
    text: "Pour le sein, la main à plat effectue de petits mouvements circulaires avec une pression légère puis ferme. Pour les ganglions, vérifiez sous les aisselles et le cou.",
    tip: "La peau savonneuse facilite le glissement des doigts."
  },
  {
    icon: "🛏️",
    title: "Palper allongée",
    text: "Un coussin sous l'épaule du côté examiné, refaites les mêmes mouvements sur le sein et jusqu'au creux de l'aisselle.",
    tip: "Cette position détend les tissus et simplifie le repérage."
  },
  {
    icon: "💬",
    title: "Ce qu'il faut retenir",
    text: "La plupart des nodules ou petites anomalies ne sont pas cancéreux. Si vous observez un changement net qui persiste plus de 2 à 3 semaines, consultez un médecin sans paniquer.",
    tip: "Ces gestes complètent le dépistage médical, sans le remplacer."
  }
];

export default function AutopalpationGuide() {
  const [index, setIndex] = useState(0);

  const current = steps[index];
  const progressPercent = ((index + 1) / steps.length) * 100;

  const handleNext = () => {
    setIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  return (
    <section id="autopalpation" className="py-16 border-b border-[#E1D6C6]">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="max-w-2xl mb-9">
          <h2 className="font-serif text-3xl text-[#2A2521] mb-2">Les gestes d'auto-observation</h2>
          <p className="text-[#6B6155]">
            Cinq minutes une fois par mois suffisent. Prenez l'habitude de surveiller votre corps pour déceler rapidement tout changement inhabituel.
          </p>
        </div>

        <div className="max-w-2xl bg-[#F2EBDE] border border-[#E1D6C6] border-t-4 border-t-[#7A2143] rounded p-7">
          <div className="flex items-center gap-3.5 mb-6">
            <span className="text-xs text-[#6B6155] font-semibold shrink-0">
              Étape {index + 1} / {steps.length}
            </span>
            <div className="flex-1 h-1.5 bg-[#E1D6C6] rounded overflow-hidden">
              <div
                className="h-full bg-[#7A2143] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="text-center py-2 mb-6">
            <div className="text-4xl mb-3">{current.icon}</div>
            <h3 className="font-serif text-xl text-[#2A2521] font-medium mb-2.5">
              {current.title}
            </h3>
            <p className="text-[#6B6155] text-sm max-w-[52ch] mx-auto mb-3.5">
              {current.text}
            </p>
            {current.tip && (
              <span className="inline-block text-xs text-[#123E3B] bg-[#E4EEEC] rounded-full px-3.5 py-1 font-semibold">
                {current.tip}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              className="border border-[#1F5A56] text-[#123E3B] hover:bg-[#EFE0D3] disabled:opacity-40 disabled:hover:bg-transparent px-4 py-2 rounded text-sm font-semibold transition"
            >
              Précédent
            </button>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Aller à l'étape ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === index ? 'bg-[#7A2143]' : 'bg-[#E1D6C6]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="bg-[#1F5A56] hover:bg-[#123E3B] text-white px-4 py-2 rounded text-sm font-semibold transition"
            >
              {index === steps.length - 1 ? 'Recommencer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}