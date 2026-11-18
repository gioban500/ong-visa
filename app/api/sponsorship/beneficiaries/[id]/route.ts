import { NextResponse } from 'next/server';
import { getSponsorablePerson } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: 'Personne parrainable introuvable.' }, { status: 404 });
    }
    const person = await getSponsorablePerson(id);
    if (!person) return NextResponse.json({ error: 'Personne parrainable introuvable.' }, { status: 404 });
    return NextResponse.json(person);
  } catch (error) {
    console.error('Sponsorable person could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger cette fiche.' }, { status: 500 });
  }
}
