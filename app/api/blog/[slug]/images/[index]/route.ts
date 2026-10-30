import { NextResponse } from 'next/server';
import { getBlogPostImage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; index: string }> },
) {
  try {
    const { slug, index: indexParam } = await params;
    const index = Number(indexParam);
    if (!Number.isSafeInteger(index) || index < 0 || index > 100) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const image = await getBlogPostImage(slug, index);
    if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

    if (/^https?:\/\//i.test(image)) {
      return NextResponse.redirect(image, {
        headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' },
      });
    }

    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(image);
    if (!match) return NextResponse.json({ error: 'Image format not supported' }, { status: 415 });

    const bytes = Buffer.from(match[2], 'base64');
    return new Response(bytes, {
      headers: {
        'Content-Type': match[1],
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Blog image could not be loaded:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
