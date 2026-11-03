'use client';

import { useState, useEffect } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

interface ScreeningResult {
  title: string;
  details: string[];
  source?: { label: string; href: string };
}

interface CalculatorResults {
  breast?: ScreeningResult;
  cervix?: ScreeningResult;
  familyHistoryWarning?: boolean;
}

const isJournalEntry = (value: unknown): value is JournalEntry =>
  typeof value === 'object'
  && value !== null
  && 'id' in value
  && typeof value.id === 'string'
  && 'date' in value
  && typeof value.date === 'string'
  && 'text' in value
  && typeof value.text === 'string';

export default function HealthCompanion() {
  const [patho, setPatho] = useState('sein');
  const [age, setAge] = useState('');
  const [hasFamily, setHasFamily] = useState(false);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [calculatorError, setCalculatorError] = useState('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Carnet personnel
  const [journalInput, setJournalInput] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'init-1',
      date: 'Exemple',
      text: 'Sensibilité passagère remarquée il y a 3 jours — penser à demander une vérification à la sage-femme.',
    },
  ]);

  // Charger depuis localStorage côté client si disponible
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem('visa_journal_entries');
        if (!saved) return;

        const entries: unknown = JSON.parse(saved);
        if (Array.isArray(entries) && entries.every(isJournalEntry)) {
          setJournalEntries(entries);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du carnet de suivi:', error);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const resetCalculatorResults = () => {
    setResults(null);
    setCalculatorError('');
    setCalculatedAge(null);
  };

  const handleCompute = () => {
    const numericAge = Number(age);
    if (age.trim() === '' || !Number.isInteger(numericAge) || numericAge < 0 || numericAge > 120) {
      setCalculatorError('Veuillez indiquer un âge entier valide, entre 0 et 120 ans.');
      setResults(null);
      setCalculatedAge(null);
      return;
    }

    setCalculatorError('');
    setCalculatedAge(numericAge);
    if (hasFamily) {
      setResults({ familyHistoryWarning: true });
      return;
    }

    const nextResults: CalculatorResults = {};

    if (patho === 'sein' || patho === 'tous') {
      if (numericAge < 20) {
        nextResults.breast = {
          title: 'Habitudes de vie saines & connaissance de son corps',
          details: [
            'Le cancer du sein est rare à cet âge. Privilégiez une alimentation équilibrée, l’activité physique et évitez le tabac et l’alcool.',
            'Prenez simplement l’habitude d’observer votre poitrine de temps en temps, par exemple sous la douche.',
          ],
        };
      } else if (numericAge < 40) {
        nextResults.breast = {
          title: 'Examen clinique régulier & auto-surveillance active',
          details: [
            'Un examen clinique des seins par un professionnel de santé est recommandé tous les 3 ans.',
            'Apprenez à repérer une grosseur, une modification de la peau ou un écoulement du mamelon et consultez rapidement si l’un de ces signes apparaît.',
          ],
        };
      } else if (numericAge < 50) {
        nextResults.breast = {
          title: 'Examen clinique annuel & suivi individuel',
          details: [
            'Faites examiner vos seins chaque année par un médecin ou une sage-femme.',
            'À partir de 40 ans, une mammographie peut être discutée avec votre professionnel de santé selon votre profil.',
          ],
        };
      } else if (numericAge <= 74) {
        nextResults.breast = {
          title: 'Dépistage par mammographie',
          details: [
            'Une mammographie tous les 2 ans est recommandée, en complément d’un examen clinique annuel.',
            'La mammographie peut détecter certaines anomalies qui ne sont pas perceptibles à la palpation.',
          ],
          source: {
            label: 'En savoir plus sur le dépistage organisé',
            href: 'https://cancers-enparleratous.org/wp-content/uploads/2022/06/depliant_information_depistage_cancer_sein_langues_afrique_ouest_mel_20180214.pdf',
          },
        };
      } else {
        nextResults.breast = {
          title: 'Suivi médical sur mesure',
          details: [
            'Le dépistage systématique par mammographie s’arrête après 74 ans dans ces repères.',
            'Poursuivez le suivi clinique annuel. Discutez avec votre médecin de l’intérêt de continuer l’imagerie selon votre situation.',
          ],
        };
      }
    }

    if (patho === 'uterus' || patho === 'tous') {
      if (numericAge < 25) {
        nextResults.cervix = {
          title: 'Vaccination & prévention primaire',
          details: [
            'Le dépistage par frottis ou test HPV n’est pas recommandé avant 25 ans dans ces repères.',
            'La vaccination contre le HPV est prioritaire pour les jeunes filles de 9 à 14 ans. Le préservatif réduit le risque de transmission du HPV sans le supprimer complètement.',
          ],
        };
      } else if (numericAge <= 50) {
        nextResults.cervix = {
          title: 'Dépistage prioritaire',
          details: [
            'Effectuez un frottis ou un test HPV tous les 2 à 3 ans, selon les recommandations de votre professionnel de santé.',
            'La méthode visuelle VIA/VILI peut également être proposée là où elle est disponible.',
          ],
          source: {
            label: 'Information sur les campagnes de dépistage à Lomé',
            href: 'https://ekinamag.com/2024/06/17/cancer-du-col-de-luterus-une-campagne-de-depistage-gratuit-en-cours-a-linh/',
          },
        };
      } else if (numericAge <= 65) {
        nextResults.cervix = {
          title: 'Suivi et dépistage par test HPV',
          details: [
            'Le dépistage continue jusqu’à 65 ans : un test HPV ou un frottis est recommandé tous les 5 ans si vous n’avez pas d’antécédents nécessitant un suivi particulier.',
          ],
        };
      } else {
        nextResults.cervix = {
          title: 'Arrêt du dépistage sous conditions',
          details: [
            'Le dépistage régulier peut s’arrêter si les examens des 10 dernières années étaient normaux et qu’un professionnel de santé confirme que vous pouvez l’arrêter.',
            'Après la ménopause, consultez rapidement en cas de saignement, même léger.',
          ],
        };
      }
    }

    setResults(nextResults);
  };

  const handleAddJournal = () => {
    if (!journalInput.trim()) return;
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: dateStr,
      text: journalInput.trim(),
    };
    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    setJournalInput('');
    try {
      localStorage.setItem('visa_journal_entries', JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journalEntries.filter((e) => e.id !== id);
    setJournalEntries(updated);
    try {
      localStorage.setItem('visa_journal_entries', JSON.stringify(updated));
    } catch {}
  };

  return (
    <section id="compagnon" style={{ padding: '64px 0', background: 'var(--teal-deep)', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="wrap">
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, color: '#F8B4C6', marginBottom: 6, display: 'block' }}>Autonomie &amp; Sérénité</span>
          <h2 style={{ fontSize: 32, letterSpacing: '-0.3px', marginBottom: 12, color: '#fff' }}>Calculateur &amp; Carnet de suivi</h2>
          <p style={{ fontSize: 16, color: '#D3E2DF', lineHeight: 1.6 }}>
            Choisissez entre le cancer du sein et les cancers de l&apos;utérus pour afficher des repères de prévention, puis consignez vos observations.
          </p>
        </div>

        {/* Grille Calculateur & Résultat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-8">
          {/* Calculateur */}
          <div className="bg-white/8 border border-white/15 rounded-[4px] p-6 sm:p-7 backdrop-blur-sm">
            <h3 className="font-serif text-xl font-semibold text-white mb-4">
              Calculer mes repères de dépistage
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="calcPatho" className="block text-xs font-semibold text-[#E2EDE9] mb-1.5">
                  Pathologie / Dépistage ciblé :
                </label>
                <select
                  id="calcPatho"
                  value={patho}
                  onChange={(e) => {
                    setPatho(e.target.value);
                    resetCalculatorResults();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-[4px] bg-white border border-[#D3E2DF] text-[#2A2521] text-sm focus:outline-none focus:border-[#ffb1c3] focus:ring-2 focus:ring-[#ffb1c3]/40"
                >
                  <option value="sein" className="text-black">Cancer du Sein</option>
                  <option value="uterus" className="text-black">Cancer du col de l&apos;utérus</option>
                  <option value="tous" className="text-black">Cancers du sein et de l&apos;utérus</option>
                </select>
              </div>

              <div>
                <label htmlFor="calcAge" className="block text-xs font-semibold text-[#E2EDE9] mb-1.5">
                  Votre âge :
                </label>
                <input
                  id="calcAge"
                  type="number"
                  min="0"
                  max="120"
                  step="1"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    resetCalculatorResults();
                  }}
                  placeholder="Ex. 42"
                  aria-invalid={Boolean(calculatorError)}
                  aria-describedby={calculatorError ? 'calculator-error' : undefined}
                  className="w-full px-3.5 py-2.5 rounded-[4px] bg-white border border-[#D3E2DF] text-[#2A2521] text-sm placeholder:text-[#756B60] focus:outline-none focus:border-[#ffb1c3] focus:ring-2 focus:ring-[#ffb1c3]/40"
                />
              </div>

              {calculatorError && (
                <p id="calculator-error" role="alert" className="text-sm text-rose-200">
                  {calculatorError}
                </p>
              )}

              <label className="flex items-start gap-2.5 text-xs text-[#D3E2DF] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={hasFamily}
                  onChange={(e) => {
                    setHasFamily(e.target.checked);
                    resetCalculatorResults();
                  }}
                  className="mt-0.5 accent-[#9E2F55] w-4 h-4 rounded cursor-pointer"
                />
                <span>
                  Antécédents familiaux de cancer du sein ou du col de l&apos;utérus (mère, sœur ou tante).
                </span>
              </label>

              <button
                type="button"
                onClick={handleCompute}
                className="w-full bg-[#9E2F55] hover:bg-[#7A2143] text-white py-3 rounded-[4px] font-semibold text-sm transition-colors shadow-sm mt-2"
              >
                Obtenir mes repères
              </button>
            </div>
          </div>

          {/* Résultats par pathologie */}
          <div aria-live="polite" className="min-w-0">
            {!results ? (
              <div className="bg-white/6 border border-white/15 rounded-[4px] p-6 sm:p-7 min-h-[220px]">
                <h4 className="font-serif text-lg font-semibold text-white mb-3">
                  Repères de dépistage
                </h4>
                <p className="text-sm text-[#E2EDE9]">
                  Saisissez votre âge et cliquez sur « Obtenir mes repères » pour afficher les recommandations correspondant à votre situation.
                </p>
              </div>
            ) : results.familyHistoryWarning ? (
              <div role="alert" className="bg-rose-950/40 border border-rose-200/50 rounded-[4px] p-6 sm:p-7">
                <h4 className="font-serif text-lg font-semibold text-white mb-3">
                  Risque familial à prendre en compte
                </h4>
                <p className="text-sm leading-relaxed text-[#FFF1F3]">
                  Attention : Risque Élevé. Vos examens doivent être avancés. Consultez un gynécologue pour établir un calendrier personnalisé dès maintenant.
                </p>
              </div>
            ) : (
              <>
                <h4 className="font-serif text-lg font-semibold text-white mb-3">
                  Vos repères à {calculatedAge} ans
                </h4>
                <div className={`grid grid-cols-1 ${results.breast && results.cervix ? 'md:grid-cols-2' : ''} gap-4`}>
                  {results.breast && (
                    <article className="bg-white/6 border border-white/15 rounded-[4px] p-5 sm:p-6">
                      <h5 className="font-serif text-base font-semibold text-white mb-3">
                        Cancer du sein
                      </h5>
                      <p className="text-sm font-semibold text-[#FFB1C3] mb-3">
                        {results.breast.title}
                      </p>
                      <ul className="space-y-2.5 text-sm text-[#E2EDE9] pl-5 list-disc">
                        {results.breast.details.map((detail) => (
                          <li key={detail} className="leading-relaxed">{detail}</li>
                        ))}
                      </ul>
                      {results.breast.source && (
                        <a
                          href={results.breast.source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block text-sm font-medium text-[#BFE4DD] underline underline-offset-2"
                        >
                          {results.breast.source.label}
                        </a>
                      )}
                    </article>
                  )}
                  {results.cervix && (
                    <article className="bg-white/6 border border-white/15 rounded-[4px] p-5 sm:p-6">
                      <h5 className="font-serif text-base font-semibold text-white mb-3">
                        Cancer du col de l&apos;utérus
                      </h5>
                      <p className="text-sm font-semibold text-[#FFB1C3] mb-3">
                        {results.cervix.title}
                      </p>
                      <ul className="space-y-2.5 text-sm text-[#E2EDE9] pl-5 list-disc">
                        {results.cervix.details.map((detail) => (
                          <li key={detail} className="leading-relaxed">{detail}</li>
                        ))}
                      </ul>
                      {results.cervix.source && (
                        <a
                          href={results.cervix.source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block text-sm font-medium text-[#BFE4DD] underline underline-offset-2"
                        >
                          {results.cervix.source.label}
                        </a>
                      )}
                    </article>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <p role="note" className="mb-8 rounded-[4px] border border-rose-200/40 bg-rose-950/30 p-4 text-sm leading-relaxed text-white">
          Peu importe les repères affichés par ce calculateur, l&apos;apparition d&apos;une boule au sein ou d&apos;un saignement anormal après la ménopause exige une consultation immédiate.
        </p>
        <p className="mb-8 text-xs leading-relaxed text-[#A3C4BE]">
        Ces repères généraux ne remplacent pas un avis médical. Les intervalles peuvent varier selon vos antécédents, votre situation et les recommandations locales en vigueur ; confirmez votre suivi avec un professionnel de santé.
        </p>

        {/* Carnet de symptômes hors-ligne */}
        <div className="bg-white/5 border border-white/15 rounded-[4px] p-6 sm:p-7">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-white mb-1.5">
            Carnet de symptômes personnel
          </h3>
          <p className="text-[13.5px] text-[#C4DBD6] mb-4 max-w-2xl">
            Notez tout changement ou gêne ressentie (date, fréquence) à présenter lors de votre prochaine consultation.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-4">
            <input
              type="text"
              value={journalInput}
              onChange={(e) => setJournalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddJournal();
                }
              }}
              placeholder="Ex. Tension mammaire remarquée le 14, sans rougeur..."
              className="flex-1 min-w-[260px] px-3.5 py-2.5 rounded-[4px] bg-white border border-[#D3E2DF] text-[#2A2521] placeholder:text-[#756B60] text-sm focus:outline-none focus:border-[#ffb1c3] focus:ring-2 focus:ring-[#ffb1c3]/40"
            />
            <button
              onClick={handleAddJournal}
              className="bg-white hover:bg-[#FAF6F0] text-[#123E3B] px-5 py-2.5 rounded-[4px] font-semibold text-sm transition-colors shadow-sm"
            >
              Ajouter au carnet
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/8 border border-white/12 rounded-[4px] px-4 py-2.5 text-[13.5px] text-white flex items-center justify-between gap-3"
              >
                <span>
                  <strong className="text-[#ffb1c3] font-semibold">{entry.date} :</strong>{' '}
                  {entry.text}
                </span>
                <button
                  onClick={() => handleDeleteJournal(entry.id)}
                  title="Supprimer cette note"
                  className="text-white/60 hover:text-white text-base px-1.5 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}