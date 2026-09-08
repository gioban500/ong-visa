import { Pool } from 'pg';

// Support explicite de POSTGRES_URL et DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('localhost') 
    ? undefined 
    : { 
        rejectUnauthorized: false 
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
function readJsonFallback(fileName: string, fallback: any = []) {
  const fs = require('fs');
  const path = require('path');
  try {
    const dataPath = path.join(process.cwd(), 'data', fileName);
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
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
  
  if (process.env.VERCEL && process.env.NEXT_PHASE === 'phase-production-build') {
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
      `).catch(err => {
        if (err.code !== '42P07') throw err;
      });

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
      `).catch(err => {
        if (err.code !== '42P07') throw err;
      });

      // Create blog posts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT NOT NULL,
          image TEXT,
          author VARCHAR(255),
          publishedDate VARCHAR(50),
          readTime INTEGER,
          category VARCHAR(100),
          tags JSONB,
          published BOOLEAN DEFAULT TRUE
        );
      `).catch(err => {
        if (err.code !== '42P07') throw err;
      });

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
      `).catch(err => {
        if (err.code !== '42P07') throw err;
      });

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
      `).catch(err => {
        if (err.code !== '42P07') throw err;
      });

      // Migration : Supprimer la contrainte UNIQUE sur l'email si elle existe
      await client.query(`
        ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_email_key;
      `).catch(err => console.error('Error dropping unique constraint:', err));

      // Auto-migration : ajouter les colonnes phone, subject, message si absentes
      await client.query(`
        ALTER TABLE subscribers 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS subject VARCHAR(100),
        ADD COLUMN IF NOT EXISTS message TEXT;
      `).catch(err => console.error('Error altering subscribers table:', err));

      // Auto-migration : hero dans testimonials
      await client.query(`
        ALTER TABLE testimonials 
        ADD COLUMN IF NOT EXISTS hero BOOLEAN DEFAULT FALSE;
      `).catch(err => console.error('Error altering testimonials table:', err));

      initialized = true;
      console.log('Database initialized successfully');
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Database initialization completed (tables may already exist or connection unavailable)');
    initialized = true;
  }
}

// Cancers operations
export async function getCancers() {
  await initDatabase();
  
  if (!connectionString) {
    return readJsonFallback('cancers.json', []);
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
    return readJsonFallback('cancers.json', []);
  }
}

export async function getCancerById(id: string) {
  await initDatabase();
  
  if (!connectionString) {
    const data = readJsonFallback('cancers.json', []);
    return data.find((c: any) => c.id === id) || null;
  }
  
  const decodedId = (() => {
    try { return decodeURIComponent(id); } catch { return id; }
  })();
  const wantedSlug = slugify(decodedId);

  const format = (row: any) => ({
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
      (row: any) => slugify(row.id) === wantedSlug || slugify(row.name) === wantedSlug
    );
    return match ? format(match) : null;
  } catch (error) {
    console.error('DB error (getCancerById), falling back to JSON:', error);
    const data = readJsonFallback('cancers.json', []);
    return (
      data.find((c: any) => c.id === decodedId) ||
      data.find((c: any) => slugify(c.id) === wantedSlug || slugify(c.name) === wantedSlug) ||
      null
    );
  }
}

export async function createCancer(cancer: any) {
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

export async function updateCancer(id: string, updates: any) {
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
      riskFactors = $9,
      symptoms = $10,
      screening = $11,
      testimonials = $12,
      resources = $13
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
    JSON.stringify(updates.riskFactors || { modifiable: [], nonModifiable: [] }),
    JSON.stringify(updates.symptoms || { early: [], advanced: [], warningSign: [] }),
    JSON.stringify(updates.screening || { primaryPrevention: [], availableTests: [], recommendations: [], resultsInterpretation: '', screeningCenters: [] }),
    JSON.stringify(updates.testimonials || []),
    JSON.stringify(updates.resources || [])
  ]);
  return getCancerById(id);
}

export async function deleteCancer(id: string) {
  await initDatabase();
  await pool.query('DELETE FROM cancers WHERE id = $1', [id]);
}

// Testimonials operations
export async function getTestimonials() {
  await initDatabase();
  
  if (!connectionString) {
    return readJsonFallback('testimonials.json', []);
  }
  
  try {
    const result = await pool.query('SELECT * FROM testimonials');
    return result.rows;
  } catch (error) {
    console.error('DB error (getTestimonials), falling back to JSON:', error);
    return readJsonFallback('testimonials.json', []);
  }
}

export async function getApprovedTestimonials() {
  await initDatabase();
  
  if (!connectionString) {
    const data = readJsonFallback('testimonials.json', []);
    return data.filter((t: any) => t.approved !== false);
  }
  
  try {
    const result = await pool.query('SELECT * FROM testimonials WHERE approved = TRUE');
    return result.rows;
  } catch (error) {
    console.error('DB error (getApprovedTestimonials), falling back to JSON:', error);
    const data = readJsonFallback('testimonials.json', []);
    return data.filter((t: any) => t.approved !== false);
  }
}

export async function getTestimonialById(id: string) {
  await initDatabase();
  const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createTestimonial(testimonial: any) {
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

export async function updateTestimonial(id: string, updates: any) {
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
export async function getBlogPosts() {
  await initDatabase();
  
  if (!connectionString) {
    return readJsonFallback('blog.json', []);
  }
  
  try {
    const result = await pool.query('SELECT * FROM blog_posts');
    return result.rows.map(row => ({
      ...row,
      publishedDate: row.publisheddate || row.publishedDate,
      readTime: row.readtime || row.readTime,
      tags: row.tags || []
    }));
  } catch (error) {
    console.error('DB error (getBlogPosts), falling back to JSON:', error);
    return readJsonFallback('blog.json', []);
  }
}

export async function getBlogPostBySlug(slug: string) {
  await initDatabase();
  
  if (!connectionString) {
    const data = readJsonFallback('blog.json', []);
    return data.find((p: any) => p.slug === slug) || null;
  }
  
  try {
    const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      ...row,
      publishedDate: row.publisheddate || row.publishedDate,
      readTime: row.readtime || row.readTime,
      tags: row.tags || []
    };
  } catch (error) {
    console.error('DB error (getBlogPostBySlug), falling back to JSON:', error);
    const data = readJsonFallback('blog.json', []);
    return data.find((p: any) => p.slug === slug) || null;
  }
}

export async function createBlogPost(post: any) {
  await initDatabase();
  await pool.query(`
    INSERT INTO blog_posts (
      id, title, slug, excerpt, content, image, 
      author, publishedDate, readTime, category, tags, published
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `, [
    post.id, post.title, post.slug, post.excerpt, post.content, 
    post.image, post.author, post.publishedDate, post.readTime, 
    post.category, JSON.stringify(post.tags || []), post.published ?? true
  ]);
  return post;
}

export async function updateBlogPost(slug: string, updates: any) {
  await initDatabase();
  await pool.query(`
    UPDATE blog_posts SET
      title = $2,
      slug = $3,
      excerpt = $4,
      content = $5,
      image = $6,
      author = $7,
      publishedDate = $8,
      readTime = $9,
      category = $10,
      tags = $11,
      published = $12
    WHERE slug = $1
  `, [
    slug,
    updates.title,
    updates.slug,
    updates.excerpt,
    updates.content,
    updates.image,
    updates.author,
    updates.publishedDate,
    updates.readTime,
    updates.category,
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
    return result.rows.map((r: any) => ({
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
    
    return result.rows.map((r: any) => ({
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