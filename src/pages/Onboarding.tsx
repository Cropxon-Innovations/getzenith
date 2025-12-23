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
      // Complete onboarding
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
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={stepIndex} totalSteps={STEPS.length} />
        
        {/* Step Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="hidden lg:block w-[480px] border-l border-border bg-card">
        <OnboardingPreview state={state} currentStep={currentStep} />
      </div>
    </div>
  );
}
