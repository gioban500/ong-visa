'use client';

import { useState, useEffect } from 'react';
import { Trash2, Loader2, RefreshCw, Download, Mail, Eye, Phone, MessageSquare, X } from 'lucide-react';

interface Subscriber {
  id: string;
  firstName?: string;
  firstname?: string;
  lastName?: string;
  lastname?: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
  createdat?: string;
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers', { cache: 'no-store' });
      const data = await res.json();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch {
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce message / abonné ?')) return;
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedSubscriber?.id === id) setSelectedSubscriber(null);
        await fetchSubscribers();
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const exportCSV = () => {
    const header = 'Prénom,Nom,Email,Téléphone,Sujet,Message,Date\n';
    const rows = subscribers
      .map((s) => {
        const fname = s.firstName || s.firstname || '';
        const lname = s.lastName || s.lastname || '';
        const phone = s.phone || '';
        const subject = s.subject || '';
        const message = (s.message || '').replace(/"/g, '""');
        const date = s.createdAt || s.createdat;
        const formattedDate = date ? new Date(date).toLocaleDateString('fr-FR') : '';

        return `"${fname}","${lname}","${s.email}","${phone}","${subject}","${message}","${formattedDate}"`;
      })
      .join('\n');

    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-contact-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages & Contacts</h1>
          <p className="text-gray-600">
            {subscribers.length} message{subscribers.length > 1 ? 's' : ''} reçu{subscribers.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSubscribers}
            className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={exportCSV}
            disabled={subscribers.length === 0}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-5 h-5" /> Exporter (CSV)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-medium">Aucun message pour le moment</p>
          <p className="text-gray-500 mt-2">
            Les messages soumis via le formulaire de contact apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom & Prénom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Coordonnées</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Sujet / Message</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((s) => {
                const fname = s.firstName || s.firstname || '—';
                const lname = s.lastName || s.lastname || '—';
                const date = s.createdAt || s.createdat;

                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {fname} {lname}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <a href={`mailto:${s.email}`} className="text-pink-600 hover:underline flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 inline" /> {s.email}
                        </a>
                      </div>
                      {s.phone && (
                        <div className="text-gray-500 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 inline text-gray-400" /> {s.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell max-w-xs">
                      {s.subject && <p className="font-semibold text-gray-800 line-clamp-1">{s.subject}</p>}
                      <p className="text-gray-500 line-clamp-1">{s.message || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell whitespace-nowrap">
                      {date ? new Date(date).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedSubscriber(s)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Voir le message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de détail du message */}
      {selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedSubscriber(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-pink-600" /> Détails du Contact
            </h2>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Nom complet</p>
                  <p className="text-base font-semibold text-gray-800">
                    {(selectedSubscriber.firstName || selectedSubscriber.firstname || '') + ' ' + (selectedSubscriber.lastName || selectedSubscriber.lastname || '—')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Date</p>
                  <p className="text-base font-semibold text-gray-800">
                    {selectedSubscriber.createdAt || selectedSubscriber.createdat
                      ? new Date(selectedSubscriber.createdAt || selectedSubscriber.createdat!).toLocaleDateString('fr-FR')
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                  <a href={`mailto:${selectedSubscriber.email}`} className="text-pink-600 hover:underline font-medium">
                    {selectedSubscriber.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Téléphone</p>
                  <p className="font-medium text-gray-800">{selectedSubscriber.phone || 'Non renseigné'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Sujet</p>
                <p className="font-semibold text-gray-900 text-base border-b pb-2">
                  {selectedSubscriber.subject || 'Aucun sujet'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Message</p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed border border-gray-100">
                  {selectedSubscriber.message || 'Aucun contenu de message.'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={() => handleDelete(selectedSubscriber.id)}
                className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
              <button
                onClick={() => setSelectedSubscriber(null)}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}