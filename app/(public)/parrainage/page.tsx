'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  Eye,
  HandCoins,
  HeartHandshake,
  Loader2,
  LogOut,
  MessageCircleHeart,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface Person {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  amountCollected: number;
}

const contributionAmounts = ['1 000 F', '2 000 F', '5 000 F', '10 000 F', 'ou plus'];

const participationSteps = [
  {
    number: '01',
    icon: CircleDollarSign,
    title: 'Choisissez votre contribution',
    description: 'Déterminez librement le montant mensuel qui correspond à vos moyens.',
  },
  {
    number: '02',
    icon: CalendarDays,
    title: 'Choisissez votre durée',
    description: 'Engagez-vous pour 6 ou 12 mois, selon ce qui vous convient.',
  },
  {
    number: '03',
    icon: HandCoins,
    title: 'Contribuez chaque mois',
    description: 'L’équipe VISA vous indique les modalités pour effectuer vos versements.',
  },
];

const commitments = [
  {
    icon: Check,
    title: 'Une confirmation',
    description: 'Chaque contribution reçue est confirmée par l’équipe.',
  },
  {
    icon: TrendingUp,
    title: 'Un suivi régulier',
    description: 'Vous pouvez consulter l’évolution des fonds collectés.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Des nouvelles des actions',
    description: 'Nous vous informons périodiquement des actions réalisées.',
  },
  {
    icon: CircleDollarSign,
    title: 'De la transparence',
    description: 'Les contributions sont suivies avec attention et transparence.',
  },
  {
    icon: ShieldCheck,
    title: 'La confidentialité',
    description: 'Nous veillons au respect de la vie privée des bénéficiaires.',
  },
];

const formatAmount = (amount: number) => `${amount.toLocaleString('fr-FR')} FCFA`;

