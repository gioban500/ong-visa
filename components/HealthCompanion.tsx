'use client';

import { useState } from 'react';

interface JournalEntry {
  date: string;
  text: string;
}

export default function HealthCompanion() {
  const [age, setAge] = useState<string>('');
  const [cancerType, setCancerType] = useState<'sein' | 'col' | 'colorectal'>('sein');
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const [journalInput, setJournalInput] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const handleCompute = () => {
    const parsedAge = parseInt(age, 10);
    if (!parsedAge) return;

    if (cancerType === 'sein') {
      if (parsedAge < 25) setRecommendation("Sensibilisation aux gestes d'observation personnelle. Pas de mammographie systématique.");
      else if (parsedAge < 50) setRecommendation("Examen clinique des seins 1 fois par an chez un professionnel de santé.");
      else setRecommendation("Dépistage organisé : Mammographie recommandée tous les 2 ans.");
    } else if (cancerType === 'col') {
      if (parsedAge < 25) setRecommendation("Vaccination HPV recommandée durant l'adolescence. Le dépistage débute à 25 ans.");
      else if (parsedAge <= 65) setRecommendation("Frottis tous les 3 ans (ou test HPV tous les 5 ans selon l'historique).");
      else setRecommendation("Consulter votre médecin pour vérifier la nécessité de poursuivre le suivi.");
    } else if (cancerType === 'colorectal') {
      if (parsedAge < 50) setRecommendation("Dépistage ciblé sur signe d'alerte ou antécédent familial direct.");
      else setRecommendation("Test immunologique de dépistage recommandé tous les 2 ans (de 50 à 74 ans).");
    }
  };

  const handleAddJournal = () => {
    if (!journalInput.trim()) return;
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    setEntries((prev) => [{ date: dateStr, text: journalInput.trim() }, ...prev]);
    setJournalInput('');
  };

  return (
    <section id="compagnon" className="py-16 bg-[#123E3B] text-[#F3EAF2]">
      <div className="max-w-[1120px] mx-auto px-7">
        <h2 className="font-serif text-3xl text-white mb-2">Calculateur & Carnet de suivi</h2>
        <p className="text-[#DCC8DA] text-sm mb-8 max-w-xl">
          Sélectionnez le type de dépistage pour afficher les recommandations de santé publique et consigner vos observations.
        </p>

        <div className="bg-white/5 border border-white/20 rounded p-6 max-w-2xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="typeSelect" className="block text-xs font-semibold mb-1">Pathologie / Dépistage</label>
              <select
                id="typeSelect"
                value={cancerType}
                onChange={(e) => setCancerType(e.target.value as any)}
                className="w-full p-2 rounded bg-white/10 border border-white/30 text-white text-sm focus:outline-none"
              >
                <option value="sein" className="text-black">Cancer du Sein</option>
                <option value="col" className="text-black">Cancer du Col de l'utérus</option>
                <option value="colorectal" className="text-black">Cancer Colorectal</option>
              </select>
            </div>

            <div>
              <label htmlFor="ageInputComp" className="block text-xs font-semibold mb-1">Votre âge</label>
              <input
                id="ageInputComp"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex. 45"
                className="w-full p-2 rounded bg-white/10 border border-white/30 text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCompute}
            className="bg-[#7A2143] hover:bg-[#5E1833] text-white px-4 py-2 rounded text-xs font-semibold transition mb-4"
          >
            Obtenir mes repères
          </button>

          {recommendation && (
            <div className="bg-white/10 p-4 rounded text-xs text-[#EFE6D8] border-l-2 border-[#7A2143]">
              <strong>Recommandation :</strong> {recommendation}
            </div>
          )}
        </div>

        <div className="max-w-2xl">
          <h3 className="font-serif text-xl text-white mb-1">Carnet de symptômes personnel</h3>
          <p className="text-xs text-[#DCC8DA] mb-3">
            Notez tout changement ou gêne ressentie (date, fréquence) à présenter lors de votre prochaine consultation.
          </p>

          <textarea
            value={journalInput}
            onChange={(e) => setJournalInput(e.target.value)}
            placeholder="Ex. fatigue persistante depuis 2 semaines, douleurs abdominales légères..."
            rows={2}
            className="w-full p-3 rounded border border-white/30 bg-white/10 text-white placeholder-white/50 text-sm focus:outline-none resize-y"
          />
          <button
            onClick={handleAddJournal}
            className="mt-2 border border-white/50 text-white hover:bg-white/10 px-4 py-1.5 rounded text-xs font-semibold transition"
          >
            Ajouter au carnet
          </button>

          {entries.length > 0 && (
            <div className="mt-4 space-y-2">
              {entries.map((entry, idx) => (
                <div key={idx} className="bg-white/10 rounded p-3 text-xs flex gap-2">
                  <span className="font-semibold text-white/80">{entry.date}</span>
                  <span>{entry.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}