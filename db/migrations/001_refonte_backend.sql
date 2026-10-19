CREATE TABLE IF NOT EXISTS refonte_admins (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
  active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refonte_contact_messages (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'contact' CHECK (source IN ('contact', 'listening')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refonte_contact_messages_created_at_idx
  ON refonte_contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS refonte_contact_messages_status_idx
  ON refonte_contact_messages (status);

CREATE TABLE IF NOT EXISTS refonte_centers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  services TEXT[] NOT NULL DEFAULT '{}',
  badge TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  verified_at DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refonte_centers_active_idx ON refonte_centers (active, name);

CREATE TABLE IF NOT EXISTS refonte_medical_contents (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('faq', 'article')),
  category TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  validated_by TEXT NOT NULL DEFAULT '',
  validated_at DATE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refonte_medical_contents_published_idx
  ON refonte_medical_contents (published, kind, category);
