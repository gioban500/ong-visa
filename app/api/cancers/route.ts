import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCancers, createCancer, slugify } from '@/lib/db';

// Bloque tout rafraîchissement automatique
export const revalidate = false;

export async function GET() {
  try {
    const cancers = await getCancers();
    return NextResponse.json(cancers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch cancers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cancer = await createCancer({
      ...body,
      id: body.id || slugify(body.name)
    });

    // Régénère uniquement les pages impactées après la création
    revalidatePath('/cancers');
    revalidatePath('/');

    return NextResponse.json(cancer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create cancer' }, { status: 500 });
  }
}