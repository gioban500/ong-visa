import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isJsonRecord, JsonBodyError, readJsonBody } from '@/lib/security/request-body';
import { bootstrapFirstAdmin, enforceRateLimit } from '@/lib/refonte-backend';

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, 'admin-bootstrap', 5, 60 * 60);
  if (limited) return limited;

  try {
    const expectedToken = process.env.ADMIN_SETUP_TOKEN;
    const suppliedToken = request.headers.get('x-admin-setup-token') || '';
    if (!expectedToken || expectedToken.length < 32) {
      return NextResponse.json({ error: 'Initialisation administrateur non configurée.' }, { status: 503 });
    }

    const suppliedBuffer = Buffer.from(suppliedToken);
    const expectedBuffer = Buffer.from(expectedToken);
    if (
      suppliedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(suppliedBuffer, expectedBuffer)
    ) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const body = await readJsonBody(request, 4096);
    if (!isJsonRecord(body)) {
      return NextResponse.json(
        { error: 'Fournissez un e-mail valide et un mot de passe de 14 caractères minimum.' },
        { status: 400 },
      );
    }
    if (
      typeof body.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
      typeof body.password !== 'string' ||
      body.password.length < 14 ||
      body.password.length > 200
    ) {
      return NextResponse.json(
        { error: 'Fournissez un e-mail valide et un mot de passe de 14 caractères minimum.' },
        { status: 400 },
      );
    }

    const created = await bootstrapFirstAdmin(body.email, body.password);
    if (!created) {
      return NextResponse.json({ error: 'Un compte administrateur existe déjà.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Compte administrateur créé.' }, { status: 201 });
  } catch (error) {
    if (error instanceof JsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin bootstrap failed:', error);
    return NextResponse.json({ error: 'Initialisation administrateur impossible.' }, { status: 500 });
  }
}
