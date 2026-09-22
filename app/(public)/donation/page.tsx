'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, CreditCard, Check, Users, Share2 } from 'lucide-react';

const presetAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

export default function DonationPage() {
  const [amount, setAmount] = useState<number | string>(10000);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [submitted, setSubmitted] = useState(false);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount('custom');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const finalAmount: number =
    amount === 'custom'
      ? parseFloat(customAmount) || 0
      : typeof amount === 'number'
      ? amount
      : 0;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A2521] pb-20">
      {/* Hero Section */}
      <section className="bg-[#123E3B] text-white py-14 px-4 sm:px-7 border-b border-white/10 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-[#9E2F55] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-7 h-7 text-white fill-current" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#ffb1c3] block">
            Solidarité Cancers Féminins au Togo
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-white leading-tight">
            Soutenez les Actions de l'ONG VISA
          </h1>
          <p className="text-base sm:text-lg text-[#D3E2DF] leading-relaxed max-w-2xl mx-auto">
            Votre générosité finance le dépistage précoce (VIA-VILI, mammographie), l'information des femmes dans les communautés et la prise en charge des patientes isolées.
          </p>
        </div>
      </section>

      {/* Impact des Dons */}
      <section className="max-w-[1180px] mx-auto px-4 sm:px-7 py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9E2F55] mb-1 block">
            Transparence & Efficacité
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2A2521]">
            L'Impact Concret de Votre Don
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[4px] p-6 border border-[#E2D7C7] border-t-4 border-t-[#9E2F55] shadow-sm">
            <div className="font-serif text-2xl font-bold text-[#9E2F55] mb-2">15 000 FCFA</div>
            <p className="text-[14px] text-[#514A43] leading-relaxed">
              Finance les kits de dépistage visuel (acide acétique et lugol) pour 20 femmes lors des tournées foraines.
            </p>
          </div>

          <div className="bg-white rounded-[4px] p-6 border border-[#E2D7C7] border-t-4 border-t-[#1F5A56] shadow-sm">
            <div className="font-serif text-2xl font-bold text-[#1F5A56] mb-2">30 000 FCFA</div>
            <p className="text-[14px] text-[#514A43] leading-relaxed">
              Permet d'organiser un atelier d'apprentissage de l'autopalpation et de sensibilisation dans un marché ou un dispensaire.
            </p>
          </div>

          <div className="bg-white rounded-[4px] p-6 border border-[#E2D7C7] border-t-4 border-t-[#9E2F55] shadow-sm">
            <div className="font-serif text-2xl font-bold text-[#9E2F55] mb-2">65 000 FCFA</div>
            <p className="text-[14px] text-[#514A43] leading-relaxed">
              Prend en charge le transport et les examens d'imagerie diagnostique (mammographie / échographie) pour une patiente démunie.
            </p>
          </div>
        </div>
      </section>

      {/* Formulaire de Don */}
      <section className="max-w-[760px] mx-auto px-4 sm:px-7 py-6">
        {!submitted ? (
          <div className="bg-white rounded-[4px] p-6 sm:p-9 border border-[#E2D7C7] shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-[#2A2521] mb-6 text-center">
              Choisissez Votre Contribution
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fréquence */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#756B60] mb-2">
                  Fréquence du don
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFrequency('once')}
                    className={`py-2.5 px-4 rounded-[4px] text-sm font-semibold transition-all border ${
                      frequency === 'once'
                        ? 'border-[#9E2F55] bg-[#F9EBF0] text-[#9E2F55]'
                        : 'border-[#E2D7C7] bg-white text-[#514A43] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    Don Unique
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`py-2.5 px-4 rounded-[4px] text-sm font-semibold transition-all border ${
                      frequency === 'monthly'
                        ? 'border-[#9E2F55] bg-[#F9EBF0] text-[#9E2F55]'
                        : 'border-[#E2D7C7] bg-white text-[#514A43] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    Don Mensuel
                  </button>
                </div>
              </div>

              {/* Montants prédéfinis */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#756B60] mb-2">
                  Montant en FCFA
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={`py-3 px-3 rounded-[4px] border font-serif text-base font-semibold transition-all ${
                        amount === preset
                          ? 'border-[#1F5A56] bg-[#1F5A56] text-white shadow-sm'
                          : 'border-[#E2D7C7] bg-white text-[#2A2521] hover:bg-[#F5EFE6]'
                      }`}
                    >
                      {preset.toLocaleString('fr-FR')} FCFA
                    </button>
                  ))}
                </div>

                {/* Montant personnalisé */}
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      className="w-full px-4 py-2.5 pr-16 rounded-[4px] border border-[#CFC1AD] bg-white text-[#2A2521] focus:outline-none focus:border-[#9E2F55] text-sm"
                      placeholder="Autre montant libre (ex: 20 000)"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#756B60]">
                      FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Résumé du don */}
              <div className="bg-[#F5EFE6] rounded-[4px] p-4.5 border border-[#E2D7C7] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#756B60] block">Type sélectionné :</span>
                  <span className="font-semibold text-sm text-[#2A2521]">
                    {frequency === 'once' ? 'Don ponctuel' : 'Don mensuel régulier'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#756B60] block">Total :</span>
                  <span className="font-serif text-2xl font-bold text-[#9E2F55]">
                    {finalAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Coordonnées */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-base font-semibold text-[#2A2521]">
                  Vos Coordonnées
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Prénom"
                    required
                    className="px-3.5 py-2.5 rounded-[4px] border border-[#CFC1AD] bg-white text-sm focus:outline-none focus:border-[#9E2F55]"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    required
                    className="px-3.5 py-2.5 rounded-[4px] border border-[#CFC1AD] bg-white text-sm focus:outline-none focus:border-[#9E2F55]"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Adresse email pour le reçu"
                  required
                  className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#CFC1AD] bg-white text-sm focus:outline-none focus:border-[#9E2F55]"
                />
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={finalAmount <= 0}
                className="w-full bg-[#9E2F55] hover:bg-[#7A2143] text-white py-3.5 rounded-[4px] font-semibold text-base transition-colors shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5" />
                <span>Procéder au versement solidaire</span>
              </button>

              <p className="text-center text-xs text-[#756B60]">
                Règlement sécurisé par Mobile Money (T-Money, Flooz) ou Carte bancaire.
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-[4px] p-8 sm:p-12 border border-[#E2D7C7] shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-[#EBF3F1] rounded-full flex items-center justify-center mx-auto text-[#1F5A56]">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2A2521]">
              Akpé kaka ! Merci pour votre soutien
            </h2>
            <p className="text-base text-[#514A43] max-w-lg mx-auto">
              Votre don de <strong>{finalAmount.toLocaleString('fr-FR')} FCFA</strong> permet de poursuivre le dépistage et l'accompagnement des femmes togolaises.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-block bg-[#1F5A56] hover:bg-[#123E3B] text-white px-6 py-2.5 rounded-[4px] text-sm font-semibold transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Autres Moyens de Soutien */}
      <section className="max-w-[1180px] mx-auto px-4 sm:px-7 pt-10">
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2A2521] text-center mb-8">
          Autres Moyens d'Agir avec l'ONG VISA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[4px] border border-[#E2D7C7] text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#F9EBF0] text-[#9E2F55] flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2A2521] mb-2">
              Devenir Bénévole
            </h3>
            <p className="text-xs sm:text-sm text-[#514A43] mb-4">
              Participez aux journées de dépistage mobile et aux ateliers de sensibilisation.
            </p>
            <Link href="/contact" className="text-[#9E2F55] font-semibold text-xs hover:underline">
              Rejoindre l'équipe →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-[4px] border border-[#E2D7C7] text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EBF3F1] text-[#1F5A56] flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2A2521] mb-2">
              Partenariats & Mécénat
            </h3>
            <p className="text-xs sm:text-sm text-[#514A43] mb-4">
              Entreprises, institutions, impliquez votre structure dans nos campagnes de santé publique.
            </p>
            <Link href="/contact" className="text-[#1F5A56] font-semibold text-xs hover:underline">
              Nous contacter →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-[4px] border border-[#E2D7C7] text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#F9EBF0] text-[#9E2F55] flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2A2521] mb-2">
              Diffuser l'Information
            </h3>
            <p className="text-xs sm:text-sm text-[#514A43] mb-4">
              Partagez les repères d'autopalpation et les fiches médicales autour de vous.
            </p>
            <Link href="/blog" className="text-[#9E2F55] font-semibold text-xs hover:underline">
              Voir nos événements →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
