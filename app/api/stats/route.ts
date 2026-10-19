import { NextResponse } from 'next/server';
import { getCancers, getTestimonials, getBlogPosts } from '@/lib/db';
import { requireAdmin } from '@/lib/refonte-backend';

export const dynamic = 'force-dynamic';

interface TestimonialSummary {
  id: string;
  name: string;
  cancerType: string;
  story: string;
  date: string;
  approved: boolean;
}

interface BlogPostSummary {
  id: string;
  title: string;
  author: string;
  publishedDate: string;
  category: string;
  published: boolean;
  image: string;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const cancers = await getCancers();
    const testimonialRows = await getTestimonials();
    const testimonials: TestimonialSummary[] = testimonialRows.flatMap((testimonial) => {
      if (
        typeof testimonial.id !== 'string'
        || typeof testimonial.name !== 'string'
        || typeof testimonial.story !== 'string'
      ) return [];

      return [{
        id: testimonial.id,
        name: testimonial.name,
        cancerType: typeof testimonial.cancerType === 'string' ? testimonial.cancerType : '',
        story: testimonial.story,
        date: typeof testimonial.date === 'string' ? testimonial.date : '',
        approved: testimonial.approved === true,
      }];
    });

    const blogRows = await getBlogPosts();
    const blogPosts: BlogPostSummary[] = blogRows.flatMap((post) => {
      if (typeof post.id !== 'string' || typeof post.title !== 'string') return [];

      return [{
        id: post.id,
        title: post.title,
        author: typeof post.author === 'string' ? post.author : '',
        publishedDate: typeof post.publishedDate === 'string' ? post.publishedDate : '',
        category: typeof post.category === 'string' ? post.category : '',
        published: post.published === true,
        image: typeof post.image === 'string' ? post.image : '',
      }];
    });

    const pendingTestimonials = testimonials.filter((t) => !t.approved);
    const approvedTestimonials = testimonials.filter((t) => t.approved);
    const publishedPosts = blogPosts.filter((p) => p.published);

    // 5 most recent testimonials (pending first)
    const recentTestimonials = [...pendingTestimonials, ...approvedTestimonials]
      .sort((a: TestimonialSummary, b: TestimonialSummary) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        name: t.name,
        cancerType: t.cancerType,
        excerpt: t.story.slice(0, 80) + '...',
        date: t.date,
        approved: t.approved,
      }));

    // 3 most recent blog posts
    const recentPosts = blogPosts
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author,
        publishedDate: p.publishedDate,
        category: p.category,
        published: p.published,
        image: p.image,
      }));

    return NextResponse.json({
      stats: {
        testimonials: testimonials.length,
        approvedTestimonials: approvedTestimonials.length,
        pendingTestimonials: pendingTestimonials.length,
        blogPosts: blogPosts.length,
        publishedPosts: publishedPosts.length,
        cancers: cancers.length,
      },
      recentTestimonials,
      recentPosts,
    });
  } catch (error) {
    console.error('Admin statistics could not be loaded:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