export default function SponsorshipPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sponsor, setSponsor] = useState<{ email: string } | null>(null);
  const [sessionStatus, setSessionStatus] = useState<'checking' | 'anonymous' | 'authenticated' | 'unavailable'>('checking');
  const [sessionError, setSessionError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/sponsorship/beneficiaries', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Impossible de charger les personnes parrainables.');
        setPeople(data);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les personnes parrainables.');
      })
      .finally(() => setLoading(false));
  }, []);

  const checkSponsorSession = useCallback(async () => {
    setSessionStatus('checking');
    setSessionError('');
    try {
      const response = await fetch('/api/sponsorship/auth/session', { cache: 'no-store' });
      if (response.status === 401) {
        setSponsor(null);
        setSessionStatus('anonymous');
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de vérifier votre connexion.');
      setSponsor(data.sponsor);
      setSessionStatus('authenticated');
    } catch (sessionLoadError) {
      setSessionError(sessionLoadError instanceof Error ? sessionLoadError.message : 'Impossible de vérifier votre connexion.');
      setSessionStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void checkSponsorSession(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [checkSponsorSession]);

  const logout = async () => {
    setLoggingOut(true);
    setSessionError('');
    try {
      const response = await fetch('/api/sponsorship/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('La déconnexion n’a pas abouti. Réessayez.');
      setSponsor(null);
      setSessionStatus('anonymous');
    } catch (logoutError) {
      setSessionError(logoutError instanceof Error ? logoutError.message : 'La déconnexion n’a pas abouti.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF6F0] text-[#2A2521]">
      <section className="relative isolate bg-[#123E3B] px-4 py-16 text-white sm:px-7 sm:py-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#9E2F55]/25 blur-3xl" />
          <div className="absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-[#71A49A]/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_25%,rgba(255,255,255,0.08),transparent_42%)]" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.17em] text-[#FFD4DE]">
              <HeartHandshake size={15} />
              Programme de parrainage solidaire · Togo
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Devenir parrain
              <span className="block text-[#FFD4DE]">ou marraine</span>
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-white sm:text-2xl">
              Un engagement mensuel pour donner une chance de vivre aux femmes atteintes de cancer.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#D3E2DF] sm:text-base">
              Et si, chaque mois, votre générosité permettait à une femme de poursuivre son combat contre le cancer ? Au Togo, de nombreuses femmes atteintes d’un cancer du sein ou du col de l’utérus rencontrent des difficultés financières pour poursuivre leurs traitements. L’ONG VISA mobilise des parrains et marraines pour les accompagner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#personnes" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9E2F55] px-6 py-3 font-semibold text-white transition hover:bg-[#842645]">
                Choisir une personne <ArrowRight size={17} />
              </Link>
              {sessionStatus === 'checking' ? (
                <span role="status" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm text-[#D3E2DF]">
                  <Loader2 size={16} className="animate-spin" /> Vérification de votre espace…
                </span>
              ) : sessionStatus === 'authenticated' ? (
                <>
                  <Link href="/parrainage/espace" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#123E3B] transition hover:bg-[#E4EFEC]">
                    Voir mes parrainages <ArrowRight size={17} />
                  </Link>
                  <button type="button" onClick={() => void logout()} disabled={loggingOut} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-60">
                    <LogOut size={16} /> {loggingOut ? 'Déconnexion…' : 'Se déconnecter'}
                  </button>
                </>
              ) : sessionStatus === 'anonymous' ? (
                <>
                  <Link href="/parrainage/compte" className="inline-flex items-center justify-center rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                    Créer un compte parrain
                  </Link>
                  <Link href="/parrainage/compte?mode=login" className="inline-flex items-center justify-center rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                    Se connecter
                  </Link>
                </>
              ) : (
                <button type="button" onClick={() => void checkSponsorSession()} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                  Réessayer de vérifier mon espace <ArrowRight size={17} />
                </button>
              )}
            </div>
            {sessionStatus === 'authenticated' && sponsor && (
              <p className="mt-3 text-sm text-[#D3E2DF]">Connecté·e en tant que {sponsor.email}</p>
            )}
            {sessionError && <p role="alert" className="mt-3 text-sm text-[#FFD4DE]">{sessionError}</p>}
          </div>

          <aside className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-[#F0B7C4]/15" aria-hidden="true" />
            <div className="relative rounded-[1.6rem] border border-white/15 bg-[#FAF6F0] p-7 text-[#2A2521] shadow-2xl sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8E7EB] text-[#9E2F55]">
                <HeartHandshake size={25} />
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#9E2F55]">La solidarité, chaque mois</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#123E3B]">
                Un petit geste régulier. Un grand soutien dans la durée.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#62584F]">
                Même 1 000 FCFA par mois peuvent faire la différence lorsque nous sommes nombreux à nous engager.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {contributionAmounts.map((amount) => (
                  <span key={amount} className="rounded-full border border-[#E2D7C7] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F5A56]">{amount}</span>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-3 border-t border-[#E2D7C7] pt-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4EFEC] text-[#1F5A56]"><CalendarDays size={19} /></span>
                <p className="text-sm leading-5 text-[#514A43]"><strong className="text-[#123E3B]">6 ou 12 mois</strong><br />Choisissez une durée qui vous convient.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-7 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9E2F55]">Un geste concret, un espoir partagé</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123E3B] sm:text-4xl">Comment participer ?</h2>
          <p className="mt-4 leading-7 text-[#62584F]">
            Rejoignez un élan de solidarité et soutenez les femmes qui ont besoin d’aide pour poursuivre leurs soins.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {participationSteps.map(({ number, icon: Icon, title, description }) => (
            <article key={number} className="relative rounded-2xl border border-[#E2D7C7] bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4EFEC] text-[#1F5A56]"><Icon size={23} /></span>
                <span className="font-serif text-3xl font-semibold text-[#E8D9CC]">{number}</span>
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-[#123E3B]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#62584F]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#EAD5DB] bg-[#F8E7EB]/70 p-5 sm:flex-row sm:items-center sm:p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#9E2F55]"><Eye size={21} /></span>
          <p className="text-sm leading-6 text-[#514A43]">
            <strong className="text-[#842645]">Comment ça se passe ?</strong> Le montant et la durée de votre engagement sont convenus avec l’équipe de l’ONG VISA, qui vous précise les modalités de versement.{' '}
            <Link href="/contact" className="font-semibold text-[#842645] underline underline-offset-2">Contacter l’équipe</Link>. Ce site ne traite aucun paiement ; les contributions reçues sont ensuite enregistrées et suivies par l’équipe.
          </p>
        </div>
      </section>

      <section className="border-y border-[#E2D7C7] bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-7 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9E2F55]">Nos engagements envers vous</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123E3B] sm:text-4xl">Votre confiance compte.</h2>
            <p className="mt-4 leading-7 text-[#62584F]">
              Parrainer, c’est créer un lien de solidarité. Nous nous engageons à vous tenir informé·e et à traiter chaque contribution avec sérieux et respect.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {commitments.map(({ icon: Icon, title, description }) => (
              <article key={title} className="flex gap-4 rounded-xl border border-[#EEE5DA] bg-[#FAF6F0]/70 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1F5A56] shadow-sm"><Icon size={19} /></span>
                <div>
                  <h3 className="font-semibold text-[#123E3B]">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-[#62584F]">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-7 sm:py-20">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#123E3B] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#9E2F55]/30 blur-3xl" />
          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD4DE]"><HeartHandshake size={15} /> Ensemble, donnons de l’espoir</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">Soutenez la vie, un mois après l’autre.</h2>
              <p className="mt-3 text-sm leading-6 text-[#D3E2DF]">Découvrez les personnes actuellement ouvertes au parrainage et choisissez comment vous souhaitez vous engager.</p>
            </div>
            <Link href="#personnes" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#F0B7C4] px-6 py-3 font-semibold text-[#3A2028] transition hover:bg-[#FFD4DE]">
              Voir les personnes <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section id="personnes" className="scroll-mt-24 bg-[#F3EDE4] px-4 py-16 sm:px-7 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9E2F55]">Les personnes à accompagner</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#123E3B] sm:text-4xl">Choisissez une personne à parrainer</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#62584F]">Consultez les dossiers ouverts et leur progression. La liste est publique ; un compte sera demandé pour confirmer votre parrainage.</p>
            </div>
            {!loading && !error && people.length > 0 && (
              <p className="inline-flex items-center gap-2 self-start rounded-full border border-[#E2D7C7] bg-white px-4 py-2 text-sm font-medium text-[#1F5A56] sm:self-auto">
                <HeartHandshake size={17} /> {people.length} dossier{people.length === 1 ? '' : 's'} ouvert{people.length === 1 ? '' : 's'}
              </p>
            )}
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
          {loading ? (
            <div className="flex justify-center rounded-2xl border border-[#E2D7C7] bg-white py-16" role="status" aria-label="Chargement des personnes parrainables"><Loader2 className="h-8 w-8 animate-spin text-[#1F5A56]" /></div>
          ) : !error && !people.length ? (
            <div className="rounded-2xl border border-[#E2D7C7] bg-white px-6 py-12 text-center">
              <HeartHandshake className="mx-auto h-10 w-10 text-[#9E2F55]" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123E3B]">De nouveaux dossiers bientôt</h3>
              <p className="mt-2 text-sm text-[#62584F]">Aucune personne n’est actuellement ouverte au parrainage. Revenez prochainement pour découvrir les nouveaux dossiers.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {people.map((person) => {
                const progress = Math.min(100, Math.round((person.amountCollected / person.totalCost) * 100));
                return (
                  <article key={person.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#E2D7C7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="h-1.5 bg-gradient-to-r from-[#9E2F55] via-[#D990A3] to-[#1F5A56]" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E2F55]">Dossier de parrainage</p>
                          <h3 className="mt-1 font-serif text-xl font-semibold text-[#123E3B]">{person.name}</h3>
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8E7EB] text-[#9E2F55]"><HeartHandshake size={19} /></span>
                      </div>
                      <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-6 text-[#514A43]">{person.description || 'Une personne accompagnée par l’ONG VISA.'}</p>

                      <div className="mt-6 rounded-xl bg-[#FAF6F0] p-4">
                        <div className="mb-2 flex justify-between gap-3 text-xs text-[#756B60]">
                          <span>Collecte globale</span>
                          <span className="font-semibold text-[#123E3B]">{progress}%</span>
                        </div>
                        <div
                          className="h-2.5 overflow-hidden rounded-full bg-[#E6DCCE]"
                          role="progressbar"
                          aria-label={`Avancement du financement de ${person.name}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={progress}
                        >
                          <div className="h-full rounded-full bg-[#1F5A56] transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="mt-2 flex justify-between gap-3 text-xs">
                          <span className="font-semibold text-[#1F5A56]">{formatAmount(person.amountCollected)} collectés</span>
                          <span className="text-[#756B60]">sur {formatAmount(person.totalCost)}</span>
                        </div>
                      </div>

                      <Link href={`/parrainage/${person.id}`} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F5A56] px-4 py-3 font-semibold text-white transition hover:bg-[#123E3B]">
                        Voir la fiche <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#756B60]">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#1F5A56]" size={15} />
            Les informations affichées sont limitées à celles nécessaires à la présentation des dossiers et au suivi solidaire.
          </p>
        </div>
      </section>

      <section className="bg-[#9E2F55] px-4 py-12 text-center text-white sm:px-7">
        <div className="mx-auto max-w-3xl">
          <p className="font-serif text-2xl font-semibold leading-relaxed text-white sm:text-3xl">« Même 1 000 FCFA par mois peuvent faire la différence lorsque nous sommes nombreux à nous engager. »</p>
          <p className="mt-3 text-sm text-white/80">Ensemble, donnons de l’espoir et soutenons la vie.</p>
          {sessionStatus === 'authenticated' ? (
            <Link href="/parrainage/espace" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#842645] transition hover:bg-[#FAF6F0]">
              Voir mes parrainages <ArrowRight size={17} />
            </Link>
          ) : sessionStatus === 'anonymous' ? (
            <Link href="/parrainage/compte" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#842645] transition hover:bg-[#FAF6F0]">
              Devenir parrain ou marraine <ArrowRight size={17} />
            </Link>
          ) : (
            <Link href="#personnes" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#842645] transition hover:bg-[#FAF6F0]">
              Découvrir les personnes <ArrowRight size={17} />
            </Link>
          )}
        </div>
      </section>

    </div>
  );
}
