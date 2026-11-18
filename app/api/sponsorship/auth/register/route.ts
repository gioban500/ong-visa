import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import { enforceRateLimit, registerSponsor } from '@/lib/refonte-backend';

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, 'sponsor-register', 5, 60 * 60);
  if (limited) return limited;
  try {
    const body = await readJsonBody(request, 4096);
    if (
      !isJsonRecord(body) ||
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      body.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
      body.password.length < 12 ||
      Buffer.byteLength(body.password, 'utf8') > 72
    ) {
      return NextResponse.json({ error: 'Adresse e-mail ou mot de passe invalide (12 caractères minimum).' }, { status: 400 });
    }
    return await registerSponsor(body.email, body.password);
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Sponsor registration failed:', error);
    return NextResponse.json({ error: 'Création du compte impossible pour le moment.' }, { status: 500 });
  }
}
