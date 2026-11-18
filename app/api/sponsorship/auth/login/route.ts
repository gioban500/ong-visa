import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import { enforceRateLimit, loginSponsor } from '@/lib/refonte-backend';

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, 'sponsor-login', 10, 15 * 60);
  if (limited) return limited;
  try {
    const body = await readJsonBody(request, 4096);
    if (
      !isJsonRecord(body) ||
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      body.email.length > 254 ||
      Buffer.byteLength(body.password, 'utf8') > 72
    ) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 400 });
    }
    return await loginSponsor(body.email, body.password);
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Sponsor login failed:', error);
    return NextResponse.json({ error: 'Connexion indisponible pour le moment.' }, { status: 500 });
  }
}
