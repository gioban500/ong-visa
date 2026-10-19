BEGIN;

CREATE TABLE IF NOT EXISTS refonte_rate_limits (
  bucket_key TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count > 0),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS refonte_rate_limits_expires_at_idx
  ON refonte_rate_limits (expires_at);

COMMIT;
