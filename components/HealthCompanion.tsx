'use client';

import { useState, useEffect } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

export default function HealthCompanion() {
  const [patho, setPatho] = useState('sein');
  const [age, setAge] = useState('');
  const [hasFamily, setHasFamily] = useState(false);
  const [resultItems, setResultItems] = useState<string[]>([
    'Autopalpation mensuelle conseillée une fois par mois pour bien connaître votre poitrine dès 25 ans.',
    'Frottis cervico-utérin ou test HPV tous les 3 à 5 ans entre 25 et 65 ans.',
    'Examen clinique annuel des seins et du pelvis lors de la consultation sage-femme ou médecin.',
  ]);
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
    try {
      const saved = localStorage.getItem('visa_journal_entries');
      if (saved) {
        setJournalEntries(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleCompute = () => {
    const numericAge = parseInt(age, 10);
    if (!numericAge || numericAge < 15 || numericAge > 99) {
      setResultItems([
        'Veuillez indiquer un âge valide (ex. 35) pour afficher vos repères personnalisés.',
      ]);
      setCalculatedAge(null);
      return;
    }

    setCalculatedAge(numericAge);
    const items: string[] = [];

    if (patho === 'sein' || patho === 'tous') {
      items.push('Autopalpation mensuelle régulière pour bien connaître votre poitrine dès 25 ans.');
      items.push('Palpation annuelle des seins par une sage-femme ou un médecin traitant.');
      if (numericAge >= 45) {
        items.push('Mammographie numérique de dépistage recommandée tous les 2 ans.');
      } else if (hasFamily && numericAge >= 35) {
        items.push('Antécédents familiaux directs : une première mammographie ou échographie dès 35-40 ans est conseillée.');
      }
    }

    if (patho === 'col' || patho === 'tous') {
      if (numericAge >= 25 && numericAge <= 65) {
        items.push('Frottis cervico-utérin ou test HPV tous les 3 à 5 ans pour prévenir les lésions du col.');
      } else if (numericAge < 25) {
        items.push('Vaccination préventive HPV fortement recommandée pour les adolescentes et jeunes femmes.');
      }
    }

    if (patho === 'ovaires' || patho === 'tous') {
      items.push('Consultation gynécologique en cas de pesanteur pelvienne ou ballonnements durant plus de 3 semaines.');
    }

    if (hasFamily) {
      items.push('Surveillance personnalisée recommandée avec votre gynécologue en raison de l\'histoire familiale.');
    }

    setResultItems(items);
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
            Sélectionnez le type de dépistage pour afficher les recommandations de santé publique OMS et togolaise, puis consignez vos observations.
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
                  onChange={(e) => setPatho(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[4px] bg-white/12 border border-white/25 text-white text-sm focus:outline-none focus:border-[#ffb1c3]"
                >
                  <option value="sein" className="text-black">Cancer du Sein</option>
                  <option value="col" className="text-black">Col de l'Utérus & HPV</option>
                  <option value="ovaires" className="text-black">Ovaires & Pelvis</option>
                  <option value="tous" className="text-black">Tous les dépistages féminins</option>
                </select>
              </div>

              <div>
                <label htmlFor="calcAge" className="block text-xs font-semibold text-[#E2EDE9] mb-1.5">
                  Votre âge :
                </label>
                <input
                  id="calcAge"
                  type="number"
                  min="15"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex. 42"
                  className="w-full px-3.5 py-2.5 rounded-[4px] bg-white/12 border border-white/25 text-white text-sm placeholder-white/50 focus:outline-none focus:border-[#ffb1c3]"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#D3E2DF] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={hasFamily}
                  onChange={(e) => setHasFamily(e.target.checked)}
                  className="mt-0.5 accent-[#9E2F55] w-4 h-4 rounded cursor-pointer"
                />
                <span>
                  Antécédents familiaux directs (mère, sœur, tante atteinte d'un cancer féminin).
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

          {/* Résultat Dynamique */}
          <div className="bg-white/6 border border-white/15 rounded-[4px] p-6 sm:p-7 min-h-[220px] flex flex-col justify-between">
            <div>
              <h4 className="font-serif text-lg font-semibold text-white mb-3">
                {calculatedAge
                  ? `Vos repères personnalisés pour vos ${calculatedAge} ans :`
                  : 'Repères personnalisés recommandés :'}
              </h4>
              <ul className="space-y-2.5 text-sm text-[#E2EDE9] pl-5 list-disc">
                {resultItems.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[12px] text-[#A3C4BE] pt-4 border-t border-white/10 mt-4 m-0">
              * Données fournies à titre indicatif selon les directives de l'OMS et de la Société de Gynécologie du Togo.
            </p>
          </div>
        </div>

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
              className="flex-1 min-w-[260px] px-3.5 py-2.5 rounded-[4px] bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#ffb1c3]"
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