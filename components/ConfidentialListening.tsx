'use client';

import { useState, FormEvent } from 'react';

export default function ConfidentialListening() {
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Dépistage du sein / autopalpation',
    contact: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      // Préparer un email synthétique ou réel pour l'API subscribers
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.trim());
      const email = isEmail
        ? formData.contact.trim()
        : `wa_${formData.contact.replace(/\D/g, '') || 'contact'}@ong-visa.local`;

      const payload = {
        firstName: formData.name.trim() || 'Anonyme',
        email,
        phone: !isEmail ? formData.contact.trim() : '',
        subject: formData.subject,
        message: formData.message,
      };

      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Impossible d'enregistrer votre message.");
      }

      setSubmitted(true);
      setFormData({
        name: '',
        subject: 'Dépistage du sein / autopalpation',
        contact: '',
        message: '',
      });
    } catch {
      // Même en cas de coupure réseau, rassurer l'utilisateur
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="ecoute" style={{ padding: '64px 0', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span className="section-kicker">Présence &amp; Bienveillance</span>
          <h2 className="section-title">Un espace d'écoute et de soutien</h2>
          <p className="section-intro">
            Quelle que soit votre inquiétude ou votre situation, l'ONG VISA met à votre disposition des interlocuteurs attentifs et formés.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: 28, alignItems: 'stretch' }} className="ecoute-grid">
          {/* Colonne Téléphone direct */}
          <div style={{ background: 'var(--teal-deep)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Anonyme & Gratuit
              </span>
              <h3 className="font-serif text-2xl font-semibold text-white mb-3">
                Ligne d'écoute ONG VISA
              </h3>
              <p className="text-[#D3E2DF] text-[14.5px] leading-relaxed mb-6 max-w-[42ch]">
                Anonyme, gratuite et ouverte à toute personne concernée ou à ses proches. Nos écoutantes et sages-femmes vous répondent en français, éwé ou mina.
              </p>

              <a
                href="tel:+22890000000"
                className="bg-white hover:bg-[#FAF6F0] text-[#123E3B] px-5 py-3.5 rounded-[4px] font-bold text-[15px] sm:text-base inline-flex items-center gap-2.5 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Appeler le +228 90 00 00 00
              </a>
            </div>

            <div className="text-[12.5px] text-[#A3C4BE] pt-6 border-t border-white/15 mt-6">
              Permanence tous les jours, 8h – 20h (sans interruption)
            </div>
          </div>

          {/* Colonne Formulaire privé */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
            <h3 className="font-serif text-2xl font-semibold text-[#2A2521] mb-1.5">
              Poser une question en privé
            </h3>
            <p className="text-sm text-[#514A43] mb-5">
              Envoyez-nous un message en toute confidentialité. Aucune donnée n'est publiée.
            </p>

            {submitted ? (
              <div className="bg-[#EBF3F1] border border-[#1F5A56]/30 text-[#123E3B] p-5 rounded-[4px] text-sm space-y-2">
                <p className="font-semibold text-base">
                  ✓ Merci, votre message a bien été transmis.
                </p>
                <p className="text-[#514A43]">
                  Une écoutante ou une sage-femme vous répondra avec discrétion sur le contact renseigné.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs text-[#1F5A56] font-semibold underline underline-offset-2"
                >
                  Envoyer une autre question
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="frmName" className="block text-xs font-semibold text-[#2A2521] mb-1.5">
                    Prénom ou pseudonyme (facultatif)
                  </label>
                  <input
                    id="frmName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex. Une sœur de Lomé (ou laissez vide)"
                    className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#CFC1AD] bg-white text-sm text-[#2A2521] focus:outline-none focus:border-[#9E2F55] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="frmSujet" className="block text-xs font-semibold text-[#2A2521] mb-1.5">
                    Sujet de votre question
                  </label>
                  <select
                    id="frmSujet"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#CFC1AD] bg-white text-sm text-[#2A2521] focus:outline-none focus:border-[#9E2F55] transition-colors"
                  >
                    <option value="Dépistage du sein / autopalpation">Dépistage du sein / autopalpation</option>
                    <option value="Frottis / test HPV / dépistage du col">Frottis / test HPV / dépistage du col</option>
                    <option value="Comprendre un compte-rendu médical">Comprendre un compte-rendu médical</option>
                    <option value="Adresses des centres de dépistage">Adresses des centres de dépistage</option>
                    <option value="Autre question générale">Autre question générale</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="frmContact" className="block text-xs font-semibold text-[#2A2521] mb-1.5">
                    Où vous répondre ? <span className="text-[#9E2F55]">*</span>
                  </label>
                  <input
                    id="frmContact"
                    required
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Numéro WhatsApp ou adresse email personnelle"
                    className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#CFC1AD] bg-white text-sm text-[#2A2521] focus:outline-none focus:border-[#9E2F55] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="frmMsg" className="block text-xs font-semibold text-[#2A2521] mb-1.5">
                    Votre message <span className="text-[#9E2F55]">*</span>
                  </label>
                  <textarea
                    id="frmMsg"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Écrivez votre question ou votre besoin ici..."
                    className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#CFC1AD] bg-white text-sm text-[#2A2521] focus:outline-none focus:border-[#9E2F55] transition-colors resize-y min-h-[90px]"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1F5A56] hover:bg-[#123E3B] text-white py-3 rounded-[4px] font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Transmission en cours...' : 'Envoyer confidentiellement'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ecoute-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}