import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBlogPostBySlug, updateBlogPost, deleteBlogPost } from '@/lib/db';

// Bloque le rafraîchissement automatique par intervalle
export const revalidate = false;

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const post = await updateBlogPost(slug, body);

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