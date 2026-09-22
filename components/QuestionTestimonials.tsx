'use client';

interface Testimonial {
  badge: string;
  question: string;
  answer: string;
  meta: string;
}

const testimonials: Testimonial[] = [
  {
    badge: 'Sein · Mammographie',
    question: 'Est-ce que la mammographie fait mal ?',
    answer:
      "« Une brève pression pendant quelques secondes par cliché, pas une douleur tenace. La manipulatrice au CHU m'a expliqué chaque geste avec douceur. J'ai eu bien plus d'appréhension avant d'entrer que pendant l'examen lui-même. »",
    meta: 'Akosiwa, 42 ans · Lomé (Dépistage de contrôle)',
  },
  {
    badge: "Col de l'Utérus & HPV",
    question: 'Un frottis anormal signifie-t-il un cancer ?',
    answer:
      "« Absolument pas ! Mon frottis a révélé des lésions légères dues au virus HPV. La sage-femme m'a rassurée : un traitement local simple a suffi pour tout éliminer avant même que cela ne devienne dangereux. »",
    meta: 'Delphine, 34 ans · Atakpamé (Dépistage col)',
  },
  {
    badge: 'Ovaires & Pelvis',
    question: 'Quels ont été les signes pour mes ovaires ?',
    answer:
      "« Des ballonnements et une sensation de pesanteur pelvienne qui persistaient depuis plus d'un mois. En consultant rapidement, l'échographie a permis une prise en charge précoce et très rassurante avec l'ONG VISA. »",
    meta: 'Ama, 51 ans · Kpalimé (Vigilance & écoute du corps)',
  },
];

export default function QuestionTestimonials() {
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
            Retours d'expérience et explications pratiques selon les situations vécues sur le terrain.
          </p>
        </div>

        {/* Grille 3 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 20 }} className="testim-grid">
          {testimonials.map((t, i) => (
            <div
              key={i}
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