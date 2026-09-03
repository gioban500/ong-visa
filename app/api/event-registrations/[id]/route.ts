import { NextRequest, NextResponse } from 'next/server';
import { deleteEventRegistration } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Résolution de la promesse des params

    await deleteEventRegistration(id);

    return NextResponse.json({ message: 'Inscription supprimée avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'inscription" },
      { status: 500 }
    );
  }
}