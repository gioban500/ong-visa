import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Users,
  Award,
  ArrowRight,
  Target,
  HandHeart,
  Ribbon,
  Stethoscope,
} from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import TestimonialSection from '@/components/TestimonialSection';
import Newsletter from '@/components/Newsletter';
import Reveal from '@/components/Reveal';
import { getApprovedTestimonials, getCancers, getBlogPosts, initDatabase, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CancerItem {
  id: string;
  name: string;
  color?: string;
  description?: string;
  shortDescription?: string;
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ============ HERO CAROUSEL ============ */}
      <HeroCarousel testimonials={testimonials as any} />

      {/* ============ MISSION SECTION ============ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-[#0f766e] font-semibold text-sm mb-4 border border-teal-100">
                  Notre engagement
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  Notre <span className="text-[#0f766e]">Mission</span>
                </h2>
                <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  L&apos;ONG VISA se consacre à la prévention et à la sensibilisation des cancers féminins, avec une priorité accordée au cancer du sein et au cancer du col de l&apos;utérus.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-teal-100/80 rounded-2xl flex items-center justify-center mb-6 text-[#0f766e] group-hover:scale-110 transition-transform">
                      <Target className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Prévention</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Sensibiliser les femmes à l&apos;importance du dépistage précoce et promouvoir des habitudes de vie plus saines pour réduire les risques.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={150} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-pink-100/80 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Dépistage</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Faciliter l&apos;accès aux examens de dépistage et orienter les femmes vers une prise en charge médicale adaptée et rapide.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-amber-100/80 rounded-2xl flex items-center justify-center mb-6 text-amber-700 group-hover:scale-110 transition-transform">
                      <HandHeart className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Soutien</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Apporter un accompagnement humain et psychologique aux patientes et à leurs proches tout au long du traitement.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CANCERS FÉMININS SECTION ============ */}
      <section className="py-20 sm:py-24 bg-slate-100/60 border-y border-slate-200/60">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white text-pink-600 font-semibold text-sm mb-4 shadow-sm">
                  Informations Sanitaires
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  Cancers <span className="text-pink-600">Féminins</span>
                </h2>
                <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Comprendre les symptômes et l&apos;importance d&apos;un diagnostic précoce pour agir à temps.
                </p>
              </div>
            </Reveal>

            {cancers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {cancers.slice(0, 2).map((cancer, i) => (
                  <Reveal key={cancer.id} delay={i * 150} direction={i % 2 === 0 ? 'left' : 'right'}>
                    <Link
                      href={`/cancers/${cancer.id}`}
                      className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group h-full border border-slate-200/80 flex flex-col"
                    >
                      <div
                        className="h-48 flex items-center justify-center relative p-6"
                        style={{
                          background: `linear-gradient(135deg, ${cancer.color || '#0f766e'}15 0%, ${cancer.color || '#0f766e'}30 100%)`,
                        }}
                      >
                        <Ribbon
                          className="w-16 h-16 opacity-30 absolute top-4 right-4 group-hover:scale-110 transition-transform"
                          style={{ color: cancer.color || '#0f766e' }}
                        />
                        <h3
                          className="text-2xl sm:text-3xl font-extrabold text-center relative z-10"
                          style={{ color: cancer.color || '#0f766e' }}
                        >
                          {cancer.name}
                        </h3>
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 text-sm sm:text-base">
                          {cancer.shortDescription || cancer.description}
                        </p>
                        <div className="inline-flex items-center text-[#0f766e] font-bold group-hover:gap-3 gap-2 transition-all">
                          En savoir plus
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Reveal direction="left">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 p-8">
                    <h3 className="text-2xl font-bold text-pink-600 mb-4">Cancer du Sein</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Le cancer le plus fréquent chez la femme. Le dépistage précoce par auto-palpation et mammographie augmente considérablement les chances de guérison.
                    </p>
                  </div>
                </Reveal>
                <Reveal direction="right" delay={150}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 p-8">
                    <h3 className="text-2xl font-bold text-[#0f766e] mb-4">Cancer du Col de l&apos;Utérus</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Prévenable grâce au dépistage régulier par frottis ou test HPV. Une détection précoce permet un traitement efficace avant tout stade avancé.
                    </p>
                  </div>
                </Reveal>
              </div>
            )}

            <Reveal>
              <div className="text-center">
                <Link
                  href="/cancers"
                  className="inline-flex items-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Voir tous les cancers féminins
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ ÉVÉNEMENTS SECTION ============ */}
      {events.length > 0 && (
        <section className="py-20 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="text-center mb-16">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm mb-4">
                    Actualités & Actions
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    Nos <span className="text-[#0f766e]">Événements</span>
                  </h2>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {events.map((evt, i) => (
                  <Reveal key={evt.id} delay={i * 150} direction="up">
                    <Link
                      href={`/blog/${evt.slug}`}
                      className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 transition-all h-full group"
                    >
                      <div className="aspect-video relative overflow-hidden bg-slate-100">
                        {evt.image ? (
                          <Image
                            src={evt.image}
                            alt={evt.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <span className="text-[#0f766e] text-3xl">🗓️</span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0f766e] shadow-sm z-10">
                          {new Date(evt.publishedDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0f766e] transition-colors line-clamp-2">
                          {evt.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3 text-sm">
                          {evt.excerpt}
                        </p>
                        <div className="inline-flex items-center text-[#0f766e] font-bold gap-2 text-sm">
                          Détails
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <div className="text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-all"
                  >
                    Voir tous les articles
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ============ STATISTIQUES SECTION ============ */}
      <section className="py-20 sm:py-24 bg-[#0f766e] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-extrabold">
                  Notre impact en chiffres
                </h2>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Users, value: '1000+', label: 'Femmes sensibilisées' },
                { icon: Heart, value: '500+', label: 'Dépistages réalisés' },
                { icon: Award, value: '50+', label: 'Vies accompagnées' },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 150} direction="zoom">
                  <div className="bg-white/10 rounded-2xl p-8 border border-white/15">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-4xl sm:text-5xl font-black mb-2">
                      {stat.value}
                    </div>
                    <div className="text-base text-teal-100">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES SECTION ============ */}
      <TestimonialSection testimonials={testimonials as any} />

      {/* ============ NEWSLETTER SECTION ============ */}
      <Newsletter />

      {/* ============ CTA SECTION ============ */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Reveal direction="zoom">
              <div className="bg-white rounded-3xl p-8 sm:p-14 text-center shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HandHeart className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                  Ensemble, luttons contre les cancers féminins
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
                  Votre engagement nous permet d&apos;intensifier les campagnes de sensibilisation et les consultations de dépistage sur le terrain au Togo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/donation"
                    className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-md shadow-pink-500/20"
                  >
                    <Heart className="w-5 h-5" />
                    Faire un don
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 px-8 py-3.5 rounded-xl font-bold transition"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}