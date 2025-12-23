import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Check, Sparkles, Building2, 
  Target, Palette, Rocket, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface OnboardingWizardState {
  businessType: string | null;
  businessGoals: string[];
  brandName: string;
  primaryColor: string;
  logoUrl: string | null;
}

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  { id: 'business-type', title: 'Business Type', description: 'Tell us about your business', icon: Building2 },
  { id: 'business-goal', title: 'Goals', description: 'What do you want to achieve?', icon: Target },
  { id: 'branding', title: 'Branding', description: 'Customize your workspace', icon: Palette },
  { id: 'setup', title: 'Setup', description: 'Configuring your studios', icon: Sparkles },
  { id: 'complete', title: 'Complete', description: 'You\'re all set!', icon: Rocket },
];

const STORAGE_KEY = 'zenith_onboarding_progress';

interface OnboardingWizardProps {
  initialState?: Partial<OnboardingWizardState>;
  onComplete: (state: OnboardingWizardState) => Promise<void>;
  children: (props: {
    state: OnboardingWizardState;
    updateState: (updates: Partial<OnboardingWizardState>) => void;
    currentStep: string;
    canContinue: boolean;
    setCanContinue: (value: boolean) => void;
  }) => React.ReactNode;
}

export const OnboardingWizard = ({ 
  initialState, 
  onComplete,
  children 
}: OnboardingWizardProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState] = useState<OnboardingWizardState>(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...getDefaultState(), ...JSON.parse(saved), ...initialState };
      } catch {
        return { ...getDefaultState(), ...initialState };
      }
    }
    return { ...getDefaultState(), ...initialState };
  });
  const [canContinue, setCanContinue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const currentStep = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = useCallback((updates: Partial<OnboardingWizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(async () => {
    if (currentStepIndex === STEPS.length - 2) {
      // On setup step - start auto-config
      setCurrentStepIndex(prev => prev + 1);
      setDirection(1);
    } else if (currentStepIndex === STEPS.length - 1) {
      // On complete step - finish
      setIsSubmitting(true);
      try {
        await onComplete(state);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setDirection(1);
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, onComplete, state]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isComplete = index < currentStepIndex;
            
            return (
              <div 
                key={step.id}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isComplete 
                      ? 'hsl(var(--primary))' 
                      : isActive 
                        ? 'hsl(var(--primary) / 0.2)' 
                        : 'hsl(var(--muted))',
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                >
                  {isComplete ? (
                    <Check size={18} className="text-primary-foreground" />
                  ) : (
                    <Icon 
                      size={18} 
                      className={cn(
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} 
                    />
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs mt-2 hidden sm:block",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-1" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          {/* Step Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
            >
              <currentStep.icon size={28} className="text-primary" />
            </motion.div>
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              {currentStep.title}
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              {currentStep.description}
            </motion.p>
          </div>

          {/* Step Content from children */}
          {children({
            state,
            updateState,
            currentStep: currentStep.id,
            canContinue,
            setCanContinue,
          })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between mt-8 pt-6 border-t border-border"
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStepIndex === 0 || isSubmitting}
          className="gap-2"
        >
          <ChevronLeft size={16} />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canContinue || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Finishing...
            </>
          ) : currentStepIndex === STEPS.length - 1 ? (
            <>
              Get Started
              <Rocket size={16} />
            </>
          ) : (
            <>
              Continue
              <ChevronRight size={16} />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

function getDefaultState(): OnboardingWizardState {
  return {
    businessType: null,
    businessGoals: [],
    brandName: '',
    primaryColor: '#3B82F6',
    logoUrl: null,
  };
}

export default OnboardingWizard;