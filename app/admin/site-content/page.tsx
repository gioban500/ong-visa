'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { getClientData, hasFreshClientData, setClientData } from '@/lib/client-data-cache';

type Collection = 'topics' | 'questionResponses' | 'resultSteps';
type FieldValue = string | number | boolean;
type Entry = Record<string, FieldValue> & { id: string };
type SiteContent = Record<Collection, Entry[]>;

const labels: Record<Collection, string> = {
  topics: 'Sujets et cadres',
  questionResponses: 'Réponses aux questions',
  resultSteps: 'Étapes après résultat',
};

const emptyForms: Record<Collection, Record<string, FieldValue>> = {
  topics: {
    slug: '', category: '', title: '', summary: '', signs: '', exams: '', togo: '',
    buttonText: '', buttonLink: '#ecoute', position: 0, active: false,
  },
  questionResponses: {
    badge: '', question: '', answer: '', meta: '', position: 0, published: false,
  },
  resultSteps: { title: '', body: '', position: 0, active: true },
};

function asEntry(value: Record<string, unknown>): Entry {
  return value as Entry;
}

function titleOf(collection: Collection, entry: Entry): string {
  if (collection === 'topics' || collection === 'resultSteps') return String(entry.title);
  return String(entry.question);
}

function excerptOf(collection: Collection, entry: Entry): string {
  if (collection === 'topics') return String(entry.summary);
  if (collection === 'resultSteps') return String(entry.body);
  return String(entry.answer);
}

