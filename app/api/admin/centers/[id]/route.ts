import { NextResponse } from 'next/server';
import { deleteCenter, requireAdmin, saveCenter } from '@/lib/refonte-backend';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json();
    if (
      typeof body.name !== 'string' || !body.name.trim() || body.name.length > 200 ||
      (typeof body.email === 'string' && body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    ) {
      return NextResponse.json({ error: 'Le nom du centre est obligatoire.' }, { status: 400 });
    }
    const latitude = body.latitude == null || body.latitude === '' ? null : Number(body.latitude);
    const longitude = body.longitude == null || body.longitude === '' ? null : Number(body.longitude);
    const verifiedAt = typeof body.verifiedAt === 'string' && body.verifiedAt ? body.verifiedAt : null;
    if (
      (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
      (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) ||
      (body.active === true && !verifiedAt)
    ) {
      return NextResponse.json({ error: 'Coordonnées ou date de vérification invalides.' }, { status: 400 });
    }
    const center = await saveCenter({
      id,
      name: body.name,
      address: typeof body.address === 'string' ? body.address : '',
      city: typeof body.city === 'string' ? body.city : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      email: typeof body.email === 'string' ? body.email : '',
      services: Array.isArray(body.services)
        ? body.services.filter((service: unknown): service is string => typeof service === 'string').map((service: string) => service.trim()).filter(Boolean)
        : [],
      badge: typeof body.badge === 'string' ? body.badge : '',
      latitude,
      longitude,
      verifiedAt,
      active: body.active === true,
    });
    return NextResponse.json(center);
  } catch (error) {
    console.error('Screening center update failed:', error);
    return NextResponse.json({ error: 'Impossible de modifier le centre.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    await deleteCenter(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Screening center deletion failed:', error);
    return NextResponse.json({ error: 'Impossible de supprimer le centre.' }, { status: 500 });
  }
}
