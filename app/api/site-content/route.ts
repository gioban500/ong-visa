import { NextResponse } from 'next/server';
import {
  listAbnormalResultSteps,
  listQuestionResponses,
  listSiteTopics,
} from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [topics, resultSteps, questionResponses] = await Promise.all([
      listSiteTopics(),
      listAbnormalResultSteps(),
      listQuestionResponses(),
    ]);
    return NextResponse.json({ topics, resultSteps, questionResponses });
  } catch (error) {
    console.error('Homepage content could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger le contenu du site.' }, { status: 500 });
  }
}
