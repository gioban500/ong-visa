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
    <div className="w-full bg-[#f9fafb] min-h-screen pb-16">
      {/* Header Banner - Fond blanc épuré aligné avec le Hero */}
      <section className="bg-white border-b border-slate-100 pt-10 pb-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-[#e11d48] text-xs font-bold uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100 inline-block">
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contactez <span className="text-[#e11d48]">VISA ONG</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Dédiés à la sensibilisation, la prévention et au dépistage précoce des cancers féminins au Togo.
          </p>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Informations de Contact */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Nos Coordonnées
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                N'hésitez pas à nous contacter ou à nous rendre visite à Lomé.
              </p>
            </div>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-rose-100 text-[#e11d48]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                    Adresse
                  </h3>
                  <p className="text-slate-600 mt-0.5">
                    Lomé, Togo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-teal-100 text-[#0f766e]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                    Téléphone
                  </h3>
                  <p className="text-slate-600 font-medium mt-0.5">+228 90 62 96 93</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-teal-100 text-[#0f766e]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                    Email
                  </h3>
                  <p className="text-slate-600 font-medium mt-0.5">contact@ongvisa.org</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                    Horaires d'ouverture
                  </h3>
                  <p className="text-slate-600 mt-0.5 text-xs">
                    Lundi - Vendredi : 8h00 - 17h00<br />
                    Samedi - Dimanche : Fermé
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de Contact */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Envoyer un message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Remplissez les informations ci-dessous et notre équipe vous recontactera rapidement.
              </p>
            </div>

            {submitted && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="font-medium">
                  Votre message a été envoyé avec succès !
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-700 block">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] bg-white"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] bg-white"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-slate-700 block">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] bg-white"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="info">Demande d'information</option>
                  <option value="depistage">Planifier un dépistage</option>
                  <option value="partenariat">Partenariat / Bénévole</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-slate-700 block">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] bg-white resize-none"
                  placeholder="Écrivez votre message..."
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold py-2.5 px-6 rounded-lg transition shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                Envoyer le message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}