export default function AdminSiteContent() {
  const cacheKey = '/api/admin/site-content';
  const [collection, setCollection] = useState<Collection>('topics');
  const [content, setContent] = useState<SiteContent>(() => getClientData<SiteContent>(cacheKey) || {
    topics: [],
    questionResponses: [],
    resultSteps: [],
  });
  const [form, setForm] = useState<Record<string, FieldValue>>(emptyForms.topics);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(() => !getClientData<SiteContent>(cacheKey));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (force = false) => {
    if (!force && hasFreshClientData(cacheKey)) {
      setLoading(false);
      return;
    }
    if (!getClientData<SiteContent>(cacheKey)) setLoading(true);
    try {
      const response = await fetch('/api/admin/site-content', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de charger le contenu du site.');
      const nextContent = {
        topics: Array.isArray(data.topics) ? data.topics.map(asEntry) : [],
        questionResponses: Array.isArray(data.questionResponses) ? data.questionResponses.map(asEntry) : [],
        resultSteps: Array.isArray(data.resultSteps) ? data.resultSteps.map(asEntry) : [],
      };
      setClientData(cacheKey, nextContent);
      setContent(nextContent);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger le contenu du site.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const changeCollection = (next: Collection) => {
    setCollection(next);
    setForm({ ...emptyForms[next] });
    setEditing(false);
    setError('');
  };

  const startNew = () => {
    setForm({ ...emptyForms[collection], position: content[collection].length });
    setEditing(true);
    setError('');
  };

  const edit = (entry: Entry) => {
    setForm({ ...entry, collection });
    setEditing(true);
    setError('');
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = { ...form, collection };
      const response = await fetch(
        typeof form.id === 'string' ? `/api/admin/site-content/${form.id}` : '/api/admin/site-content',
        {
          method: typeof form.id === 'string' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible d’enregistrer ce contenu.');
      setEditing(false);
      setForm({ ...emptyForms[collection] });
      await load(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer ce contenu.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (entry: Entry) => {
    if (!window.confirm(`Supprimer définitivement « ${titleOf(collection, entry)} » ?`)) return;
    try {
      const response = await fetch(
        `/api/admin/site-content/${entry.id}?collection=${collection}`,
        { method: 'DELETE' },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de supprimer ce contenu.');
      await load(true);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Impossible de supprimer ce contenu.');
    }
  };

  const entries = content[collection];
  const textField = (key: string, label: string, multiline = false, required = false) => (
    <label key={key} className="text-sm font-medium text-gray-800">
      {label}{required ? ' *' : ''}
      {multiline ? (
        <textarea
          required={required}
          rows={key === 'summary' || key === 'intro' ? 3 : 5}
          value={String(form[key] ?? '')}
          onChange={(event) => setForm({ ...form, [key]: event.target.value })}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      ) : (
        <input
          required={required}
          value={String(form[key] ?? '')}
          onChange={(event) => setForm({ ...form, [key]: event.target.value })}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      )}
    </label>
  );
  const toggleField = (key: string, label: string) => (
    <label key={key} className="flex items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        checked={form[key] === true}
        onChange={(event) => setForm({ ...form, [key]: event.target.checked })}
      />
      {label}
    </label>
  );

  return (
    <section className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contenu des sections du site</h1>
          <p className="mt-2 text-gray-600">Modifiez les sujets du site, les réponses aux questions et les étapes déroulantes après un résultat atypique.</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white">
          <Plus className="h-4 w-4" />
          Ajouter
          </button>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Sections de contenu">
        {(Object.keys(labels) as Collection[]).map((key) => (
          <button
            key={key}
            onClick={() => changeCollection(key)}
            aria-pressed={collection === key}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              collection === key ? 'bg-purple-700 text-white' : 'border border-gray-200 bg-white text-gray-700'
            }`}
          >
            {labels[key]} ({content[key].length})
          </button>
        ))}
      </nav>

      {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}

      {editing && (
        <form onSubmit={save} className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
          {collection === 'topics' && (
            <>
              {textField('title', 'Titre du sujet', false, true)}
              {textField('slug', 'Identifiant du sujet', false, true)}
              {textField('category', 'Catégorie')}
              {textField('summary', 'Texte introductif du cadre', true, true)}
              {textField('signs', 'Signes à observer', true, true)}
              {textField('exams', 'Examens de référence', true, true)}
              {textField('togo', 'Informations / accompagnement au Togo', true, true)}
              {textField('buttonText', 'Texte du bouton')}
              {textField('buttonLink', 'Lien du bouton (ex. #centres)')}
              <label className="text-sm font-medium text-gray-800">
                Ordre d’affichage
                <input type="number" min="0" value={Number(form.position)} onChange={(event) => setForm({ ...form, position: Number(event.target.value) })} className="mt-1 w-full rounded border border-gray-300 p-2" />
              </label>
              {toggleField('active', 'Afficher ce sujet sur le site')}
            </>
          )}
          {collection === 'resultSteps' && (
            <>
              {textField('title', 'Titre de l’étape', false, true)}
              <div className="md:col-span-2">{textField('body', 'Texte de l’étape', true, true)}</div>
              <label className="text-sm font-medium text-gray-800">
                Ordre d’affichage
                <input type="number" min="0" value={Number(form.position)} onChange={(event) => setForm({ ...form, position: Number(event.target.value) })} className="mt-1 w-full rounded border border-gray-300 p-2" />
              </label>
              {toggleField('active', 'Afficher cette étape sur le site')}
            </>
          )}
          {collection === 'questionResponses' && (
            <>
              {textField('badge', 'Catégorie / badge')}
              {textField('question', 'Question', false, true)}
              <div className="md:col-span-2">{textField('answer', 'Réponse', true, true)}</div>
              {textField('meta', 'Signature ou précision affichée')}
              <label className="text-sm font-medium text-gray-800">
                Ordre d’affichage
                <input type="number" min="0" value={Number(form.position)} onChange={(event) => setForm({ ...form, position: Number(event.target.value) })} className="mt-1 w-full rounded border border-gray-300 p-2" />
              </label>
              {toggleField('published', 'Afficher sur le site')}
            </>
          )}
          <div className="flex gap-3 md:col-span-2">
            <button disabled={saving} className="rounded bg-teal-800 px-5 py-2 font-semibold text-white disabled:opacity-60">
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded border px-5 py-2">Annuler</button>
          </div>
        </form>
      )}

      {loading ? <Loader2 className="mx-auto my-12 h-8 w-8 animate-spin" /> : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <article key={entry.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900">{titleOf(collection, entry)}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{excerptOf(collection, entry)}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {collection === 'topics' || collection === 'resultSteps'
                    ? (entry.active ? 'Visible sur le site' : 'Masqué du site')
                    : (entry.published ? 'Publié' : 'Brouillon')}
                  · ordre {entry.position}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(entry)} aria-label="Modifier" className="rounded p-2 text-purple-700 hover:bg-purple-50"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => void remove(entry)} aria-label="Supprimer" className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
          {!entries.length && <p className="rounded-xl bg-white p-8 text-center text-gray-600">Aucun élément dans cette section.</p>}
        </div>
      )}
    </section>
  );
}
