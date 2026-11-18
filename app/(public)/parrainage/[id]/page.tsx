'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, HeartHandshake, Loader2 } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  amountCollected: number;
}

interface SponsorSponsorship {
  personId: string;
  amountGiven: number;
}

const isSponsorSponsorship = (value: unknown): value is SponsorSponsorship =>
  typeof value === 'object' &&
  value !== null &&
  'personId' in value &&
  typeof value.personId === 'string' &&
  'amountGiven' in value &&
  typeof value.amountGiven === 'number' &&
  Number.isFinite(value.amountGiven);

const formatAmount = (amount: number) => `${amount.toLocaleString('fr-FR')} FCFA`;

export default function SponsorablePersonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [alreadySponsoring, setAlreadySponsoring] = useState(false);
  const [amountGiven, setAmountGiven] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadPage = async () => {
      try {
        const [personResponse, sessionResponse] = await Promise.all([
          fetch(`/api/sponsorship/beneficiaries/${id}`, { cache: 'no-store' }),
          fetch('/api/sponsorship/auth/session', { cache: 'no-store' }),
        ]);
        const personData = await personResponse.json();
        if (!personResponse.ok) throw new Error(personData.error || 'Fiche introuvable.');

        let isSignedIn = false;
        let hasSponsorship = false;
        let personalAmountGiven = 0;
        if (sessionResponse.status !== 401) {
          const sessionData = await sessionResponse.json();
          if (!sessionResponse.ok) {
            throw new Error(sessionData.error || 'Impossible de vérifier votre connexion.');
          }
          isSignedIn = true;

          const sponsorshipResponse = await fetch('/api/sponsorship', { cache: 'no-store' });
          if (sponsorshipResponse.status !== 401) {
            const sponsorshipData: unknown = await sponsorshipResponse.json();
            if (!sponsorshipResponse.ok) {
              throw new Error('Impossible de vérifier vos parrainages.');
            }
            if (!Array.isArray(sponsorshipData) || !sponsorshipData.every(isSponsorSponsorship)) {
              throw new Error('Réponse invalide lors de la vérification de vos parrainages.');
            }
            const personalSponsorship = sponsorshipData.find((sponsorship) => sponsorship.personId === id);
            hasSponsorship = Boolean(personalSponsorship);
            personalAmountGiven = personalSponsorship?.amountGiven ?? 0;
          } else {
            isSignedIn = false;
          }
        }

        if (active) {
          setPerson(personData);
          setSignedIn(isSignedIn);
          setAlreadySponsoring(hasSponsorship);
          setAmountGiven(personalAmountGiven);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger cette fiche.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const timeoutId = window.setTimeout(() => { void loadPage(); }, 0);
    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [id]);

  const sponsor = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/sponsorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beneficiaryId: id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de confirmer le parrainage.');
      router.push('/parrainage/espace');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Impossible de confirmer le parrainage.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center" role="status"><Loader2 className="h-8 w-8 animate-spin text-[#1F5A56]" /></div>;
  if (!person) return <section className="mx-auto max-w-3xl px-4 py-16 text-center"><p role="alert">{error || 'Fiche introuvable.'}</p><Link className="mt-5 inline-block text-[#1F5A56] underline" href="/parrainage">Retour aux personnes</Link></section>;

  const progress = Math.min(100, Math.round((person.amountCollected / person.totalCost) * 100));
  return (
    <section className="mx-auto min-h-[65vh] max-w-3xl px-4 py-12 sm:px-7">
      <Link href="/parrainage" className="inline-flex items-center gap-2 text-sm font-medium text-[#1F5A56]"><ArrowLeft size={16} /> Toutes les personnes</Link>
      <article className="mt-6 rounded-lg border border-[#E2D7C7] bg-white p-6 shadow-sm sm:p-9">
        <HeartHandshake className="mb-4 h-9 w-9 text-[#9E2F55]" />
        <p className="text-xs font-bold uppercase tracking-wider text-[#9E2F55]">{alreadySponsoring ? 'Votre parrainage' : 'Personne à parrainer'}</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#123E3B]">{person.name}</h1>
        <p className="mt-5 whitespace-pre-line leading-relaxed text-[#514A43]">{person.description || 'Une personne accompagnée par l’ONG VISA.'}</p>
        <div className="mt-8 rounded bg-[#FAF6F0] p-5">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span>Collecté au total par tous les parrains</span><strong>{formatAmount(person.amountCollected)}</strong>
          </div>
          {signedIn && alreadySponsoring && (
            <div className="mt-1 flex flex-wrap justify-between gap-2 text-sm text-[#1F5A56]">
              <span>Vos versements enregistrés</span><strong>{formatAmount(amountGiven)}</strong>
            </div>
          )}
          <div className="mt-1 flex flex-wrap justify-between gap-2 text-sm text-[#756B60]">
            <span>Coût total à couvrir</span><strong>{formatAmount(person.totalCost)}</strong>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E2D7C7]" role="progressbar" aria-label="Avancement global du financement" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full rounded-full bg-[#1F5A56]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-right text-xs font-semibold text-[#1F5A56]">{progress}% couverts</p>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        {signedIn && alreadySponsoring ? (
          <div className="mt-7 rounded-lg border border-[#C7DED8] bg-[#EAF3F0] p-4 text-center">
            <p className="font-semibold text-[#123E3B]">Vous parrainez déjà cette personne.</p>
            <p className="mt-1 text-sm text-[#514A43]">Retrouvez le suivi de ce parrainage dans votre espace personnel.</p>
            <Link href="/parrainage/espace" className="mt-4 inline-flex w-full items-center justify-center rounded bg-[#1F5A56] px-5 py-3 font-semibold text-white hover:bg-[#123E3B]">
              Voir mes parrainages
            </Link>
          </div>
        ) : signedIn ? (
          <button type="button" disabled={saving} onClick={() => void sponsor()} className="mt-7 w-full rounded bg-[#9E2F55] px-5 py-3 font-semibold text-white hover:bg-[#842645] disabled:opacity-60">
            {saving ? 'Confirmation…' : 'Je souhaite parrainer cette personne'}
          </button>
        ) : (
          <Link href={`/parrainage/compte?beneficiaire=${person.id}`} className="mt-7 block rounded bg-[#9E2F55] px-5 py-3 text-center font-semibold text-white hover:bg-[#842645]">
            Créer un compte ou se connecter pour parrainer
          </Link>
        )}
        <p className="mt-3 text-center text-xs text-[#756B60]">Le parrainage enregistre votre soutien. Aucun paiement n’est effectué en ligne.</p>
      </article>
    </section>
  );
}
