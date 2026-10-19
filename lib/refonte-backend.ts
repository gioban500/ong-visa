import { createHmac, randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const SESSION_COOKIE = 'visa_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const SESSION_ISSUER = 'ong-visa';
let schemaCheck: Promise<void> | undefined;
let lastRateLimitCleanup = 0;

export interface SiteTopic {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  signs: string;
  exams: string;
  togo: string;
  buttonText: string;
  buttonLink: string;
  position: number;
  active: boolean;
}

export interface QuestionResponse {
  id: string;
  badge: string;
  question: string;
  answer: string;
  meta: string;
  position: number;
  published: boolean;
}

export interface AbnormalResultStep {
  id: string;
  title: string;
  body: string;
  position: number;
  active: boolean;
}

export type SiteContentCollection = 'topics' | 'questionResponses' | 'resultSteps';

export async function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowSeconds: number,
): Promise<NextResponse | null> {
  try {
    const forwardedAddress = request.headers.get('x-real-ip');
    const address = forwardedAddress?.trim() || (process.env.NODE_ENV === 'development' ? 'local-development' : 'unknown');
    const bucketKey = createHmac('sha256', getSessionSecret())
      .update(`${scope}:${address}`)
      .digest('hex');
    const result = await pool.query(
      `INSERT INTO refonte_rate_limits (bucket_key, window_started_at, request_count, expires_at)
       VALUES ($1, NOW(), 1, NOW() + make_interval(secs => $2::double precision + 86400))
       ON CONFLICT (bucket_key) DO UPDATE SET
         window_started_at = CASE
           WHEN refonte_rate_limits.window_started_at <= NOW() - make_interval(secs => $2::double precision)
             THEN NOW()
           ELSE refonte_rate_limits.window_started_at
         END,
         request_count = CASE
           WHEN refonte_rate_limits.window_started_at <= NOW() - make_interval(secs => $2::double precision)
             THEN 1
           ELSE refonte_rate_limits.request_count + 1
         END,
         expires_at = NOW() + make_interval(secs => $2::double precision + 86400)
       RETURNING request_count,
         GREATEST(1, CEIL(EXTRACT(EPOCH FROM
           (window_started_at + make_interval(secs => $2::double precision) - NOW())
         )))::INTEGER AS retry_after`,
      [bucketKey, windowSeconds],
    );

    if (Date.now() - lastRateLimitCleanup > 15 * 60 * 1000) {
      lastRateLimitCleanup = Date.now();
      void pool.query('DELETE FROM refonte_rate_limits WHERE expires_at < NOW()')
        .catch((error: unknown) => {
          lastRateLimitCleanup = 0;
          console.error('Expired rate-limit buckets could not be removed:', error);
        });
    }

    const bucket = result.rows[0] as { request_count: number; retry_after: number } | undefined;
    if (!bucket) throw new Error('Rate-limit query returned no bucket.');
    if (Number(bucket.request_count) <= limit) return null;

    return NextResponse.json(
      { error: 'Trop de tentatives. Veuillez réessayer plus tard.' },
      { status: 429, headers: { 'Retry-After': String(bucket.retry_after) } },
    );
  } catch (error) {
    console.error(`Rate-limit check failed for ${scope}:`, error);
    return NextResponse.json(
      { error: 'Service temporairement indisponible.' },
      { status: 503 },
    );
  }
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters.');
  }
  return secret;
}

export async function ensureRefonteSchema(): Promise<void> {
  if (!connectionString) {
    throw new Error('POSTGRES_URL or DATABASE_URL must be configured.');
  }
  if (!schemaCheck) {
    schemaCheck = pool.query(`
      SELECT to_regclass('public.refonte_admins') AS admins,
             to_regclass('public.refonte_contact_messages') AS messages,
             to_regclass('public.refonte_centers') AS centers,
             to_regclass('public.refonte_medical_contents') AS contents,
             to_regclass('public.refonte_topics') AS topics,
             to_regclass('public.refonte_question_responses') AS questionResponses,
             to_regclass('public.refonte_abnormal_result_steps') AS resultSteps
    `).then(({ rows }) => {
      const tables = rows[0];
      if (!tables || Object.values(tables).some((table) => table === null)) {
        throw new Error('Refonte tables are missing. Apply all SQL migrations in db/migrations to Neon.');
      }
    }).catch((error: unknown) => {
      schemaCheck = undefined;
      throw error;
    });
  }
  await schemaCheck;
}

export async function requireAdmin(): Promise<NextResponse | null> {
  try {
    const admin = await getAdminSession();
    if (admin) return null;
    return NextResponse.json({ error: 'Authentification administrateur requise.' }, { status: 401 });
  } catch (error) {
    console.error('Admin authorization check failed:', error);
    return NextResponse.json({ error: 'Service d’administration temporairement indisponible.' }, { status: 503 });
  }
}

