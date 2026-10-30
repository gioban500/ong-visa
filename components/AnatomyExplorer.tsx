'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ZoneDetail {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  signs: string;
  exams: string;
  togo: string;
  buttonText: string;
  buttonLink: string;
  position: number;
}

const mapPinPositions = [
  { top: '36%', left: '44%' },
  { top: '84%', left: '50%' },
  { top: '72%', left: '34%' },
  { top: '76%', left: '66%' },
  { top: '61%', left: '50%' },
];

export default function AnatomyExplorer() {
  const [topics, setTopics] = useState<ZoneDetail[]>([]);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/site-content', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Impossible de charger les sujets.');
        const loadedTopics = Array.isArray(data.topics) ? data.topics as ZoneDetail[] : [];
        setTopics(loadedTopics);
        setActiveId(loadedTopics[0]?.id || '');
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les sujets.');
      })
      .finally(() => setLoading(false));
  }, []);

  const zone = topics.find((topic) => topic.id === activeId);

  return (
    <section id="cancers-surveilles" style={{ padding: '64px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        {/* En-tête */}
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span className="section-kicker">Pédagogie médicale simplifiée</span>
          <h2 className="section-title">Mieux comprendre chaque zone sans jargon</h2>
          <p className="section-intro">
            Cliquez sur un organe ou une catégorie pour afficher les signes d&apos;alerte spécifiques et les examens de contrôle
            associés.
          </p>
        </div>

        {/* Layout 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.25fr)', gap: 32, alignItems: 'start' }}
          className="lg-two-col">

          {/* Colonne gauche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topics.map((topic) => {
                const isActive = activeId === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveId(topic.id)}
                    style={{
                      textAlign: 'left',
                      background: isActive ? 'var(--teal-light)' : 'var(--surface)',
                      border: `1px solid ${isActive ? 'var(--teal)' : 'var(--line)'}`,
                      borderLeft: isActive ? '4px solid var(--teal)' : '1px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        color: isActive ? 'var(--teal-deep)' : 'var(--ink-soft)',
                      }}
                    >
                      {topic.category}
                    </span>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{topic.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Schéma anatomique */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ position: 'relative', maxWidth: 260, width: '100%', margin: '0 auto' }}>
                <Image
                  src="/images/anathomie.png"
                  alt="Schéma anatomique silhouette féminine éducative"
                  width={800}
                  height={1100}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }}
                />
                {topics.slice(0, mapPinPositions.length).map((topic, index) => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveId(topic.id)}
                    style={{
                      position: 'absolute',
                      top: mapPinPositions[index].top,
                      left: mapPinPositions[index].left,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: activeId === topic.id ? 'var(--clay)' : 'var(--teal)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      border: '2px solid #fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'inherit',
                      transform: activeId === topic.id
                        ? 'translate(-50%, -50%) scale(1.2)'
                        : 'translate(-50%, -50%)',
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 8 }}>Repères numérotés interactifs</span>
            </div>
          </div>

          {/* Colonne droite — panneau médical */}
          {loading && <p role="status">Chargement des sujets…</p>}
          {error && <p role="alert" className="text-red-700">{error}</p>}
          {!loading && !error && !zone && <p>Aucun sujet n’est actuellement publié.</p>}
          {zone && <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderTop: '4px solid var(--clay)',
              borderRadius: 'var(--radius-sm)',
              padding: 32,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                fontSize: 11.5,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: 'var(--clay)',
                background: 'var(--clay-soft)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                marginBottom: 12,
              }}
            >
              {zone.category}
            </span>
            <h3 style={{ fontSize: 24, marginBottom: 12, color: 'var(--ink)' }}>{zone.title}</h3>
            <p style={{ fontSize: 15, color: 'var(--ink-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              {zone.summary}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {/* Signes */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 18px',
                }}
              >
                <h4 style={{ fontSize: 13.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--ink)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg fill="none" height={15} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={15}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Signes d&apos;appel à observer (sans panique)
                </h4>
                <p style={{ fontSize: 13.5, margin: 0, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>{zone.signs}</p>
              </div>
              {/* Examens */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 18px',
                }}
              >
                <h4 style={{ fontSize: 13.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--ink)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg fill="none" height={15} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={15}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Examens de référence préconisés
                </h4>
                <p style={{ fontSize: 13.5, margin: 0, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>{zone.exams}</p>
              </div>
              {/* Togo */}
              <div
                style={{
                  background: 'var(--teal-light)',
                  border: '1px solid rgba(31,90,86,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 18px',
                }}
              >
                <h4 style={{ fontSize: 13.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--teal-deep)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg fill="none" height={15} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={15}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Au Togo avec l&apos;ONG VISA
                </h4>
                <p style={{ fontSize: 13.5, margin: 0, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>{zone.togo}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href={zone.buttonLink} className="btn btn-clay">{zone.buttonText}</Link>
              <Link href="#centres" className="btn btn-outline">Voir les centres d&apos;imagerie</Link>
              <Link href="/cancers" className="btn btn-clay">En savoir plus</Link>
            </div>
          </div>}
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .lg-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}