import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, HeartHandshake, ShieldCheck, Users, Calendar, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-[#faf9f6] overflow-x-hidden">
      {/* ============ HERO CAROUSEL ============ */}
      <HeroCarousel testimonials={testimonials as any} />

      {/* ============ MISSION SECTION ============ */}
      <section className="py-24 bg-[#faf9f6] relative overflow-hidden">
        <div className="absolute top-10 -left-20 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-[#0e5c54] text-xs font-bold uppercase tracking-wider mb-4 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-[#e91e63]" /> Ensemble Engagés
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#0e5c54] tracking-tight uppercase">
                  NOTRE MISSION
                </h2>
                <div className="w-20 h-1.5 bg-[#e91e63] mx-auto mt-4 rounded-full" />
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-slate-100 hover:border-emerald-500/30 h-full flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-emerald-100/50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
                      alt="Sensibiliser"
                      className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#001731] mb-4 tracking-tight group-hover:text-[#0e5c54] transition-colors">
                    1. SENSIBILISER
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Informer et éduquer la population afin de briser les tabous autour des cancers féminins.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-slate-100 hover:border-pink-500/30 h-full flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-pink-100/50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
                    <img
                      src="https://static.vecteezy.com/ti/vecteur-libre/t1/34611704-protection-vecteur-icone-conception-illustration-vectoriel.jpg"
                      alt="Prévenir"
                      className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#001731] mb-4 tracking-tight group-hover:text-[#e91e63] transition-colors">
                    2. PRÉVENIR
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Organiser des campagnes de dépistage précoce et faciliter l&apos;accès aux examens médicaux.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-slate-100 hover:border-emerald-500/30 h-full flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-emerald-100/50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
                    <img
                      src="https://static.vecteezy.com/ti/vecteur-libre/t1/75893034-travail-en-equipe-ou-mains-copains-vectoriel.jpg"
                      alt="Accompagner"
                      className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#001731] mb-4 tracking-tight group-hover:text-[#0e5c54] transition-colors">
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

      {/* ============ SECTION IMPACT / CHIFFRES CLÉS (REDESIGNÉE) ============ */}
      <section className="py-24 bg-gradient-to-b from-[#073833] via-[#052b27] to-[#031d1a] text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Titre d'accroche */}
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#e91e63]" /> Notre Impact en Chiffres
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  DES ACTIONS CONCRÈTES SUR LE TERRAIN
                </h2>
                <div className="w-16 h-1 bg-[#e91e63] mx-auto mt-4 rounded-full" />
              </div>
            </Reveal>

            {/* Grille de cartes impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Reveal delay={0} direction="up">
                <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 transform hover:-translate-y-2 shadow-2xl">
                  <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#e91e63] to-[#d81b60] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">5,000+</div>
                  <p className="text-xs sm:text-sm text-emerald-200 font-bold uppercase tracking-wider">Femmes sensibilisées</p>
                </div>
              </Reveal>

              <Reveal delay={100} direction="up">
                <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 transform hover:-translate-y-2 shadow-2xl">
                  <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#e91e63] to-[#d81b60] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">1,200+</div>
                  <p className="text-xs sm:text-sm text-emerald-200 font-bold uppercase tracking-wider">Dépistages gratuits</p>
                </div>
              </Reveal>

              <Reveal delay={200} direction="up">
                <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 transform hover:-translate-y-2 shadow-2xl">
                  <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#e91e63] to-[#d81b60] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">20+</div>
                  <p className="text-xs sm:text-sm text-emerald-200 font-bold uppercase tracking-wider">Campagnes terrain</p>
                </div>
              </Reveal>

              <Reveal delay={300} direction="up">
                <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 transform hover:-translate-y-2 shadow-2xl">
                  <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#e91e63] to-[#d81b60] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                    <HeartHandshake className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">100%</div>
                  <p className="text-xs sm:text-sm text-emerald-200 font-bold uppercase tracking-wider">Engagement bénévoles</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NOS FOCUS CANCERS SECTION ============ */}
      <section className="py-24 bg-[#faf9f6] relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14 gap-4 border-b border-slate-200/60 pb-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#001731] tracking-wide uppercase">
                    NOS FOCUS CANCERS
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">S'informer pour mieux se protéger au quotidien</p>
                </div>
                <Link
                  href="/cancers"
                  className="group text-[#0e5c54] hover:text-[#0b4741] font-bold flex items-center gap-1.5 text-sm sm:text-base transition-all"
                >
                  <span>Voir toutes les informations</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {(cancers.length > 0 ? cancers.slice(0, 3) : defaultCancers).map((cancer, i) => (
                <Reveal key={cancer.id} delay={i * 150} direction="up">
                  <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 hover:border-pink-500/20 h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={cancer.image || `/images/cancers/${cancer.id}.jpg`}
                        alt={cancer.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-[0_4px_14px_rgba(233,30,99,0.4)] animate-pulse">
                        Focus 0{i + 1}
                      </span>
                    </div>

                    <div className="p-7 flex-1 flex flex-col justify-between text-center">
                      <div>
                        <h3 className="text-lg font-black text-[#001731] mb-3 uppercase tracking-tight group-hover:text-[#0e5c54] transition-colors">
                          {cancer.name}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                          {('shortDescription' in cancer && cancer.shortDescription) || cancer.description}
                        </p>
                      </div>

                      <Link
                        href={`/cancers/${cancer.id}`}
                        className="w-full bg-[#0e5c54] hover:bg-[#0b4741] text-white py-3.5 rounded-2xl font-bold text-sm transition-all text-center block shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.02] active:scale-[0.98]"
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
      <section className="py-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#112647] via-[#071327] to-[#030914] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14 gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-wide uppercase text-white">
                    ÉVÉNEMENTS À VENIR
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Rejoignez-nous sur le terrain lors de nos prochaines actions</p>
                </div>
                <Link
                  href="/blog"
                  className="group text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1.5 text-sm sm:text-base transition-all"
                >
                  <span>Voir tous les événements</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
                      <div className="group bg-white text-slate-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2">
                        <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                          {evt.image ? (
                            <Image
                              src={evt.image}
                              alt={evt.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-5xl">🗓️</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                          <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(233,30,99,0.4)] backdrop-blur-md">
                            {formattedDate}
                          </span>
                        </div>

                        <div className="p-7 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[#0e5c54] font-bold text-xs uppercase mb-2 tracking-wider flex items-center gap-1">
                              📍 {evt.location || 'LOMÉ, TOGO'}
                            </p>
                            <h3 className="text-base font-black text-[#001731] mb-3 uppercase leading-snug group-hover:text-[#e91e63] transition-colors">
                              {evt.title}
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                              {evt.excerpt}
                            </p>
                          </div>

                          <Link
                            href={`/blog/${evt.slug || evt.id}`}
                            className="mt-6 w-full bg-[#e91e63] hover:bg-[#d81b60] text-white py-3.5 rounded-2xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span>Détails de l'événement</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
                    <div className="group bg-white text-slate-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                        <Image
                          src={evt.img}
                          alt={evt.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                        <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(233,30,99,0.4)] backdrop-blur-md">
                          {evt.date}
                        </span>
                      </div>

                      <div className="p-7 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[#0e5c54] font-bold text-xs uppercase mb-2 tracking-wider flex items-center gap-1">
                            📍 {evt.location}
                          </p>
                          <h3 className="text-base font-black text-[#001731] mb-3 uppercase leading-snug group-hover:text-[#e91e63] transition-colors">
                            {evt.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {evt.desc}
                          </p>
                        </div>

                        <Link
                          href={`/blog/${evt.slug || evt.id}`}
                          className="mt-6 w-full bg-[#0e5c54] hover:bg-[#0b4741] text-white py-3.5 rounded-2xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Détails de l'événement</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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

      {/* ============ BANNIÈRE BANNER CALL TO ACTION ============ */}
      <section className="py-20 bg-gradient-to-br from-[#e91e63] via-[#d81b60] to-[#880e4f] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Reveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                ENSEMBLE CONTRE LE CANCER
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
                VOTRE SOUTIEN PEUT SAUVER DES VIES
              </h2>
              <p className="text-pink-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Chaque don nous permet d'offrir des dépistages gratuits aux femmes les plus vulnérables et de multiplier nos campagnes de sensibilisation.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-[#e91e63] rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:bg-slate-100 shadow-xl hover:scale-105 active:scale-95"
                >
                  Faire un don
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
                >
                  Devenir bénévole
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}