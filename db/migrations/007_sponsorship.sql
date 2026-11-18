BEGIN;

CREATE TABLE IF NOT EXISTS refonte_sponsorable_people (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  total_cost NUMERIC(14, 0) NOT NULL CHECK (total_cost > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refonte_sponsorable_people_active_idx
  ON refonte_sponsorable_people (active, created_at DESC);

CREATE TABLE IF NOT EXISTS refonte_sponsors (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refonte_sponsorships (
  id UUID PRIMARY KEY,
  sponsor_id UUID NOT NULL REFERENCES refonte_sponsors (id) ON DELETE RESTRICT,
  person_id UUID NOT NULL REFERENCES refonte_sponsorable_people (id) ON DELETE RESTRICT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sponsor_id, person_id)
);
CREATE INDEX IF NOT EXISTS refonte_sponsorships_person_idx
  ON refonte_sponsorships (person_id, started_at DESC);

CREATE TABLE IF NOT EXISTS refonte_sponsorship_payments (
  id UUID PRIMARY KEY,
  sponsorship_id UUID NOT NULL REFERENCES refonte_sponsorships (id) ON DELETE RESTRICT,
  amount NUMERIC(14, 0) NOT NULL CHECK (amount > 0),
  recorded_by_admin_id UUID REFERENCES refonte_admins (id) ON DELETE SET NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refonte_sponsorship_payments_sponsorship_idx
  ON refonte_sponsorship_payments (sponsorship_id, recorded_at DESC);

COMMIT;
