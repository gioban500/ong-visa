'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Upload, Loader2, RefreshCw } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedDate: string;
  readTime: number;
  category: string;
  tags: string[];
  published: boolean;
}

const CATEGORIES = ['Actualités', 'Sensibilisation', 'Dépistage', 'Témoignages', 'Prévention', 'Événements', 'Recherche'];

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'Admin ONG VISA',
    category: 'Actualités',
    tags: [] as string[],
    published: false,
    publishedDate: '',
    readTime: 1
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog', { cache: 'no-store' });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(f => ({ ...f, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = tagsInput ? tagsInput.split(',').map(s => s.trim()).filter(Boolean) : formData.tags;
      const wordCount = formData.content.split(' ').filter(Boolean).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      
      let publishedDate = new Date().toISOString();
      if (formData.publishedDate) {
        try {
          publishedDate = new Date(formData.publishedDate).toISOString();
        } catch (e) {
          publishedDate = formData.publishedDate;
        }
      }
      
      const payload = { 
        ...(editingPost ? { id: editingPost.id, slug: editingPost.slug } : {}),
        ...formData, 
        tags: formData.category === 'Événements' ? [] : tags, 
        readTime, 
        publishedDate
      };

      const targetIdentifier = editingPost?.slug || editingPost?.id;
      const url = editingPost ? `/api/blog/${targetIdentifier}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || 'Erreur lors de la sauvegarde');
      }

      await fetchPosts();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', image: '', author: 'Admin ONG VISA', category: 'Actualités', tags: [], published: false, publishedDate: '', readTime: 1 });
    setTagsInput('');
    setEditingPost(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.image || '',
      author: post.author || 'Admin ONG VISA',
      category: post.category || 'Actualités',
      tags: post.tags || [],
      published: post.published ?? false,
      publishedDate: post.publishedDate ? post.publishedDate.split('T')[0] : '',
      readTime: post.readTime || 1
    });
    setTagsInput((post.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    const targetIdentifier = post.slug || post.id;
    try {
      const res = await fetch(`/api/blog/${targetIdentifier}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Échec de la suppression');
      }
      await fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    const targetIdentifier = post.slug || post.id;
    const payload = { ...post, published: !post.published };
    
    try {
      const res = await fetch(`/api/blog/${targetIdentifier}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Échec de la mise à jour du statut');
      }
      await fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const published = posts.filter(p => p.published).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion du Blog</h1>
          <p className="text-gray-600">
            {posts.length} articles · <span className="text-green-600 font-medium">{published} publiés</span> · <span className="text-gray-500">{posts.length - published} brouillons</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPosts} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" title="Actualiser">
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nouvel Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Articles</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-100 text-center">
          <p className="text-3xl font-bold text-green-600">{published}</p>
          <p className="text-sm text-green-700 mt-1">Publiés</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-500">{posts.length - published}</p>
          <p className="text-sm text-gray-600 mt-1">Brouillons</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Article</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Auteur</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Catégorie</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id || post.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <span className="text-purple-400 text-lg">📝</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{post.readTime} min de lecture</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{post.author}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{post.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => togglePublish(post)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      post.published ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      {post.published ? '✓ Publié' : '○ Brouillon'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(post)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(post)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPost ? 'Modifier l\'Article' : 'Nouvel Article de Blog'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l&apos;article *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Titre accrocheur..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Auteur</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(f => ({ ...f, author: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image de Couverture</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-purple-500 cursor-pointer transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {formData.image ? (
                    <div>
                      <img src={formData.image} alt="Aperçu" className="max-h-48 mx-auto rounded-lg mb-2 object-cover" />
                      <p className="text-sm text-purple-600 font-medium">Cliquer pour changer</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">Télécharger une image de couverture</p>
                    </div>
                  )}
                </div>
              </div>

              {formData.category === 'Événements' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de l'événement *</label>
                    <input
                      type="date"
                      value={formData.publishedDate}
                      onChange={(e) => setFormData(f => ({ ...f, publishedDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Petite description *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(f => ({ ...f, excerpt: e.target.value, content: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                      placeholder="Description de l'événement..."
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Extrait / Résumé *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(f => ({ ...f, excerpt: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                      placeholder="Un résumé bref..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contenu Complet *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(f => ({ ...f, content: e.target.value }))}
                      rows={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none font-mono text-sm"
                      placeholder="Rédigez votre article ici..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="dépistage, prévention..."
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(f => ({ ...f, published: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publier immédiatement
                </label>
              </div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-white py-4 border-t border-gray-100 -mx-6 px-6">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : (editingPost ? 'Mettre à jour' : 'Publier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}