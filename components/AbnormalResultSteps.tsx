'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AccItem {
  id: string;
  title: string;
  body: string;
  position: number;
}

export default function AbnormalResultSteps() {
  const [items, setItems] = useState<AccItem[]>([]);
  const [openId, setOpenId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/site-content', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Impossible de charger cette section.');
        const resultSteps = Array.isArray(data.resultSteps) ? data.resultSteps as AccItem[] : [];
        setItems(resultSteps);
        setOpenId(resultSteps[0]?.id || '');
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger cette section.');
      });
  }, []);

  return (
    <section id="apres-resultat" style={{ padding: '64px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.5fr)', gap: 40, alignItems: 'start' }}
          className="result-grid">

          {/* Colonne rassurante */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              padding: 28,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="section-kicker">Anticiper sereinement</span>
            <h2 style={{ fontSize: 26, marginBottom: 12, color: 'var(--ink)', fontFamily: 'var(--font-fraunces), Fraunces, serif', fontWeight: 500 }}>
              Résultat atypique ou anormal : et après ?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              Comprendre le déroulement des examens de contrôle permet d&apos;aborder la suite plus sereinement, quel que soit le
              type de dépistage effectué.
            </p>

            {/* Bannière rassurante */}
            <div
              style={{
                background: 'var(--teal-light)',
                borderLeft: '4px solid var(--teal)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 18px',
                margin: '20px 0',
              }}
            >
              <strong
                style={{
                  display: 'block',
                  fontSize: 18,
                  color: 'var(--teal-deep)',
                  fontFamily: 'var(--font-fraunces), Fraunces, serif',
                  marginBottom: 4,
                  fontWeight: 600,
                }}
              >
                8 anomalies sur 10 sont bénignes
              </strong>
              <p style={{ fontSize: 13, margin: 0, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                La grande majorité des images nécessitant un contrôle complémentaire s&apos;avèrent être de simples kystes
                liquides ou des modifications bénignes sans danger.
              </p>
            </div>

            <Link href="#ecoute" className="btn btn-clay" style={{ width: '100%', justifyContent: 'center' }}>
              Échanger avec notre équipe d&apos;écoute
            </Link>
          </div>

          {/* Accordéon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
            {!error && items.map((item, i) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="acc-item"
                  data-open={String(isOpen)}
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${isOpen ? 'var(--clay)' : 'var(--line)'}`,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    transition: 'var(--transition)',
                  }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? '' : item.id)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-fraunces), Fraunces, serif',
                          fontSize: 16,
                          fontWeight: 700,
                          color: isOpen ? '#fff' : 'var(--clay)',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          background: isOpen ? 'var(--clay)' : 'var(--clay-soft)',
                          flexShrink: 0,
                          transition: 'var(--transition)',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          fontFamily: 'var(--font-fraunces), Fraunces, serif',
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span
                      className="acc-indicator"
                      style={{
                        fontSize: 12,
                        color: isOpen ? 'var(--clay)' : 'var(--ink-soft)',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? 280 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.28s ease-out',
                    }}
                  >
                    <div
                      style={{
                        padding: '0 20px 20px 62px',
                        fontSize: 14.5,
                        color: 'var(--ink-secondary)',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .result-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}