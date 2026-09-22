'use client';

import { useState } from 'react';
import Link from 'next/link';

type ZoneKey = 'sein' | 'col' | 'ovaires' | 'endometre' | 'ganglions';

interface ZoneDetail {
  category: string;
  title: string;
  summary: string;
  signs: string;
  exams: string;
  togo: string;
  btnText: string;
  btnLink: string;
}

const zoneData: Record<ZoneKey, ZoneDetail> = {
  sein: {
    category: 'Gynécologie / Sénologie',
    title: 'Sein & Aisselles',
    summary:
      "Recherche de nodules fermes indolores, écoulements anormaux par le mamelon ou rétractions de la peau. L'observation régulière du corps permet de repérer un changement récent et d'intervenir précocement.",
    signs:
      "Apparition d'une petite boule dure non douloureuse, épaississement localisé de la peau (aspect peau d'orange), rétraction du mamelon ou ganglion inhabituel sous l'aisselle.",
    exams:
      'Autopalpation mensuelle dès 25 ans. Examen clinique annuel par sage-femme ou médecin. Mammographie numérique tous les 2 ans entre 45-50 ans et 74 ans (plus précoce si antécédents familiaux).',
    togo:
      "Séances de sensibilisation communautaire, apprentissage guidé de l'autopalpation dans les marchés et dispensaires, et orientation vers les plateaux d'imagerie de Lomé et des chefs-lieux de région.",
    btnText: "Apprendre les gestes d'autopalpation",
    btnLink: '#autopalpation',
  },
  col: {
    category: 'Gynécologie',
    title: "Col de l'utérus & HPV",
    summary:
      "Le cancer du col de l'utérus se développe très lentement à partir de lésions précancéreuses causées par le papillomavirus (HPV). Un dépistage précoce permet d'agir des années avant le stade de cancer.",
    signs:
      'Saignements inhabituels après les rapports sexuels ou entre les cycles menstruels, pertes vaginales anormales persistantes, douleurs pelviennes inexpliquées.',
    exams:
      'Test HPV ou frottis cervico-utérin tous les 3 à 5 ans de 25 à 65 ans. Méthode visuelle VIA-VILI (acide acétique / lugol) très accessible en centre de santé.',
    togo:
      "Campagnes de dépistage mobile VIA-VILI organisées par l'ONG VISA dans les dispensaires de quartier et sensibilisation active à la vaccination des jeunes filles.",
    btnText: 'Voir les étapes après un dépistage',
    btnLink: '#apres-resultat',
  },
  ovaires: {
    category: 'Gynécologie',
    title: 'Ovaires & Pelvis',
    summary:
      "Les ovaires ne bénéficient pas d'un dépistage systématique par imagerie de masse. La meilleure approche repose sur l'attention bienveillante portée aux signaux chroniques inhabituels.",
    signs:
      'Ballonnements abdominaux permanents, sensation de pesanteur pelvienne, satiété rapide inexpliquée aux repas, besoins urinaires pressants et répétés durant plus de 3 semaines.',
    exams:
      'Échographie pelvienne endovaginale prescrite par le soignant et dosage sanguin du marqueur CA-125 en cas de suspicion clinique.',
    togo:
      'Formation des agents de santé communautaire pour orienter rapidement les femmes présentant ces symptômes persistants vers les services gynécologiques de référence.',
    btnText: 'Écrire confidentiellement à une soignante',
    btnLink: '#ecoute',
  },
  endometre: {
    category: 'Utérus',
    title: 'Endomètre & Corps utérin',
    summary:
      "L'endomètre est la muqueuse qui tapisse l'intérieur de l'utérus. La vigilance concerne particulièrement toute reprise de saignements après la ménopause.",
    signs:
      'Tout saignement gynécologique apparaissant après la ménopause (même minime ou rosé), ou des règles anormalement abondantes et irrégulières en période de périménopause.',
    exams:
      "Échographie pelvienne par voie vaginale pour mesurer l'épaisseur de l'endomètre, complétée si nécessaire par une biopsie ambulatoire douce en consultation.",
    togo:
      'Prise en charge et orientation au CHU Sylvanus Olympio et dans les polycliniques partenaires pour une exploration rapide.',
    btnText: 'Consulter un centre partenaire',
    btnLink: '#centres',
  },
  ganglions: {
    category: 'Prévention globale',
    title: 'Signes généraux & Ganglions',
    summary:
      "La surveillance de l'état général et du système lymphatique (aisselles, clavicules, aines) participe à un suivi gynécologique rigoureux et complet.",
    signs:
      "Perte de poids involontaire, fatigue marquée inexpliquée, sueurs nocturnes abondantes ou présence d'un ganglion gonflé et ferme durant plus de 3 à 4 semaines.",
    exams:
      'Palpation médicale complète des aires ganglionnaires lors du bilan annuel, complétée au besoin par un bilan sanguin général et une échographie ganglionnaire.',
    togo:
      "Consultations de médecine générale et d'orientation intégrées aux caravanes de santé de l'ONG VISA.",
    btnText: "Prendre contact avec l'équipe",
    btnLink: '#ecoute',
  },
};

