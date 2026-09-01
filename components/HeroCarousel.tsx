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
  const slides = testimonials?.filter((t) => t.image) || [];
  const [current, setCurrent] = useState(0);

  const defaultBgImage = "https://firebasestorage.googleapis.com/v0/b/newafrique-b466a.appspot.com/o/292horjq9s7?alt=media&token=5ebc90cd-98ae-4ff4-a4fd-9bf540ad527a";

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[current];

  return (
    <section className="relative w-full py-12 sm:py-20 min-h-[480px] sm:min-h-[550px] flex items-center bg-slate-900 lg:bg-white overflow-hidden">
      {/* Image de fond dynamique (BDD si dispo, sinon image par défaut) */}
      <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-0 opacity-40 lg:opacity-100">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeSlide ? activeSlide.id : 'default-hero'}
            src={activeSlide?.image || defaultBgImage} 
            alt="Hero VISA ONG"
            initial={{ opacity: 0.3, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="hidden lg:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white via-white/70 to-transparent z-10" />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-white lg:text-slate-900"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
            VISA ONG : Votre Partenaire pour la Santé et l'Espoir au Togo
          </h1>
          
          <p className="text-pink-400 lg:text-pink-600 font-semibold text-base sm:text-xl mb-6 sm:mb-8">
            {activeSlide 
              ? `"${activeSlide.story.slice(0, 110)}..." — ${activeSlide.name}`
              : "Dédiés à la sensibilisation et au dépistage des cancers féminins."}
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
      </div>
    </section>
  );
}