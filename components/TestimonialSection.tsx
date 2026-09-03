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
];

export default function TestimonialSection({ testimonials = [] }: TestimonialSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayList =
    testimonials && testimonials.length > 0
      ? testimonials.filter((t) => t.approved !== false)
      : fallbackTestimonials;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!displayList || displayList.length === 0) return null;

  const showArrows = displayList.length > 3;

  return (
    <section className="py-20 sm:py-28 bg-[#faf9f6]">
      <div className="w-full px-6 sm:px-12 lg:px-16 max-w-[1500px] mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001731] text-center mb-16 sm:mb-20 tracking-wide uppercase">
          TÉMOIGNAGES
        </h2>

        <div className="relative">
          {showArrows && (
            <>
              <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 text-[#001731] p-4 rounded-full shadow-2xl border border-slate-200 transition-all hover:scale-110"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 text-[#001731] p-4 rounded-full shadow-2xl border border-slate-200 transition-all hover:scale-110"
                aria-label="Suivant"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-10 lg:gap-14 xl:gap-16 overflow-x-auto pb-8 snap-x snap-mandatory ${
              displayList.length <= 3 ? 'md:grid md:grid-cols-3 md:overflow-visible' : ''
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayList.map((item, index) => (
              <div
                key={item.id || index}
                className="snap-center flex-shrink-0 w-[340px] sm:w-[420px] md:w-auto bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between"
              >
                {/* Image dominante (~70% de la hauteur de la carte) */}
                <div className="relative h-[380px] sm:h-[420px] lg:h-[460px] w-full bg-slate-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium text-xl">
                      {item.name}
                    </div>
                  )}
                </div>

                {/* Zone texte compacte (~30% de la carte) */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-normal italic">
                    &quot;{item.story}&quot;
                  </p>
                  <p className="font-black text-[#001731] text-sm sm:text-base uppercase tracking-wider">
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