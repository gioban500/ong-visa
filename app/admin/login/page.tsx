'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  HeartHandshake,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Connexion impossible.');
        return;
      }
      router.replace('/admin');
    } catch {
      setError('Le serveur est indisponible. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <section className="admin-login-story" aria-label="La mission de l’ONG VISA">
        <div className="admin-login-orbit admin-login-orbit-one" />
        <div className="admin-login-orbit admin-login-orbit-two" />
        <div className="admin-login-story-content">
          <Link href="/" className="admin-login-brand">
            <span className="admin-login-logo">
              <Image src="/logo.png" alt="Logo de l’ONG VISA" width={68} height={68} priority />
            </span>
            <span>
              <strong>ONG VISA</strong>
              <small>Nous Visons l’Excellence</small>
            </span>
          </Link>

          <div className="admin-login-message">
            <span className="admin-login-kicker"><Sparkles size={15} /> ESPACE DE GESTION</span>
            <h1>Ensemble, faisons avancer la prévention.</h1>
            <p>
              Retrouvez ici les outils pour informer, accompagner et prendre soin
              des femmes, au Togo et partout où notre mission nous mène.
            </p>
            <div className="admin-login-values">
              <span><HeartHandshake size={18} /> Écoute & accompagnement</span>
              <span><ShieldCheck size={18} /> Information de confiance</span>
            </div>
          </div>

          <div className="admin-login-quote">
            <Heart size={16} fill="currentColor" />
            <span>Prévenir, sensibiliser, agir ensemble.</span>
          </div>
        </div>
        <span className="admin-login-story-glow" aria-hidden="true" />
      </section>

      <section className="admin-login-panel">
        <div className="admin-login-panel-inner">
          <Link href="/" className="admin-login-mobile-brand">
            <Image src="/logo.png" alt="" width={42} height={42} />
            <span>ONG VISA</span>
          </Link>

          <div className="admin-login-heading">
            <span className="admin-login-heading-icon"><LockKeyhole size={21} /></span>
            <span className="admin-login-kicker">RAVIE DE VOUS RETROUVER</span>
            <h2>Bon retour parmi nous</h2>
            <p>Connectez-vous à votre espace pour continuer votre mission.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-field">
              <label htmlFor="admin-email">Adresse e-mail</label>
              <div className="admin-login-input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="vous@ong-visa.org"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password">Mot de passe</label>
              <div className="admin-login-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p role="alert" className="admin-login-error">{error}</p>}

            <button type="submit" disabled={loading} className="admin-login-submit">
              <span>{loading ? 'Connexion en cours…' : 'Accéder à mon espace'}</span>
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="admin-login-secure">
            <ShieldCheck size={17} />
            <span>Connexion sécurisée · Espace réservé à l’équipe ONG VISA</span>
          </div>

          <Link href="/" className="admin-login-back">
            <ArrowLeft size={16} />
            Retourner sur le site
          </Link>
        </div>
      </section>
    </main>
  );
}
