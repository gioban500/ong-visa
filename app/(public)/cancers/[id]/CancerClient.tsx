'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Cancer } from '@/types/cancer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CancerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [cancer, setCancer] = useState<Cancer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCancer() {
      try {
        const cleanId = decodeURIComponent(id);
        const res = await fetch(`/api/cancers/${cleanId}`);

        if (res.ok) {
          const data = await res.json();
          setCancer(data);
        } else {
          const listRes = await fetch('/api/cancers');
          if (listRes.ok) {
            const allCancers: Cancer[] = await listRes.json();
            const found = allCancers.find((c) => {
              const slugifiedName = c.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

              return (
                String(c.id) === cleanId ||
                slugifiedName === cleanId.toLowerCase()
              );
            });

            setCancer(found || null);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du cancer:', error);
        setCancer(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCancer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] text-[#2A2521] flex items-center justify-center">
        <p className="text-base font-medium animate-pulse text-[#756B60]">
          Chargement de la fiche médicale...
        </p>
      </div>
    );
  }

  if (!cancer) {
    notFound();
  }

  const shortDescription =
    cancer.shortDescription ||
    (cancer as unknown as { shortdescription?: string }).shortdescription ||
    cancer.description;

  const fullDescription = cancer.description || shortDescription;

  let symptomsList: string[] = [];
  const rawSymptoms = cancer.symptoms as unknown;

  if (rawSymptoms) {
    if (typeof rawSymptoms === 'object' && !Array.isArray(rawSymptoms)) {
      const typed = rawSymptoms as {
        early?: string[];
        advanced?: string[];
        warningSign?: string[];
      };
      symptomsList = [
        ...(typed.early || []),
        ...(typed.advanced || []),
        ...(typed.warningSign || []),
      ];
    } else if (Array.isArray(rawSymptoms)) {
      symptomsList = rawSymptoms as string[];
    } else if (typeof rawSymptoms === 'string') {
      symptomsList = rawSymptoms.split('\n').filter((item) => item.trim() !== '');
    }
  }

  const primaryPrevention = cancer.screening?.primaryPrevention;
  const preventionText =
    Array.isArray(primaryPrevention) && primaryPrevention.length > 0
      ? primaryPrevention.join('\n')
      : (cancer as unknown as { prevention?: string }).prevention ||
        'Un dépistage précoce permet d’augmenter considérablement les chances de guérison. N’hésitez pas à consulter un professionnel de santé.';

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen pb-20">
      {/* Barre de retour supérieure */}
      <div className="w-full bg-[#123E3B] py-3.5 px-4 sm:px-7 border-b border-white/10">
        <div className="max-w-[1180px] mx-auto">
          <Link
            href="/cancers"
            className="text-[#D3E2DF] hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste des cancers
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-[#123E3B] text-white py-12 md:py-16 px-4 sm:px-7 border-b border-white/10">
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3.5">
            <span className="bg-[#9E2F55] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Focus Médical · Prévention & Dépistage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
              {cancer.name}
            </h1>
            <p className="text-base sm:text-lg text-[#D3E2DF] leading-relaxed max-w-2xl">
              {shortDescription}
            </p>
          </div>
          {cancer.image && (
            <div className="lg:col-span-5">
              <div className="w-full h-64 sm:h-72 rounded-[4px] overflow-hidden shadow-md border border-white/20 bg-[#F5EFE6]">
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

      {/* Contenu Détaillé */}
      <section className="max-w-[1180px] mx-auto px-4 sm:px-7 py-12 text-[#2A2521]">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Présentation Générale */}
          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[#E2D7C7] border-t-4 border-t-[#1F5A56] shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-[#123E3B] mb-3">
              Présentation & Épidémiologie
            </h2>
            <p className="text-[#514A43] leading-relaxed text-[15px] whitespace-pre-line">
              {fullDescription}
            </p>
          </div>

          {/* Symptômes à Surveiller */}
          {symptomsList.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[#E2D7C7] border-t-4 border-t-[#9E2F55] shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-[#9E2F55] mb-4 flex items-center gap-2">
                Signes d'appel & Symptômes à observer
              </h2>
              <ul className="space-y-3">
                {symptomsList.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[#514A43] text-sm sm:text-[15px] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#9E2F55] shrink-0 mt-1" />
                    <span>{symptom.replace(/^[•-]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prévention et Dépistage */}
          <div className="bg-[#EBF3F1] p-6 sm:p-8 rounded-[4px] border border-[#1F5A56]/20 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#123E3B]">
              Prévention & Recommandations au Togo
            </h2>
            <p className="text-[#514A43] leading-relaxed text-[15px] whitespace-pre-line">
              {preventionText}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/#centres"
                className="inline-block bg-[#1F5A56] hover:bg-[#123E3B] text-white font-semibold px-6 py-3 rounded-[4px] transition text-sm shadow-sm"
              >
                Trouver un centre de dépistage partenaire
              </Link>
              <Link
                href="/#ecoute"
                className="inline-block bg-white hover:bg-[#FAF6F0] text-[#123E3B] border border-[#E2D7C7] font-semibold px-6 py-3 rounded-[4px] transition text-sm"
              >
                Poser une question à notre équipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}