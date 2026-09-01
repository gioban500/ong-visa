import React from 'react';
import { Cancer } from '@/types/cancer'; // Ajuste le chemin selon ton projet

interface CancerDetailProps {
  cancer: Cancer;
  onBack?: () => void;
  onBookAppointment?: () => void;
}

export default function CancerDetail({ cancer, onBack, onBookAppointment }: CancerDetailProps) {
  // Extraction propre des symptômes (supporte tableau direct ou objet symptoms.early / warningSign)
  const getSymptomsList = (): string[] => {
    if (!cancer.symptoms) return [];
    if (Array.isArray(cancer.symptoms)) return cancer.symptoms;
    
    const symptomsObj = cancer.symptoms as any;
    return [
      ...(symptomsObj.warningSign || []),
      ...(symptomsObj.early || []),
      ...(symptomsObj.advanced || [])
    ];
  };

  const symptomsList = getSymptomsList();

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      {/* 1. Top Bar / En-tête sombre */}
      <div className="bg-[#0f172a] text-white py-4 px-6 sm:px-12">
        <button 
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          ← Retour à la liste des cancers
        </button>
      </div>

      {/* 2. Hero Section (Fond Vert Teal) */}
      <section className="bg-[#0e7490] text-white py-12 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Gauche: Titre & Description courte */}
          <div className="md:col-span-7 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#ec4899] text-white text-xs font-bold rounded-full tracking-wide uppercase">
              FOCUS 02 - VACCINATION & FROTTIS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
              {cancer.name}
            </h1>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">
              {cancer.shortDescription || cancer.shortdescription}
            </p>
          </div>

          {/* Droite: Image illustrative avec bordure arrondie */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md h-64 sm:h-72 rounded-3xl overflow-hidden border-4 border-white/20 shadow-xl">
              <img 
                src={cancer.image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80"} 
                alt={cancer.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Contenu principal (Cartes Blanches) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 space-y-6 relative z-10">
        
        {/* Présentation Générale */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e7490] tracking-wide uppercase">
            PRÉSENTATION GÉNÉRALE
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            {cancer.description}
          </p>
        </div>

        {/* Signes & Symptômes à surveiller */}
        {symptomsList.length > 0 && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#ec4899] tracking-wide uppercase">
              SIGNES & SYMPTÔMES À SURVEILLER
            </h2>
            <ul className="space-y-4">
              {symptomsList.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 text-base">
                  <span className="text-[#ec4899] text-lg leading-none mt-0.5">✦</span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prévention & Dépistage */}
        <div className="bg-[#e6f4f1] p-8 rounded-3xl border border-teal-100 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e7490] tracking-wide uppercase">
            PRÉVENTION & DÉPISTAGE
          </h2>
          <p className="text-slate-700 leading-relaxed text-base">
            Vaccination contre le HPV pour les jeunes filles et réalisation d'un frottis de dépistage tous les 3 ans.
          </p>

          <div>
            <button 
              onClick={onBookAppointment}
              className="bg-[#0e7490] hover:bg-[#0c627a] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
            >
              Prendre rendez-vous pour un dépistage gratuit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}