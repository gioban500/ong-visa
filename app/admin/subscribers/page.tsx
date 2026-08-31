'use client';

import { useState, useEffect } from 'react';
import { Trash2, Loader2, RefreshCw, Download, Mail } from 'lucide-react';

interface Subscriber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers');
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
    if (!confirm('Supprimer cet abonné de la liste ?')) return;
    await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
    await fetchSubscribers();
  };

  const exportCSV = () => {
    const header = 'Prénom,Nom,Email,Date inscription\n';
    const rows = subscribers
      .map(
        (s) =>
          `"${s.firstName || ''}","${s.lastName || ''}","${s.email}","${
            s.createdAt ? new Date(s.createdAt).toLocaleDateString('fr-FR') : ''
          }"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liste-diffusion-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Liste de Diffusion</h1>
          <p className="text-gray-600">
            {subscribers.length} abonné{subscribers.length > 1 ? 's' : ''} à la newsletter
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
          <p className="text-xl text-gray-600 font-medium">Aucun abonné pour le moment</p>
          <p className="text-gray-500 mt-2">
            Les inscriptions via le formulaire du site apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prénom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{s.firstName || '—'}</td>
                  <td className="px-6 py-4 text-gray-900">{s.lastName || '—'}</td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${s.email}`} className="text-pink-600 hover:underline">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