export async function getAdminSession(): Promise<{ id: string; email: string; role: string } | null> {
  const secret = getSessionSecret();
  let admin: { id: string; email: string; role: string };
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = jwt.verify(token, secret, { issuer: SESSION_ISSUER });
    if (typeof payload === 'string' || !payload.sub || !payload.email || !payload.role) return null;
    admin = { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
  await ensureRefonteSchema();
  const result = await pool.query(
    'SELECT 1 FROM refonte_admins WHERE id = $1 AND active = TRUE',
    [admin.id],
  );
  return result.rowCount ? admin : null;
}

export async function loginAdmin(email: string, password: string): Promise<NextResponse> {
  await ensureRefonteSchema();
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    'SELECT id, email, password_hash, role FROM refonte_admins WHERE email = $1 AND active = TRUE',
    [normalizedEmail],
  );
  const admin = result.rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return NextResponse.json({ error: 'Adresse e-mail ou mot de passe incorrect.' }, { status: 401 });
  }

  const token = jwt.sign(
    { email: admin.email, role: admin.role },
    getSessionSecret(),
    { subject: admin.id, issuer: SESSION_ISSUER, expiresIn: SESSION_DURATION_SECONDS },
  );
  const response = NextResponse.json({ admin: { email: admin.email, role: admin.role } });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
  return response;
}

export async function logoutAdmin(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}

