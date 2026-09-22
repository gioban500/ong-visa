'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AccItem {
  num: number;
  title: string;
  body: string;
}

const items: AccItem[] = [
  {
    num: 1,
    title: "L'attente des résultats et le délai",
    body: "Recevoir un compte-rendu après plusieurs jours est habituel et ne présage en rien de la gravité. Ce délai correspond au temps technique de lecture, à la double analyse des clichés par deux radiologues ou à la fixation des prélèvements en laboratoire.",
  },
  {
    num: 2,
    title: 'Un examen complémentaire est demandé',
    body: "C'est la situation la plus fréquente. Une échographie mammaire ciblée, un frottis de contrôle ou une colposcopie ne signifient pas la présence d'un cancer : ils permettent simplement de préciser la nature exacte de l'image vue au dépistage initial.",
  },
  {
    num: 3,
    title: 'Consultation et échange avec le soignant',
    body: "Le médecin traitant ou la sage-femme vous expose les conclusions. Notez toutes vos interrogations sur un carnet avant le rendez-vous. N'hésitez pas à venir accompagnée d'une personne de confiance pour vous sentir soutenue.",
  },
  {
    num: 4,
    title: "Si un traitement s'impose : un parcours collégial",
    body: "Si une anomalie avérée nécessite des soins, la décision n'est jamais prise par un soignant isolé, mais lors d'une Réunion de Concertation Pluridisciplinaire (RCP). Les traitements actuels offrent d'excellents taux de guérison et l'ONG VISA vous accompagne à chaque étape.",
  },
];

export default function AbnormalResultSteps() {
  const [openIndex, setOpenIndex] = useState(0);

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
              Comprendre le déroulement des examens de contrôle permet d'aborder la suite plus sereinement, quel que soit le
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
                La grande majorité des images nécessitant un contrôle complémentaire s'avèrent être de simples kystes
                liquides ou des modifications bénignes sans danger.
              </p>
            </div>

            <Link href="#ecoute" className="btn btn-clay" style={{ width: '100%', justifyContent: 'center' }}>
              Échanger avec notre équipe d'écoute
            </Link>
          </div>

          {/* Accordéon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.num}
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
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
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
                        {item.num}
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