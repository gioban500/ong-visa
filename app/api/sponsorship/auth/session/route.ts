import { NextResponse } from 'next/server';
import { getSponsorSession } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sponsor = await getSponsorSession();
    if (!sponsor) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
    return NextResponse.json({ sponsor: { email: sponsor.email } });
  } catch (error) {
    console.error('Sponsor session check failed:', error);
    return NextResponse.json({ error: 'Service de parrainage temporairement indisponible.' }, { status: 503 });
  }
}
