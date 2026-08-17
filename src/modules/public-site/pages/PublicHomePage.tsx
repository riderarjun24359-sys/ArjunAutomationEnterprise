import { PublicLayout } from '../components/layout/PublicLayout';
import { FounderHero } from '../components/hero/FounderHero';
import { PlatformReveal } from '../components/sections/PlatformReveal';
import { BusinessSystems } from '../components/sections/BusinessSystems';
import { AiWorkers } from '../components/sections/AiWorkers';
import { Operations } from '../components/sections/Operations';
import { Industries } from '../components/industries/Industries';
import { Security } from '../components/security/Security';
import { Founder } from '../components/founders/Founder';
import { FinalCta } from '../components/sections/FinalCta';

export const PublicHomePage: React.FC = () => {
  return (
    <PublicLayout>
      <FounderHero />
      <PlatformReveal />
      <BusinessSystems />
      <AiWorkers />
      <Operations />
      <Industries />
      <Security />
      <Founder />
      <FinalCta />
    </PublicLayout>
  );
};
