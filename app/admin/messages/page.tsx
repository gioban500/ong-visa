'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { getClientData, hasFreshClientData, setClientData } from '@/lib/client-data-cache';

type MessageStatus = 'new' | 'in_progress' | 'resolved';

interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string;
  message: string;
  source: 'contact' | 'listening';
  status: MessageStatus;
  createdAt: string;
}

const statusLabels: Record<MessageStatus, string> = {
  new: 'Nouveau',
  in_progress: 'En cours',
  resolved: 'Traité',
};

export default function AdminMessages() {
  const cacheKey = '/api/contact-messages';
  const [messages, setMessages] = useState<ContactMessage[]>(() => getClientData<ContactMessage[]>(cacheKey) || []);
  const [loading, setLoading] = useState(() => !getClientData<ContactMessage[]>(cacheKey));
  const [error, setError] = useState('');

  const fetchMessages = useCallback(async (force = false) => {
    if (!force && hasFreshClientData(cacheKey)) {
      setLoading(false);
      return;
    }
    if (!getClientData<ContactMessage[]>(cacheKey)) setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/contact-messages', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de charger les messages.');
      const rows = Array.isArray(data) ? data : [];
      setClientData(cacheKey, rows);
      setMessages(rows);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Impossible de charger les messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchMessages(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchMessages]);

  const updateStatus = async (id: string, status: MessageStatus) => {
    const response = await fetch(`/api/contact-messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Impossible de modifier le statut.');
      return;
    }
    await fetchMessages(true);
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Supprimer définitivement ce message ?')) return;
    const response = await fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Impossible de supprimer le message.');
      return;
    }
    await fetchMessages(true);
  };

  return (
    <section className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages de contact et d’écoute</h1>
          <p className="mt-2 text-gray-600">{messages.length} demande(s) enregistrée(s)</p>
        </div>
        <button onClick={() => void fetchMessages(true)} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow">
          <RefreshCw className="h-4 w-4" /> Actualiser
        </button>
      </header>
      {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>
      ) : messages.length === 0 ? (
        <p className="rounded-xl bg-white p-10 text-center text-gray-600">Aucun message reçu.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((item) => (
            <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    {item.source === 'listening' ? 'Espace d’écoute' : 'Contact'}
                  </span>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">{item.subject}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.name || 'Anonyme'}
                    {item.email && <> · <a className="underline" href={`mailto:${item.email}`}>{item.email}</a></>}
                    {item.phone && <> · <a className="underline" href={`tel:${item.phone}`}>{item.phone}</a></>}
                    {' · '}{new Date(item.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    aria-label={`Statut du message ${item.subject}`}
                    value={item.status}
                    onChange={(event) => void updateStatus(item.id, event.target.value as MessageStatus)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <button onClick={() => void deleteMessage(item.id)} aria-label="Supprimer le message" className="rounded p-2 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-800">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
