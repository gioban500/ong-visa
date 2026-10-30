'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { getClientData, hasFreshClientData, setClientData } from '@/lib/client-data-cache';

interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  services: string[];
  badge: string;
  latitude: number | null;
  longitude: number | null;
  verifiedAt: string | null;
  active: boolean;
}

type CenterForm = Omit<Center, 'id' | 'services' | 'verifiedAt'> & { id?: string; services: string; verifiedAt: string };
const emptyForm: CenterForm = {
  name: '', address: '', city: '', phone: '', email: '', services: '', badge: '',
  latitude: null, longitude: null, verifiedAt: '', active: false,
};

export default function AdminCenters() {
  const cacheKey = '/api/admin/centers';
  const [centers, setCenters] = useState<Center[]>(() => getClientData<Center[]>(cacheKey) || []);
  const [form, setForm] = useState<CenterForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(() => !getClientData<Center[]>(cacheKey));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCenters = useCallback(async (force = false) => {
    if (!force && hasFreshClientData(cacheKey)) {
      setLoading(false);
      return;
    }
    if (!getClientData<Center[]>(cacheKey)) setLoading(true);
    try {
      const response = await fetch('/api/admin/centers', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de charger les centres.');
      setClientData(cacheKey, data);
      setCenters(data);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les centres.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadCenters(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadCenters]);

  const edit = (center: Center) => {
    setForm({
      ...center,
      services: center.services.join(', '),
      verifiedAt: center.verifiedAt ? center.verifiedAt.slice(0, 10) : '',
    });
    setEditing(true);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        services: form.services.split(',').map((service) => service.trim()).filter(Boolean),
      };
      const response = await fetch(form.id ? `/api/admin/centers/${form.id}` : '/api/admin/centers', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible d’enregistrer le centre.');
      setForm(emptyForm);
      setEditing(false);
      await loadCenters(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer le centre.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer ce centre ?')) return;
    const response = await fetch(`/api/admin/centers/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Impossible de supprimer le centre.');
      return;
    }
    await loadCenters(true);
  };

  return (
    <section className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centres de dépistage</h1>
          <p className="mt-2 text-gray-600">Publiez uniquement les informations confirmées par l’ONG VISA.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(!editing); }} className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white">
          {editing ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editing ? 'Fermer' : 'Ajouter un centre'}
        </button>
      </header>
      {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {editing && (
        <form onSubmit={save} className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
          <label className="text-sm font-medium">Nom *<input required maxLength={200} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium">Ville / localité<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium md:col-span-2">Adresse<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium">Téléphone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium">E-mail<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium md:col-span-2">Services (séparés par des virgules)<input value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium">Badge / précision<input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium">Date de vérification<input type="date" value={form.verifiedAt} onChange={(e) => setForm({ ...form, verifiedAt: e.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Afficher publiquement (date de vérification obligatoire)</label>
          <div className="md:col-span-2"><button disabled={saving} className="rounded bg-teal-800 px-5 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div>
        </form>
      )}
      {loading ? <Loader2 className="mx-auto my-12 h-8 w-8 animate-spin" /> : (
        <div className="space-y-3">
          {centers.map((center) => (
            <article key={center.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div>
                <h2 className="font-semibold">{center.name}</h2>
                <p className="text-sm text-gray-600">{[center.address, center.city].filter(Boolean).join(', ') || 'Adresse non renseignée'}</p>
                <p className="mt-1 text-xs text-gray-500">{center.active ? 'Publié' : 'Désactivé'}{center.verifiedAt ? ` · vérifié le ${new Date(center.verifiedAt).toLocaleDateString('fr-FR')}` : ' · non vérifié'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(center)} aria-label="Modifier le centre" className="rounded p-2 text-purple-700 hover:bg-purple-50"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => void remove(center.id)} aria-label="Supprimer le centre" className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
          {!centers.length && <p className="rounded-xl bg-white p-8 text-center text-gray-600">Aucun centre enregistré.</p>}
        </div>
      )}
    </section>
  );
}
