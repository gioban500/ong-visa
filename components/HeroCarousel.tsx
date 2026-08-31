'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Ribbon } from 'lucide-react';

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
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  // Ne garder que les témoignages avec photo pour le fond
  const slides = testimonials.filter((t) => t.image);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 400);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const go = (dir: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + dir + slides.length) % slides.length);
      setFade(true);
    }, 300);
  };

  // ====== Cas sans photo : hero dégradé animé ======
  if (slides.length === 0) {
    return (
      <section className="mx-3 md:mx-4 rounded-[2rem] relative overflow-hidden gradient-rose-violet min-h-[75vh] flex items-center">
        <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold mb-6 border border-white/30 animate-fade-up">
            <Ribbon className="w-4 h-4" /> ONG VISA
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Ensemble contre les
            <br /> cancers féminins
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Prévention, dépistage et accompagnement face au cancer du sein et du
            col de l'utérus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/cancers" className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              Découvrir les cancers <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/donation" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all">
              <Heart className="w-5 h-5" /> Faire un don
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  // ====== Cas avec photos : carousel avec image entière visible ======
  return (
    <section className="mx-3 md:mx-4 rounded-[2rem] relative min-h-[75vh] w-full overflow-hidden bg-gray-900">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {/* Fond flou (remplit tout l'espace sans bandes vides) */}
          <img
            src={s.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
          />
          {/* Image entière visible (non rognée) */}
          <img
            src={s.image}
            alt={s.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      ))}

      {/* Voile léger uniquement en bas pour lisibilité du texte */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Contenu ancré en bas */}
      <div className="relative z-10 min-h-[75vh] flex flex-col justify-end px-6 md:px-12 pb-14 md:pb-16">
        <div
          className={`max-w-3xl transition-all duration-500 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white font-semibold text-sm border border-white/25 mb-5">
            <Ribbon className="w-4 h-4" /> Témoignage
          </span>

          <blockquote className="mb-5">
            <p className="text-xl md:text-3xl lg:text-4xl font-bold text-white leading-snug drop-shadow-xl line-clamp-4">
              "{slide.story}"
            </p>
          </blockquote>

          <div className="flex items-center gap-3 mb-8">
            <span className="h-1 w-10 rounded-full gradient-rose-violet" />
            <p className="text-lg md:text-xl text-white font-semibold drop-shadow">
              {slide.name}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/cancers"
              className="inline-flex items-center justify-center gap-2 gradient-rose-violet text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Découvrir les cancers <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
            >
              Partager votre histoire
            </Link>
          </div>
        </div>
      </div>

      {/* Flèches */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-3 rounded-full transition-all border border-white/30"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-3 rounded-full transition-all border border-white/30"
            aria-label="Suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Points */}
      {slides.length > 1 && (
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setCurrent(i);
                  setFade(true);
                }, 300);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-10 gradient-rose-violet' : 'w-2 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
