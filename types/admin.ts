export interface Testimonial {
  id: string;
  name: string;
  image: string;
  story: string;
  cancerType: string;
  date: string;
  approved: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  content?: string;
  image?: string;
  images?: string[];
  author: string;
  publishedDate: string | null;
  readTime?: number;
  category: string;
  tags: string[];
  published: boolean;
}

export interface SiteSettings {
  logo: string;
  siteName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}
