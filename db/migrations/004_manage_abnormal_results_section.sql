BEGIN;

DROP TABLE IF EXISTS refonte_autopalpation_faq;

CREATE TABLE IF NOT EXISTS refonte_abnormal_result_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  kicker TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  intro TEXT NOT NULL DEFAULT '',
  reassurance_title TEXT NOT NULL DEFAULT '',
  reassurance_body TEXT NOT NULL DEFAULT '',
  button_text TEXT NOT NULL DEFAULT '',
  button_link TEXT NOT NULL DEFAULT '#ecoute',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refonte_abnormal_result_steps (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS refonte_abnormal_result_steps_active_position_idx
  ON refonte_abnormal_result_steps (active, position);

INSERT INTO refonte_abnormal_result_settings
  (id, kicker, title, intro, reassurance_title, reassurance_body, button_text, button_link)
VALUES
  (
    1,
    'Anticiper sereinement',
    'Résultat atypique ou anormal : et après ?',
    'Comprendre le déroulement des examens de contrôle permet d''aborder la suite plus sereinement, quel que soit le type de dépistage effectué.',
    '8 anomalies sur 10 sont bénignes',
    'La grande majorité des images nécessitant un contrôle complémentaire s''avèrent être de simples kystes liquides ou des modifications bénignes sans danger.',
    'Échanger avec notre équipe d''écoute',
    '#ecoute'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO refonte_abnormal_result_steps (id, title, body, position)
VALUES
  (
    md5('abnormal-result-step:waiting')::uuid,
    'L''attente des résultats et le délai',
    'Recevoir un compte-rendu après plusieurs jours est habituel et ne présage en rien de la gravité. Ce délai correspond au temps technique de lecture, à la double analyse des clichés par deux radiologues ou à la fixation des prélèvements en laboratoire.',
    0
  ),
  (
    md5('abnormal-result-step:additional-exam')::uuid,
    'Un examen complémentaire est demandé',
    'C''est la situation la plus fréquente. Une échographie mammaire ciblée, un frottis de contrôle ou une colposcopie ne signifient pas la présence d''un cancer : ils permettent simplement de préciser la nature exacte de l''image vue au dépistage initial.',
    1
  ),
  (
    md5('abnormal-result-step:consultation')::uuid,
    'Consultation et échange avec le soignant',
    'Le médecin traitant ou la sage-femme vous expose les conclusions. Notez toutes vos interrogations sur un carnet avant le rendez-vous. N''hésitez pas à venir accompagnée d''une personne de confiance pour vous sentir soutenue.',
    2
  ),
  (
    md5('abnormal-result-step:treatment')::uuid,
    'Si un traitement s''impose : un parcours collégial',
    'Si une anomalie avérée nécessite des soins, la décision n''est jamais prise par un soignant isolé, mais lors d''une Réunion de Concertation Pluridisciplinaire (RCP). Les traitements actuels offrent d''excellents taux de guérison et l''ONG VISA vous accompagne à chaque étape.',
    3
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
