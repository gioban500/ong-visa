'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const navLinks = [
    { href: isHome ? '#hero' : '/', label: 'Accueil' },
    { href: isHome ? '#cancers-surveilles' : '/cancers', label: 'Cancers surveillés' },
    { href: isHome ? '#autopalpation' : '/#autopalpation', label: 'Autosurveillance' },
    { href: isHome ? '#apres-resultat' : '/#apres-resultat', label: 'Après un résultat' },
    { href: isHome ? '#temoignages' : '/#temoignages', label: 'Témoignages' },
    { href: isHome ? '#ecoute' : '/contact', label: "Ligne d'écoute" },
    { href: isHome ? '#compagnon' : '/#compagnon', label: 'Mon suivi' },
    { href: isHome ? '#centres' : '/#centres', label: 'Où consulter' },
  ];

  return (
    <header
      style={{
        background: 'rgba(250, 246, 240, 0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--maxw)',
          margin: '0 auto',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          paddingBottom: 12,
          gap: 16,
        }}
      >
        {/* Logo & Marque */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid var(--line-strong)',
              background: '#fff',
              padding: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo.png"
              alt="Logo officiel ONG VISA - Cancers Féminins"
              width={44}
              height={44}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-fraunces), Fraunces, serif',
                fontSize: 19,
                fontWeight: 700,
                color: 'var(--teal-deep)',
                lineHeight: 1.15,
              }}
            >
              ONG VISA
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--clay)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Cancers Féminins
            </span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap' }} className="main-nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: 13.5,
                fontWeight: 500,
                color: 'var(--ink-secondary)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)',
              }}
              className="nav-link-desktop"
            >
              {link.label}
            </Link>
          ))}

          {/* CTA Don */}
          <Link
            href="/donation"
            style={{
              background: 'var(--clay)',
              color: '#fff',
              padding: '7px 16px',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              marginLeft: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13.5,
              textDecoration: 'none',
              transition: 'var(--transition)',
              flexShrink: 0,
            }}
            className="nav-cta-link"
          >
            <svg fill="currentColor" height={13} viewBox="0 0 24 24" width={13}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Faire un don
          </Link>
        </nav>

        {/* Bouton Menu Mobile */}
        <div style={{ display: 'none' }} className="nav-mobile-btn">
          <Link
            href="/donation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--clay)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg fill="currentColor" height={12} viewBox="0 0 24 24" width={12}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Don
          </Link>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Menu principal"
            style={{
              padding: '8px',
              color: 'var(--ink)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--line)',
              background: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
            }}
          >
            {isMobileOpen ? (
              <svg fill="none" height={20} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={20}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg fill="none" height={20} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={20}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Tiroir Mobile */}
      {isMobileOpen && (
        <div
          style={{
            borderTop: '1px solid var(--line)',
            background: 'var(--bg)',
            padding: '16px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--ink)',
                transition: 'var(--transition)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ paddingTop: 8, borderTop: '1px solid var(--line)', marginTop: 4 }}>
            <Link
              href="/donation"
              onClick={() => setIsMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                background: 'var(--clay)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <svg fill="currentColor" height={14} viewBox="0 0 24 24" width={14}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Faire un don solidaire
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .main-nav-desktop { display: flex !important; }
        .nav-mobile-btn { display: none !important; }
        @media (max-width: 1023px) {
          .main-nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; gap: 8px; align-items: center; }
        }
        .nav-link-desktop:hover {
          color: var(--teal-deep) !important;
          background: var(--bg-raised) !important;
        }
        .nav-cta-link:hover {
          background: var(--clay-deep) !important;
        }
      `}</style>
    </header>
  );
}