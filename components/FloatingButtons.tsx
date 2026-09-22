'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function FloatingButtons() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showTopBtn) return null;

  return (
    <div className="fixed bottom-16 right-5 z-40">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-10 h-10 rounded-full bg-white text-[#123E3B] border border-[#E2D7C7] shadow-md hover:bg-[#FAF6F0] flex items-center justify-center transition-all hover:scale-105"
        title="Retour en haut de page"
        aria-label="Retour en haut"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
