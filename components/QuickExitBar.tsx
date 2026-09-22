'use client';

export default function QuickExitBar() {
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <div className="bg-[var(--teal-deep)] text-[var(--on-primary)] text-[13px] border-b border-[var(--line)] relative z-[60]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-7 py-2 flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-[13px]">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white px-2 py-0.5 rounded-full text-[11.5px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ligne d'écoute anonyme 7j/7
          </span>
          <span className="text-[#E2EDE9]">
            Besoin d'en parler en direct ? Ligne d'écoute ONG VISA :{' '}
            <a
              href="tel:+22890000000"
              className="text-white font-semibold underline underline-offset-2 hover:text-[#96cfca] transition-colors"
            >
              +228 90 00 00 00
            </a>{' '}
            <span className="text-white/75 hidden md:inline">(anonyme, tous les jours 8h-20h)</span>
          </span>
        </div>

        <button
          onClick={handleQuickExit}
          title="Quitte immédiatement le site et ouvre Google"
          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white text-white hover:text-[#123E3B] border border-white/25 rounded-full px-3 py-1 text-xs font-semibold transition-all shrink-0"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Sortie rapide
        </button>
      </div>
    </div>
  );
}