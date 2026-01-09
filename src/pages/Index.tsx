import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SEO } from '@/components/SEO';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ProblemSection } from '@/components/ProblemSection';
import { SystemsSection } from '@/components/SystemsSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { SolutionsSection } from '@/components/SolutionsSection';
import { TrustSection } from '@/components/TrustSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { SplashScreen } from '@/components/SplashScreen';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { SocialShareButtons } from '@/components/SocialShareButtons';

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeenSplash = sessionStorage.getItem('zenith-splash-seen');
    return !hasSeenSplash;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('zenith-splash-seen', 'true');
    setShowSplash(false);
  };

  return (
    <>
      <SEO />
      {showSplash && <SplashScreen onComplete={handleSplashComplete} duration={2500} />}
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Floating Social Share Buttons */}
        <SocialShareButtons variant="floating" />
        <main>
          <HeroSection />
          
          {/* Live Platform Preview - directly after Hero for immediate engagement */}
          <ScrollAnimationWrapper delay={0}>
            <HowItWorksSection />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper delay={0.1}>
            <FeaturesSection />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper delay={0}>
            <ProblemSection />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper delay={0.1}>
            <SystemsSection />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper delay={0}>
            <SolutionsSection />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper delay={0.1}>
            <TrustSection />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper delay={0}>
            <CTASection />
          </ScrollAnimationWrapper>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
