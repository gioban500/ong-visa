import { NextResponse } from 'next/server';

export async function DELETE() {
  return NextResponse.json(
    { error: 'Cette ancienne route est désactivée. Les demandes utilisent /api/contact-messages.' },
    { status: 410 },
  );
}
