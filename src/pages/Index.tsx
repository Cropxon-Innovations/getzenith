import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SEO } from '@/components/SEO';
import { ProblemSection } from '@/components/ProblemSection';
import { SystemsSection } from '@/components/SystemsSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { SolutionsSection } from '@/components/SolutionsSection';
import { TrustSection } from '@/components/TrustSection';
import { LivePlatformPreview } from '@/components/platform-preview/LivePlatformPreview';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { SectionDivider } from '@/components/SectionDivider';

const Index = () => {
  return (
    <ThemeProvider>
      <SEO />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <HeroSection />
          <SectionDivider />
          <ProblemSection />
          <SectionDivider />
          <SystemsSection />
          <SectionDivider />
          <HowItWorksSection />
          <SectionDivider />
          <SolutionsSection />
          <SectionDivider />
          <TrustSection />
          <SectionDivider />
          <LivePlatformPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
