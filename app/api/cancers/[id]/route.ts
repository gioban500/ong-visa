import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCancerById, updateCancer, deleteCancer } from '@/lib/db';

// Bloque tout rafraîchissement automatique
export const revalidate = false;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cancer = await getCancerById(id);
    if (!cancer) {
      return NextResponse.json({ error: 'Cancer not found' }, { status: 404 });
    }
    return NextResponse.json(cancer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch cancer' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cancer = await updateCancer(id, body);

    // Régénère la liste et la fiche spécifique lors d'une mise à jour
    revalidatePath('/cancers');
    revalidatePath(`/cancers/${id}`);
    revalidatePath('/');

    return NextResponse.json(cancer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update cancer' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteCancer(id);

    // Nettoie le cache de la fiche et de la liste à la suppression
    revalidatePath('/cancers');
    revalidatePath(`/cancers/${id}`);
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete cancer' }, { status: 500 });
  }
}