'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Dna, 
  Clock, 
  CheckCircle, 
  Users, 
  ArrowRight,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Mail,
  Inbox,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  stats: {
    testimonials: number;
    approvedTestimonials: number;
    pendingTestimonials: number;
    blogPosts: number;
    publishedPosts: number;
    cancers: number;
    subscribers: number;
    events?: number;
  };
  recentTestimonials: {
    id: string;
    name: string;
    cancerType: string;
    excerpt: string;
    date: string;
    approved: boolean;
  }[];
  recentPosts: {
    id: string;
    title: string;
    author: string;
    publishedDate: string;
    category: string;
    published: boolean;
    image: string;
  }[];
  recentSubscribers?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject?: string;
    createdAt?: string;
  }[];
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime()) || date.getTime() === 0) return '';
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((d) => { 
        setData(d); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data || !data.stats) {
    return <p className="text-red-500 font-medium">Erreur lors du chargement des données du tableau de bord.</p>;
  }

  const { stats } = data;
  const recentTestimonials = data.recentTestimonials || [];
  const recentPosts = data.recentPosts || [];
  const recentSubscribers = data.recentSubscribers || [];

  const approvedPercentage = stats.testimonials > 0 
    ? Math.round((stats.approvedTestimonials / stats.testimonials) * 100) 
    : 0;
  
  const publishedPercentage = stats.blogPosts > 0 
    ? Math.round((stats.publishedPosts / stats.blogPosts) * 100) 
    : 0;

  const statCards = [
    {
      label: 'Témoignages',
      value: stats.testimonials ?? 0,
      sub: `${stats.pendingTestimonials ?? 0} en attente`,
      icon: Users,
      bgColor: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
      href: '/admin/testimonials',
    },
    {
      label: 'Articles Blog',
      value: stats.blogPosts ?? 0,
      sub: `${stats.publishedPosts ?? 0} publiés`,
      icon: BookOpen,
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      href: '/admin/blog',
    },
    {
      label: 'Types de Cancer',
      value: stats.cancers ?? 0,
      sub: 'Pages gérées',
      icon: ShieldCheck,
      bgColor: 'bg-gradient-to-r from-rose-500 to-pink-500',
      href: '/admin/cancers',
    },
    {
      label: 'Participants Événements',
      value: stats.events ?? 'Voir',
      sub: 'Personnes inscrites',
      icon: Calendar,
      bgColor: 'bg-gradient-to-r from-amber-500 to-orange-600',
      href: '/admin/eventRegistration',
    },
  ];

  const hasNoActivity = recentTestimonials.length === 0 && recentPosts.length === 0 && recentSubscribers.length === 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Colonne Gauche : Profil & Activité Récente */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4 border-4 border-white">
                A
              </div>
              <h3 className="text-xl font-bold text-gray-900">Admin</h3>
              <p className="text-gray-500">Administrateur ONG</p>
            </div>

            <div className="flex justify-around mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{approvedPercentage}%</p>
                <p className="text-xs text-gray-500">Approuvés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{publishedPercentage}%</p>
                <p className="text-xs text-gray-500">Publiés</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">Activité Récente</h4>
              <div className="space-y-2">
                {recentTestimonials.slice(0, 2).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center flex-shrink-0">
                      {t.approved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 truncate">
                        {t.approved ? `Témoignage ${t.name} approuvé` : `Nouveau témoignage de ${t.name}`}
                      </p>
                      {t.date && <p className="text-xs text-gray-500">{formatDate(t.date)}</p>}
                    </div>
                  </div>
                ))}

                {recentSubscribers.slice(0, 1).map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 truncate">
                        Message de {sub.firstName} {sub.lastName}
                      </p>
                      {sub.createdAt && (
                        <p className="text-xs text-gray-500">{formatDate(sub.createdAt)}</p>
                      )}
                    </div>
                  </div>
                ))}

                {recentPosts.slice(0, 1).map((post) => (
                  <div key={post.id} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 truncate">
                        {post.published ? `Article "${post.title}" publié` : `Nouvel article "${post.title}"`}
                      </p>
                      {post.publishedDate && (
                        <p className="text-xs text-gray-500">{formatDate(post.publishedDate)}</p>
                      )}
                    </div>
                  </div>
                ))}

                {hasNoActivity && (
                  <p className="text-sm text-gray-500 text-center py-2">Pas d'activité récente</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Cartes de Stats & Graphiques */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.href} className="block">
                  <div className={`${stat.bgColor} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-between`}>
                    <div>
                      <h4 className="text-sm opacity-90 font-medium">{stat.label}</h4>
                      <p className="text-4xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs opacity-80 mt-2">{stat.sub}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4 text-sm font-medium text-gray-500">
                  <button className="text-purple-600 border-b-2 border-purple-600 pb-1">Activité</button>
                  <button className="hover:text-gray-700 pb-1">Stats</button>
                </div>
              </div>

              <div className="h-52 bg-gradient-to-b from-indigo-50 to-white rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Graphique d'activité</p>
                </div>
              </div>
            </div>

            {/* Témoignages récents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Témoignages récents</h3>
              
              <div className="space-y-4">
                {recentTestimonials.length > 0 ? (
                  recentTestimonials.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {t.name ? t.name.charAt(0) : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-xs text-gray-600 truncate">{t.excerpt}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        t.approved 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t.approved ? 'Approuvé' : 'Attente'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Pas de témoignages récents
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raccourcis Bas de Page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <Link href="/admin/subscribers" className="block">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Inbox className="w-6 h-6 text-teal-700" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">Contacts / Abonnés</p>
                <p className="text-xs text-gray-500 truncate">Voir les messages</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
            </div>
          </div>
        </Link>

        <Link href="/admin/testimonials" className="block">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-rose-600" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">Témoignages</p>
                <p className="text-xs text-gray-500 truncate">Approuver & publier</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
            </div>
          </div>
        </Link>

        <Link href="/admin/blog" className="block">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">Blog</p>
                <p className="text-xs text-gray-500 truncate">Rédiger des articles</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
            </div>
          </div>
        </Link>

        <Link href="/admin/cancers" className="block">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Dna className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">Types de Cancer</p>
                <p className="text-xs text-gray-500 truncate">Gérer les fiches</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
            </div>
          </div>
        </Link>

        <Link href="/admin/eventRegistration" className="block">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">Participants Événements</p>
                <p className="text-xs text-gray-500 truncate">Inscriptions reçues</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}