'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Testimonial {
  id?: string;
  name: string;
  story?: string;
  quote?: string;
  image?: string;
  cancerType?: string;
  approved?: boolean;
}

interface TestimonialSectionProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function TestimonialSection({ testimonials = [] }: TestimonialSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayList =
    testimonials && testimonials.length > 0
      ? testimonials.filter((t) => t.approved !== false)
      : defaultTestimonials;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!displayList || displayList.length === 0) return null;

  const isCarouselNeeded = displayList.length > 3;

  return (
    <section className="w-full bg-[#fdfbf7] py-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-black text-center uppercase tracking-wide mb-16 text-slate-900"
        >
          TÉMOIGNAGES
        </motion.h2>

        <div className="relative">
          {/* Flèches de navigation visibles uniquement si plus de 3 témoignages */}
          {isCarouselNeeded && (
            <>
              <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 text-slate-900 p-3 rounded-full shadow-xl border border-stone-200 transition-all hover:scale-105"
                aria-label="Témoignages précédents"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 text-slate-900 p-3 rounded-full shadow-xl border border-stone-200 transition-all hover:scale-105"
                aria-label="Témoignages suivants"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Grille responsive ou Carrousel gardant la même taille exacte de cartes */}
          <motion.div
            ref={scrollRef}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className={
              isCarouselNeeded
                ? 'flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth scrollbar-none'
                : 'grid md:grid-cols-3 gap-8'
            }
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayList.map((testimonial, idx) => {
              const textContent = testimonial.story || testimonial.quote || '';

              return (
                <motion.div
                  key={testimonial.id || idx}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className={`bg-white overflow-hidden rounded-3xl border border-stone-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${
                    isCarouselNeeded
                      ? 'snap-start shrink-0 w-[85%] sm:w-[340px] md:w-[calc((100%-4rem)/3)]'
                      : 'w-full'
                  }`}
                >
                  {/* Image fixe à h-56 */}
                  <div className="relative w-full h-56 bg-slate-100">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-200 flex items-center justify-center text-slate-400 font-semibold text-lg">
                        {testimonial.name}
                      </div>
                    )}
                  </div>

                  {/* Contenu textuel p-6 */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-base text-slate-700 font-medium mb-4 italic leading-relaxed">
                      &quot;{textContent}&quot;
                    </p>
                    <p className="text-base font-black text-slate-900 uppercase">
                      — {testimonial.name}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}