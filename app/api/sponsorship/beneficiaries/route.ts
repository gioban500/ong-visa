import { NextResponse } from 'next/server';
import { listSponsorablePeople } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await listSponsorablePeople());
  } catch (error) {
    console.error('Sponsorable people could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger les personnes parrainables.' }, { status: 500 });
  }
}
