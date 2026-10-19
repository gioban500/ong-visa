'use client';

import { useEffect, useState } from 'react';

interface Testimonial {
  id: string;
  badge: string;
  question: string;
  answer: string;
  meta: string;
}

export default function QuestionTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/site-content', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Impossible de charger les réponses.');
        setTestimonials(Array.isArray(data.questionResponses) ? data.questionResponses : []);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les réponses.');
      });
  }, []);

  return (
    <section
      id="temoignages"
      style={{ padding: '64px 0', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)' }}
    >
      <div className="wrap">
        {/* En-tête */}
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span className="section-kicker">Voix de sororité &amp; de résilience</span>
          <h2 className="section-title">Des réponses concrètes à vos questions</h2>
          <p className="section-intro">
            Retours d&apos;expérience et explications pratiques selon les situations vécues sur le terrain.
          </p>
        </div>

        {/* Grille 3 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 20 }} className="testim-grid">
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: 24,
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    color: 'var(--teal)',
                    background: 'var(--teal-light)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-block',
                    marginBottom: 12,
                  }}
                >
                  {t.badge}
                </span>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: 12,
                    lineHeight: 1.35,
                    fontFamily: 'var(--font-fraunces), Fraunces, serif',
                  }}
                >
                  {t.question}
                </h3>
                <div
                  style={{
                    fontSize: 14,
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 16,
                    borderTop: '1px solid var(--line)',
                    paddingTop: 12,
                  }}
                >
                  {t.answer}
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 500 }}>{t.meta}</div>
            </div>
          ))}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {!error && testimonials.length === 0 && (
            <p role="status" className="text-sm">Aucune réponse n’est actuellement publiée.</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .testim-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}