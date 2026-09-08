'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Phone, 
  Trash2, 
  Search, 
  RefreshCw, 
  Tag, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface EventRegistration {
  id: string;
  name: string;
  phone: string;
  eventId?: string;
  eventTitle?: string;
  createdAt?: string;
}

export default function EventRegistrationsAdminPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/event-registration');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/event-registration/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRegistrations(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Erreur lors de la suppression.');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur réseau lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = registrations.filter(r =>
    (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.phone && r.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.eventTitle && r.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-purple-600" />
            Inscriptions aux Événements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les participants inscrits via les formulaires d'événements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-xl">
            Total : {registrations.length}
          </span>
          <button 
            onClick={fetchRegistrations} 
            className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors border border-gray-200"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, téléphone ou nom d'événement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
        />
      </div>

      {/* Table des Inscriptions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-600" />
            <p className="text-lg font-medium">Aucune inscription trouvée</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm ? 'Essayez un autre terme de recherche.' : 'Aucun participant ne s\'est encore inscrit.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Participant</th>
                  <th className="py-4 px-6">Téléphone</th>
                  <th className="py-4 px-6">Événement concerné</th>
                  <th className="py-4 px-6">Date d'inscription</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {reg.name ? reg.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{reg.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <a 
                        href={`tel:${reg.phone}`} 
                        className="inline-flex items-center gap-1.5 text-purple-600 hover:underline font-medium"
                      >
                        <Phone className="w-4 h-4 text-gray-400" />
                        {reg.phone}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-xs font-medium">
                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                        {reg.eventTitle || 'Événement général'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {reg.createdAt ? new Date(reg.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(reg.id)}
                        disabled={deletingId === reg.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer l'inscription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}