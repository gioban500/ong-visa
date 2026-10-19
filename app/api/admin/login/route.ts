import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import { enforceRateLimit, loginAdmin } from '@/lib/refonte-backend';

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, 'admin-login', 10, 15 * 60);
  if (limited) return limited;

  try {
    const body = await readJsonBody(request, 4096);
    if (!isJsonRecord(body)) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 400 });
    }
    if (
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      body.email.length > 254 ||
      body.password.length > 200
    ) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 400 });
    }
    return await loginAdmin(body.email, body.password);
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin login failed:', error);
    return NextResponse.json({ error: 'Connexion indisponible pour le moment.' }, { status: 500 });
  }
}
