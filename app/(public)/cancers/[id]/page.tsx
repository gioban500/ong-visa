'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Shield, AlertTriangle, Activity, HeartHandshake } from 'lucide-react';
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
        // Décoder le paramètre au cas où l'URL contienne des caractères encodés
        const cleanId = decodeURIComponent(id);
        const res = await fetch(`/api/cancers/${cleanId}`);

        if (res.ok) {
          const data = await res.json();
          setCancer(data);
        } else {
          // Deuxième tentative : récupérer la liste complète et chercher par slug/nom
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

            if (found) {
              setCancer(found);
            } else {
              setCancer(null);
            }
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
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-sm font-medium">Chargement des informations...</p>
      </div>
    );
  }

  if (!cancer) {
    notFound();
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Header Sombre */}
      <section className="bg-[#0f172a] text-white pt-8 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/cancers"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste des cancers
          </Link>

          <div className="space-y-3">
            <span className="text-[#f472b6] font-bold text-xs uppercase tracking-widest block">
              FICHE D'INFORMATION MÉDICALE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              {cancer.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {cancer.image && (
            <div className="md:col-span-5 h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={cancer.image}
                alt={cancer.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className={cancer.image ? 'md:col-span-7 space-y-6' : 'md:col-span-12 space-y-6'}>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Vue d'ensemble</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {cancer.description || cancer.shortDescription || 'Aucune description disponible.'}
              </p>
            </div>

            {cancer.epidemiology && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold uppercase text-[#0e7490]">Épidémiologie</span>
                <p className="text-sm text-slate-700">{cancer.epidemiology}</p>
              </div>
            )}

            <div className="pt-2">
              <Link
                href={`/contact?subject=${encodeURIComponent(`Information - ${cancer.name}`)}`}
                className="inline-flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white font-bold px-8 py-4 rounded-2xl text-sm transition-colors shadow-md"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Demander un accompagnement</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Facteurs de risque et Symptômes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-extrabold uppercase tracking-wide">
                Facteurs de risque
              </h3>
            </div>
            {cancer.riskFactors ? (
              <div className="space-y-3 text-sm text-slate-700">
                {cancer.riskFactors.modifiable?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Modifiables :</span>
                    <ul className="list-disc pl-5 space-y-1">
                      {cancer.riskFactors.modifiable.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {cancer.riskFactors.nonModifiable?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Non modifiables :</span>
                    <ul className="list-disc pl-5 space-y-1">
                      {cancer.riskFactors.nonModifiable.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Consultez un professionnel de santé pour plus de détails.</p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-[#0e7490]">
              <Activity className="w-6 h-6" />
              <h3 className="text-lg font-extrabold uppercase tracking-wide">
                Dépistage & Prévention
              </h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Un dépistage précoce permet d'augmenter considérablement les chances de guérison complète. Prenez rendez-vous régulièrement avec votre gynécologue ou sage-femme.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}