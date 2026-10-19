import { NextResponse } from 'next/server';
import {
  listCenters,
  listContactMessages,
  listQuestionResponses,
  listSiteTopics,
  requireAdmin,
} from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const [messages, centers, topics, questionResponses] = await Promise.all([
      listContactMessages(),
      listCenters(true),
      listSiteTopics(true),
      listQuestionResponses(true),
    ]);
    return NextResponse.json({
      messages: messages.length,
      newMessages: messages.filter((item) => item.status === 'new').length,
      centers: centers.length,
      publishedCenters: centers.filter((item) => item.active).length,
      topics: topics.length,
      publishedTopics: topics.filter((item) => item.active).length,
      questionResponses: questionResponses.length,
    });
  } catch (error) {
    console.error('Admin summary could not be loaded:', error);
    return NextResponse.json({ error: 'Impossible de charger le tableau de bord.' }, { status: 500 });
  }
}
