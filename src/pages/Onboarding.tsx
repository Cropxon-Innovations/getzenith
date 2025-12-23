import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { OnboardingPreview } from '@/components/onboarding/OnboardingPreview';
import { BusinessTypeStep } from '@/components/onboarding/steps/BusinessTypeStep';
import { BusinessGoalStep } from '@/components/onboarding/steps/BusinessGoalStep';
import { AutoConfigStep } from '@/components/onboarding/steps/AutoConfigStep';
import { BrandingStep } from '@/components/onboarding/steps/BrandingStep';
import { FirstActionStep } from '@/components/onboarding/steps/FirstActionStep';
import { ZenithLogo } from '@/components/ZenithLogo';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { supabase } from '@/integrations/supabase/client';

export type BusinessType = 'education' | 'agency' | 'product' | 'enterprise' | 'exploring';

export interface OnboardingState {
  businessType: BusinessType | null;
  businessGoals: string[];
  brandName: string;
  primaryColor: string;
  logoUrl: string | null;
}

const STEPS = ['business-type', 'business-goal', 'auto-config', 'branding', 'first-action'] as const;
type Step = typeof STEPS[number];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<Step>('business-type');
  const [state, setState] = useState<OnboardingState>({
    businessType: null,
    businessGoals: [],
    brandName: '',
    primaryColor: '#3B82F6',
    logoUrl: null,
  });
  
  const { user, profile, tenant, updateTenant, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (profile?.onboarding_completed) {
      navigate('/admin');
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    if (tenant) {
      setState(prev => ({
        ...prev,
        brandName: tenant.name,
        primaryColor: tenant.primary_color,
        logoUrl: tenant.logo_url,
      }));
    }
  }, [tenant]);

  const stepIndex = STEPS.indexOf(currentStep);

  const handleNext = async () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      if (user) {
        await supabase.from('profiles').update({
          onboarding_completed: true
        }).eq('id', user.id);
        
        await updateTenant({
          business_type: state.businessType,
          business_goals: state.businessGoals,
          name: state.brandName,
          primary_color: state.primaryColor,
          logo_url: state.logoUrl,
        });
        
        await refreshProfile();
        navigate('/admin');
      }
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const updateState = (updates: Partial<OnboardingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'business-type':
        return (
          <BusinessTypeStep
            selected={state.businessType}
            onSelect={(type) => updateState({ businessType: type })}
            onNext={handleNext}
          />
        );
      case 'business-goal':
        return (
          <BusinessGoalStep
            businessType={state.businessType}
            selected={state.businessGoals}
            onSelect={(goals) => updateState({ businessGoals: goals })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'auto-config':
        return (
          <AutoConfigStep
            businessType={state.businessType}
            goals={state.businessGoals}
            onComplete={handleNext}
          />
        );
      case 'branding':
        return (
          <BrandingStep
            brandName={state.brandName}
            primaryColor={state.primaryColor}
            logoUrl={state.logoUrl}
            onUpdate={updateState}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'first-action':
        return (
          <FirstActionStep
            businessType={state.businessType}
            onComplete={handleNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-accent/5 blur-3xl"
          animate={{ 
            x: [0, -100, 0], 
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <ZenithLogo size={36} />
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Zenith Studio
          </span>
        </div>
        <ThemeSwitcher />
      </motion.header>

      <div className="flex-1 flex relative z-10">
        {/* Main Content with Logo Accent */}
        <div className="flex-1 flex flex-col relative">
          {/* Large decorative logo in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
            <ZenithLogo size={400} animated={false} />
          </div>
          
          {/* Progress Bar */}
          <OnboardingProgress currentStep={stepIndex} totalSteps={STEPS.length} />
          
          {/* Step Content */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-xl relative z-10"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Preview Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block w-[480px] border-l border-border bg-card/50 backdrop-blur-sm"
        >
          <OnboardingPreview state={state} currentStep={currentStep} />
        </motion.div>
      </div>
    </div>
  );
}
