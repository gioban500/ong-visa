import { NextResponse } from 'next/server';
import { createEventRegistration, getEventRegistrations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, phone, eventId, eventTitle } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Le nom et le numéro de téléphone sont requis.' },
        { status: 400 }
      );
    }

    const data = await createEventRegistration({ name, phone, eventId, eventTitle });

    return NextResponse.json(
      { message: 'Inscription réussie !', data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur d'inscription :", error);
    
    // Renvoyer le message d'erreur exact pour le diagnostic
    return NextResponse.json(
      { error: error?.message || "Une erreur est survenue lors de l'enregistrement." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const registrations = await getEventRegistrations();
    return NextResponse.json(registrations, { status: 200 });
  } catch (error: any) {
    console.error('Erreur récupération :', error);
    return NextResponse.json(
      { error: error?.message || 'Impossible de récupérer les inscriptions.' },
      { status: 500 }
    );
  }
}