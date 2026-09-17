'use client';

import { useState } from 'react';

interface Testimonial {
  id: number;
  category: string;
  question: string;
  who: string;
  answer: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    category: "Sein",
    question: "Est-ce que la mammographie fait mal ?",
    who: "Akosiwa, 42 ans",
    answer: "Une pression ferme durant quelques secondes par cliché. L'examen est rapide et le malaise éventuel s'arrête dès que la compression relâche."
  },
  {
    id: 2,
    category: "Gynécologie",
    question: "Un frottis anormal signifie-t-il automatiquement un cancer ?",
    who: "Koffi, 35 ans (accompagnateur)",
    answer: "Non, absolument pas. Un frottis anormal détecte le plus souvent de simples lésions bénignes ou des virus (HPV) que l'on peut surveiller ou traiter avant qu'ils ne posent problème."
  },
  {
    id: 3,
    category: "Colorectal / Digestif",
    question: "Comment se passe le test de dépistage à domicile ?",
    who: "Edem, 54 ans",
    answer: "C'est un kit très simple et propre à utiliser chez soi pour prélever un échantillon de selles. On l'envoie ensuite par la poste ou au centre partenaire."
  }
];

export default function QuestionTestimonials() {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleTestimonial = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="temoignages" className="py-16 border-b border-[#E1D6C6]">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="max-w-2xl mb-9">
          <h2 className="font-serif text-3xl text-[#2A2521] mb-2">Des réponses concrètes à vos questions</h2>
          <p className="text-[#6B6155]">Retours d'expérience et explications pratiques selon la thématique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div key={item.id} className="bg-white border border-[#E1D6C6] rounded p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F5A56] bg-[#E4EEEC] px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <button
                  onClick={() => toggleTestimonial(item.id)}
                  className="text-left w-full font-serif text-base text-[#2A2521] my-2 focus:outline-none"
                >
                  <span className="block font-medium">{item.question}</span>
                  <span className="block text-xs font-sans font-semibold text-[#7A2143] mt-1.5">
                    {isOpen ? '– masquer' : '+ lire la réponse'}
                  </span>
                </button>
                <div className="text-xs text-[#6B6155] mb-2">{item.who}</div>

                {isOpen && (
                  <div className="pt-3 border-t border-[#E1D6C6] text-sm text-[#6B6155] leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}