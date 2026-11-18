import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import { requireAdmin, saveSponsorablePerson } from '@/lib/refonte-backend';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await readJsonBody(request, 12_000);
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
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
      typeof body.active !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Informations sur la personne invalides.' }, { status: 400 });
    }
    return NextResponse.json(await saveSponsorablePerson({
      id,
      name: body.name,
      description: body.description,
      totalCost: body.totalCost,
      active: body.active,
    }));
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Sponsorable person could not be updated:', error);
    return NextResponse.json({ error: 'Impossible de modifier cette fiche.' }, { status: 500 });
  }
}
