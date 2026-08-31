'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Heart } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/cancers', label: 'Cancers Féminins' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-4 pt-3 md:pt-4">
      <div
        className={`container mx-auto rounded-full transition-all duration-300 border ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-lg shadow-lg border-pink-100 py-1.5 px-4'
            : 'bg-white/70 backdrop-blur-md shadow-md border-white/40 py-2.5 px-5'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 bg-white ring-2 ring-pink-100 group-hover:ring-pink-300 transition-all">
              <Image
                src="/logo.png"
                alt="Logo VISA"
                width={56}
                height={56}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-gray-900 leading-tight">ONG VISA</p>
              <p className="text-xs text-pink-600">Cancers féminins</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors rounded-full hover:bg-pink-50 group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 gradient-rose-violet rounded-full group-hover:w-1/2 transition-all duration-300" />
              </Link>
            ))}
            <Link
              href="/donation"
              className="ml-2 inline-flex items-center gap-2 gradient-rose-violet text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4" />
              Faire un Don
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 rounded-full hover:bg-pink-50"
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-3 pb-3 px-2 animate-fade-up">
            <div className="flex flex-col gap-2 pt-3 border-t border-pink-100">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors px-4 py-2 rounded-full hover:bg-pink-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/donation"
                className="gradient-rose-violet text-white px-6 py-2.5 rounded-full font-semibold text-center flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Faire un Don
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
