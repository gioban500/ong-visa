import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/refonte-backend';

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
    return NextResponse.json({ admin: { email: admin.email, role: admin.role } });
  } catch (error) {
    console.error('Admin session check failed:', error);
    return NextResponse.json({ error: 'Service d’administration temporairement indisponible.' }, { status: 503 });
  }
}
