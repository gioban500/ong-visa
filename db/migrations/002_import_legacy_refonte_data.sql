BEGIN;

ALTER TABLE refonte_centers
  ALTER COLUMN active SET DEFAULT FALSE;

INSERT INTO refonte_contact_messages
  (id, name, email, phone, subject, message, source, status, created_at)
SELECT
  md5('legacy-subscriber:' || s.id)::uuid,
  NULLIF(concat_ws(' ', NULLIF(btrim(s.firstname), ''), NULLIF(btrim(s.lastname), '')), ''),
  NULLIF(lower(btrim(s.email)), ''),
  NULLIF(btrim(s.phone), ''),
  btrim(s.subject),
  btrim(s.message),
  'contact',
  'new',
  CASE
    WHEN s.createdat ~ '^\d{4}-\d{2}-\d{2}T'
      THEN s.createdat::timestamptz
    ELSE NOW()
  END
FROM subscribers AS s
WHERE NULLIF(btrim(s.subject), '') IS NOT NULL
  AND NULLIF(btrim(s.message), '') IS NOT NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO refonte_centers
  (id, name, address, city, services, badge, verified_at, active)
SELECT
  md5('legacy-center:' || center.name)::uuid,
  center.name,
  center.address,
  center.city,
  center.services,
  center.badge,
  NULL,
  FALSE
FROM (VALUES
  (
    'Centre d''Imagerie & CHU Sylvanus Olympio',
    'Quartier Tokoin',
    'Lomé',
    ARRAY['Mammographie numérique', 'sénologie', 'frottis & échographie']::text[],
    'Partenaire ONG VISA'
  ),
  (
    'Cliniques Itinérantes ONG VISA',
    'Tournées périurbaines',
    'Maritime, Plateaux, Kara, Savanes',
    ARRAY['Dépistage mobile gratuit', 'autopalpation', 'frottis VIA-VILI']::text[],
    'Campagnes hebdomadaires'
  ),
  (
    'Dispensaires & Maisons Sage-Femme',
    'Quartiers Bè, Adidogomé, Agoè-Nyivé',
    'Lomé',
    ARRAY['Examen clinique pelvien', 'palpation', 'écoute bienveillante']::text[],
    'Accueil direct'
  )
) AS center(name, address, city, services, badge)
WHERE NOT EXISTS (
  SELECT 1
  FROM refonte_centers AS existing
  WHERE existing.name = center.name
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO refonte_medical_contents
  (id, title, slug, kind, category, body, source, validated_by, validated_at, published)
SELECT
  md5('legacy-cancer:' || cancer.id)::uuid,
  cancer.name,
  CASE cancer.id
    WHEN 'sein' THEN 'cancer-du-sein'
    WHEN 'col-uterus' THEN 'cancer-du-col-de-l-uterus'
    WHEN 'cancer-de-l-ovaire' THEN 'cancer-de-l-ovaire'
    ELSE 'legacy-cancer-' || cancer.id
  END,
  'article',
  'Cancer',
  concat_ws(E'\n\n',
    NULLIF(btrim(cancer.shortdescription), ''),
    NULLIF(btrim(cancer.description), '')
  ),
  '',
  '',
  NULL,
  FALSE
FROM cancers AS cancer
WHERE NULLIF(btrim(cancer.name), '') IS NOT NULL
  AND concat_ws(E'\n\n',
    NULLIF(btrim(cancer.shortdescription), ''),
    NULLIF(btrim(cancer.description), '')
  ) <> ''
ON CONFLICT (slug) DO NOTHING;

COMMIT;
