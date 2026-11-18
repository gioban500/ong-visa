import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import {
  listSponsorablePeople,
  requireAdmin,
  saveSponsorablePerson,
} from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

function parsePerson(body: unknown) {
  if (
    !isJsonRecord(body) ||
    typeof body.name !== 'string' ||
    !body.name.trim() ||
    body.name.length > 200 ||
    typeof body.description !== 'string' ||
    body.description.length > 5000 ||
    typeof body.totalCost !== 'number' ||
    !Number.isSafeInteger(body.totalCost) ||
    body.totalCost < 1 ||
    body.totalCost > 1_000_000_000_000 ||
    (body.active !== undefined && typeof body.active !== 'boolean')
  ) return null;
  return {
    name: body.name,
    description: body.description,
    totalCost: body.totalCost,
    active: body.active !== false,
  };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await listSponsorablePeople(true));
  } catch (error) {
    console.error('Admin sponsorable people could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger les personnes parrainables.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const parsed = parsePerson(await readJsonBody(request, 12_000));
    if (!parsed) return NextResponse.json({ error: 'Informations sur la personne invalides.' }, { status: 400 });
    return NextResponse.json(await saveSponsorablePerson(parsed), { status: 201 });
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Sponsorable person could not be created:', error);
    return NextResponse.json({ error: 'Impossible d’ajouter cette personne.' }, { status: 500 });
  }
}
