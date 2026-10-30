'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  HeartHandshake,
  Loader2,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { getClientData, setClientData } from '@/lib/client-data-cache';

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
  const cacheKey = '/api/admin/summary';
  const [summary, setSummary] = useState<Summary | null>(() => getClientData<Summary>(cacheKey) || null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/summary', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Impossible de charger le tableau de bord.');
        setClientData(cacheKey, data);
        setSummary(data);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger le tableau de bord.');
      });
  }, []);

  if (error) return <p role="alert" className="admin-feedback-error">{error}</p>;
  if (!summary) {
    return (
      <div className="admin-dashboard-loading" role="status" aria-label="Chargement du tableau de bord">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Messages reçus',
      value: summary.messages.toLocaleString('fr-FR'),
      detail: `${summary.newMessages} nouveau${summary.newMessages === 1 ? '' : 'x'} à consulter`,
      href: '/admin/messages',
      icon: Mail,
      accent: 'clay',
    },
    {
      label: 'Centres de dépistage',
      value: summary.publishedCenters.toLocaleString('fr-FR'),
      detail: `sur ${summary.centers} centre${summary.centers === 1 ? '' : 's'} enregistré${summary.centers === 1 ? '' : 's'}`,
      href: '/admin/centers',
      icon: MapPin,
      accent: 'teal',
    },
    {
      label: 'Sujets de prévention',
      value: summary.publishedTopics.toLocaleString('fr-FR'),
      detail: `${summary.questionResponses} réponse${summary.questionResponses === 1 ? '' : 's'} aux questions`,
      href: '/admin/site-content',
      icon: BookOpen,
      accent: 'gold',
    },
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-welcome">
        <div>
          <span className="admin-section-kicker"><Sparkles size={14} /> VOTRE ESPACE VISA</span>
          <h2>Chaque action compte.</h2>
          <p>Merci de faire vivre la prévention, l’écoute et l’accompagnement avec l’équipe ONG VISA.</p>
        </div>
        <div className="admin-welcome-mark" aria-hidden="true">
          <HeartHandshake size={54} strokeWidth={1.2} />
        </div>
      </div>

      <div className="admin-dashboard-section-heading">
        <div>
          <h2>En un coup d’œil</h2>
          <p>Les informations utiles pour suivre votre espace.</p>
        </div>
      </div>

      <div className="admin-summary-grid">
        {cards.map(({ label, value, detail, href, icon: Icon, accent }) => (
          <Link key={href} href={href} className={`admin-summary-card accent-${accent}`}>
            <div className="admin-summary-card-top">
              <span className="admin-summary-icon"><Icon size={20} strokeWidth={1.8} /></span>
              <ArrowUpRight size={18} className="admin-summary-arrow" />
            </div>
            <span className="admin-summary-label">{label}</span>
            <strong className="admin-summary-value">{value}</strong>
            <span className="admin-summary-detail">{detail}</span>
          </Link>
        ))}
      </div>

      <div className="admin-dashboard-next">
        <div className="admin-next-icon"><BookOpen size={22} /></div>
        <div>
          <span className="admin-next-kicker">À FAIRE VIVRE</span>
          <h3>Des contenus clairs, une prévention accessible.</h3>
          <p>Actualisez les sections d’information et les ressources utiles aux visiteurs du site.</p>
        </div>
        <Link href="/admin/site-content" className="admin-next-link">
          Gérer les contenus <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
