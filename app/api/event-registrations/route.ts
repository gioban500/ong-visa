import { NextResponse } from 'next/server';
import { createEventRegistration, getEventRegistrations } from '@/lib/db';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import { enforceRateLimit, requireAdmin } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, 'event-registration', 10, 15 * 60);
  if (limited) return limited;

  try {
    const body = await readJsonBody(request, 4096);
    if (!isJsonRecord(body)) {
      return NextResponse.json({ error: 'Les informations d’inscription sont invalides.' }, { status: 400 });
    }
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const eventId = typeof body.eventId === 'string' ? body.eventId.trim() : '';
    const eventTitle = typeof body.eventTitle === 'string' ? body.eventTitle.trim() : '';

    if (!name || !phone || name.length > 200 || phone.length > 50 || eventId.length > 255 || eventTitle.length > 255) {
      return NextResponse.json(
        { error: 'Veuillez vérifier les informations d’inscription.' },
        { status: 400 }
      );
    }

    const data = await createEventRegistration({ name, phone, eventId, eventTitle });

    return NextResponse.json(
      { message: 'Inscription réussie !', data },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Erreur d'inscription :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const registrations = await getEventRegistrations();
    return NextResponse.json(registrations, { status: 200 });
  } catch (error: unknown) {
    console.error('Erreur récupération :', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Impossible de récupérer les inscriptions.' },
      { status: 500 }
    );
  }
}