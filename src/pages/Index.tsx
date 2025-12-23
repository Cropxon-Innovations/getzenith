import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SEO } from '@/components/SEO';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ProblemSection } from '@/components/ProblemSection';
import { SystemsSection } from '@/components/SystemsSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { SolutionsSection } from '@/components/SolutionsSection';
import { TrustSection } from '@/components/TrustSection';
import { LivePlatformPreview } from '@/components/platform-preview/LivePlatformPreview';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <>
      <SEO />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ProblemSection />
          <SystemsSection />
          <HowItWorksSection />
          <SolutionsSection />
          <TrustSection />
          <LivePlatformPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
