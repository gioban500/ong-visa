'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  image?: string;
  story: string;
  cancerType?: string;
  date?: string;
  approved?: boolean;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Ne garder que les témoignages approuvés s'il y a un flag
  const displayList = testimonials?.filter(t => t.approved !== false) || [];

  useEffect(() => {
    if (displayList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [displayList.length]);

  if (!displayList || displayList.length === 0) return null;

  const current = displayList[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % displayList.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + displayList.length) % displayList.length);

  return (
    <section className="w-full bg-white py-12 sm:py-20 px-4 sm:px-8 lg:px-12 border-b border-amber-100/60">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-black text-[#0f766e] mb-8 sm:mb-14 text-center uppercase tracking-wide">
          TÉMOIGNAGES
        </h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={current.id || currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-[#fdfbf7] p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between"
            >
              <p className="text-slate-700 italic text-base sm:text-xl mb-8 leading-relaxed font-medium">
                "{current.story}"
              </p>

              <div className="flex items-center gap-4">
                {current.image ? (
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#0f766e] shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#0f766e] text-white flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                    {current.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg">{current.name}</h4>
                  <p className="text-xs sm:text-sm text-pink-600 font-semibold">
                    {current.cancerType || "Bénéficiaire"}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Flèches */}
          {displayList.length > 1 && (
            <div className="flex justify-end items-center gap-3 mt-6">
              <button
                onClick={prevSlide}
                className="p-3 bg-white hover:bg-stone-100 text-slate-800 rounded-full border border-stone-200 transition shadow-sm"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 bg-white hover:bg-stone-100 text-slate-800 rounded-full border border-stone-200 transition shadow-sm"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}