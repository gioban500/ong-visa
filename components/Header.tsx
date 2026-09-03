'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/cancers', label: 'Cancers' },
    { href: '/blog', label: 'Événements' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 pt-3 md:pt-4">
      <div
        className={`container mx-auto rounded-full transition-all duration-300 border ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-slate-200/60 py-2 px-5'
            : 'bg-white/90 backdrop-blur-md shadow-md border-white/60 py-2.5 px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo ONG VISA */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 bg-white ring-2 ring-emerald-100 group-hover:ring-pink-300 transition-all flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo ONG VISA"
                width={48}
                height={48}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-slate-900 leading-tight text-sm md:text-base tracking-tight uppercase">
                ONG VISA
              </p>
              <p className="text-[10px] md:text-xs text-pink-600 font-bold uppercase tracking-wider">
                Cancer Féminin
              </p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-pink-600 font-extrabold relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-pink-600 after:rounded-full'
                      : 'text-slate-700 hover:text-pink-600 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Bouton Faire un Don */}
            <Link
              href="/donation"
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-pink-600/30 hover:scale-105 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Faire un Don</span>
            </Link>
          </nav>

          {/* Bouton Menu Mobile */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-3 pb-3 px-2">
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2.5 rounded-2xl text-sm transition-colors ${
                      isActive
                        ? 'bg-pink-50 text-pink-600 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/donation"
                className="mt-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-4 h-4 fill-current" />
                Faire un Don
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}