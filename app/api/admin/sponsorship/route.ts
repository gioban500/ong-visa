import { NextResponse } from 'next/server';
import { listAdminSponsorshipData, requireAdmin } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await listAdminSponsorshipData());
  } catch (error) {
    console.error('Admin sponsorship data could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger les données de parrainage.' }, { status: 500 });
  }
}
