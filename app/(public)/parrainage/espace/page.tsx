'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, HeartHandshake, Loader2, LogOut } from 'lucide-react';

interface Sponsorship {
  id: string;
  startedAt: string;
  personId: string;
  name: string;
  description: string;
  totalCost: number;
  amountCollected: number;
  amountGiven: number;
  active: boolean;
}

const formatAmount = (amount: number) => `${amount.toLocaleString('fr-FR')} FCFA`;

export default function SponsorDashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const load = useCallback(async () => {
    try {
      const [sessionResponse, dataResponse] = await Promise.all([
        fetch('/api/sponsorship/auth/session', { cache: 'no-store' }),
        fetch('/api/sponsorship', { cache: 'no-store' }),
      ]);
      if (sessionResponse.status === 401) {
        router.replace('/parrainage/compte?mode=login');
        return;
      }
      const sessionData = await sessionResponse.json();
      if (!sessionResponse.ok) throw new Error(sessionData.error || 'Impossible de vérifier votre connexion.');
      const data = await dataResponse.json();
      if (!dataResponse.ok) throw new Error(data.error || 'Impossible de charger votre espace.');
      setEmail(sessionData.sponsor.email);
      setSponsorships(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger votre espace.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const logout = async () => {
    setLoggingOut(true);
    setError('');
    try {
      const response = await fetch('/api/sponsorship/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('La déconnexion n’a pas abouti. Réessayez.');
      router.replace('/parrainage');
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : 'La déconnexion n’a pas abouti.');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center" role="status"><Loader2 className="h-8 w-8 animate-spin text-[#1F5A56]" /></div>;
  return (
    <section className="mx-auto min-h-[65vh] max-w-5xl px-4 py-12 sm:px-7">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-wider text-[#9E2F55]">Votre espace personnel</p><h1 className="mt-1 font-serif text-3xl font-semibold text-[#123E3B]">Mes parrainages</h1><p className="mt-2 text-sm text-[#756B60]">{email}</p></div>
        <button type="button" onClick={() => void logout()} disabled={loggingOut} className="inline-flex items-center gap-2 rounded border border-[#CFC1AD] px-4 py-2 text-sm font-medium disabled:opacity-60"><LogOut size={16} /> {loggingOut ? 'Déconnexion…' : 'Déconnexion'}</button>
      </header>
      {error && <p role="alert" className="mb-5 rounded bg-red-50 p-4 text-red-800">{error}</p>}
      {!sponsorships.length ? (
        <div className="rounded-lg border border-[#E2D7C7] bg-white p-8 text-center">
          <HeartHandshake className="mx-auto h-9 w-9 text-[#9E2F55]" />
          <p className="mt-3 text-[#514A43]">Vous ne parrainez encore personne.</p>
          <Link href="/parrainage" className="mt-4 inline-flex items-center gap-2 font-semibold text-[#1F5A56]">Découvrir les personnes <ArrowRight size={16} /></Link>
        </div>
      ) : (
        <div className="space-y-5">
          {sponsorships.map((item) => {
            const progress = Math.min(100, Math.round((item.amountCollected / item.totalCost) * 100));
            return (
              <article key={item.id} className="rounded-lg border border-[#E2D7C7] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h2 className="font-serif text-xl font-semibold text-[#123E3B]">{item.name}</h2><p className="mt-1 text-xs text-[#756B60]">Parrainage commencé le {new Date(item.startedAt).toLocaleDateString('fr-FR')}{!item.active && ' · dossier clôturé'}</p></div>
                  <Link href={`/parrainage/${item.personId}`} className="text-sm font-semibold text-[#1F5A56] underline">Voir la fiche</Link>
                </div>
                <p className="mt-4 text-sm text-[#514A43]">{item.description}</p>
                <div className="mt-5 grid gap-2 rounded bg-[#FAF6F0] p-4 text-sm sm:grid-cols-2">
                  <p>Vos versements enregistrés : <strong>{formatAmount(item.amountGiven)}</strong></p>
                  <p>Collecte totale : <strong>{formatAmount(item.amountCollected)}</strong> / {formatAmount(item.totalCost)}</p>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#E2D7C7]" role="progressbar" aria-label={`Avancement global du financement de ${item.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                  <div className="h-full rounded-full bg-[#1F5A56]" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-right text-xs font-semibold text-[#1F5A56]">{progress}% du coût total couvert par l’ensemble des parrains</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
