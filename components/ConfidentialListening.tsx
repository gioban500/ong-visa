'use client';

import { useState, FormEvent } from 'react';

export default function ConfidentialListening() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Informations générales');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="ecoute" className="py-16 border-b border-[#E1D6C6]">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="max-w-2xl mb-9">
          <h2 className="font-serif text-3xl text-[#2A2521] mb-2">Un espace d'écoute et de soutien</h2>
          <p className="text-[#6B6155]">
            Quelle que soit la pathologie ou votre inquiétude, l'ONG VISA met à votre disposition des interlocuteurs attentifs et formés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
          <div className="bg-[#123E3B] text-[#DCE7E4] rounded p-7 flex flex-col justify-between items-start gap-4">
            <div>
              <h3 className="font-serif text-xl text-white mb-2">Ligne d'écoute ONG VISA</h3>
              <p className="text-[#B9CBC7] text-sm max-w-[38ch] mb-2">
                Anonyme, gratuite et ouverte à toute personne concernée ou à ses proches.
              </p>
            </div>
            <div>
              <a
                href="tel:+22890000000"
                className="inline-block bg-[#7A2143] hover:bg-[#5E1833] text-white px-5 py-2.5 rounded font-semibold text-sm transition mb-2"
              >
                Appeler le +228 90 00 00 00
              </a>
              <div className="text-xs text-[#93ABA5]">Tous les jours, 8h – 20h</div>
            </div>
          </div>

          <div className="bg-[#F2EBDE] border border-[#E1D6C6] rounded p-7">
            <h3 className="font-serif text-xl text-[#2A2521] mb-2">Poser une question en privé</h3>
            <p className="text-[#6B6155] text-sm max-w-[40ch] mb-4">
              Envoyez-nous un message en toute confidentialité. Aucune donnée n'est publiée.
            </p>

            {submitted ? (
              <div className="bg-[#E4EEEC] text-[#123E3B] rounded p-4 text-sm font-semibold">
                Votre message a bien été transmis. Un membre de notre équipe d'écoute vous répondra sous peu.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ecouteNom" className="block text-xs font-semibold text-[#2A2521] mb-1">
                      Prénom (facultatif)
                    </label>
                    <input
                      type="text"
                      id="ecouteNom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anonyme"
                      className="w-full px-3 py-2 border border-[#E1D6C6] rounded bg-white text-sm text-[#2A2521] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="ecouteSujet" className="block text-xs font-semibold text-[#2A2521] mb-1">
                      Sujet
                    </label>
                    <select
                      id="ecouteSujet"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E1D6C6] rounded bg-white text-sm text-[#2A2521] focus:outline-none"
                    >
                      <option value="Informations générales">Informations générales</option>
                      <option value="Dépistage Sein">Dépistage Sein</option>
                      <option value="Dépistage Col de l'utérus">Dépistage Col</option>
                      <option value="Dépistage Colorectal">Dépistage Colorectal</option>
                      <option value="Accompagnement d'un proche">Accompagnement d'un proche</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ecouteMessage" className="block text-xs font-semibold text-[#2A2521] mb-1">
                    Votre message
                  </label>
                  <textarea
                    id="ecouteMessage"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre question ou votre besoin ici..."
                    rows={3}
                    className="w-full px-3 py-2 border border-[#E1D6C6] rounded bg-white text-sm text-[#2A2521] focus:outline-none resize-y min-h-[80px]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#1F5A56] hover:bg-[#123E3B] text-white px-5 py-2.5 rounded text-sm font-semibold transition"
                >
                  Envoyer confidentiellement
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}