'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CenterItem {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  services: string[];
  badge: string;
  verifiedAt: string | null;
}

export default function LocalCenters() {
  const [centers, setCenters] = useState<CenterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/centers', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Les centres ne peuvent pas être chargés pour le moment.');
        const data = await response.json();
        setCenters(Array.isArray(data) ? data : []);
      })
      .catch((fetchError: unknown) => {
        setError(fetchError instanceof Error ? fetchError.message : 'Erreur de chargement des centres.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="centres" style={{ padding: '64px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        {/* En-tête */}
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span className="section-kicker">Proximité &amp; Réseau solidaire</span>
          <h2 className="section-title">Où consulter et réaliser ses dépistages au Togo</h2>
          <p className="section-intro">
              Centres de santé partenaires et points d&apos;accueil accompagnés par l&apos;ONG VISA.
          </p>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 20, marginBottom: 40 }}
          className="centres-grid"
        >
          {centers.map((c) => (
            <div
              key={c.id}
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
                <h3
                  style={{
                    fontFamily: 'var(--font-fraunces), Fraunces, serif',
                    fontSize: 18,
                    marginBottom: 6,
                    color: 'var(--ink)',
                    fontWeight: 600,
                  }}
                >
                  {c.name}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600, marginBottom: 10 }}>
                  {c.services.length ? c.services.join(', ') : 'Services à confirmer auprès du centre'}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                  {[c.address, c.city].filter(Boolean).join(', ')}
                </div>
                {c.phone && <a href={`tel:${c.phone}`} className="block text-sm underline mb-1">{c.phone}</a>}
                {c.email && <a href={`mailto:${c.email}`} className="block text-sm underline mb-3">{c.email}</a>}
                {c.verifiedAt && (
                  <p className="text-xs text-gray-500 mb-3">
                    Informations vérifiées le {new Date(c.verifiedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--clay)',
                  background: 'var(--clay-soft)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  alignSelf: 'flex-start',
                }}
              >
                {c.badge || 'Centre référencé'}
              </span>
            </div>
          ))}
          {loading && <p className="text-sm">Chargement des centres…</p>}
          {!loading && !error && centers.length === 0 && (
            <p className="text-sm" role="status">Aucun centre n’est actuellement référencé. Les informations seront ajoutées après vérification par l&apos;ONG VISA.</p>
          )}
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        </div>

        {/* Bannière don */}
        <div
          id="don"
          style={{
            background: 'var(--clay)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            padding: '32px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Campagne Solidaire ONG VISA
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-fraunces), Fraunces, serif',
                fontSize: 22,
                color: '#fff',
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              Chaque don permet de dépister et sauver des vies
            </h3>
            <p style={{ color: '#F8D6E1', fontSize: 14.5, maxWidth: '52ch', margin: 0, lineHeight: 1.6 }}>
              Grâce à votre soutien, l&apos;ONG VISA finance les réactifs de dépistage par acide acétique et transporte les
              femmes isolées vers les centres d&apos;imagerie.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/donation" className="btn btn-white">
              Faire un don solidaire
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}>
              Devenir bénévole
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .centres-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}