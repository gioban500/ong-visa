'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CancerData {
  id?: string;
  slug?: string;
  name: string;
  shortDescription?: string;
  description: string;
  symptoms?: string[] | { warningSign?: string[]; early?: string[]; advanced?: string[] };
  image?: string;
  color?: string;
}

// Exemple de données ou appel depuis ta base de données
const CANCERS_DATA: Record<string, CancerData> = {
  'cancer-du-col-de-l-uterus': {
    name: "CANCER DU COL DE L'UTÉRUS",
    shortDescription: "Infection persistante par le papillomavirus humain (HPV), le cancer du col de l'utérus est l'un des rares cancers que l'on peut éviter presque entièrement grâce à la vaccination et au dépistage régulier.",
    description: "Le cancer du col de l'utérus se développe sur la muqueuse du col de l'utérus, le plus souvent à la suite d'une infection durable par un virus transmis par voie sexuelle, le Papillomavirus Humain (HPV).\n\nDétecté tôt grâce au frottis de dépistage ou au test HPV, il se soigne très bien. La vaccination des jeunes filles et le suivi régulier chez le gynécologue ou la sage-femme constituent la meilleure protection.",
    symptoms: [
      "Saignements vaginaux anormaux (notamment après les rapports sexuels ou entre les règles)",
      "Pertes vaginales inhabituelles ou malodorantes",
      "Douleurs lors des rapports sexuels ou douleurs pelviennes persistantes",
      "Douleurs au bas du dos ou inconfort abdominal"
    ],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80",
    color: "#0e7490"
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CancerDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  // Remplace cette ligne par ton fetch DB si tu as une API (ex: await getCancerBySlug(slug))
  const cancer = CANCERS_DATA[slug];

  if (!cancer) {
    notFound();
  }

  // Extraction propre des symptômes
  const getSymptomsList = (): string[] => {
    if (!cancer.symptoms) return [];
    if (Array.isArray(cancer.symptoms)) return cancer.symptoms;
    
    const s = cancer.symptoms as any;
    return [
      ...(s.warningSign || []),
      ...(s.early || []),
      ...(s.advanced || [])
    ];
  };

  const symptomsList = getSymptomsList();

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Sombre / Retour */}
      <div className="bg-[#0f172a] text-white py-4 px-6 sm:px-12">
        <Link 
          href="/cancers"
          className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          ← Retour à la liste des cancers
        </Link>
      </div>

      {/* 2. Hero Section (Couleur Teal) */}
      <section 
        className="text-white py-12 px-6 sm:px-12"
        style={{ backgroundColor: cancer.color || '#0e7490' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-7 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#ec4899] text-white text-xs font-bold rounded-full tracking-wide uppercase">
              FOCUS CANCER
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
              {cancer.name}
            </h1>
            {cancer.shortDescription && (
              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">
                {cancer.shortDescription}
              </p>
            )}
          </div>

          {cancer.image && (
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md h-64 sm:h-72 rounded-3xl overflow-hidden border-4 border-white/20 shadow-xl">
                <img 
                  src={cancer.image} 
                  alt={cancer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. Contenu Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 space-y-6 relative z-10">
        
        {/* Description Longue / Présentation Générale */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e7490] tracking-wide uppercase">
            PRÉSENTATION GÉNÉRALE
          </h2>
          <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
            {cancer.description}
          </p>
        </div>

        {/* Symptômes */}
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

        {/* Prévention & Prise de RDV */}
        <div className="bg-[#e6f4f1] p-8 rounded-3xl border border-teal-100 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e7490] tracking-wide uppercase">
            PRÉVENTION & DÉPISTAGE
          </h2>
          <p className="text-slate-700 leading-relaxed text-base">
            Un dépistage précoce permet de diagnostiquer la maladie à un stade initial et augmente considérablement les chances de guérison.
          </p>

          <div>
            <Link
              href="/evenements"
              className="inline-block bg-[#0e7490] hover:bg-[#0c627a] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
            >
              Prendre rendez-vous pour un dépistage gratuit
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}