import { NextResponse } from 'next/server';
import { listCenters } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await listCenters());
  } catch (error) {
    console.error('Screening centers could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger les centres.' }, { status: 500 });
  }
}
