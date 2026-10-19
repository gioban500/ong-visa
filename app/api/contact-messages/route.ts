import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import { createContactMessage, enforceRateLimit, listContactMessages, requireAdmin } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await listContactMessages());
  } catch (error) {
    console.error('Contact messages could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger les messages.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, 'contact-message', 5, 10 * 60);
  if (limited) return limited;

  try {
    const body = await readJsonBody(request, 16 * 1024);
    if (!isJsonRecord(body)) {
      return NextResponse.json({ error: 'Veuillez vérifier les champs du formulaire.' }, { status: 400 });
    }
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const source = body.source === 'listening' ? 'listening' : 'contact';

    if (
      !subject ||
      subject.length > 200 ||
      !message ||
      message.length > 10000 ||
      name.length > 200 ||
      email.length > 254 ||
      phone.length > 50
    ) {
      return NextResponse.json({ error: 'Veuillez vérifier les champs du formulaire.' }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
    }

    const saved = await createContactMessage({ name, email, phone, subject, message, source });
    return NextResponse.json({ message: 'Demande transmise.', id: saved.id }, { status: 201 });
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Contact message could not be saved:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer votre demande.' }, { status: 500 });
  }
}