const zoneKeys: ZoneKey[] = ['sein', 'col', 'ovaires', 'endometre', 'ganglions'];

export default function AnatomyExplorer() {
  const [activeKey, setActiveKey] = useState<ZoneKey>('sein');
  const zone = zoneData[activeKey];

  return (
    <section id="cancers-surveilles" style={{ padding: '64px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        {/* En-tête */}
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span className="section-kicker">Pédagogie médicale simplifiée</span>
          <h2 className="section-title">Mieux comprendre chaque zone sans jargon</h2>
          <p className="section-intro">
            Cliquez sur un organe ou une catégorie pour afficher les signes d'alerte spécifiques et les examens de contrôle
            associés.
          </p>
        </div>

        {/* Layout 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.25fr)', gap: 32, alignItems: 'start' }}
          className="lg-two-col">

          {/* Colonne gauche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {zoneKeys.map((key) => {
                const isActive = activeKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveKey(key)}
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
                      {zoneData[key].category}
                    </span>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{zoneData[key].title}</span>
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
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VvyqSMwzbYdFFxcj19F_kUnXMi2eF14PeChiPQBgSGKnEWtadgtah8b6QYKmVhupYpHOPhTUaYvKkz4LpkvjsgXYY0IPg9y53pShZfKah-0U9HnUdUbissE74_ezVx_OjcoxhYqK42o5mn2hVil_-82acr__iDVL-P6QGFfMsEgG3VBnBLFhaPaoz6hMorEa1syzNKfEpT6u_BoTb1vZZcv3aMbYQzFYHLKjf9MuFR"
                  alt="Schéma anatomique silhouette féminine éducative"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }}
                />
                {([
                  { key: 'sein', top: '36%', left: '44%', num: 1 },
                  { key: 'col', top: '84%', left: '50%', num: 2 },
                  { key: 'ovaires', top: '72%', left: '34%', num: 3 },
                  { key: 'endometre', top: '76%', left: '66%', num: 4 },
                ] as { key: ZoneKey; top: string; left: string; num: number }[]).map((pin) => (
                  <button
                    key={pin.key}
                    onClick={() => setActiveKey(pin.key)}
                    style={{
                      position: 'absolute',
                      top: pin.top,
                      left: pin.left,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: activeKey === pin.key ? 'var(--clay)' : 'var(--teal)',
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
                      transform: activeKey === pin.key
                        ? 'translate(-50%, -50%) scale(1.2)'
                        : 'translate(-50%, -50%)',
                    }}
                  >
                    {pin.num}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 8 }}>Repères numérotés interactifs</span>
            </div>
          </div>

          {/* Colonne droite — panneau médical */}
          <div
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
                  Signes d'appel à observer (sans panique)
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
                  Au Togo avec l'ONG VISA
                </h4>
                <p style={{ fontSize: 13.5, margin: 0, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>{zone.togo}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href={zone.btnLink} className="btn btn-clay">{zone.btnText}</Link>
              <Link href="#centres" className="btn btn-outline">Voir les centres d'imagerie</Link>
            </div>
          </div>
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