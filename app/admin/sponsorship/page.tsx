'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { HeartHandshake, Loader2, Pencil, Plus, X } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  amountCollected: number;
  active: boolean;
}

interface Sponsor {
  id: string;
  email: string;
  createdAt: string;
}

interface Sponsorship {
  id: string;
  startedAt: string;
  sponsorId: string;
  email: string;
  personId: string;
  name: string;
  amountGiven: number;
}

interface Payment {
  id: string;
  sponsorshipId: string;
  amount: number;
  recordedAt: string;
  email: string;
  name: string;
}

interface SponsorshipData {
  people: Person[];
  sponsors: Sponsor[];
  sponsorships: Sponsorship[];
  payments: Payment[];
}

type PersonForm = {
  id?: string;
  name: string;
  description: string;
  totalCost: string;
  active: boolean;
};

const emptyForm: PersonForm = { name: '', description: '', totalCost: '', active: true };
const formatAmount = (amount: number) => `${amount.toLocaleString('fr-FR')} FCFA`;

export default function AdminSponsorshipPage() {
  const [data, setData] = useState<SponsorshipData | null>(null);
  const [form, setForm] = useState<PersonForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordingId, setRecordingId] = useState('');
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/sponsorship', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de charger les données de parrainage.');
      setData(result);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les données de parrainage.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const edit = (person: Person) => {
    setForm({
      id: person.id,
      name: person.name,
      description: person.description,
      totalCost: String(person.totalCost),
      active: person.active,
    });
    setEditing(true);
    setNotice('');
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(
        form.id ? `/api/admin/sponsorship/beneficiaries/${form.id}` : '/api/admin/sponsorship/beneficiaries',
        {
          method: form.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, totalCost: Number(form.totalCost) }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible d’enregistrer cette fiche.');
      setForm(emptyForm);
      setEditing(false);
      setNotice('La fiche a été enregistrée.');
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer cette fiche.');
    } finally {
      setSaving(false);
    }
  };

  const recordPayment = async (event: FormEvent, sponsorshipId: string) => {
    event.preventDefault();
    const amount = Number(amounts[sponsorshipId]);
    setRecordingId(sponsorshipId);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/sponsorship/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsorshipId, amount }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible d’enregistrer ce versement.');
      setAmounts((current) => ({ ...current, [sponsorshipId]: '' }));
      setNotice('Le versement a été enregistré.');
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer ce versement.');
    } finally {
      setRecordingId('');
    }
  };

  if (loading) return <div className="flex justify-center py-16" role="status" aria-label="Chargement"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <section className="mx-auto max-w-6xl space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#9E2F55]"><HeartHandshake size={17} /> Solidarité</p>
          <h2 className="mt-1 text-3xl font-bold text-gray-900">Gestion du parrainage</h2>
          <p className="mt-2 text-gray-600">Gérez les dossiers, les liens de parrainage et les versements effectivement reçus. Les informations des dossiers sont publiques : n’y saisissez pas de coordonnées ni de données médicales identifiantes.</p>
        </div>
        <button type="button" onClick={() => { setForm(emptyForm); setEditing(!editing); }} className="flex items-center gap-2 rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white">
          {editing ? <X size={17} /> : <Plus size={17} />}{editing ? 'Fermer' : 'Ajouter une personne'}
        </button>
      </header>

      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded border border-green-200 bg-green-50 p-3 text-green-800">{notice}</p>}

      {editing && (
        <form onSubmit={(event) => void save(event)} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
          <h3 className="text-xl font-semibold md:col-span-2">{form.id ? 'Modifier le dossier' : 'Nouveau dossier parrainable'}</h3>
          <label className="text-sm font-medium">Nom affiché *<input required maxLength={200} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium">Coût total à couvrir (FCFA) *<input required type="number" min="1" max="1000000000000" step="1" value={form.totalCost} onChange={(event) => setForm({ ...form, totalCost: event.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="text-sm font-medium md:col-span-2">Informations publiques<textarea maxLength={5000} rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded border p-2" /></label>
          <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />Ouvert au parrainage (décocher pour clôturer le dossier)</label>
          <div className="md:col-span-2"><button disabled={saving} className="rounded bg-teal-800 px-5 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer la fiche'}</button></div>
        </form>
      )}

      <section>
        <div className="mb-4"><h3 className="text-xl font-semibold">Personnes parrainables</h3><p className="mt-1 text-sm text-gray-600">La progression indique le total collecté par tous les parrains par rapport au coût du dossier.</p></div>
        <div className="space-y-3">
          {data?.people.map((person) => {
            const progress = Math.min(100, Math.round((person.amountCollected / person.totalCost) * 100));
            return (
              <article key={person.id} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-[220px] flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold">{person.name}</h4><span className={`rounded px-2 py-0.5 text-xs ${person.active ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{person.active ? 'Ouvert' : 'Clôturé'}</span></div>
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{person.description || 'Aucune information complémentaire.'}</p>
                    <p className="mt-3 text-sm"><strong>{formatAmount(person.amountCollected)}</strong> collectés sur {formatAmount(person.totalCost)} · {progress}%</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-label={`Progression de ${person.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full bg-teal-700" style={{ width: `${progress}%` }} /></div>
                  </div>
                  <button type="button" onClick={() => edit(person)} aria-label={`Modifier ${person.name}`} className="rounded p-2 text-teal-800 hover:bg-teal-50"><Pencil size={17} /></button>
                </div>
              </article>
            );
          })}
          {!data?.people.length && <p className="rounded-xl bg-white p-8 text-center text-gray-600">Aucun dossier enregistré.</p>}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold">Parrains et liens de parrainage</h3>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-semibold">Comptes parrains ({data?.sponsors.length ?? 0})</h4>
            <div className="max-h-80 space-y-2 overflow-auto">
              {data?.sponsors.map((sponsor) => <p key={sponsor.id} className="flex flex-wrap justify-between gap-2 border-b border-gray-100 py-2 text-sm"><span>{sponsor.email}</span><span className="text-gray-500">{new Date(sponsor.createdAt).toLocaleDateString('fr-FR')}</span></p>)}
              {!data?.sponsors.length && <p className="text-sm text-gray-500">Aucun compte créé.</p>}
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-semibold">Liens et montants par parrain</h4>
            <div className="max-h-80 space-y-4 overflow-auto">
              {data?.sponsorships.map((sponsorship) => (
                <article key={sponsorship.id} className="border-b border-gray-100 pb-4">
                  <p className="font-medium">{sponsorship.email} <span className="font-normal text-gray-500">→ {sponsorship.name}</span></p>
                  <p className="mt-1 text-xs text-gray-500">Depuis le {new Date(sponsorship.startedAt).toLocaleDateString('fr-FR')} · versé : {formatAmount(sponsorship.amountGiven)}</p>
                  <form onSubmit={(event) => void recordPayment(event, sponsorship.id)} className="mt-3 flex flex-wrap gap-2">
                    <label className="sr-only" htmlFor={`payment-${sponsorship.id}`}>Nouveau versement en FCFA</label>
                    <input id={`payment-${sponsorship.id}`} type="number" min="1" max="1000000000000" step="1" required value={amounts[sponsorship.id] || ''} onChange={(event) => setAmounts((current) => ({ ...current, [sponsorship.id]: event.target.value }))} placeholder="Montant reçu (FCFA)" className="min-w-0 flex-1 rounded border p-2 text-sm" />
                    <button disabled={recordingId === sponsorship.id} className="rounded bg-[#1F5A56] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{recordingId === sponsorship.id ? 'Enregistrement…' : 'Enregistrer le versement'}</button>
                  </form>
                </article>
              ))}
              {!data?.sponsorships.length && <p className="text-sm text-gray-500">Aucun parrainage confirmé.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-xl font-semibold">Historique des versements</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr className="border-b text-gray-500"><th className="p-2 font-medium">Date</th><th className="p-2 font-medium">Parrain</th><th className="p-2 font-medium">Personne</th><th className="p-2 text-right font-medium">Montant</th></tr></thead>
            <tbody>{data?.payments.map((payment) => <tr key={payment.id} className="border-b border-gray-100"><td className="p-2">{new Date(payment.recordedAt).toLocaleDateString('fr-FR')}</td><td className="p-2">{payment.email}</td><td className="p-2">{payment.name}</td><td className="p-2 text-right font-semibold">{formatAmount(payment.amount)}</td></tr>)}</tbody>
          </table>
          {!data?.payments.length && <p className="py-6 text-center text-sm text-gray-500">Aucun versement enregistré.</p>}
        </div>
      </section>
    </section>
  );
}
