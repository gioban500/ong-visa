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
      <div className="min-h-screen bg-[#0f766e] text-white flex items-center justify-center">
        <p className="text-base font-medium">Chargement des informations...</p>
      </div>
    );
  }

  if (!cancer) {
    notFound();
  }

  return (
    <div className="w-full bg-[#fdfbf7] min-h-screen pb-24">
      {/* Header Vert Institutionnel aux dimensions et styles parfaits */}
      <section className="bg-[#0f766e] text-white pt-10 pb-20 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/cancers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste des cancers
          </Link>

          <div className="space-y-3">
            <span className="text-pink-300 font-extrabold text-xs uppercase tracking-widest block">
              FOCUS 01 - DÉPISTAGE & PRÉVENTION
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-emerald-50">
              {cancer.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu Principal avec chevauchement élégant */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/85 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {cancer.image && (
            <div className="md:col-span-5 h-72 sm:h-80 rounded-2xl overflow-hidden bg-stone-100 shadow-md">
              <img
                src={cancer.image}
                alt={cancer.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className={cancer.image ? 'md:col-span-7 space-y-6' : 'md:col-span-12 space-y-6'}>
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight">Vue d'ensemble</h2>
              <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
                {cancer.description || cancer.shortDescription || 'Aucune description disponible.'}
              </p>
            </div>

            {cancer.epidemiology && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 shadow-sm">
                <span className="text-xs font-black uppercase tracking-wider text-[#0f766e]">Épidémiologie</span>
                <p className="text-sm sm:text-base text-stone-700 font-medium">{cancer.epidemiology}</p>
              </div>
            )}

            <div className="pt-2">
              <Link
                href={`/contact?subject=${encodeURIComponent(`Information - ${cancer.name}`)}`}
                className="inline-flex items-center gap-2 bg-[#db2777] hover:bg-[#be185d] text-white font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider transition-all shadow-md"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Demander un accompagnement</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Facteurs de risque et Symptômes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/85 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-black uppercase tracking-wide text-stone-900">
                Facteurs de risque
              </h3>
            </div>
            {cancer.riskFactors ? (
              <div className="space-y-4 text-sm sm:text-base text-stone-700">
                {cancer.riskFactors.modifiable?.length > 0 && (
                  <div>
                    <span className="font-extrabold text-stone-900 block mb-1.5">Modifiables :</span>
                    <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                      {cancer.riskFactors.modifiable.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {cancer.riskFactors.nonModifiable?.length > 0 && (
                  <div>
                    <span className="font-extrabold text-stone-900 block mb-1.5">Non modifiables :</span>
                    <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                      {cancer.riskFactors.nonModifiable.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-stone-500">Consultez un professionnel de santé pour plus de détails.</p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/85 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-[#0f766e]">
              <Activity className="w-6 h-6" />
              <h3 className="text-xl font-black uppercase tracking-wide text-stone-900">
                Dépistage & Prévention
              </h3>
            </div>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Un dépistage précoce permet d'augmenter considérablement les chances de guérison complète. Prenez rendez-vous régulièrement avec votre gynécologue ou sage-femme.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}