'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

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

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Titre */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 font-semibold text-sm mb-4">
              Témoignages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Elles ont <span className="text-gradient">surmonté</span> l'épreuve
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Des femmes courageuses partagent leur parcours pour inspirer et
              redonner espoir.
            </p>
          </div>

          {/* Carte témoignage */}
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl border border-pink-100">
              <Quote className="w-12 h-12 text-pink-300 mb-6" />

              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8 min-h-[120px] line-clamp-5">
                "{current.story}"
              </blockquote>

              <div className="flex items-center gap-4">
                {current.image ? (
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full gradient-rose-violet flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {current.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-gray-900">{current.name}</p>
                  <p className="text-sm text-pink-600 font-medium">
                    Témoignage inspirant
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-pink-500 p-3 rounded-full transition-all hover:scale-110"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-pink-500 p-3 rounded-full transition-all hover:scale-110"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-10 gradient-rose-violet'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Témoignage ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
