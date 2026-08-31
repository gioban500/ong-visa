import { NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost, slugify } from '@/lib/db';

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
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
