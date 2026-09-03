'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Testimonial {
  id?: string;
  name: string;
  story: string;
  image?: string;
  cancerType?: string;
  approved?: boolean;
}

interface TestimonialSectionProps {
  testimonials?: Testimonial[];
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'MARIE K.',
    story: "Un dépistage précoce m'a permis de déceler mon cancer à un stade très précoce. Grâce au soutien de l'ONG, j'ai pu suivre mon traitement sereinement.",
    image: '/images/testimonials/marie.jpg',
  },
  {
    id: '2',
    name: 'AKAKPO',
    story: "Le dépistage m'a sauvé la vie. L'accompagnement et la prise en charge m'ont redonné espoir.",
    image: '/images/testimonials/akakpo.jpg',
  },
  {
    id: '3',
    name: 'SENONO',
    story: "Grâce aux conseils et à la bienveillance de l'équipe, j'ai surmonté cette épreuve la tête haute.",
    image: '/images/testimonials/senono.jpg',
  },
  {
    id: '4',
    name: 'FATOU B.',
    story: "Une prise en charge humaine et rapide. Merci à toute l'équipe pour leur dévouement.",
    image: '/images/testimonials/fatou.jpg',
  },
];

export default function TestimonialSection({ testimonials = [] }: TestimonialSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayList =
    testimonials && testimonials.length > 0
      ? testimonials.filter((t) => t.approved !== false)
      : fallbackTestimonials;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 350;
      const gap = 32; // Corresponde à gap-8 (2rem)
      const scrollAmount = cardWidth + gap;

      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!displayList || displayList.length === 0) return null;

  const showArrows = displayList.length > 3;

  return (
    <section className="py-16 sm:py-24 bg-[#faf9f6]">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-black text-[#001731] text-center mb-12 tracking-wide uppercase">
          TÉMOIGNAGES
        </h2>

        <div className="relative">
          {/* Flèches de navigation */}
          {showArrows && (
            <>
              <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 text-[#001731] p-3 rounded-full shadow-lg border border-slate-200 transition-transform active:scale-95"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 text-[#001731] p-3 rounded-full shadow-lg border border-slate-200 transition-transform active:scale-95"
                aria-label="Suivant"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Rangée défilante : 3 cartes visibles sur desktop avec espacement (gap-8) */}
          <div
            ref={scrollRef}
            className="flex gap-8 lg:gap-10 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayList.map((item, index) => (
              <div
                key={item.id || index}
                className="snap-start shrink-0 w-[85%] sm:w-[320px] md:w-[calc((100%-4rem)/3)] bg-white rounded-3xl overflow-hidden border border-slate-100 flex flex-col justify-between shadow-sm"
              >
                {/* Photo : occupe la majorité de la hauteur du cadre (~60%) */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
                      {item.name}
                    </div>
                  )}
                </div>

                {/* Texte sous la photo */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-normal italic">
                    &quot;{item.story}&quot;
                  </p>
                  <p className="font-black text-[#001731] text-xs sm:text-sm uppercase tracking-wider">
                    — {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}