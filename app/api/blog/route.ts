import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBlogPosts, createBlogPost, slugify } from '@/lib/db';

// Bloque le rafraîchissement automatique par intervalle
export const revalidate = false;

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const post = await createBlogPost({
      ...body,
      id: body.id || Date.now().toString(),
      slug: body.slug || slugify(body.title)
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