'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  image?: string;
  story: string;
  cancerType?: string;
}

interface HeroCarouselProps {
  testimonials: Testimonial[];
}

export default function HeroCarousel({ testimonials }: HeroCarouselProps) {
  const defaultBgImage = "https://firebasestorage.googleapis.com/v0/b/newafrique-b466a.appspot.com/o/292horjq9s7?alt=media&token=5ebc90cd-98ae-4ff4-a4fd-9bf540ad527a";

  // 1. Slide 1 : Le Hero d'origine (Toujours le premier)
  const defaultSlide = {
    id: 'hero-main',
    title: "VISA ONG : Votre Partenaire pour la Santé et l'Espoir au Togo",
    text: "Dédiés à la sensibilisation, la prévention et au dépistage précoce des cancers féminins.",
    image: defaultBgImage,
    isDefault: true,
  };

  // 2. Slides suivants : Les témoignages avec image
  const testimonialSlides = (testimonials || [])
    .filter((t) => t.image)
    .map((t) => ({
      id: t.id,
      title: `L'histoire de ${t.name}`,
      text: `"${t.story.length > 130 ? t.story.slice(0, 130) + '...' : t.story}"`,
      image: t.image || defaultBgImage,
      isDefault: false,
    }));

  // Combinaison : Hero d'origine en premier [0], puis témoignages [1..N]
  const slides = [defaultSlide, ...testimonialSlides];
  const [current, setCurrent] = useState(0);

  // Temps de défilement allongé à 8 secondes pour une lecture confortable
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[current];

  return (
    <section className="relative w-full py-12 sm:py-20 min-h-[500px] sm:min-h-[580px] flex items-center bg-slate-900 lg:bg-white overflow-hidden">
      {/* Image de fond dynamique avec transition fluide (Fade + Zoom) */}
      <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-0 opacity-40 lg:opacity-100">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeSlide.id}
            src={activeSlide.image} 
            alt="Hero VISA ONG"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="hidden lg:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white via-white/70 to-transparent z-10" />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
      </div>

      {/* Zone de texte avec transition verticale douce */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeSlide.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl text-white lg:text-slate-900"
          >
            {!activeSlide.isDefault && (
              <span className="inline-block bg-pink-100 text-pink-600 text-xs font-extrabold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                Témoignage
              </span>
            )}

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              {activeSlide.title}
            </h1>
            
            <p className="text-pink-300 lg:text-pink-600 font-semibold text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed">
              {activeSlide.text}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link 
                href="/cancers"
                className="w-full sm:w-auto bg-[#0f766e] hover:bg-[#115e59] text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition shadow-lg shadow-teal-700/30 flex items-center justify-center"
              >
                Planifier un Dépistage
              </Link>
              <Link 
                href="/donation"
                className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition shadow-lg shadow-pink-500/35 flex items-center justify-center"
              >
                Faire un Don
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indication visuelle de progression */}
        {slides.length > 1 && (
          <div className="flex gap-2 mt-8">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === current
                    ? 'w-8 bg-pink-600'
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Aller à la diapositive ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}