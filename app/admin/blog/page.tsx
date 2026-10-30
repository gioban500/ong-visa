'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, ImagePlus, Loader2, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { clearClientData, getClientData, hasFreshClientData, setClientData } from '@/lib/client-data-cache';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  images?: string[];
  imageCount?: number;
  publishedDate?: string;
  published: boolean;
}

interface BlogForm {
  title: string;
  description: string;
  images: string[];
  eventDate: string;
  published: boolean;
}

const EMPTY_FORM: BlogForm = {
  title: '',
  description: '',
  images: [],
  eventDate: '',
  published: false,
};

function toImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const source = URL.createObjectURL(file);
    const image = document.createElement('img');
    image.onload = () => {
      URL.revokeObjectURL(source);
      const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error(`Impossible de traiter ${file.name}.`));
        return;
      }
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error(`Impossible de lire ${file.name}.`));
    };
    image.src = source;
  });
}

function formatDate(value?: string) {
  if (!value) return 'Date non précisée';
  const [year, month, day] = value.slice(0, 10).split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export default function AdminBlog() {
  const cacheKey = '/api/blog?includeDrafts=true';
  const [posts, setPosts] = useState<BlogPost[]>(() => getClientData<BlogPost[]>(cacheKey) || []);
  const [loading, setLoading] = useState(() => !getClientData<BlogPost[]>(cacheKey));
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async (force = false) => {
    if (!force && hasFreshClientData(cacheKey)) {
      setLoading(false);
      return;
    }
    if (!getClientData<BlogPost[]>(cacheKey)) setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/blog?includeDrafts=true', { cache: 'no-store' });
      if (!response.ok) throw new Error('Impossible de charger les publications.');
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('La réponse du serveur est invalide.');
      setClientData(cacheKey, data as BlogPost[]);
      setClientData('/api/blog', (data as BlogPost[]).filter((post) => post.published));
      setPosts(data as BlogPost[]);
    } catch (loadError) {
      console.error('Erreur lors du chargement des publications :', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchPosts(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchPosts]);

  const openNewPost = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setError('');
    setIsModalOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      description: post.description || post.excerpt || post.content || '',
      images: post.images?.length ? post.images : (post.image ? [post.image] : []),
      eventDate: post.publishedDate?.slice(0, 10) || '',
      published: post.published === true,
    });
    setError('');
    setIsModalOpen(true);
    if (post.images?.length) return;

    void fetch(`/api/blog/${encodeURIComponent(post.slug)}?includeImages=true`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Impossible de charger les images de cette publication.');
        const fullPost: BlogPost = await response.json();
        setEditingPost((current) => current?.slug === post.slug ? fullPost : current);
        setForm((current) => current.title === post.title
          ? {
            ...current,
            description: fullPost.description || fullPost.excerpt || fullPost.content || current.description,
            images: fullPost.images?.length ? fullPost.images : (fullPost.image ? [fullPost.image] : []),
          }
          : current);
      })
      .catch((loadError: unknown) => {
        console.error('Erreur lors du chargement des images de la publication :', loadError);
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les images.');
      });
  };

  const handleImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setError('Choisissez uniquement des fichiers image.');
      return;
    }

    setError('');
    try {
      const images = await Promise.all(files.map(toImageDataUrl));
      setForm((current) => ({ ...current, images: [...current.images, ...images] }));
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : 'Impossible de charger les images.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.images.length === 0) {
      setError('Ajoutez au moins une image à la publication.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...(editingPost ? { id: editingPost.id, slug: editingPost.slug } : {}),
        title: form.title.trim(),
        description: form.description.trim(),
        images: form.images,
        image: form.images[0] || '',
        publishedDate: form.eventDate || null,
        published: form.published,
        author: 'ONG VISA',
        category: 'Actualités',
        readTime: 1,
        tags: [],
      };
      const url = editingPost ? `/api/blog/${encodeURIComponent(editingPost.slug)}` : '/api/blog';
      const response = await fetch(url, {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Erreur lors de la sauvegarde.');
      }

      if (editingPost) clearClientData(`/api/blog/${encodeURIComponent(editingPost.slug)}`);
      setIsModalOpen(false);
      setForm(EMPTY_FORM);
      setEditingPost(null);
      await fetchPosts(true);
    } catch (saveError) {
      console.error('Erreur lors de la sauvegarde de la publication :', saveError);
      setError(saveError instanceof Error ? saveError.message : 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (!window.confirm(`Supprimer « ${post.title} » ?`)) return;
    setError('');
    try {
      const response = await fetch(`/api/blog/${encodeURIComponent(post.slug)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('La suppression a échoué.');
      clearClientData(`/api/blog/${encodeURIComponent(post.slug)}`);
      await fetchPosts(true);
    } catch (deleteError) {
      console.error('Erreur lors de la suppression de la publication :', deleteError);
      setError(deleteError instanceof Error ? deleteError.message : 'La suppression a échoué.');
    }
  };

  const publishedCount = posts.filter((post) => post.published).length;

  return (
    <main className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#9E2F55]">Espace éditorial</p>
          <h1 className="text-3xl font-bold text-[#2A2521]">Publications</h1>
          <p className="mt-2 text-sm text-[#756B60]">
            {posts.length} publication{posts.length === 1 ? '' : 's'} · {publishedCount} publiée{publishedCount === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void fetchPosts(true)}
            aria-label="Actualiser"
            className="rounded-lg border border-[#E2D7C7] bg-white p-3 text-[#514A43] hover:bg-[#FAF6F0]"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={openNewPost}
            className="inline-flex items-center gap-2 rounded-lg bg-[#9E2F55] px-5 py-3 font-semibold text-white transition hover:bg-[#7A2143]"
          >
            <Plus className="h-5 w-5" /> Nouvelle publication
          </button>
        </div>
      </header>

      {error && !isModalOpen && (
        <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-[#1F5A56]" /></div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D8CBB9] bg-white px-6 py-16 text-center">
          <ImagePlus className="mx-auto mb-4 h-10 w-10 text-[#9E2F55]" />
          <h2 className="text-lg font-semibold text-[#2A2521]">Aucune publication pour le moment</h2>
          <p className="mt-2 text-sm text-[#756B60]">Ajoutez un titre, une description et une ou plusieurs images.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const image = post.images?.[0] || post.image;
            return (
              <article key={post.id || post.slug} className="overflow-hidden rounded-xl border border-[#E2D7C7] bg-white shadow-sm">
                <div className="relative aspect-[16/9] bg-[#F5EFE6]">
                  {image ? (
                    <Image src={image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#9E2F55]"><ImagePlus className="h-9 w-9" /></div>
                  )}
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${post.published ? 'bg-[#E7F1ED] text-[#1F5A56]' : 'bg-white/90 text-[#756B60]'}`}>
                    {post.published ? 'Publiée' : 'Brouillon'}
                  </span>
                </div>
                <div className="p-5">
                  <p className="mb-2 flex items-center gap-2 text-xs text-[#756B60]">
                    <CalendarDays className="h-4 w-4 text-[#1F5A56]" />
                    {formatDate(post.publishedDate)}
                    {(post.imageCount || post.images?.length || (post.image ? 1 : 0)) > 1 && (
                      <span>· {post.imageCount || post.images?.length} images</span>
                    )}
                  </p>
                  <h2 className="line-clamp-1 text-lg font-semibold text-[#2A2521]">{post.title}</h2>
                  <p className="mt-2 line-clamp-3 min-h-[4.5rem] whitespace-pre-line text-sm leading-relaxed text-[#514A43]">
                    {post.description || post.excerpt || post.content}
                  </p>
                  <div className="mt-5 flex justify-end gap-2 border-t border-[#F0E9DF] pt-4">
                    <button type="button" onClick={() => openEditPost(post)} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#1F5A56] hover:bg-[#E7F1ED]">
                      <Pencil className="h-4 w-4" /> Modifier
                    </button>
                    <button type="button" onClick={() => void deletePost(post)} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#9E2F55] hover:bg-[#F9E8ED]">
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#201b18]/60 p-4 sm:items-center">
          <section role="dialog" aria-modal="true" aria-labelledby="blog-form-title" className="my-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#E2D7C7] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9E2F55]">Blog ONG VISA</p>
                <h2 id="blog-form-title" className="mt-1 text-xl font-bold text-[#2A2521]">
                  {editingPost ? 'Modifier la publication' : 'Nouvelle publication'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} aria-label="Fermer" className="rounded-full p-2 text-[#756B60] hover:bg-[#FAF6F0]">
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
              <div>
                <label htmlFor="post-title" className="mb-2 block text-sm font-semibold text-[#2A2521]">Titre *</label>
                <input
                  id="post-title"
                  required
                  maxLength={255}
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-lg border border-[#D8CBB9] px-4 py-3 text-[#2A2521] outline-none focus:border-[#1F5A56] focus:ring-2 focus:ring-[#1F5A56]/15"
                  placeholder="Titre de la publication"
                />
              </div>

              <div>
                <label htmlFor="post-description" className="mb-2 block text-sm font-semibold text-[#2A2521]">Description *</label>
                <textarea
                  id="post-description"
                  required
                  rows={6}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="w-full resize-y rounded-lg border border-[#D8CBB9] px-4 py-3 text-[#2A2521] outline-none focus:border-[#1F5A56] focus:ring-2 focus:ring-[#1F5A56]/15"
                  placeholder="Décrivez cette actualité ou cette action..."
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-[#2A2521]">Images *</label>
                  <span className="text-xs text-[#756B60]">Une ou plusieurs</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={(event) => void handleImages(event)} className="sr-only" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#9E2F55]/50 px-4 py-3 text-sm font-semibold text-[#9E2F55] hover:bg-[#F9E8ED]"
                >
                  <ImagePlus className="h-4 w-4" /> Ajouter des images
                </button>
                {form.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {form.images.map((image, index) => (
                      <div key={`${index}-${image.slice(-24)}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#F5EFE6]">
                        <Image src={image} alt={`Image ${index + 1}`} fill unoptimized sizes="160px" className="object-cover" />
                        <button
                          type="button"
                          aria-label={`Retirer l’image ${index + 1}`}
                          onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, itemIndex) => itemIndex !== index) }))}
                          className="absolute right-2 top-2 rounded-full bg-[#2A2521]/75 p-1.5 text-white hover:bg-[#9E2F55]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-5 border-t border-[#F0E9DF] pt-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="post-event-date" className="mb-2 block text-sm font-semibold text-[#2A2521]">Date de l’événement (facultative)</label>
                  <input
                    id="post-event-date"
                    type="date"
                    value={form.eventDate}
                    onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))}
                    className="w-full rounded-lg border border-[#D8CBB9] px-4 py-3 text-[#2A2521] outline-none focus:border-[#1F5A56] focus:ring-2 focus:ring-[#1F5A56]/15"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-3 self-end rounded-lg bg-[#FAF6F0] p-3 text-sm font-medium text-[#2A2521]">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))}
                    className="h-4 w-4 accent-[#1F5A56]"
                  />
                  Publier immédiatement
                </label>
              </div>

              <footer className="flex justify-end gap-3 border-t border-[#F0E9DF] pt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-[#D8CBB9] px-4 py-2.5 text-sm font-semibold text-[#514A43] hover:bg-[#FAF6F0]">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#1F5A56] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#123E3B] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
