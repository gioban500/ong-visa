'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Loader2, Mail, MapPin } from 'lucide-react';

interface Summary {
  messages: number;
  newMessages: number;
  centers: number;
  publishedCenters: number;
  topics: number;
  publishedTopics: number;
  questionResponses: number;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/summary', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Impossible de charger le tableau de bord.');
        setSummary(data);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger le tableau de bord.');
      });
  }, []);

  if (error) return <p role="alert" className="rounded bg-red-50 p-4 text-red-700">{error}</p>;
  if (!summary) return <Loader2 className="mx-auto my-16 h-8 w-8 animate-spin text-purple-700" />;

  const cards = [
    { label: 'Messages reçus', value: `${summary.messages} · ${summary.newMessages} nouveaux`, href: '/admin/messages', icon: Mail },
    { label: 'Centres de dépistage', value: `${summary.publishedCenters} publiés sur ${summary.centers}`, href: '/admin/centers', icon: MapPin },
    { label: 'Sections du site', value: `${summary.publishedTopics} sujets · ${summary.questionResponses} réponses · étapes après résultat`, href: '/admin/site-content', icon: BookOpen },
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Administration ONG VISA</h1>
      <p className="mb-8 text-gray-600">Gestion du contenu et des demandes de la version actuelle du site.</p>
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={href} href={href} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Icon className="mb-4 h-7 w-7 text-purple-700" />
            <h2 className="font-semibold text-gray-900">{label}</h2>
            <p className="mt-2 text-sm text-gray-600">{value}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
