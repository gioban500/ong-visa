import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBlogPostSummaries, createBlogPost, slugify } from '@/lib/db';
import { requireAdmin } from '@/lib/refonte-backend';

// Bloque le rafraîchissement automatique par intervalle
export const revalidate = false;

export async function GET(request: Request) {
  try {
    const posts = await getBlogPostSummaries();
    const includeDrafts = new URL(request.url).searchParams.get('includeDrafts') === 'true';
    if (includeDrafts) {
      const denied = await requireAdmin();
      if (denied) return denied;
      return NextResponse.json(posts);
    }
    return NextResponse.json(posts.filter((post) => post.published === true));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string'
      ? body.description.trim()
      : typeof body.content === 'string'
        ? body.content.trim()
        : '';
    const images = Array.isArray(body.images)
      ? body.images
      : typeof body.image === 'string' && body.image
        ? [body.image]
        : [];
    if (!title || !description) {
      return NextResponse.json({ error: 'A title and description are required' }, { status: 400 });
    }
    if (images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }
    if (!images.every((image: unknown) => typeof image === 'string')) {
      return NextResponse.json({ error: 'Images must be valid strings' }, { status: 400 });
    }
    if (body.publishedDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.publishedDate)) {
      return NextResponse.json({ error: 'The event date must use YYYY-MM-DD format' }, { status: 400 });
    }

    const post = await createBlogPost({
      ...body,
      title,
      description,
      excerpt: description,
      content: description,
      images,
      image: images[0] || '',
      publishedDate: body.publishedDate || null,
      published: body.published === true,
      id: body.id || Date.now().toString(),
      slug: body.slug || slugify(title)
    });

    // Déclenche la mise à jour UNIQUE à la création
    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}