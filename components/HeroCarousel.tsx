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

  const defaultSlide = {
    id: 'hero-main',
    title: "VISA ONG : Votre Partenaire pour la Santé et l'Espoir au Togo",
    text: "Dédiés à la sensibilisation, la prévention et au dépistage précoce des cancers féminins.",
    image: defaultBgImage,
    isDefault: true,
  };

  const testimonialSlides = (testimonials || [])
    .filter((t) => t.image)
    .map((t) => ({
      id: t.id,
      title: `L'histoire de ${t.name}`,
      text: `"${t.story.length > 130 ? t.story.slice(0, 130) + '...' : t.story}"`,
      image: t.image!,
      isDefault: false,
    }));

  const slides = [defaultSlide, ...testimonialSlides];
  const [current, setCurrent] = useState(0);

  // 1. PRÉCHARGEMENT INSTANTANÉ DES IMAGES (Élimine le délai de chargement)
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, []);

  // 2. DÉFILEMENT AUTOMATIQUE (8 Secondes)
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[current];

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[580px] flex items-center bg-white overflow-hidden py-12 sm:py-16">
      {/* FOND IMAGE CONTINU (Plus de conteneur 55% = Plus de ligne verticale) */}
      <div className="absolute inset-0 z-0 bg-slate-100">
        <AnimatePresence>
          <motion.img 
            key={activeSlide.id}
            src={activeSlide.image} 
            alt="Hero VISA ONG"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* FONDU FLUIDE SANS BORDURE DURE */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 lg:via-white/85 to-transparent w-full lg:w-[68%] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent lg:hidden z-10" />
      </div>

      {/* CONTENU TEXTE ET BOUTONS */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeSlide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl text-slate-900"
          >
            {!activeSlide.isDefault && (
              <span className="inline-block bg-pink-100 text-pink-600 text-xs font-extrabold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                Témoignage
              </span>
            )}

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 tracking-tight text-slate-900">
              {activeSlide.title}
            </h1>
            
            <p className="text-pink-600 font-semibold text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed">
              {activeSlide.text}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link 
                href="/cancers"
                className="w-full sm:w-auto bg-[#0f766e] hover:bg-[#115e59] text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition shadow-lg shadow-teal-700/20 flex items-center justify-center"
              >
                Planifier un Dépistage
              </Link>
              <Link 
                href="/donation"
                className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition shadow-lg shadow-pink-500/25 flex items-center justify-center"
              >
                Faire un Don
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* INDICATEURS DE SLIDE */}
        {slides.length > 1 && (
          <div className="flex gap-2 mt-8">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
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