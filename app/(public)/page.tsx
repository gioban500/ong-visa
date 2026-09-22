import EmotionalHero from '@/components/EmotionalHero';
import AnatomyExplorer from '@/components/AnatomyExplorer';
import AutopalpationGuide from '@/components/AutopalpationGuide';
import AbnormalResultSteps from '@/components/AbnormalResultSteps';
import QuestionTestimonials from '@/components/QuestionTestimonials';
import ConfidentialListening from '@/components/ConfidentialListening';
import HealthCompanion from '@/components/HealthCompanion';
import LocalCenters from '@/components/LocalCenters';
import StickyActionBar from '@/components/StickyActionBar';
import FloatingButtons from '@/components/FloatingButtons';

export const metadata = {
  title: 'ONG VISA — Cancers Féminins : Prévention, Dépistage & Soutien au Togo',
  description: "Plateforme d'information, de prévention et d'écoute sur le cancer du sein, le col de l'utérus et les autres pathologies oncologiques féminines par l'ONG VISA à Lomé.",
};

export default function HomePage() {
  return (
    <div className="bg-[#FAF6F0] text-[#2A2521] pb-14">
      <EmotionalHero />
      <AnatomyExplorer />
      <AutopalpationGuide />
      <AbnormalResultSteps />
      <QuestionTestimonials />
      <ConfidentialListening />
      <HealthCompanion />
      <LocalCenters />
      <StickyActionBar />
      <FloatingButtons />
    </div>
  );
}