import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail, Phone, MapPin, Heart } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import TestimonialSection from '@/components/TestimonialSection';
import Reveal from '@/components/Reveal';
import { getApprovedTestimonials, getCancers, getBlogPosts, initDatabase, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
  image?: string;
  category: string;
  published: boolean;
  publishedDate: string;
  location?: string;
}

export default async function Home() {
  try {
    await initDatabase();
    await seedDatabase();
  } catch (error: unknown) {
    console.error('Error initializing database:', error);
  }

  let testimonials: unknown[] = [];
  let cancers: CancerItem[] = [];
  let events: BlogPost[] = [];

  try {
    testimonials = await getApprovedTestimonials();
  } catch (_e: unknown) {
    testimonials = [];
  }

  try {
    cancers = await getCancers();
  } catch (_e: unknown) {
    cancers = [];
  }

  try {
    const allPosts: BlogPost[] = await getBlogPosts();
    events = allPosts.filter((p) => p.category === 'Événements' && p.published).slice(0, 3);
  } catch (_e: unknown) {
    events = [];
  }

  // Fallback si la BDD est vide pour les cancers
  const defaultCancers = [
    {
      id: 'sein',
      name: 'CANCER DU SEIN',
      description: 'Le cancer le plus fréquent chez la femme. Le dépistage précoce permet de guérir plus de 9 cas sur 10.',
      image: '/images/cancers/sein.jpg',
    },
    {
      id: 'col-uterus',
      name: "CANCER DU COL DE L'UTÉRUS",
      description: 'Principalement causé par le virus HPV. Un cancer presque totalement évitable grâce à la vaccination et au frottis.',
      image: '/images/cancers/col.jpg',
    },
    {
      id: 'ovaire',
      name: "CANCER DE L'OVAIRE",
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
                      <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Focus 0{i + 1}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between text-center">
                      <div>
                        <h3 className="text-lg font-black text-[#001731] mb-3 uppercase tracking-tight">
                          {cancer.name}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                          {cancer.shortDescription || cancer.description}
                        </p>
                      </div>
                      <Link
                        href={`/cancers/${cancer.id}`}
                        className="w-full bg-[#0e5c54] hover:bg-[#0b4741] text-white py-3 rounded-2xl font-bold text-sm transition-colors text-center block"
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

      {/* ============ ÉVÉNEMENTS À VENIR SECTION ============ */}
      <section className="py-20 bg-[#071327] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                <h2 className="text-3xl sm:text-4xl font-black tracking-wide uppercase text-white">
                  ÉVÉNEMENTS À VENIR
                </h2>
                <Link
                  href="/events"
                  className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 text-sm sm:text-base transition-colors"
                >
                  Voir tous les événements <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {events.length > 0 ? (
                events.map((evt, i) => (
                  <Reveal key={evt.id} delay={i * 150} direction="up">
                    <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-md h-full flex flex-col">
                      <div className="relative h-52 w-full bg-slate-200">
                        {evt.image ? (
                          <Image src={evt.image} alt={evt.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-300 flex items-center justify-center text-4xl">🗓️</div>
                        )}
                        <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          {new Date(evt.publishedDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
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
                      </div>
                    </div>
                  </Reveal>
                ))
              ) : (
                [
                  {
                    date: '15 Octobre 2026',
                    location: 'LOMÉ, TOGO',
                    title: 'GRANDE CAMPAGNE DE DÉPISTAGE GRATUIT',
                    desc: 'Une journée dédiée à la sensibilisation, au contrôle clinique gratuit du sein et au dépistage du col de l’utérus pour toutes les femmes.',
                    img: '/images/events/event1.jpg',
                  },
                  {
                    date: '28 Novembre 2026',
                    location: 'PALAIS DES CONGRÈS, LOMÉ',
                    title: 'CONFÉRENCE SANTÉ & PRÉVENTION',
                    desc: 'Échanges avec des professionnels de santé sur les avancées de la prise en charge des cancers féminins au Togo.',
                    img: '/images/events/event2.jpg',
                  },
                  {
                    date: '12 Décembre 2026',
                    location: 'RÉGION MARITIME',
                    title: 'CARAVANE DE SANTÉ RÉGIONALE',
                    desc: 'Ateliers itinérants d’information et d’autopalpation guidée dans plusieurs communautés.',
                    img: '/images/events/event3.jpg',
                  },
                ].map((evt, i) => (
                  <Reveal key={i} delay={i * 150} direction="up">
                    <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-md h-full flex flex-col">
                      <div className="relative h-52 w-full bg-slate-200">
                        <Image src={evt.img} alt={evt.title} fill className="object-cover" />
                        <span className="absolute top-4 right-4 bg-[#e91e63] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
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

      {/* ============ FOOTER SECTION ============ */}
      <footer className="bg-[#001731] text-white pt-16 pb-8 border-t border-slate-800" id="contact">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Branding ONG VISA */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="ONG VISA Logo" width={45} height={45} className="object-contain" />
                <div>
                  <span className="font-extrabold text-lg block leading-tight">ONG VISA</span>
                  <span className="text-xs text-pink-400 uppercase font-semibold">Cancer Féminin</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Organisation Dédiée à la Prévention, au Dépistage et à l&apos;Accompagnement contre les Cancers Féminins au Togo.
              </p>
            </div>

            {/* Navigation rapide */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#0e5c54]">Navigation</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/cancers" className="hover:text-white transition-colors">Nos Focus Cancers</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Événements</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Nos Actions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#0e5c54]">Nos Actions</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><span className="hover:text-white transition-colors">Sensibilisation Communautaire</span></li>
                <li><span className="hover:text-white transition-colors">Dépistages Gratuits</span></li>
                <li><span className="hover:text-white transition-colors">Soutien aux Patientes</span></li>
                <li><span className="hover:text-white transition-colors">Conférences & Formations</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#0e5c54]">Contact</h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                  <span>Lomé, Togo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>+228 90 00 00 00</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>contact@ongvisa.org</span>
                </li>
              </ul>
              <Link
                href="/donation"
                className="mt-6 inline-flex items-center gap-2 bg-[#e91e63] hover:bg-[#d81b60] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md"
              >
                <Heart className="w-3.5 h-3.5" /> Faire un Don
              </Link>
            </div>

          </div>

          <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ONG VISA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}