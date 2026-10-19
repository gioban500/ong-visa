import { NextResponse } from 'next/server';
import {
  deleteAbnormalResultStep,
  deleteQuestionResponse,
  deleteSiteTopic,
  requireAdmin,
  saveAbnormalResultStep,
  saveQuestionResponse,
  saveSiteTopic,
  type SiteContentCollection,
} from '@/lib/refonte-backend';

function text(body: Record<string, unknown>, key: string): string | null {
  return typeof body[key] === 'string' ? body[key] as string : null;
}

function parseCollection(value: unknown): SiteContentCollection | null {
  return value === 'topics' || value === 'questionResponses' || value === 'resultSteps' ? value : null;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;
    const collection = parseCollection(body.collection);
    const position = body.position;
    if (!collection || typeof position !== 'number' || !Number.isInteger(position) || position < 0) {
      return NextResponse.json({ error: 'Contenu invalide.' }, { status: 400 });
    }

    if (collection === 'topics') {
      const slug = text(body, 'slug');
      const category = text(body, 'category');
      const title = text(body, 'title');
      const summary = text(body, 'summary');
      const signs = text(body, 'signs');
      const exams = text(body, 'exams');
      const togo = text(body, 'togo');
      const buttonText = text(body, 'buttonText');
      const buttonLink = text(body, 'buttonLink');
      if (
        !slug || !category || !title?.trim() || summary === null || signs === null ||
        exams === null || togo === null || buttonText === null || buttonLink === null ||
        typeof body.active !== 'boolean'
      ) return NextResponse.json({ error: 'Contenu invalide.' }, { status: 400 });
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return NextResponse.json({ error: 'Identifiant de sujet invalide.' }, { status: 400 });
      }
      if ((!buttonLink.startsWith('#') && !buttonLink.startsWith('/')) || buttonLink.startsWith('//')) {
        return NextResponse.json({ error: 'Lien de bouton invalide.' }, { status: 400 });
      }
      return NextResponse.json(await saveSiteTopic({
        id, slug, category, title, summary, signs, exams, togo, buttonText, buttonLink,
        position, active: body.active,
      }));
    }

    if (collection === 'resultSteps') {
      const title = text(body, 'title');
      const stepBody = text(body, 'body');
      if (!title?.trim() || !stepBody?.trim() || typeof body.active !== 'boolean') {
        return NextResponse.json({ error: 'Étape invalide.' }, { status: 400 });
      }
      return NextResponse.json(await saveAbnormalResultStep({
        id, title, body: stepBody, position, active: body.active,
      }));
    }
    const question = text(body, 'question');
    const answer = text(body, 'answer');
    if (!question?.trim() || !answer?.trim() || typeof body.published !== 'boolean') {
      return NextResponse.json({ error: 'Contenu invalide.' }, { status: 400 });
    }
    const badge = text(body, 'badge');
    const meta = text(body, 'meta');
    if (badge === null || meta === null) return NextResponse.json({ error: 'Contenu invalide.' }, { status: 400 });
    return NextResponse.json(await saveQuestionResponse({
      id, badge, question, answer, meta, position, published: body.published,
    }));
  } catch (error) {
    console.error('Homepage content update failed:', error);
    return NextResponse.json({ error: 'Impossible de modifier le contenu.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const collection = parseCollection(new URL(request.url).searchParams.get('collection'));
    if (!collection) return NextResponse.json({ error: 'Type de contenu invalide.' }, { status: 400 });

    if (collection === 'topics') await deleteSiteTopic(id);
    else if (collection === 'resultSteps') await deleteAbnormalResultStep(id);
    else await deleteQuestionResponse(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Homepage content deletion failed:', error);
    return NextResponse.json({ error: 'Impossible de supprimer le contenu.' }, { status: 500 });
  }
}
