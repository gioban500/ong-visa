import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBlogPostBySlug, getBlogPostSummaryBySlug, updateBlogPost, deleteBlogPost } from '@/lib/db';
import { requireAdmin } from '@/lib/refonte-backend';

// Bloque le rafraîchissement automatique par intervalle
export const revalidate = false;

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const includeImages = new URL(request.url).searchParams.get('includeImages') === 'true';
    if (includeImages) {
      const denied = await requireAdmin();
      if (denied) return denied;
    }
    const post = includeImages
      ? await getBlogPostBySlug(slug)
      : await getBlogPostSummaryBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (post.published !== true) {
      const denied = await requireAdmin();
      if (denied) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { slug } = await params;
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
    const updates = {
      ...body,
      title,
      description,
      excerpt: description,
      content: description,
      images,
      image: images[0] || '',
      publishedDate: body.publishedDate || null,
    };
    const post = await updateBlogPost(slug, updates);

    // Déclenche la mise à jour UNIQUE à la modification
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { slug } = await params;
    await deleteBlogPost(slug);

    // Déclenche la mise à jour UNIQUE à la suppression
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}