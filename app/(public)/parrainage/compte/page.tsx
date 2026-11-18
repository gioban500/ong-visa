'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

function SponsorAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const beneficiaryId = searchParams.get('beneficiaire');
  const [mode, setMode] = useState<'register' | 'login'>(() => searchParams.get('mode') === 'login' ? 'login' : 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let active = true;
    const timeoutId = window.setTimeout(() => {
      fetch('/api/sponsorship/auth/session', { cache: 'no-store' })
        .then(async (response) => {
          if (response.status === 401) {
            if (active) setSessionChecked(true);
            return;
          }
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Impossible de vérifier votre connexion.');
          router.replace('/parrainage/espace');
        })
        .catch((sessionError: unknown) => {
          if (active) {
            setError(sessionError instanceof Error ? sessionError.message : 'Impossible de vérifier votre connexion.');
            setSessionChecked(true);
          }
        });
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/sponsorship/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Connexion impossible.');
      if (beneficiaryId) {
        const sponsorshipResponse = await fetch('/api/sponsorship', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ beneficiaryId }),
        });
        const sponsorshipData = await sponsorshipResponse.json();
        if (!sponsorshipResponse.ok) throw new Error(sponsorshipData.error || 'Impossible de confirmer le parrainage.');
      }
      router.replace('/parrainage/espace');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Vérification de la connexion"><Loader2 className="h-8 w-8 animate-spin text-[#1F5A56]" /></div>;
  }

  return (
    <section className="mx-auto min-h-[65vh] max-w-lg px-4 py-12 sm:px-7">
      <Link href="/parrainage" className="inline-flex items-center gap-2 text-sm font-medium text-[#1F5A56]"><ArrowLeft size={16} /> Retour au parrainage</Link>
      <div className="mt-6 rounded-lg border border-[#E2D7C7] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#9E2F55]">Espace parrain</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#123E3B]">{mode === 'register' ? 'Créer un compte parrain' : 'Se connecter'}</h1>
        <p className="mt-3 text-sm text-[#756B60]">Votre mot de passe est haché par le serveur et n’est jamais stocké en clair.</p>
        <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Adresse e-mail
            <input type="email" required maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-[#CFC1AD] px-3 py-2.5" />
          </label>
          <label className="block text-sm font-medium">Mot de passe
            <input type="password" required minLength={mode === 'register' ? 12 : undefined} maxLength={72} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded border border-[#CFC1AD] px-3 py-2.5" />
            {mode === 'register' && <span className="mt-1 block text-xs text-[#756B60]">12 caractères minimum, 72 octets maximum.</span>}
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded bg-[#1F5A56] px-4 py-3 font-semibold text-white disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Veuillez patienter…' : mode === 'register' ? 'Créer mon compte' : 'Me connecter'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-[#756B60]">
          {mode === 'register' ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button type="button" onClick={() => { setError(''); setMode(mode === 'register' ? 'login' : 'register'); }} className="font-semibold text-[#1F5A56] underline">
            {mode === 'register' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
      </div>
    </section>
  );
}

export default function SponsorAccountPage() {
  return <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#1F5A56]" /></div>}><SponsorAccountForm /></Suspense>;
}
