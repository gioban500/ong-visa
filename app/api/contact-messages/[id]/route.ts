import { NextResponse } from 'next/server';
import { deleteContactMessage, requireAdmin, updateContactMessage } from '@/lib/refonte-backend';

const statuses = ['new', 'in_progress', 'resolved'] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json();
    if (!statuses.includes(body.status)) {
      return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
    }
    const updated = await updateContactMessage(id, body.status);
    if (!updated) return NextResponse.json({ error: 'Message introuvable.' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Contact message status update failed:', error);
    return NextResponse.json({ error: 'Impossible de mettre à jour le message.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    await deleteContactMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact message deletion failed:', error);
    return NextResponse.json({ error: 'Impossible de supprimer le message.' }, { status: 500 });
  }
}
