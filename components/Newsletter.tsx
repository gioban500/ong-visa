'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function Newsletter() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || "Une erreur s'est produite. Réessayez.");
      }
    } catch {
      setStatus('error');
      setMessage("Impossible de vous inscrire pour le moment. Réessayez.");
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="gradient-rose-violet rounded-[2rem] overflow-hidden shadow-xl relative">
            {/* Décor */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
              {/* Texte */}
              <div className="text-white">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Restez informé(e)
                </h2>
                <p className="text-white/90 leading-relaxed">
                  Inscrivez-vous à notre liste de diffusion pour recevoir nos
                  actualités, nos campagnes de sensibilisation et nos conseils de
                  prévention sur les cancers féminins.
                </p>
              </div>

              {/* Formulaire */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
                {status === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Merci pour votre inscription !
                    </h3>
                    <p className="text-gray-600">
                      Vous recevrez bientôt de nos nouvelles.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 text-pink-600 font-semibold hover:underline"
                    >
                      Inscrire une autre personne
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-colors"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-colors"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-colors"
                        placeholder="votre@email.com"
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-red-600 font-medium">{message}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full gradient-rose-violet text-white px-6 py-3.5 rounded-full font-bold hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Inscription...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" /> S'inscrire
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Nous respectons votre vie privée. Désinscription possible à
                      tout moment.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
