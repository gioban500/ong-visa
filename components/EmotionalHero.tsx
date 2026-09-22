'use client';

import { useState } from 'react';
import Link from 'next/link';

type TopicKey = 'all' | 'sein' | 'col' | 'ovaires' | 'endometre';

interface SummaryCard {
  id: string;
  cat: TopicKey;
  accent: 'clay' | 'teal';
  tag: string;
  title: string;
  desc: string;
}

const cards: SummaryCard[] = [
  {
    id: 'sein',
    cat: 'sein',
    accent: 'clay',
    tag: 'Sein',
    title: 'Mammographie & Autopalpation',
    desc: "Repérer une bosse, un changement de peau ou du mamelon. Examen recommandé dès 25 ans (autopalpation) et dès 45-50 ans (mammographie régulière).",
  },
  {
    id: 'col',
    cat: 'col',
    accent: 'teal',
    tag: "Col de l'Utérus",
    title: 'Frottis & Test HPV / VIA-VILI',
    desc: 'Dépistage préventif essentiel de 25 à 65 ans pour éliminer les lésions précancéreuses bien avant toute évolution maligne.',
  },
  {
    id: 'ovaires',
    cat: 'ovaires',
    accent: 'clay',
    tag: 'Ovaires & Pelvis',
    title: 'Écoute des signaux & Échographie',
    desc: 'Ballonnements persistants (> 3 semaines), pesanteur pelvienne inexpliquée, satiété précoce à signaler lors du contrôle gynécologique.',
  },
  {
    id: 'endometre',
    cat: 'endometre',
    accent: 'teal',
    tag: 'Endomètre',
    title: 'Surveillance des saignements',
    desc: "Tout saignement inhabituel après la ménopause ou en dehors des cycles menstruels doit motiver une échographie pelvienne rapide.",
  },
];

const topics = [
  { key: 'all', label: "Vue d'ensemble" },
  { key: 'sein', label: 'Cancer du Sein' },
  { key: 'col', label: "Col de l'Utérus & HPV" },
  { key: 'ovaires', label: 'Ovaires & Pelvis' },
  { key: 'endometre', label: 'Endomètre & Corps utérin' },
];

export default function EmotionalHero() {
  const [active, setActive] = useState<TopicKey>('all');
  const visible = cards.filter((c) => active === 'all' || c.cat === active);

  return (
    <section
      id="hero"
      style={{
        padding: '48px 0 56px',
        background:
          'radial-gradient(circle at 85% 20%, rgba(158,47,85,0.04) 0%, transparent 60%), radial-gradient(circle at 15% 85%, rgba(31,90,86,0.04) 0%, transparent 50%), var(--bg)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="wrap">
        {/* Pré-titre */}
        <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 10, letterSpacing: '0.3px' }}>
          ONG VISA · Dépistage, sensibilisation &amp; accompagnement face aux cancers
        </p>

        {/* H1 */}
        <h1
          style={{
            fontSize: 'clamp(30px, 5vw, 42px)',
            letterSpacing: '-0.6px',
            marginBottom: 14,
            fontWeight: 600,
            color: 'var(--ink)',
            maxWidth: '24ch',
          }}
        >
          Qu'est-ce qui vous amène aujourd'hui ?
        </h1>
        <p style={{ fontSize: 17, maxWidth: '68ch', color: 'var(--ink-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          Un espace d'écoute et d'information pour tous les cancers féminins. Choisissez votre situation ou explorez les
          repères médicaux essentiels au Togo :
        </p>

        {/* Sélecteur de sujet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Sujet concerné :</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {topics.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key as TopicKey)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: active === t.key ? 'var(--teal)' : 'var(--surface)',
                  border: `1px solid ${active === t.key ? 'var(--teal)' : 'var(--line)'}`,
                  fontSize: 13,
                  fontWeight: 600,
                  color: active === t.key ? '#fff' : 'var(--ink-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  fontFamily: 'inherit',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de synthèse */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}
        >
          {visible.map((card) => (
            <div
              key={card.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderTop: `3px solid ${card.accent === 'clay' ? 'var(--clay)' : 'var(--teal)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: 20,
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 160,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    color: card.accent === 'clay' ? 'var(--clay)' : 'var(--teal)',
                    marginBottom: 6,
                  }}
                >
                  {card.tag}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Barre d'action rapide */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            padding: '14px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg fill="none" height={18} stroke="var(--teal)" strokeWidth={2} viewBox="0 0 24 24" width={18}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            Une question sur un dépistage ou un symptôme ?
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="#centres" className="btn btn-clay">
              Trouver un centre partenaire
            </Link>
            <Link href="#ecoute" className="btn btn-white">
              Écrire à une sage-femme
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}