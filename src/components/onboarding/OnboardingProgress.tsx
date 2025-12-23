import { motion } from 'framer-motion';
import { ZenithLogo } from '../ZenithLogo';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="h-full max-w-4xl mx-auto px-6 flex items-center justify-between">
        <ZenithLogo size={32} />
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </span>
          
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  backgroundColor: index <= currentStep 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--muted))',
                  scale: index === currentStep ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
        className="h-0.5 bg-primary"
      />
    </div>
  );
};
