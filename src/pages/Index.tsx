import { useState, useEffect } from 'react';
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
import { SplashScreen } from '@/components/SplashScreen';

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
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
