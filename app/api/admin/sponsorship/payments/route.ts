import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import {
  getAdminSession,
  recordSponsorshipPayment,
  requireAdmin,
  SponsorshipPaymentLimitError,
} from '@/lib/refonte-backend';

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await readJsonBody(request, 2048);
    if (
      !isJsonRecord(body) ||
      typeof body.sponsorshipId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.sponsorshipId) ||
      typeof body.amount !== 'number' ||
      !Number.isSafeInteger(body.amount) ||
      body.amount < 1 ||
      body.amount > 1_000_000_000_000
    ) {
      return NextResponse.json({ error: 'Montant ou parrainage invalide.' }, { status: 400 });
    }
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Authentification administrateur requise.' }, { status: 401 });
    const payment = await recordSponsorshipPayment(body.sponsorshipId, body.amount, admin.id);
    if (!payment) return NextResponse.json({ error: 'Parrainage introuvable.' }, { status: 404 });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SponsorshipPaymentLimitError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('Sponsorship payment could not be recorded:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer ce versement.' }, { status: 500 });
  }
}
