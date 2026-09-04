'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Upload, Loader2, RefreshCw, X } from 'lucide-react';

interface CancerData {
  id?: string;
  name: string;
  slug?: string;
  color: string;
  image: string;
  shortDescription: string;
  description: string;
  symptoms: string;
  riskFactors: string;
  prevention: string;
  treatment: string;
}

const initialFormState: CancerData = {
  name: '',
  slug: '',
  color: '#EC4899',
  image: '',
  shortDescription: '',
  description: '',
  symptoms: '',
  riskFactors: '',
  prevention: '',
  treatment: '',
};

export default function AdminCancers() {
  const [cancersList, setCancersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCancer, setEditingCancer] = useState<any | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CancerData>(initialFormState);

  const fetchCancers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cancers');
      const data = await res.json();
      setCancersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des cancers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancers();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData(f => ({
      ...f,
      name,
      slug: editingCancer ? f.slug : generatedSlug
    }));
  };

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
      const endpoint = editingCancer ? `/api/cancers/${editingCancer.id}` : '/api/cancers';
      const method = editingCancer ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur réseau');

      await fetchCancers();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingCancer(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleEdit = (cancer: any) => {
    setEditingCancer(cancer);
    setFormData({
      name: cancer.name || '',
      slug: cancer.slug || '',
      color: cancer.color || '#EC4899',
      image: cancer.image || '',
      shortDescription: cancer.shortDescription || '',
      description: cancer.description || '',
      symptoms: cancer.symptoms || '',
      riskFactors: cancer.riskFactors || '',
      prevention: cancer.prevention || '',
      treatment: cancer.treatment || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce type de cancer ?')) return;
    await fetch(`/api/cancers/${id}`, { method: 'DELETE' });
    await fetchCancers();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Cancers</h1>
          <p className="text-gray-600">Gérez les fiches médicales et les informations ({cancersList.length} entrées)</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchCancers} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" title="Actualiser">
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Ajouter un Type
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type de Cancer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Slug / URL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Description Courte</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Couleur</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cancersList.map((cancer) => (
                <tr key={cancer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {cancer.image ? (
                          <img 
                            src={cancer.image} 
                            alt={cancer.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full items-center justify-center" 
                          style={{ 
                            backgroundColor: cancer.color + '20',
                            display: cancer.image ? 'none' : 'flex'
                          }}
                        >
                          <span className="text-xs font-bold" style={{ color: cancer.color }}>
                            {cancer.name?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">{cancer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500 hidden md:table-cell">
                    {cancer.slug || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate hidden lg:table-cell">
                    {cancer.shortDescription}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: cancer.color }} />
                      <span className="text-xs text-gray-500 hidden xl:inline">{cancer.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(cancer)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cancer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
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

      {/* Modal d'édition complet */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-4 shadow-2xl">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCancer ? 'Modifier' : 'Ajouter'} une fiche de cancer
              </h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informations Générales */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-purple-700 border-b pb-2">Informations Générales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      placeholder="Ex: Cancer du sein"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(f => ({ ...f, slug: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      placeholder="cancer-du-sein"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Couleur représentative</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(f => ({ ...f, color: e.target.value }))}
                        className="w-14 h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <span className="text-sm font-mono text-gray-600">{formData.color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Photo d'illustration</label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-500 cursor-pointer transition-colors"
                      onClick={() => fileRef.current?.click()}
                    >
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {formData.image ? (
                        <div className="flex items-center justify-center gap-3">
                          <img src={formData.image} alt="Aperçu" className="h-12 w-12 rounded-md object-cover" />
                          <span className="text-xs text-pink-600 font-medium">Changer la photo</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-xs font-medium">Télécharger une image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description Courte *</label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(f => ({ ...f, shortDescription: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="Accroche / Bref résumé pour les cartes de présentation..."
                    required
                  />
                </div>
              </div>

              {/* Contenu Médical Détaillé */}
              <div className="space-y-4 pt-2">
                <h3 className="text-md font-bold text-purple-700 border-b pb-2">Contenu Médical & Fiche Détaillée</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description / Présentation Globale *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="Présentation générale de la maladie..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Symptômes principaux</label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) => setFormData(f => ({ ...f, symptoms: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                      placeholder="Liste des symptômes ou signaux d'alerte..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Facteurs de Risque</label>
                    <textarea
                      value={formData.riskFactors}
                      onChange={(e) => setFormData(f => ({ ...f, riskFactors: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                      placeholder="Facteurs génétiques, environnementaux..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prévention & Dépistage</label>
                    <textarea
                      value={formData.prevention}
                      onChange={(e) => setFormData(f => ({ ...f, prevention: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                      placeholder="Méthodes de prévention et gestes de dépistage..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Traitements envisageables</label>
                    <textarea
                      value={formData.treatment}
                      onChange={(e) => setFormData(f => ({ ...f, treatment: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                      placeholder="Options thérapeutiques disponibles..."
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : (editingCancer ? 'Mettre à jour' : 'Enregistrer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}