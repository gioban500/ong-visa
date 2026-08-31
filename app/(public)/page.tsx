import Link from 'next/link';
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
import { getApprovedTestimonials, getCancers, getBlogPosts } from '@/lib/db';
import { initDatabase, seedDatabase } from '@/lib/db';

// Toujours rendre à la demande pour afficher les données ajoutées sans rebuild
export const dynamic = 'force-dynamic';

async function initializeDB() {
  try {
    await initDatabase();
    await seedDatabase();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDB();

export default async function Home() {
  let testimonials: any[] = [];
  let cancers: any[] = [];

  try {
    testimonials = await getApprovedTestimonials();
  } catch (e) {
    testimonials = [];
  }
  try {
    cancers = await getCancers();
  } catch (e) {
    cancers = [];
  }
  
  let events: any[] = [];
  try {
    const allPosts = await getBlogPosts();
    events = allPosts.filter((p: any) => p.category === 'Événements' && p.published).slice(0, 3);
  } catch (e) {
    events = [];
  }

  return (
    <div className="flex flex-col">
      {/* ============ HERO CAROUSEL ============ */}
      <HeroCarousel testimonials={testimonials} />

      {/* ============ MISSION SECTION ============ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm mb-4">
                  Notre engagement
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Notre <span className="text-gradient">Mission</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  L'ONG VISA se consacre à la prévention et à la
                  sensibilisation des cancers féminins, avec un focus sur le
                  cancer du sein et le cancer du col de l'utérus.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-pink-100 h-full">
                  <div className="w-16 h-16 gradient-rose-violet rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Prévention
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sensibiliser les femmes à l'importance du dépistage précoce et
                    promouvoir des modes de vie sains pour réduire les risques.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-purple-100 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Dépistage
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Faciliter l'accès au dépistage gratuit et accompagner les
                    femmes dans leur parcours de santé reproductive.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300} direction="up">
                <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-pink-100 h-full">
                  <div className="w-16 h-16 gradient-rose-violet rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <HandHeart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Soutien</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Offrir un soutien moral et psychologique aux femmes touchées et
                    à leurs familles tout au long de leur combat.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CANCERS FÉMININS SECTION ============ */}
      <section className="py-24 gradient-rose-violet-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white text-pink-600 font-semibold text-sm mb-4 shadow-sm">
                  S'informer
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Cancers <span className="text-gradient">Féminins</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Informez-vous sur les principaux cancers féminins, leurs
                  symptômes et l'importance du dépistage précoce.
                </p>
              </div>
            </Reveal>

            {cancers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {cancers.slice(0, 2).map((cancer: any, i: number) => (
                  <Reveal key={cancer.id} delay={i * 150} direction={i % 2 === 0 ? 'left' : 'right'}>
                    <Link
                      href={`/cancers/${cancer.id}`}
                      className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group h-full"
                    >
                      <div
                        className="h-52 flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${cancer.color || '#EC4899'}25 0%, ${cancer.color || '#A78BFA'}45 100%)`,
                        }}
                      >
                        <Ribbon
                          className="w-16 h-16 opacity-40 absolute top-4 right-4 group-hover:scale-125 transition-transform"
                          style={{ color: cancer.color || '#EC4899' }}
                        />
                        <h3
                          className="text-3xl font-bold px-6 text-center relative z-10"
                          style={{ color: cancer.color || '#DB2777' }}
                        >
                          {cancer.name}
                        </h3>
                      </div>
                      <div className="p-8">
                        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                          {cancer.shortDescription || cancer.description}
                        </p>
                        <div className="inline-flex items-center text-pink-600 font-bold group-hover:gap-3 gap-2 transition-all">
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
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-full">
                    <div className="h-52 flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
                      <h3 className="text-3xl font-bold text-pink-600 px-6 text-center">
                        Cancer du Sein
                      </h3>
                    </div>
                    <div className="p-8">
                      <p className="text-gray-600 leading-relaxed">
                        Le cancer le plus fréquent chez la femme. Le dépistage
                        précoce par auto-palpation et mammographie augmente
                        considérablement les chances de guérison.
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal direction="right" delay={150}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-full">
                    <div className="h-52 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                      <h3 className="text-3xl font-bold text-purple-600 px-6 text-center">
                        Cancer du Col de l'Utérus
                      </h3>
                    </div>
                    <div className="p-8">
                      <p className="text-gray-600 leading-relaxed">
                        Évitable grâce à la vaccination contre le HPV et le frottis
                        de dépistage régulier. Un suivi gynécologique permet de le
                        prévenir efficacement.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            )}

            <Reveal>
              <div className="text-center">
                <Link
                  href="/cancers"
                  className="inline-flex items-center gap-2 gradient-rose-violet text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
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
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="text-center mb-16">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 font-semibold text-sm mb-4">
                    À venir & Passés
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Nos <span className="text-gradient">Événements</span>
                  </h2>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {events.map((evt, i) => (
                  <Reveal key={evt.id} delay={i * 150} direction="up">
                    <Link
                      href={`/blog/${evt.slug}`}
                      className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 h-full group"
                    >
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        {evt.image ? (
                          <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <span className="text-purple-400 text-4xl">🗓️</span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm">
                          {new Date(evt.publishedDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                          {evt.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 text-sm">
                          {evt.excerpt}
                        </p>
                        <div className="inline-flex items-center text-pink-600 font-bold gap-2 group-hover:gap-3 transition-all text-sm">
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
                    className="inline-flex items-center gap-2 gradient-rose-violet text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
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
      <section className="py-24 gradient-rose-violet relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Notre impact en chiffres
                </h2>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Users, value: '1000+', label: 'Femmes sensibilisées' },
                { icon: Heart, value: '500+', label: 'Dépistages réalisés' },
                { icon: Award, value: '50+', label: 'Vies sauvées' },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 150} direction="zoom">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl font-extrabold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg text-white/90">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES SECTION ============ */}
      <TestimonialSection testimonials={testimonials} />

      {/* ============ NEWSLETTER SECTION ============ */}
      <Newsletter />

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Reveal direction="zoom">
              <div className="gradient-rose-violet-soft rounded-3xl p-10 md:p-16 text-center shadow-lg border border-pink-100">
                <div className="w-20 h-20 gradient-rose-violet rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                  <HandHeart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Ensemble, luttons contre les cancers féminins
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                  Votre soutien nous permet de continuer nos actions de
                  prévention, de dépistage et d'accompagnement des femmes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/donation"
                    className="inline-flex items-center justify-center gap-2 gradient-rose-violet text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    <Heart className="w-5 h-5" />
                    Faire un don
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 border-2 border-pink-500 px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-all"
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
