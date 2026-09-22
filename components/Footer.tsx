'use client';

import Link from 'next/link';

export default function Footer() {
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <footer className="bg-[#0E2927] text-[#B5CCC8] pt-14 pb-8 border-t border-white/10">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Colonne 1 : ONG VISA */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold mb-3.5 tracking-tight">
              ONG VISA · Cancers Féminins
            </h4>
            <p className="text-[13px] text-[#B5CCC8] leading-relaxed mb-4">
              Organisation humanitaire dédiée à la sensibilisation, au dépistage précoce et à l'accompagnement solidaire face aux cancers gynécologiques au Togo et en Afrique de l'Ouest.
            </p>
            <div className="flex gap-2.5">
              <a
                href="https://www.facebook.com/Ong-Visa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B5CCC8] hover:text-white hover:bg-[#1F5A56] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/ongvisa2026"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B5CCC8] hover:text-white hover:bg-[#1F5A56] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@ongvisa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B5CCC8] hover:text-white hover:bg-[#1F5A56] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Plan du site */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold mb-3.5 tracking-tight">
              Plan du site
            </h4>
            <ul className="space-y-2 text-[13.5px]">
              <li>
                <Link href="/#hero" className="hover:text-white transition-colors">
                  Accueil & Vue d'ensemble
                </Link>
              </li>
              <li>
                <Link href="/#cancers-surveilles" className="hover:text-white transition-colors">
                  Cancers surveillés
                </Link>
              </li>
              <li>
                <Link href="/#autopalpation" className="hover:text-white transition-colors">
                  Guide d'autopalpation
                </Link>
              </li>
              <li>
                <Link href="/#apres-resultat" className="hover:text-white transition-colors">
                  Après un résultat anormal
                </Link>
              </li>
              <li>
                <Link href="/#temoignages" className="hover:text-white transition-colors">
                  Témoignages sororaux
                </Link>
              </li>
              <li>
                <Link href="/#compagnon" className="hover:text-white transition-colors">
                  Mon carnet de suivi
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Permanence & Contact */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold mb-3.5 tracking-tight">
              Permanence & Contact
            </h4>
            <ul className="space-y-2 text-[13.5px]">
              <li>
                Ligne d'écoute : <strong className="text-white font-semibold">+228 90 00 00 00</strong>
              </li>
              <li>
                WhatsApp : <span className="text-white">+228 90 62 96 93</span>
              </li>
              <li>
                Courriel :{' '}
                <a href="mailto:contact@ongvisa.org" className="hover:text-white transition-colors underline">
                  contact@ongvisa.org
                </a>
              </li>
              <li>Siège : Lomé, République Togolaise</li>
              <li className="text-white/75 text-xs pt-1">Permanence : 7j/7 de 8h à 20h</li>
            </ul>
          </div>

          {/* Colonne 4 : Ressources & Droits */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold mb-3.5 tracking-tight">
              Ressources & Droits
            </h4>
            <ul className="space-y-2 text-[13.5px]">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cancers" className="hover:text-white transition-colors">
                  Fiches pathologiques complètes
                </Link>
              </li>
              <li>
                <Link href="/donation" className="text-[#ff7ba1] font-semibold hover:text-white transition-colors">
                  Faire un don solidaire →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8CAFA9]">
          <p>
            © {new Date().getFullYear()} ONG VISA. Tous droits réservés. Les informations fournies sur ce site ne remplacent pas un avis médical professionnel.
          </p>
          <button
            onClick={handleQuickExit}
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white text-white hover:text-[#0E2927] border border-white/20 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          >
            Sortie rapide & discrète
          </button>
        </div>
      </div>
    </footer>
  );
}
