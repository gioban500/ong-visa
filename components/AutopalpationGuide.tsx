'use client';

import { useState } from 'react';

const steps = [
  {
    badge: 'Repère Mensuel',
    title: '1. Choisir le bon moment',
    desc: "Idéalement quelques jours après la fin des règles pour la poitrine, quand elle est naturellement souple et indolore. Pour une observation générale du corps, fixez une date régulière chaque mois.",
    tip: 'Astuce : associez cette vérification à un repère mensuel simple (ex. le 1er du mois).',
  },
  {
    badge: 'Inspection Visuelle',
    title: '2. Observer devant le miroir',
    desc: "Tenez-vous debout, bras le long du corps puis levés au-dessus de la tête. Scrutez les contours : observez s'il y a un méplat, une fossette, un pli inhabituel, une rougeur ou une rétraction du mamelon.",
    tip: 'Repère : comparez-vous à vous-même au fil des mois, jamais à des modèles extérieurs.',
  },
  {
    badge: 'Palpation Debout',
    title: '3. Palper debout ou sous la douche',
    desc: "Le bras gauche levé, utilisez la pulpe des trois doigts du milieu de la main droite bien à plat. Décrivez de petits cercles réguliers de l'extérieur du sein vers le mamelon avec une pression douce mais ferme.",
    tip: 'Conseil pratique : la peau savonnée facilite la fluidité du toucher et la précision.',
  },
  {
    badge: 'Palpation Allongée',
    title: "4. Palper allongée avec l'aisselle",
    desc: "Allongez-vous confortablement avec un coussin sous l'épaule. Refaites les mouvements circulaires et prolongez l'examen jusque sous l'aisselle et au-dessus de la clavicule pour palper les aires ganglionnaires.",
    tip: 'Bénéfice : la position allongée étale naturellement la glande mammaire pour un examen idéal.',
  },
  {
    badge: 'Garder Raison',
    title: '5. Que retenir et quand consulter ?',
    desc: "La majorité des petites irrégularités sont des variations physiologiques ou de simples kystes. Si une modification persiste après le cycle suivant, signalez-la sans crainte à une sage-femme ou un médecin.",
    tip: "Rappel : l'autopalpation complète l'examen clinique annuel du soignant sans s'y substituer.",
  },
];

export default function AutopalpationGuide() {
  const [cur, setCur] = useState(0);
  const step = steps[cur];
  const progress = ((cur + 1) / steps.length) * 100;

  return (
    <section
      id="autopalpation"
      style={{
        padding: '64px 0',
        background: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="wrap">
        {/* En-tête centré */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 36px' }}>
          <span className="section-kicker">5 minutes · 1 fois par mois</span>
          <h2 className="section-title">Les gestes d'auto-observation, pas à pas</h2>
          <p className="section-intro">
            Cinq minutes une fois par mois suffisent. Prenez l'habitude de surveiller votre corps pour déceler rapidement
            tout changement inhabituel.
          </p>
        </div>

        {/* Corps : 2 colonnes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)',
            gap: 32,
            alignItems: 'start',
            maxWidth: 1060,
            margin: '0 auto',
          }}
          className="apalp-grid"
        >
          {/* Colonne image */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              padding: 16,
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8hays5fZvtA3iZpxvS45fgVNAQbFRRstR-6c1Gj7WRWfQ9SuoVf96xdw-llnqcuekBKsDaBaDtq5RJsiAfafIa4U50I9Sv-RFlgfriBQdb1jVzCmkuWPXIKnMMRvc5t3smWI4FKbmtSkacfYDnFP9QJDEGSpKI_0JZ4e2iR893G5gfT_KL4BVe0J_g-nlre5W-SPfydjA9nYcTmFYVswduQMwt3QydggpZYWBSLji4dJ6iR03ibYUX"
              alt="Octobre rose : Guide officiel de l'auto-palpation des seins pas à pas"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 6,
                display: 'block',
                border: '1px solid var(--line)',
                boxShadow: '0 4px 14px rgba(42,37,33,0.06)',
              }}
            />
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                fontSize: 12,
                color: 'var(--ink-soft)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--teal-deep)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--clay)', display: 'inline-block' }} />
                Infographie didactique de référence
              </span>
              <span>6 étapes clés</span>
            </div>
          </div>

          {/* Colonne guide interactif */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              padding: '32px 36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--clay)', letterSpacing: '0.3px' }}>
                Étape {cur + 1} sur {steps.length}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 5,
                  background: 'var(--bg-raised)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--clay)',
                    transition: 'width 0.25s ease',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
              </div>
            </div>

            {/* Contenu centré */}
            <div
              style={{
                textAlign: 'center',
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 0 20px',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'var(--teal-deep)',
                  background: 'var(--teal-light)',
                  padding: '3px 12px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 12,
                }}
              >
                {step.badge}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-fraunces), Fraunces, serif',
                  fontSize: 24,
                  marginBottom: 12,
                  color: 'var(--ink)',
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: 15.5, maxWidth: '52ch', margin: '0 auto 16px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                {step.desc}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--teal-deep)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 14px',
                }}
              >
                {step.tip}
              </span>
            </div>

            {/* Contrôles */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--line)',
                paddingTop: 20,
              }}
            >
              <button
                onClick={() => setCur((c) => Math.max(0, c - 1))}
                disabled={cur === 0}
                className="btn btn-outline"
                style={{ opacity: cur === 0 ? 0.4 : 1 }}
              >
                ← Précédent
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCur(i)}
                    className={`apalp-dot-btn${i === cur ? ' active' : ''}`}
                    aria-label={`Étape ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCur((c) => (c === steps.length - 1 ? 0 : c + 1))}
                className="btn btn-primary"
              >
                {cur === steps.length - 1 ? 'Recommencer' : 'Étape suivante →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .apalp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}