'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-[#0f766e] text-white flex items-center justify-center">
        <p className="text-base font-medium">Chargement des informations...</p>
      </div>
    );
  }

  if (!cancer) {
    notFound();
  }

  const rawSymptoms = cancer.symptoms as unknown;
  const prevention = (cancer as unknown as { prevention?: string }).prevention;
  const symptomsList: string[] = Array.isArray(rawSymptoms)
    ? (rawSymptoms as string[])
    : typeof rawSymptoms === 'string'
    ? rawSymptoms.split('\n').filter((item) => item.trim() !== '')
    : [];

  return (
    <div className="w-full bg-[#fdfbf7] min-h-screen">
      {/* Barre de retour supérieure */}
      <div className="w-full bg-slate-900 py-4 px-6 sm:px-8 lg:px-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/cancers"
            className="text-slate-300 hover:text-white font-bold text-sm flex items-center gap-2 transition inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste des cancers
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-[#0f766e] text-white py-14 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              FOCUS - DÉPISTAGE & PRÉVENTION
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-4 mb-6 leading-tight">
              {cancer.name}
            </h1>
            <p className="text-lg text-emerald-50 leading-relaxed font-medium">
              {cancer.shortDescription || cancer.description}
            </p>
          </div>
          {cancer.image && (
            <div className="lg:col-span-5">
              <div className="w-full h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
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
      <section className="w-full bg-[#fdfbf7] py-16 px-6 sm:px-8 lg:px-12 text-slate-900">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* PRESENTATION GENERALE */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm">
            <h2 className="text-2xl font-black text-[#0f766e] uppercase mb-4">
              Présentation Générale
            </h2>
            <p className="text-slate-700 leading-relaxed font-medium text-base whitespace-pre-line">
              {cancer.description || 'Aucune description détaillée disponible.'}
            </p>
          </div>

          {/* SYMPTÔMES A SURVEILLER */}
          {symptomsList.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm">
              <h2 className="text-2xl font-black text-pink-600 uppercase mb-6 flex items-center gap-2">
                Signes & Symptômes à Surveiller
              </h2>
              <ul className="space-y-4">
                {symptomsList.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 font-semibold text-base">
                    <span className="text-pink-600 text-lg">✦</span>
                    {symptom.replace(/^[•-]\s*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PRÉVENTION ET DÉPISTAGE */}
          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 shadow-sm">
            <h2 className="text-2xl font-black text-[#0f766e] uppercase mb-4 flex items-center gap-2">
              Prévention & Dépistage
            </h2>
            <p className="text-slate-800 leading-relaxed font-medium text-base mb-6 whitespace-pre-line">
              {prevention || 'Un dépistage précoce permet d’augmenter considérablement les chances de guérison. N’hésitez pas à consulter un professionnel de santé.'}
            </p>
            <Link
              href="/events"
              className="inline-block bg-[#0f766e] hover:bg-[#115e59] text-white font-bold px-8 py-4 rounded-xl transition text-base shadow-lg shadow-pink-500/35 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Prendre rendez-vous pour un dépistage gratuit
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}