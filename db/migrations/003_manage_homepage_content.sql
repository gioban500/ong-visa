BEGIN;

CREATE TABLE IF NOT EXISTS refonte_topics (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  signs TEXT NOT NULL DEFAULT '',
  exams TEXT NOT NULL DEFAULT '',
  togo TEXT NOT NULL DEFAULT '',
  button_text TEXT NOT NULL DEFAULT '',
  button_link TEXT NOT NULL DEFAULT '#ecoute',
  position INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refonte_question_responses (
  id UUID PRIMARY KEY,
  badge TEXT NOT NULL DEFAULT '',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  meta TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS refonte_topics_active_position_idx
  ON refonte_topics (active, position);
CREATE INDEX IF NOT EXISTS refonte_question_responses_published_position_idx
  ON refonte_question_responses (published, position);

INSERT INTO refonte_topics
  (id, slug, category, title, summary, signs, exams, togo, button_text, button_link, position)
VALUES
  (
    md5('homepage-topic:sein')::uuid,
    'sein',
    'Gynécologie / Sénologie',
    'Sein & Aisselles',
    'Recherche de nodules fermes indolores, écoulements anormaux par le mamelon ou rétractions de la peau. L''observation régulière du corps permet de repérer un changement récent et d''intervenir précocement.',
    'Apparition d''une petite boule dure non douloureuse, épaississement localisé de la peau (aspect peau d''orange), rétraction du mamelon ou ganglion inhabituel sous l''aisselle.',
    'Autopalpation mensuelle dès 25 ans. Examen clinique annuel par sage-femme ou médecin. Mammographie numérique tous les 2 ans entre 45-50 ans et 74 ans (plus précoce si antécédents familiaux).',
    'Séances de sensibilisation communautaire, apprentissage guidé de l''autopalpation dans les marchés et dispensaires, et orientation vers les plateaux d''imagerie de Lomé et des chefs-lieux de région.',
    'Apprendre les gestes d''autopalpation',
    '#autopalpation',
    0
  ),
  (
    md5('homepage-topic:col')::uuid,
    'col',
    'Gynécologie',
    'Col de l''utérus & HPV',
    'Le cancer du col de l''utérus se développe très lentement à partir de lésions précancéreuses causées par le papillomavirus (HPV). Un dépistage précoce permet d''agir des années avant le stade de cancer.',
    'Saignements inhabituels après les rapports sexuels ou entre les cycles menstruels, pertes vaginales anormales persistantes, douleurs pelviennes inexpliquées.',
    'Test HPV ou frottis cervico-utérin tous les 3 à 5 ans de 25 à 65 ans. Méthode visuelle VIA-VILI (acide acétique / lugol) très accessible en centre de santé.',
    'Campagnes de dépistage mobile VIA-VILI organisées par l''ONG VISA dans les dispensaires de quartier et sensibilisation active à la vaccination des jeunes filles.',
    'Voir les étapes après un dépistage',
    '#apres-resultat',
    1
  ),
  (
    md5('homepage-topic:ovaires')::uuid,
    'ovaires',
    'Gynécologie',
    'Ovaires & Pelvis',
    'Les ovaires ne bénéficient pas d''un dépistage systématique par imagerie de masse. La meilleure approche repose sur l''attention bienveillante portée aux signaux chroniques inhabituels.',
    'Ballonnements abdominaux permanents, sensation de pesanteur pelvienne, satiété rapide inexpliquée aux repas, besoins urinaires pressants et répétés durant plus de 3 semaines.',
    'Échographie pelvienne endovaginale prescrite par le soignant et dosage sanguin du marqueur CA-125 en cas de suspicion clinique.',
    'Formation des agents de santé communautaire pour orienter rapidement les femmes présentant ces symptômes persistants vers les services gynécologiques de référence.',
    'Écrire confidentiellement à une soignante',
    '#ecoute',
    2
  ),
  (
    md5('homepage-topic:endometre')::uuid,
    'endometre',
    'Utérus',
    'Endomètre & Corps utérin',
    'L''endomètre est la muqueuse qui tapisse l''intérieur de l''utérus. La vigilance concerne particulièrement toute reprise de saignements après la ménopause.',
    'Tout saignement gynécologique apparaissant après la ménopause (même minime ou rosé), ou des règles anormalement abondantes et irrégulières en période de périménopause.',
    'Échographie pelvienne par voie vaginale pour mesurer l''épaisseur de l''endomètre, complétée si nécessaire par une biopsie ambulatoire douce en consultation.',
    'Prise en charge et orientation au CHU Sylvanus Olympio et dans les polycliniques partenaires pour une exploration rapide.',
    'Consulter un centre partenaire',
    '#centres',
    3
  ),
  (
    md5('homepage-topic:ganglions')::uuid,
    'ganglions',
    'Prévention globale',
    'Signes généraux & Ganglions',
    'La surveillance de l''état général et du système lymphatique (aisselles, clavicules, aines) participe à un suivi gynécologique rigoureux et complet.',
    'Perte de poids involontaire, fatigue marquée inexpliquée, sueurs nocturnes abondantes ou présence d''un ganglion gonflé et ferme durant plus de 3 à 4 semaines.',
    'Palpation médicale complète des aires ganglionnaires lors du bilan annuel, complétée au besoin par un bilan sanguin général et une échographie ganglionnaire.',
    'Consultations de médecine générale et d''orientation intégrées aux caravanes de santé de l''ONG VISA.',
    'Prendre contact avec l''équipe',
    '#ecoute',
    4
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO refonte_question_responses
  (id, badge, question, answer, meta, position)
VALUES
  (
    md5('question-response:mammographie')::uuid,
    'Sein · Mammographie',
    'Est-ce que la mammographie fait mal ?',
    '« Une brève pression pendant quelques secondes par cliché, pas une douleur tenace. La manipulatrice au CHU m''a expliqué chaque geste avec douceur. J''ai eu bien plus d''appréhension avant d''entrer que pendant l''examen lui-même. »',
    'Akosiwa, 42 ans · Lomé (Dépistage de contrôle)',
    0
  ),
  (
    md5('question-response:frottis')::uuid,
    'Col de l''Utérus & HPV',
    'Un frottis anormal signifie-t-il un cancer ?',
    '« Absolument pas ! Mon frottis a révélé des lésions légères dues au virus HPV. La sage-femme m''a rassurée : un traitement local simple a suffi pour tout éliminer avant même que cela ne devienne dangereux. »',
    'Delphine, 34 ans · Atakpamé (Dépistage col)',
    1
  ),
  (
    md5('question-response:ovaires')::uuid,
    'Ovaires & Pelvis',
    'Quels ont été les signes pour mes ovaires ?',
    '« Des ballonnements et une sensation de pesanteur pelvienne qui persistaient depuis plus d''un mois. En consultant rapidement, l''échographie a permis une prise en charge précoce et très rassurante avec l''ONG VISA. »',
    'Ama, 51 ans · Kpalimé (Vigilance & écoute du corps)',
    2
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
