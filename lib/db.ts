import { Pool } from 'pg';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type LegacyRecord = Record<string, unknown>;

interface CancerInput {
  id: string;
  name: string;
  color?: string | null;
  image?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  epidemiology?: string | null;
  riskPopulation?: string | null;
  riskFactors?: unknown;
  symptoms?: unknown;
  screening?: unknown;
  testimonials?: unknown;
  resources?: unknown;
}

type CancerUpdates = Partial<Omit<CancerInput, 'id'>>;

interface TestimonialInput {
  id: string;
  name: string;
  image?: string | null;
  story: string;
  cancerType?: string | null;
  date?: string | null;
  approved?: boolean | null;
  hero?: boolean | null;
}

type TestimonialUpdates = Partial<Omit<TestimonialInput, 'id'>>;

interface BlogPostInput {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  images?: string[];
  author?: string | null;
  publishedDate?: string | null;
  readTime?: number | null;
  category?: string | null;
  tags?: string[];
  published?: boolean | null;
}

type BlogPostUpdates = Partial<Omit<BlogPostInput, 'id'>>;

// Support explicite de POSTGRES_URL et DATABASE_URL
const configuredConnectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const connectionString = configuredConnectionString?.includes('localhost')
  ? configuredConnectionString
  : configuredConnectionString?.replace(
    /([?&])sslmode=(?:prefer|require|verify-ca)(?=&|$)/i,
    '$1sslmode=verify-full'
  );

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('localhost') 
    ? undefined 
    : { 
        rejectUnauthorized: true
      },
});

let initialized = false;

