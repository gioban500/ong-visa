'use client';

export default function QuickExitBar() {
  const handleQuickExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="bg-[#123E3B] text-[#EFE6D8] text-sm py-2.5">
      <div className="max-w-[1120px] mx-auto px-7 flex flex-wrap justify-between items-center gap-4">
        <div>
          Besoin d'en parler maintenant ? Ligne d'écoute ONG VISA :{' '}
          <a
            href="tel:+22890000000"
            className="underline text-[#EFE6D8] underline-offset-4 hover:text-white"
          >
            +228 90 00 00 00
          </a>{' '}
          — anonyme, tous les jours
        </div>
        <button
          onClick={handleQuickExit}
          title="Quitte le site immédiatement et ouvre une page neutre"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded px-3.5 py-1 text-xs font-medium transition"
        >
          Sortie rapide
        </button>
      </div>
    </div>
  );
}