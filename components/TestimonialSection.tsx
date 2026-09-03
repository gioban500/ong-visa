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
    name: 'AMINA',
    story: "Le dépistage précoce m'a sauvé la vie. L'ONG VISA m'a soutenue tout au long du parcours.",
    image: '/images/testimonials/amina.jpg',
  },
  {
    id: '2',
    name: 'CHANTAL',
    story: "J'ai pu combattre mon cancer grâce à leur accompagnement et leurs conseils.",
    image: '/images/testimonials/chantal.jpg',
  },
  {
    id: '3',
    name: 'FATOU',
    story: "Aujourd'hui je suis une survivante. Sensibiliser les autres est devenu mon combat.",
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
    <section className="py-16 sm:py-24 bg-[#faf9f6]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-black text-[#001731] text-center mb-12 sm:mb-16 tracking-wide uppercase">
          TÉMOIGNAGES
        </h2>

        <div className="relative">
          {showArrows && (
            <>
              <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#001731] p-3 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#001731] p-3 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110"
                aria-label="Suivant"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory ${
              displayList.length <= 3 ? 'md:grid md:grid-cols-3 md:overflow-visible' : ''
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayList.map((item, index) => (
              <div
                key={item.id || index}
                className="snap-center flex-shrink-0 w-[290px] sm:w-[340px] md:w-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                <div className="relative h-56 w-full bg-slate-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-medium">
                      {item.name}
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    &quot;{item.story}&quot;
                  </p>
                  <p className="font-black text-[#001731] text-sm uppercase tracking-wider">
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