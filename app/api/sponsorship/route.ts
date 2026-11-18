import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import {
  createSponsorship,
  getSponsorSession,
  listSponsorSponsorships,
  requireSponsor,
} from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireSponsor();
  if (denied) return denied;
  try {
    const sponsor = await getSponsorSession();
    if (!sponsor) return NextResponse.json({ error: 'Connexion au compte parrain requise.' }, { status: 401 });
    return NextResponse.json(await listSponsorSponsorships(sponsor.id));
  } catch (error) {
    console.error('Sponsor dashboard could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger votre espace parrain.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireSponsor();
  if (denied) return denied;
  try {
    const body = await readJsonBody(request, 2048);
    if (
      !isJsonRecord(body) ||
      typeof body.beneficiaryId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.beneficiaryId)
    ) {
      return NextResponse.json({ error: 'Personne parrainable invalide.' }, { status: 400 });
    }
    const sponsor = await getSponsorSession();
    if (!sponsor) return NextResponse.json({ error: 'Connexion au compte parrain requise.' }, { status: 401 });
    const result = await createSponsorship(sponsor.id, body.beneficiaryId);
    if (!result) return NextResponse.json({ error: 'Cette personne n’est plus disponible au parrainage.' }, { status: 404 });
    return NextResponse.json(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Sponsorship could not be created:', error);
    return NextResponse.json({ error: 'Impossible de créer ce parrainage.' }, { status: 500 });
  }
}
