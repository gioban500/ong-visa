export default function LocalCenters() {
  return (
    <section id="acces" className="py-16 border-b border-[#E1D6C6]">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="max-w-2xl mb-9">
          <h2 className="font-serif text-3xl text-[#2A2521] mb-2">Où consulter et réaliser ses dépistages à Lomé</h2>
          <p className="text-[#6B6155]">
            Centres de santé partenaires et points d'accueil accompagnés par l'ONG VISA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#E1D6C6] rounded p-5 bg-[#F2EBDE]">
            <h3 className="font-serif text-base text-[#2A2521] font-semibold mb-1">
              Centre de Dépistage & D'Imagerie — Tokoin
            </h3>
            <div className="text-xs text-[#6B6155] mb-2">
              Mammographie, frottis cervical, échographies
            </div>
            <p className="text-xs text-[#2A2521]">Quartier Tokoin, Lomé</p>
            <div className="text-[11px] text-[#7A2143] italic mt-2">Partenaire ONG VISA</div>
          </div>

          <div className="border border-[#E1D6C6] rounded p-5 bg-[#F2EBDE]">
            <h3 className="font-serif text-base text-[#2A2521] font-semibold mb-1">
              Unité d'Orientation Onco-Digestive & Générales — Bè
            </h3>
            <div className="text-xs text-[#6B6155] mb-2">
              Bilans généraux, kits immunologiques, consultation
            </div>
            <p className="text-xs text-[#2A2521]">Quartier Bè, Lomé</p>
            <div className="text-[11px] text-[#7A2143] italic mt-2">Partenaire ONG VISA</div>
          </div>

          <div className="border border-[#E1D6C6] rounded p-5 bg-[#F2EBDE]">
            <h3 className="font-serif text-base text-[#2A2521] font-semibold mb-1">
              Ligne d'Écoute Directe
            </h3>
            <div className="text-xs text-[#6B6155] mb-2">
              Conseils, prise de rendez-vous et orientation
            </div>
            <p className="text-xs font-semibold text-[#1F5A56]">+228 90 00 00 00</p>
            <div className="text-[11px] text-[#7A2143] italic mt-2">Ligne directe ONG VISA</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3.5 mt-7">
          <a
            href="#compagnon"
            className="bg-[#1F5A56] hover:bg-[#123E3B] text-white px-5 py-2.5 rounded font-semibold text-sm transition"
          >
            Commencer mon suivi
          </a>
          <a
            href="#temoignages"
            className="border border-[#1F5A56] text-[#123E3B] hover:bg-[#F2EBDE] px-5 py-2.5 rounded font-semibold text-sm transition"
          >
            Lire les témoignages
          </a>
        </div>
      </div>
    </section>
  );
}