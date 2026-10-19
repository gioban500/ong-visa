import { NextResponse } from 'next/server';
import { listCenters, requireAdmin, saveCenter } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

function parseCenter(body: Record<string, unknown>) {
  if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 200) return null;
  const services = Array.isArray(body.services)
    ? body.services.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
    : [];
  const latitude = body.latitude === '' || body.latitude == null ? null : Number(body.latitude);
  const longitude = body.longitude === '' || body.longitude == null ? null : Number(body.longitude);
  if (
    (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
    (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))
  ) return null;
  if (body.active === true && typeof body.verifiedAt !== 'string') return null;

  return {
    id: typeof body.id === 'string' ? body.id : undefined,
    name: body.name,
    address: typeof body.address === 'string' ? body.address : '',
    city: typeof body.city === 'string' ? body.city : '',
    phone: typeof body.phone === 'string' ? body.phone : '',
    email: typeof body.email === 'string' ? body.email : '',
    services,
    badge: typeof body.badge === 'string' ? body.badge : '',
    latitude,
    longitude,
    verifiedAt: typeof body.verifiedAt === 'string' ? body.verifiedAt : null,
    active: body.active === true,
  };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await listCenters(true));
  } catch (error) {
    console.error('Admin screening centers could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger les centres.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const parsed = parseCenter(await request.json());
    if (!parsed) return NextResponse.json({ error: 'Données du centre invalides.' }, { status: 400 });
    return NextResponse.json(await saveCenter(parsed), { status: 201 });
  } catch (error) {
    console.error('Screening center could not be saved:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer le centre.' }, { status: 500 });
  }
}
