'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
      {/* Hero Section Banner */}
      <section className="bg-[#0b1329] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="bg-pink-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-md tracking-wider">
            CONTACT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Contactez-Nous
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Nous sommes là pour répondre à vos questions et vous accompagner. N'hésitez pas à nous laisser un message.
          </p>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Informations de Contact */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Nos Coordonnées
            </h2>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-pink-100">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-0.5">
                    Adresse
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    ONG VISA<br />
                    Lomé, Togo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-teal-100">
                  <Phone className="w-5 h-5 text-[#0f766e]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-0.5">
                    Téléphone
                  </h3>
                  <p className="text-slate-600 font-medium">+228 90 62 96 93</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Lundi - Vendredi, 8h - 17h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-teal-100">
                  <Mail className="w-5 h-5 text-[#0f766e]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-0.5">
                    Email
                  </h3>
                  <p className="text-slate-600 font-medium">contact@ongvisa.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-0.5">
                    Horaires
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-800">Lun - Ven :</strong> 8h00 - 17h00<br />
                    <strong className="text-slate-800">Sam - Dim :</strong> Fermé
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de Contact */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Envoyez-nous un Message
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Remplissez ce formulaire et notre équipe vous recontactera rapidement.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="font-medium">
                  Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block"
                  >
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-slate-50/50"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-slate-50/50"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block"
                >
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-slate-50/50"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="info">Demande d'information</option>
                  <option value="depistage">Question sur le dépistage</option>
                  <option value="temoignage">Partager un témoignage</option>
                  <option value="partenariat">Proposition de partenariat</option>
                  <option value="benevolat">Devenir bénévole</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-slate-50/50 resize-none"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="mt-1 w-4 h-4 text-[#0f766e] border-slate-300 rounded focus:ring-[#0f766e]"
                />
                <label htmlFor="consent" className="text-xs text-slate-500 leading-normal">
                  J'accepte que mes données soient utilisées pour me répondre conformément à la{' '}
                  <a href="/privacy" className="text-[#0f766e] font-semibold hover:underline">
                    politique de confidentialité
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white font-bold py-4 px-6 rounded-xl transition shadow-md shadow-teal-900/10 text-sm flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Send className="w-4 h-4" />
                Envoyer le Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}