import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import TestimonialSection from '@/components/TestimonialSection';
import Reveal from '@/components/Reveal';
import { getApprovedTestimonials, getCancers, getBlogPosts } from '@/lib/db';

export const revalidate = 60;

interface CancerItem {
  id: string;
  name: string;
  color?: string;
  description?: string;
  shortDescription?: string;
  image?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image?: string;
  category: string;
  published: boolean;
  createdAt?: string;
  publishedDate?: string;
  location?: string;
}

export default async function Home() {
  const [testimonialsRes, cancersRes, postsRes] = await Promise.allSettled([
    getApprovedTestimonials(),
    getCancers(),
    getBlogPosts(),
  ]);

  const testimonials = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value : [];
  const cancers: CancerItem[] = cancersRes.status === 'fulfilled' ? (cancersRes.value as CancerItem[]) : [];
  const allPosts: BlogPost[] = postsRes.status === 'fulfilled' ? (postsRes.value as BlogPost[]) : [];

  const publishedPosts = allPosts.filter((p) => p.published);
  const eventCategoryPosts = publishedPosts.filter((p) => p.category?.toLowerCase() === 'événements');
  const events = (eventCategoryPosts.length > 0 ? eventCategoryPosts : publishedPosts).slice(0, 3);

  const defaultCancers: CancerItem[] = [
    {
      id: 'sein',
      name: 'CANCER DU SEIN',
      shortDescription: 'Le cancer le plus fréquent chez la femme. Le dépistage précoce permet de guérir plus de 9 cas sur 10.',
      description: 'Le cancer le plus fréquent chez la femme. Le dépistage précoce permet de guérir plus de 9 cas sur 10.',
      image: '/images/cancers/sein.jpg',
    },
    {
      id: 'col-uterus',
      name: "CANCER DU COL DE L'UTÉRUS",
      shortDescription: 'Principalement causé par le virus HPV. Un cancer presque totalement évitable grâce à la vaccination et au frottis.',
      description: 'Principalement causé par le virus HPV. Un cancer presque totalement évitable grâce à la vaccination et au frottis.',
      image: '/images/cancers/col.jpg',
    },
    {
      id: 'ovaire',
      name: "CANCER DE L'OVAIRE",
      shortDescription: 'Souvent silencieux au début. Une attention particulière aux signes persistants permet un diagnostic plus rapide.',
      description: 'Souvent silencieux au début. Une attention particulière aux signes persistants permet un diagnostic plus rapide.',
      image: '/images/cancers/ovaire.jpg',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6]">
      {/* ============ HERO CAROUSEL ============ */}
      <HeroCarousel testimonials={testimonials as any} />

      {/* ============ MISSION SECTION ============ */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0e5c54] tracking-wide uppercase">
                  NOTRE MISSION
                </h2>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0} direction="up">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center">
                    <img
                      src="/icons/sensibiliser.png"
                      alt="Sensibiliser"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#001731] mb-4 tracking-tight">
                    1. SENSIBILISER
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Informer et éduquer la population afin de briser les tabous autour des cancers féminins.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150} direction="up">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center">
                    <img
                      src="/icons/prevenir.png"
                      alt="Prévenir"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#001731] mb-4 tracking-tight">
                    2. PRÉVENIR
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Organiser des campagnes de dépistage précoce et faciliter l&apos;accès aux examens médicaux.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300} direction="up">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center">
                    <img
                      src="/icons/accompagner.png"
                      alt="Accompagner"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#001731] mb-4 tracking-tight">
                    3. ACCOMPAGNER
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Soutenir moralement, matériellement et médicalement les patientes dans leur combat.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NOS FOCUS CANCERS SECTION ============ */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                <h2 className="text-3xl sm:text-4xl font-black text-[#001731] tracking-wide uppercase">
                  NOS FOCUS CANCERS
                </h2>
                <Link
                  href="/cancers"
                  className="text-[#0e5c54] hover:text-[#0b4741] font-bold flex items-center gap-1 text-sm sm:text-base transition-colors"
                >
                  Voir toutes les informations <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {(cancers.length > 0 ? cancers.slice(0, 3) : defaultCancers).map((cancer, i) => (
                <Reveal key={cancer.id} delay={i * 150} direction="up">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col">
                    <div className="relative h-56 w-full bg-slate-100">
                      <Image
                        src={cancer.image || `/images/cancers/${cancer.id}.jpg`}
                        alt={cancer.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_4px_14px_rgba(233,30,99,0.4)]">
                        Focus 0{i + 1}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between text-center">
                      <div>
                        <h3 className="text-lg font-black text-[#001731] mb-3 uppercase tracking-tight">
                          {cancer.name}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                          {('shortDescription' in cancer && cancer.shortDescription) || cancer.description}
                        </p>
                      </div>
                      <Link
                        href={`/cancers/${cancer.id}`}
                        className="w-full bg-[#0e5c54] hover:bg-[#0b4741] text-white py-3 rounded-2xl font-bold text-sm transition-all text-center block shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        En savoir plus
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ÉVÉNEMENTS SECTION ============ */}
      <section className="py-20 bg-[#071327] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                <h2 className="text-3xl sm:text-4xl font-black tracking-wide uppercase text-white">
                  ÉVÉNEMENTS À VENIR
                </h2>
                <Link
                  href="/blog"
                  className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 text-sm sm:text-base transition-colors"
                >
                  Voir tous les événements <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {events.length > 0 ? (
                events.map((evt, i) => {
                  const displayDate = evt.publishedDate || evt.createdAt;
                  const formattedDate = displayDate
                    ? new Date(displayDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'RÉCENT';

                  return (
                    <Reveal key={evt.id} delay={i * 150} direction="up">
                      <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-md h-full flex flex-col">
                        <div className="relative h-52 w-full bg-slate-200">
                          {evt.image ? (
                            <Image src={evt.image} alt={evt.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-4xl">🗓️</div>
                          )}
                          <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(233,30,99,0.35)]">
                            {formattedDate}
                          </span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[#0e5c54] font-bold text-xs uppercase mb-2 tracking-wider">
                              {evt.location || 'LOMÉ, TOGO'}
                            </p>
                            <h3 className="text-base font-black text-[#001731] mb-3 uppercase leading-snug">
                              {evt.title}
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                              {evt.excerpt}
                            </p>
                          </div>
                          <Link
                            href={`/blog/${evt.slug || evt.id}`}
                            className="mt-6 w-full bg-[#e91e63] hover:bg-[#d81b60] text-white py-3 rounded-2xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span>Détails de l'événement</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  );
                })
              ) : (
                [
                  {
                    id: 'event-1',
                    slug: 'grande-campagne-de-depistage-gratuit',
                    date: '15 Octobre 2026',
                    location: 'LOMÉ, TOGO',
                    title: 'GRANDE CAMPAGNE DE DÉPISTAGE GRATUIT',
                    desc: 'Une journée dédiée à la sensibilisation, au contrôle clinique gratuit du sein et au dépistage du col de l’utérus pour toutes les femmes.',
                    img: '/images/events/event1.jpg',
                  },
                  {
                    id: 'event-2',
                    slug: 'conference-sante-et-prevention',
                    date: '28 Novembre 2026',
                    location: 'PALAIS DES CONGRÈS, LOMÉ',
                    title: 'CONFÉRENCE SANTÉ & PRÉVENTION',
                    desc: 'Échanges avec des professionnels de santé sur les avancées de la prise en charge des cancers féminins au Togo.',
                    img: '/images/events/event2.jpg',
                  },
                  {
                    id: 'event-3',
                    slug: 'caravane-de-sante-regionale',
                    date: '12 Décembre 2026',
                    location: 'RÉGION MARITIME',
                    title: 'CARAVANE DE SANTÉ RÉGIONALE',
                    desc: 'Ateliers itinérants d’information et d’autopalpation guidée dans plusieurs communautés.',
                    img: '/images/events/event3.jpg',
                  },
                ].map((evt, i) => (
                  <Reveal key={evt.id} delay={i * 150} direction="up">
                    <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-md h-full flex flex-col">
                      <div className="relative h-52 w-full bg-slate-200">
                        <Image src={evt.img} alt={evt.title} fill className="object-cover" />
                        <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(233,30,99,0.35)]">
                          {evt.date}
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[#0e5c54] font-bold text-xs uppercase mb-2 tracking-wider">
                            {evt.location}
                          </p>
                          <h3 className="text-base font-black text-[#001731] mb-3 uppercase leading-snug">
                            {evt.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {evt.desc}
                          </p>
                        </div>
                        <Link
  href={`/blog/${evt.slug || evt.id}`}
  className="mt-6 w-full bg-[#0e5c54] hover:bg-[#0b4741] text-white py-3 rounded-2xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]"
>
  <span>Détails de l'événement</span>
  <ArrowRight className="w-4 h-4" />
</Link>
                      </div>
                    </div>
                  </Reveal>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES SECTION ============ */}
      <TestimonialSection testimonials={testimonials as any} />
    </div>
  );
}