// Helper: transformer un texte en identifiant URL propre (sans accents ni caractères spéciaux)
export function slugify(str: string): string {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: lire un fichier JSON de secours (data/*.json)
function readJsonFallback<T>(fileName: string, fallback: T): T {
  try {
    const dataPath = join(process.cwd(), 'data', fileName);
    return JSON.parse(readFileSync(dataPath, 'utf8')) as T;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return fallback;
  }
}

// Initialize database tables
export async function initDatabase() {
  if (initialized) return;
  
  if (!connectionString) {
    console.log('⚠️ No POSTGRES_URL or DATABASE_URL found - skipping database initialization');
    initialized = true;
    return;
  }
  
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⚠️ Build phase detected - skipping database initialization');
    initialized = true;
    return;
  }
  
  try {
    const client = await pool.connect();
    try {
      // Create cancers table
      await client.query(`
        CREATE TABLE IF NOT EXISTS cancers (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          color VARCHAR(20),
          image TEXT,
          shortDescription TEXT,
          description TEXT,
          epidemiology TEXT,
          riskPopulation TEXT,
          riskFactors JSONB,
          symptoms JSONB,
          screening JSONB,
          testimonials JSONB,
          resources JSONB
        );
      `);

      // Create testimonials table
      await client.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image TEXT,
          story TEXT NOT NULL,
          cancerType VARCHAR(255),
          date VARCHAR(50),
          approved BOOLEAN DEFAULT TRUE,
          hero BOOLEAN DEFAULT FALSE
        );
      `);

      // Create blog posts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT NOT NULL,
          image TEXT,
          images JSONB,
          author VARCHAR(255),
          publishedDate VARCHAR(50),
          readTime INTEGER,
          category VARCHAR(100),
          tags JSONB,
          published BOOLEAN DEFAULT TRUE
        );
      `);

      await client.query(`
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS images JSONB;
        UPDATE blog_posts
        SET images = jsonb_build_array(image)
        WHERE images IS NULL AND image IS NOT NULL AND image <> '';
      `);

      // Create event registrations table (colonnes en snake_case comme dans Neon)
      await client.query(`
        CREATE TABLE IF NOT EXISTS event_registrations (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          event_id VARCHAR(255),
          event_title VARCHAR(255),
          created_at VARCHAR(50)
        );
      `);

      // Create newsletter subscribers table
      await client.query(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id VARCHAR(100) PRIMARY KEY,
          firstName VARCHAR(255),
          lastName VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          subject VARCHAR(100),
          message TEXT,
          createdAt VARCHAR(50)
        );
      `);

      // Migration : Supprimer la contrainte UNIQUE sur l'email si elle existe
      await client.query(`
        ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_email_key;
      `);

      // Auto-migration : ajouter les colonnes phone, subject, message si absentes
      await client.query(`
        ALTER TABLE subscribers 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS subject VARCHAR(100),
        ADD COLUMN IF NOT EXISTS message TEXT;
      `);

      // Auto-migration : hero dans testimonials
      await client.query(`
        ALTER TABLE testimonials 
        ADD COLUMN IF NOT EXISTS hero BOOLEAN DEFAULT FALSE;
      `);

      initialized = true;
      console.log('Database initialized successfully');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Cancers operations
export async function getCancers(): Promise<LegacyRecord[]> {
  await initDatabase();
  
  if (!connectionString) {
    return readJsonFallback<LegacyRecord[]>('cancers.json', []);
  }
  
  try {
    const result = await pool.query('SELECT * FROM cancers');
    return result.rows.map(row => ({
      ...row,
      riskFactors: row.riskfactors || { modifiable: [], nonModifiable: [] },
      symptoms: row.symptoms || { early: [], advanced: [], warningSign: [] },
      screening: row.screening || { primaryPrevention: [], availableTests: [], recommendations: [], resultsInterpretation: '', screeningCenters: [] },
      testimonials: row.testimonials || [],
      resources: row.resources || []
    }));
  } catch (error) {
    console.error('DB error (getCancers), falling back to JSON:', error);
    return readJsonFallback<LegacyRecord[]>('cancers.json', []);
  }
}

export async function getCancerById(id: string): Promise<LegacyRecord | null> {
  await initDatabase();
  
  if (!connectionString) {
    const data = readJsonFallback<LegacyRecord[]>('cancers.json', []);
    return data.find(cancer => cancer.id === id) || null;
  }
  
  const decodedId = (() => {
    try { return decodeURIComponent(id); } catch { return id; }
  })();
  const wantedSlug = slugify(decodedId);

  const format = (row: LegacyRecord) => ({
    ...row,
    riskFactors: row.riskfactors || { modifiable: [], nonModifiable: [] },
    symptoms: row.symptoms || { early: [], advanced: [], warningSign: [] },
    screening: row.screening || { primaryPrevention: [], availableTests: [], recommendations: [], resultsInterpretation: '', screeningCenters: [] },
    testimonials: row.testimonials || [],
    resources: row.resources || []
  });

  try {
    const result = await pool.query('SELECT * FROM cancers WHERE id = $1', [decodedId]);
    if (result.rows[0]) return format(result.rows[0]);

    const all = await pool.query('SELECT * FROM cancers');
    const match = all.rows.find(
      row => slugify(String(row.id ?? '')) === wantedSlug || slugify(String(row.name ?? '')) === wantedSlug
    );
    return match ? format(match) : null;
  } catch (error) {
    console.error('DB error (getCancerById), falling back to JSON:', error);
    const data = readJsonFallback<LegacyRecord[]>('cancers.json', []);
    return (
      data.find(cancer => cancer.id === decodedId) ||
      data.find(cancer => slugify(String(cancer.id ?? '')) === wantedSlug || slugify(String(cancer.name ?? '')) === wantedSlug) ||
      null
    );
  }
}

export async function createCancer(cancer: CancerInput) {
  await initDatabase();
  await pool.query(`
    INSERT INTO cancers (
      id, name, color, image, shortDescription, description, 
      epidemiology, riskPopulation, riskFactors, symptoms, 
      screening, testimonials, resources
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  `, [
    cancer.id, cancer.name, cancer.color, cancer.image, 
    cancer.shortDescription, cancer.description, cancer.epidemiology, 
    cancer.riskPopulation, JSON.stringify(cancer.riskFactors || { modifiable: [], nonModifiable: [] }), 
    JSON.stringify(cancer.symptoms || { early: [], advanced: [], warningSign: [] }), 
    JSON.stringify(cancer.screening || { primaryPrevention: [], availableTests: [], recommendations: [], resultsInterpretation: '', screeningCenters: [] }), 
    JSON.stringify(cancer.testimonials || []), JSON.stringify(cancer.resources || [])
  ]);
  return cancer;
}

export async function updateCancer(id: string, updates: CancerUpdates) {
  await initDatabase();
  await pool.query(`
    UPDATE cancers SET
      name = $2,
      color = $3,
      image = $4,
      shortDescription = $5,
      description = $6,
      epidemiology = $7,
      riskPopulation = $8,
      riskFactors = COALESCE($9::jsonb, riskFactors),
      symptoms = COALESCE($10::jsonb, symptoms),
      screening = COALESCE($11::jsonb, screening),
      testimonials = COALESCE($12::jsonb, testimonials),
      resources = COALESCE($13::jsonb, resources)
    WHERE id = $1
  `, [
    id,
    updates.name,
    updates.color,
    updates.image,
    updates.shortDescription,
    updates.description,
    updates.epidemiology,
    updates.riskPopulation,
    updates.riskFactors === undefined ? null : JSON.stringify(updates.riskFactors),
    updates.symptoms === undefined ? null : JSON.stringify(updates.symptoms),
    updates.screening === undefined ? null : JSON.stringify(updates.screening),
    updates.testimonials === undefined ? null : JSON.stringify(updates.testimonials),
    updates.resources === undefined ? null : JSON.stringify(updates.resources)
  ]);
  return getCancerById(id);
}

export async function deleteCancer(id: string) {
  await initDatabase();
  await pool.query('DELETE FROM cancers WHERE id = $1', [id]);
}

// Testimonials operations
export async function getTestimonials(): Promise<LegacyRecord[]> {
  await initDatabase();
  
  if (!connectionString) {
    return readJsonFallback<LegacyRecord[]>('testimonials.json', []);
  }
  
  try {
    const result = await pool.query('SELECT * FROM testimonials');
    return result.rows;
  } catch (error) {
    console.error('DB error (getTestimonials), falling back to JSON:', error);
    return readJsonFallback<LegacyRecord[]>('testimonials.json', []);
  }
}

export async function getApprovedTestimonials() {
  await initDatabase();
  
  if (!connectionString) {
    const data = readJsonFallback<LegacyRecord[]>('testimonials.json', []);
    return data.filter(testimonial => testimonial.approved !== false);
  }
  
  try {
    const result = await pool.query('SELECT * FROM testimonials WHERE approved = TRUE');
    return result.rows;
  } catch (error) {
    console.error('DB error (getApprovedTestimonials), falling back to JSON:', error);
    const data = readJsonFallback<LegacyRecord[]>('testimonials.json', []);
    return data.filter(testimonial => testimonial.approved !== false);
  }
}

export async function getTestimonialById(id: string) {
  await initDatabase();
  const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createTestimonial(testimonial: TestimonialInput) {
  await initDatabase();
  await pool.query(`
    INSERT INTO testimonials (id, name, image, story, cancerType, date, approved, hero)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [
    testimonial.id, 
    testimonial.name, 
    testimonial.image, 
    testimonial.story, 
    testimonial.cancerType, 
    testimonial.date, 
    testimonial.approved ?? true,
    testimonial.hero ?? false
  ]);
  return testimonial;
}

export async function updateTestimonial(id: string, updates: TestimonialUpdates) {
  await initDatabase();
  await pool.query(`
    UPDATE testimonials SET
      name = COALESCE($2, name),
      image = COALESCE($3, image),
      story = COALESCE($4, story),
      cancerType = COALESCE($5, cancerType),
      date = COALESCE($6, date),
      approved = COALESCE($7, approved),
      hero = COALESCE($8, hero)
    WHERE id = $1
  `, [
    id,
    updates.name ?? null,
    updates.image ?? null,
    updates.story ?? null,
    updates.cancerType ?? null,
    updates.date ?? null,
    updates.approved ?? null,
    updates.hero ?? null
  ]);
  return getTestimonialById(id);
}

export async function deleteTestimonial(id: string) {
  await initDatabase();
  await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
}

// Blog operations
function toBlogPostSummary(post: LegacyRecord): LegacyRecord {
  const images = Array.isArray(post.images) ? post.images : [];
  const firstImage = typeof post.image === 'string' ? post.image : (typeof images[0] === 'string' ? images[0] : '');
  const imageCount = Math.max(images.length, firstImage ? 1 : 0);
  const slug = typeof post.slug === 'string' ? post.slug : '';
  return {
    id: post.id,
    title: post.title,
    slug,
    description: post.description || post.excerpt || post.content || '',
    excerpt: post.excerpt || post.description || post.content || '',
    image: imageCount > 0 ? `/api/blog/${encodeURIComponent(slug)}/images/0` : '',
    imageCount,
    publishedDate: post.publishedDate || post.publisheddate || null,
    published: post.published === true,
  };
}

export async function getBlogPostSummaries(): Promise<LegacyRecord[]> {
  await initDatabase();

  if (!connectionString) {
    const data = readJsonFallback<LegacyRecord[]>('blog.json', []);
    return data.map(toBlogPostSummary);
  }

  try {
    const result = await pool.query(`
      SELECT id, title, slug, excerpt, publishedDate, published,
        CASE
          WHEN images IS NOT NULL
            AND jsonb_typeof(images) = 'array'
            AND jsonb_array_length(images) > 0
            THEN jsonb_array_length(images)
          WHEN image IS NOT NULL AND image <> '' THEN 1
          ELSE 0
        END AS image_count
      FROM blog_posts
      ORDER BY publishedDate DESC NULLS LAST
    `);
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || '',
      description: row.excerpt || '',
      image: Number(row.image_count) > 0 ? `/api/blog/${encodeURIComponent(row.slug)}/images/0` : '',
      imageCount: Number(row.image_count) || 0,
      publishedDate: row.publisheddate || row.publishedDate || null,
      published: row.published === true,
    }));
  } catch (error) {
    console.error('DB error (getBlogPostSummaries), falling back to JSON:', error);
    const data = readJsonFallback<LegacyRecord[]>('blog.json', []);
    return data.map(toBlogPostSummary);
  }
}

export async function getBlogPostSummaryBySlug(slug: string): Promise<LegacyRecord | null> {
  await initDatabase();

  if (!connectionString) {
    const data = readJsonFallback<LegacyRecord[]>('blog.json', []);
    const post = data.find((item) => item.slug === slug);
    return post ? toBlogPostSummary(post) : null;
  }

  try {
    const result = await pool.query(`
      SELECT id, title, slug, excerpt, publishedDate, published,
        CASE
          WHEN images IS NOT NULL
            AND jsonb_typeof(images) = 'array'
            AND jsonb_array_length(images) > 0
            THEN jsonb_array_length(images)
          WHEN image IS NOT NULL AND image <> '' THEN 1
          ELSE 0
        END AS image_count
      FROM blog_posts
      WHERE slug = $1
    `, [slug]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || '',
      description: row.excerpt || '',
      image: Number(row.image_count) > 0 ? `/api/blog/${encodeURIComponent(row.slug)}/images/0` : '',
      imageCount: Number(row.image_count) || 0,
      publishedDate: row.publisheddate || row.publishedDate || null,
      published: row.published === true,
    };
  } catch (error) {
    console.error('DB error (getBlogPostSummaryBySlug), falling back to JSON:', error);
    const data = readJsonFallback<LegacyRecord[]>('blog.json', []);
    const post = data.find((item) => item.slug === slug);
    return post ? toBlogPostSummary(post) : null;
  }
}

export async function getBlogPostImage(slug: string, index: number): Promise<string | null> {
  await initDatabase();

  if (!connectionString) {
    const data = readJsonFallback<LegacyRecord[]>('blog.json', []);
    const post = data.find((item) => item.slug === slug);
    if (!post || post.published !== true) return null;
    const images = Array.isArray(post.images) ? post.images : [];
    const image = images[index] ?? (index === 0 ? post.image : null);
    return typeof image === 'string' ? image : null;
  }

  try {
    const result = await pool.query(`
      SELECT CASE
        WHEN images IS NOT NULL
          AND jsonb_typeof(images) = 'array'
          AND jsonb_array_length(images) > $2
          THEN images ->> $2
        WHEN $2 = 0 THEN image
        ELSE NULL
      END AS image
      FROM blog_posts
      WHERE slug = $1 AND published = TRUE
    `, [slug, index]);
    const image: unknown = result.rows[0]?.image;
    return typeof image === 'string' && image ? image : null;
  } catch (error) {
    console.error('DB error (getBlogPostImage):', error);
    throw error;
  }
}

export async function getBlogPosts(): Promise<LegacyRecord[]> {
  await initDatabase();
  
  if (!connectionString) {
    return readJsonFallback<LegacyRecord[]>('blog.json', []);
  }
  
  try {
    const result = await pool.query('SELECT * FROM blog_posts');
    return result.rows.map(row => ({
      ...row,
      description: row.description || row.excerpt || row.content || '',
      images: Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : (row.image ? [row.image] : []),
      publishedDate: row.publisheddate || row.publishedDate,
      readTime: row.readtime || row.readTime,
      tags: row.tags || []
    }));
  } catch (error) {
    console.error('DB error (getBlogPosts), falling back to JSON:', error);
    return readJsonFallback<LegacyRecord[]>('blog.json', []);
  }
}

export async function getBlogPostBySlug(slug: string) {
  await initDatabase();
  
  if (!connectionString) {
    const data = readJsonFallback<LegacyRecord[]>('blog.json', []);
    return data.find(post => post.slug === slug) || null;
  }
  
  try {
    const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      ...row,
      description: row.description || row.excerpt || row.content || '',
      images: Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : (row.image ? [row.image] : []),
      publishedDate: row.publisheddate || row.publishedDate,
      readTime: row.readtime || row.readTime,
      tags: row.tags || []
    };
  } catch (error) {
    console.error('DB error (getBlogPostBySlug), falling back to JSON:', error);
    const data = readJsonFallback<LegacyRecord[]>('blog.json', []);
    return data.find(post => post.slug === slug) || null;
  }
}

export async function createBlogPost(post: BlogPostInput) {
  await initDatabase();
  await pool.query(`
    INSERT INTO blog_posts (
      id, title, slug, excerpt, content, image, images,
      author, publishedDate, readTime, category, tags, published
    ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13)
  `, [
    post.id, post.title, post.slug, post.description || post.excerpt || '', post.description || post.content || '',
    post.image || post.images?.[0] || '', JSON.stringify(post.images || (post.image ? [post.image] : [])),
    post.author, post.publishedDate || null, post.readTime,
    post.category, JSON.stringify(post.tags || []), post.published ?? true
  ]);
  return post;
}

export async function updateBlogPost(slug: string, updates: BlogPostUpdates) {
  await initDatabase();
  await pool.query(`
    UPDATE blog_posts SET
      title = $2,
      slug = $3,
      excerpt = $4,
      content = $5,
      image = $6,
      images = COALESCE($7::jsonb, images),
      author = $8,
      publishedDate = $9,
      readTime = $10,
      category = $11,
      tags = $12,
      published = $13
    WHERE slug = $1
  `, [
    slug,
    updates.title,
    updates.slug,
    updates.description ?? updates.excerpt ?? '',
    updates.description ?? updates.content ?? '',
    updates.image ?? updates.images?.[0] ?? '',
    updates.images === undefined ? null : JSON.stringify(updates.images),
    updates.author ?? 'ONG VISA',
    updates.publishedDate ?? null,
    updates.readTime ?? 1,
    updates.category ?? 'Événement',
    JSON.stringify(updates.tags || []),
    updates.published
  ]);
  return getBlogPostBySlug(updates.slug || slug);
}

export async function deleteBlogPost(slug: string) {
  await initDatabase();
  await pool.query('DELETE FROM blog_posts WHERE slug = $1', [slug]);
}

// ============ Newsletter / Messages / Contacts ============
export async function createSubscriber(sub: { 
  firstName?: string; 
  lastName?: string; 
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
}) {
  await initDatabase();
  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  await pool.query(
    `INSERT INTO subscribers (id, firstname, lastname, email, phone, subject, message, createdat)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id, 
      sub.firstName || '', 
      sub.lastName || '', 
      sub.email.toLowerCase().trim(),
      sub.phone || '',
      sub.subject || '',
      sub.message || '',
      createdAt
    ]
  );
  return { id, ...sub, createdAt };
}

export async function getSubscribers() {
  await initDatabase();
  try {
    const result = await pool.query('SELECT * FROM subscribers ORDER BY createdat DESC');
    return result.rows.map(r => ({
      id: r.id,
      firstName: r.firstname || r.firstName,
      lastName: r.lastname || r.lastName,
      email: r.email,
      phone: r.phone,
      subject: r.subject,
      message: r.message,
      createdAt: r.createdat || r.createdAt,
    }));
  } catch (error) {
    console.error('DB error (getSubscribers):', error);
    return [];
  }
}

export async function deleteSubscriber(id: string) {
  await initDatabase();
  await pool.query('DELETE FROM subscribers WHERE id = $1', [id]);
}

export async function seedDatabase() {
  await initDatabase();
  console.log('Database ready, no static data seeded.');
}

seedDatabase().catch(err => console.error('Error initializing database:', err));

// ============ Event Registrations / Inscriptions Événements ============
export async function createEventRegistration(data: { name: string; phone: string; eventId?: string; eventTitle?: string }) {
  await initDatabase();
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  // Support des colonnes de la DB Neon (snake_case avec fallback)
  await pool.query(
    `INSERT INTO event_registrations (id, name, phone, event_id, event_title, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, data.name.trim(), data.phone.trim(), data.eventId || '', data.eventTitle || 'Événement', createdAt]
  ).catch(async () => {
    // Fallback si la table utilise le format sans underscore (eventid, eventtitle, createdat)
    await pool.query(
      `INSERT INTO event_registrations (id, name, phone, eventid, eventtitle, createdat)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, data.name.trim(), data.phone.trim(), data.eventId || '', data.eventTitle || 'Événement', createdAt]
    );
  });

  return { id, ...data, createdAt };
}

export async function getEventRegistrations() {
  await initDatabase();
  try {
    const result = await pool.query('SELECT * FROM event_registrations');
    
    return result.rows.map(r => ({
      id: r.id ? String(r.id) : '',
      name: r.name || '',
      phone: r.phone || '',
      eventId: r.event_id || r.eventid || r.eventId || '',
      eventTitle: r.event_title || r.eventtitle || r.eventTitle || '',
      createdAt: r.created_at || r.createdat || r.createdAt || '',
    }));
  } catch (error) {
    console.error('DB error (getEventRegistrations):', error);
    return [];
  }
}

export async function deleteEventRegistration(id: string) {
  await initDatabase();
  await pool.query('DELETE FROM event_registrations WHERE id = $1', [id]);
}