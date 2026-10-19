import { NextResponse } from 'next/server';
import {
  listAbnormalResultSteps,
  listQuestionResponses,
  listSiteTopics,
  requireAdmin,
  saveAbnormalResultStep,
  saveQuestionResponse,
  saveSiteTopic,
  type SiteContentCollection,
} from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

function parseCollection(value: unknown): SiteContentCollection | null {
  return value === 'topics' || value === 'questionResponses' || value === 'resultSteps' ? value : null;
}

function parsePosition(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function isText(value: unknown): value is string {
  return typeof value === 'string';
}

function parseItem(collection: SiteContentCollection, body: Record<string, unknown>) {
  const id = isText(body.id) ? body.id : undefined;
  const position = parsePosition(body.position);
  if (position === null) return null;

  if (collection === 'topics') {
    const fields = ['slug', 'category', 'title', 'summary', 'signs', 'exams', 'togo', 'buttonText', 'buttonLink'];
    if (!fields.every((field) => isText(body[field])) || !isText(body.title) || !body.title.trim()) return null;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug as string)) return null;
    if (!String(body.buttonLink).startsWith('#') && !String(body.buttonLink).startsWith('/')) return null;
    if (String(body.buttonLink).startsWith('//')) return null;
    if (typeof body.active !== 'boolean') return null;
    return {
      collection,
      item: {
        id,
        slug: body.slug as string,
        category: body.category as string,
        title: body.title as string,
        summary: body.summary as string,
        signs: body.signs as string,
        exams: body.exams as string,
        togo: body.togo as string,
        buttonText: body.buttonText as string,
        buttonLink: body.buttonLink as string,
        position,
        active: body.active,
      },
    };
  }

  if (collection === 'resultSteps') {
    if (!isText(body.title) || !body.title.trim() || !isText(body.body) || !body.body.trim()) return null;
    if (typeof body.active !== 'boolean') return null;
    return {
      collection,
      item: { id, title: body.title, body: body.body, position, active: body.active },
    };
  }

  if (!isText(body.question) || !body.question.trim() || !isText(body.answer) || !body.answer.trim()) return null;
  if (!isText(body.badge) || !isText(body.meta) || typeof body.published !== 'boolean') return null;
  return {
    collection,
    item: {
      id,
      badge: body.badge,
      question: body.question,
      answer: body.answer,
      meta: body.meta,
      position,
      published: body.published,
    },
  };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const [topics, resultSteps, questionResponses] = await Promise.all([
      listSiteTopics(true),
      listAbnormalResultSteps(true),
      listQuestionResponses(true),
    ]);
    return NextResponse.json({ topics, resultSteps, questionResponses });
  } catch (error) {
    console.error('Admin homepage content could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger le contenu du site.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json() as Record<string, unknown>;
    const collection = parseCollection(body.collection);
    const parsed = collection ? parseItem(collection, body) : null;
    if (!parsed) return NextResponse.json({ error: 'Contenu invalide.' }, { status: 400 });

    if (parsed.collection === 'topics') {
      return NextResponse.json(await saveSiteTopic(parsed.item), { status: 201 });
    }
    if (parsed.collection === 'resultSteps') {
      return NextResponse.json(await saveAbnormalResultStep(parsed.item), { status: 201 });
    }
    return NextResponse.json(await saveQuestionResponse(parsed.item), { status: 201 });
  } catch (error) {
    console.error('Homepage content could not be saved:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer le contenu.' }, { status: 500 });
  }
}
