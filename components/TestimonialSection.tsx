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
    <section className="py-16 sm:py-20 bg-[#faf9f6]">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-black text-[#001731] text-center mb-10 sm:mb-14 tracking-wide uppercase">
          TÉMOIGNAGES
        </h2>

        <div className="relative">
          {showArrows && (
            <>
              <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 text-[#001731] p-3 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 text-[#001731] p-3 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105"
                aria-label="Suivant"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-6 lg:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory ${
              displayList.length <= 3 ? 'md:grid md:grid-cols-3 md:overflow-visible' : ''
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayList.map((item, index) => (
              <div
                key={item.id || index}
                className="snap-center flex-shrink-0 w-[280px] sm:w-[320px] md:w-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                {/* Image : ratio 4/3 pour être visuelle sans être géante */}
                <div className="relative aspect-[4/3] w-full bg-slate-100">
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

                {/* Texte compact sous l'image */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 font-normal italic">
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