export async function bootstrapFirstAdmin(email: string, password: string): Promise<boolean> {
  await ensureRefonteSchema();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtext('ong-visa-refonte-admin-bootstrap'))");
    const existing = await client.query('SELECT 1 FROM refonte_admins LIMIT 1');
    if (existing.rowCount) {
      await client.query('ROLLBACK');
      return false;
    }

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    await client.query(
      `INSERT INTO refonte_admins (id, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      [id, email.trim().toLowerCase(), passwordHash],
    );
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function listContactMessages() {
  await ensureRefonteSchema();
  const result = await pool.query(
    `SELECT id, name, email, phone, subject, message, source, status, created_at AS "createdAt"
     FROM refonte_contact_messages
     ORDER BY created_at DESC`,
  );
  return result.rows;
}

export async function createContactMessage(input: {
  name?: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  source: 'contact' | 'listening';
}) {
  await ensureRefonteSchema();
  const id = randomUUID();
  const result = await pool.query(
    `INSERT INTO refonte_contact_messages (id, name, email, phone, subject, message, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, phone, subject, message, source, status, created_at AS "createdAt"`,
    [
      id,
      input.name?.trim() || null,
      input.email?.trim().toLowerCase() || null,
      input.phone?.trim() || null,
      input.subject.trim(),
      input.message.trim(),
      input.source,
    ],
  );
  return result.rows[0];
}

export async function updateContactMessage(
  id: string,
  status: 'new' | 'in_progress' | 'resolved',
) {
  await ensureRefonteSchema();
  const result = await pool.query(
    `UPDATE refonte_contact_messages SET status = $2 WHERE id = $1
     RETURNING id, status`,
    [id, status],
  );
  return result.rows[0] || null;
}

export async function deleteContactMessage(id: string): Promise<void> {
  await ensureRefonteSchema();
  await pool.query('DELETE FROM refonte_contact_messages WHERE id = $1', [id]);
}

export async function listCenters(includeInactive = false) {
  await ensureRefonteSchema();
  const result = await pool.query(
    `SELECT id, name, address, city, phone, email, services, badge, latitude, longitude,
            verified_at AS "verifiedAt", active
     FROM refonte_centers
     ${includeInactive ? '' : 'WHERE active = TRUE'}
     ORDER BY name`,
  );
  return result.rows;
}

export async function saveCenter(input: {
  id?: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  services?: string[];
  badge?: string;
  latitude?: number | null;
  longitude?: number | null;
  verifiedAt?: string | null;
  active?: boolean;
}) {
  await ensureRefonteSchema();
  const id = input.id || randomUUID();
  const result = await pool.query(
    `INSERT INTO refonte_centers
       (id, name, address, city, phone, email, services, badge, latitude, longitude, verified_at, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name, address = EXCLUDED.address, city = EXCLUDED.city,
       phone = EXCLUDED.phone, email = EXCLUDED.email, services = EXCLUDED.services,
       badge = EXCLUDED.badge, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude,
       verified_at = EXCLUDED.verified_at, active = EXCLUDED.active, updated_at = NOW()
     RETURNING id, name, address, city, phone, email, services, badge, latitude, longitude,
               verified_at AS "verifiedAt", active`,
    [
      id,
      input.name.trim(),
      input.address?.trim() || '',
      input.city?.trim() || '',
      input.phone?.trim() || '',
      input.email?.trim().toLowerCase() || '',
      input.services || [],
      input.badge?.trim() || '',
      input.latitude ?? null,
      input.longitude ?? null,
      input.verifiedAt || null,
      input.active ?? false,
    ],
  );
  return result.rows[0];
}

export async function deleteCenter(id: string): Promise<void> {
  await ensureRefonteSchema();
  await pool.query('DELETE FROM refonte_centers WHERE id = $1', [id]);
}

export async function listSiteTopics(includeInactive = false): Promise<SiteTopic[]> {
  await ensureRefonteSchema();
  const result = await pool.query(
    `SELECT id, slug, category, title, summary, signs, exams, togo,
            button_text AS "buttonText", button_link AS "buttonLink", position, active
     FROM refonte_topics
     ${includeInactive ? '' : 'WHERE active = TRUE'}
     ORDER BY position, title`,
  );
  return result.rows;
}

export async function saveSiteTopic(input: Omit<SiteTopic, 'id'> & { id?: string }): Promise<SiteTopic> {
  await ensureRefonteSchema();
  const id = input.id || randomUUID();
  const result = await pool.query(
    `INSERT INTO refonte_topics
       (id, slug, category, title, summary, signs, exams, togo, button_text, button_link, position, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (id) DO UPDATE SET
       slug = EXCLUDED.slug, category = EXCLUDED.category, title = EXCLUDED.title,
       summary = EXCLUDED.summary, signs = EXCLUDED.signs, exams = EXCLUDED.exams,
       togo = EXCLUDED.togo, button_text = EXCLUDED.button_text,
       button_link = EXCLUDED.button_link, position = EXCLUDED.position,
       active = EXCLUDED.active, updated_at = NOW()
     RETURNING id, slug, category, title, summary, signs, exams, togo,
               button_text AS "buttonText", button_link AS "buttonLink", position, active`,
    [
      id, input.slug.trim(), input.category.trim(), input.title.trim(), input.summary.trim(),
      input.signs.trim(), input.exams.trim(), input.togo.trim(), input.buttonText.trim(),
      input.buttonLink.trim(), input.position, input.active,
    ],
  );
  return result.rows[0];
}

export async function deleteSiteTopic(id: string): Promise<void> {
  await ensureRefonteSchema();
  await pool.query('DELETE FROM refonte_topics WHERE id = $1', [id]);
}

export async function listAbnormalResultSteps(includeInactive = false): Promise<AbnormalResultStep[]> {
  await ensureRefonteSchema();
  const result = await pool.query(
    `SELECT id, title, body, position, active
     FROM refonte_abnormal_result_steps
     ${includeInactive ? '' : 'WHERE active = TRUE'}
     ORDER BY position, created_at`,
  );
  return result.rows;
}

export async function saveAbnormalResultStep(
  input: Omit<AbnormalResultStep, 'id'> & { id?: string },
): Promise<AbnormalResultStep> {
  await ensureRefonteSchema();
  const id = input.id || randomUUID();
  const result = await pool.query(
    `INSERT INTO refonte_abnormal_result_steps (id, title, body, position, active)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title, body = EXCLUDED.body, position = EXCLUDED.position,
       active = EXCLUDED.active, updated_at = NOW()
     RETURNING id, title, body, position, active`,
    [id, input.title.trim(), input.body.trim(), input.position, input.active],
  );
  return result.rows[0];
}

export async function deleteAbnormalResultStep(id: string): Promise<void> {
  await ensureRefonteSchema();
  await pool.query('DELETE FROM refonte_abnormal_result_steps WHERE id = $1', [id]);
}

export async function listQuestionResponses(includeUnpublished = false): Promise<QuestionResponse[]> {
  await ensureRefonteSchema();
  const result = await pool.query(
    `SELECT id, badge, question, answer, meta, position, published
     FROM refonte_question_responses
     ${includeUnpublished ? '' : 'WHERE published = TRUE'}
     ORDER BY position, created_at`,
  );
  return result.rows;
}

export async function saveQuestionResponse(
  input: Omit<QuestionResponse, 'id'> & { id?: string },
): Promise<QuestionResponse> {
  await ensureRefonteSchema();
  const id = input.id || randomUUID();
  const result = await pool.query(
    `INSERT INTO refonte_question_responses
       (id, badge, question, answer, meta, position, published)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET
       badge = EXCLUDED.badge, question = EXCLUDED.question, answer = EXCLUDED.answer,
       meta = EXCLUDED.meta, position = EXCLUDED.position,
       published = EXCLUDED.published, updated_at = NOW()
     RETURNING id, badge, question, answer, meta, position, published`,
    [
      id, input.badge.trim(), input.question.trim(), input.answer.trim(), input.meta.trim(),
      input.position, input.published,
    ],
  );
  return result.rows[0];
}

export async function deleteQuestionResponse(id: string): Promise<void> {
  await ensureRefonteSchema();
  await pool.query('DELETE FROM refonte_question_responses WHERE id = $1', [id]);
}
