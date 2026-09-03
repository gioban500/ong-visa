import { NextResponse } from 'next/server';
import { deleteEventRegistration } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deleteEventRegistration(id);
    return NextResponse.json({ message: 'Inscription supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur suppression :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression.' },
      { status: 500 }
    );
  }
}