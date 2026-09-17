'use client';

import { useState } from 'react';

interface StepItem {
  id: number;
  title: string;
  tag?: { text: string; type: 'frequent' | 'rare' };
  body: string;
}

const stepsData: StepItem[] = [
  {
    id: 1,
    title: "L'attente des résultats du dépistage",
    body: "L'attente entre un examen (frottis, mammographie, test immunologique, prise de sang) et la réponse peut susciter de l'inquiétude. Ce délai technique ne présage en rien de la gravité du résultat."
  },
  {
    id: 2,
    title: "Un examen complémentaire est prescrit",
    tag: { text: "Cas fréquent", type: "frequent" },
    body: "Un résultat d'imagerie ou d'analyse 'anormal' nécessite souvent un contrôle supplémentaire (échographie, biopsie, coloscopie, colposcopie). Dans la majorité des cas, il s'agit d'une anomalie bénigne ou d'une fausse alerte."
  },
  {
    id: 3,
    title: "Consultation et bilan médical",
    body: "Le médecin vous explique précisément ce qui a été détecté. Préparez vos questions : s'agit-il d'une simple surveillance, d'un traitement préventif ou d'un bilan plus approfondi ?"
  },
  {
    id: 4,
    title: "Proposition d'un parcours de soins",
    tag: { text: "Si confirmation", type: "rare" },
    body: "Si un cancer est diagnostiqué, une équipe pluridisciplinaire établit un protocole de traitement adapté (chirurgie, radiothérapie, chimiothérapie, thérapie ciblée). Vous êtes accompagnée à chaque étape."
  }
];

export default function AbnormalResultSteps() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleStep = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="etapes" className="py-16 border-b border-[#E1D6C6]">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="max-w-2xl mb-9">
          <h2 className="font-serif text-3xl text-[#2A2521] mb-2">Résultat atypique ou anormal : et après ?</h2>
          <p className="text-[#6B6155]">
            Comprendre le déroulement des examens de contrôle permet d'aborder la suite plus sereinement, quel que soit le type de dépistage effectué.
          </p>
        </div>

        <div className="max-w-2xl divide-y divide-[#E1D6C6]">
          {stepsData.map((step) => {
            const isOpen = openId === step.id;
            return (
              <div key={step.id} className="grid grid-cols-[44px_1fr] gap-4 py-1">
                <span className="font-serif text-xl text-[#7A2143] pt-4">
                  {step.id}
                </span>
                <div>
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full text-left py-4 font-serif text-lg text-[#2A2521] flex justify-between items-center gap-3"
                  >
                    <span>{step.title}</span>
                    <span
                      className={`text-sm text-[#6B6155] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-5 text-[#6B6155] text-sm leading-relaxed animate-fadeIn">
                      {step.tag && (
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2.5 ${
                            step.tag.type === 'frequent'
                              ? 'bg-[#E4EEE8] text-[#123E3B]'
                              : 'bg-[#F3DCE3] text-[#7A2143]'
                          }`}
                        >
                          {step.tag.text}
                        </span>
                      )}
                      <p>{step.body}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}