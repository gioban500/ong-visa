import { NextResponse } from 'next/server';
import { getSubscribers, createSubscriber } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim();

    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    const subscriber = await createSubscriber({
      firstName: body.firstName,
      lastName: body.lastName,
      email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}