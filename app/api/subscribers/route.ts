import { NextResponse } from 'next/server';

function retiredRoute() {
  return NextResponse.json(
    { error: 'Cette ancienne route est désactivée. Les demandes utilisent /api/contact-messages.' },
    { status: 410 },
  );
}

export async function GET() {
  return retiredRoute();
}

export async function POST() {
  return retiredRoute();
}
