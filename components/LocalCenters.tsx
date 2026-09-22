'use client';

import Link from 'next/link';

interface CenterItem {
  title: string;
  services: string;
  location: string;
  badge: string;
}

const centers: CenterItem[] = [
  {
    title: "Centre d'Imagerie & CHU Sylvanus Olympio",
    services: 'Mammographie numérique, sénologie, frottis & échographie',
    location: '📍 Quartier Tokoin, Lomé (Consultations du lundi au vendredi)',
    badge: 'Partenaire ONG VISA',
  },
  {
    title: 'Cliniques Itinérantes ONG VISA',
    services: 'Dépistage mobile gratuit, autopalpation & frottis VIA-VILI',
    location: '📍 Tournées périurbaines (Maritime, Plateaux, Kara, Savanes)',
    badge: 'Campagnes hebdomadaires',
  },
  {
    title: 'Dispensaires & Maisons Sage-Femme',
    services: 'Examen clinique pelvien, palpation & écoute bienveillante',
    location: '📍 Quartiers Bè, Adidogomé, Agoè-Nyivé (accueil sans RDV)',
    badge: 'Accueil direct',
  },
];

export default function LocalCenters() {
  return (
    <section id="centres" style={{ padding: '64px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        {/* En-tête */}
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span className="section-kicker">Proximité &amp; Réseau solidaire</span>
          <h2 className="section-title">Où consulter et réaliser ses dépistages au Togo</h2>
          <p className="section-intro">
            Centres de santé partenaires et points d'accueil accompagnés par l'ONG VISA.
          </p>
        </div>

        {/* Grille des 3 centres */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 20, marginBottom: 40 }}
          className="centres-grid"
        >
          {centers.map((c, idx) => (
            <div
              key={idx}
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
                  {c.title}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600, marginBottom: 10 }}>
                  {c.services}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                  {c.location}
                </div>
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
                {c.badge}
              </span>
            </div>
          ))}
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
              Grâce à votre soutien, l'ONG VISA finance les réactifs de dépistage par acide acétique et transporte les
              femmes isolées vers les centres d'imagerie.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/donation" className="btn btn-white">
              Faire un don solidaire
            </Link>
            <Link href="#ecoute" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}>
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