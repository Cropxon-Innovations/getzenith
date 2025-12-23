import { motion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BusinessType } from '@/pages/Onboarding';

interface BusinessGoalStepProps {
  businessType: BusinessType | null;
  selected: string[];
  onSelect: (goals: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const goalsByType: Record<string, { id: string; label: string }[]> = {
  education: [
    { id: 'online-courses', label: 'Launch online courses' },
    { id: 'live-classes', label: 'Run live classes' },
    { id: 'certifications', label: 'Sell certifications' },
    { id: 'academy-website', label: 'Build an academy website' },
    { id: 'student-onboarding', label: 'Automate student onboarding' },
  ],
  agency: [
    { id: 'portfolio-website', label: 'Create a portfolio website' },
    { id: 'client-proposals', label: 'Send client proposals' },
    { id: 'case-studies', label: 'Showcase case studies' },
    { id: 'lead-capture', label: 'Capture leads automatically' },
    { id: 'client-portal', label: 'Build a client portal' },
  ],
  product: [
    { id: 'membership-site', label: 'Launch a membership site' },
    { id: 'digital-products', label: 'Sell digital products' },
    { id: 'community', label: 'Build a community' },
    { id: 'newsletter', label: 'Grow a newsletter' },
    { id: 'landing-pages', label: 'Create landing pages' },
  ],
  enterprise: [
    { id: 'knowledge-base', label: 'Build a knowledge base' },
    { id: 'team-training', label: 'Create team training' },
    { id: 'internal-wiki', label: 'Set up internal wiki' },
    { id: 'onboarding-docs', label: 'Document onboarding' },
    { id: 'process-automation', label: 'Automate processes' },
  ],
  exploring: [
    { id: 'try-cms', label: 'Try the content system' },
    { id: 'try-website', label: 'Build a quick website' },
    { id: 'try-courses', label: 'Create a sample course' },
    { id: 'try-automation', label: 'Explore automation' },
  ],
};

export const BusinessGoalStep = ({
  businessType,
  selected,
  onSelect,
  onNext,
  onBack,
}: BusinessGoalStepProps) => {
  const goals = goalsByType[businessType || 'exploring'] || [];

  const toggleGoal = (goalId: string) => {
    if (selected.includes(goalId)) {
      onSelect(selected.filter((id) => id !== goalId));
    } else if (selected.length < 2) {
      onSelect([...selected, goalId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          What do you want to achieve first?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          Select up to 2 priorities — we'll focus on these
        </motion.p>
      </div>

      <div className="grid gap-3">
        {goals.map((goal, index) => {
          const isSelected = selected.includes(goal.id);
          const isDisabled = !isSelected && selected.length >= 2;

          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => toggleGoal(goal.id)}
              disabled={isDisabled}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-4 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : isDisabled
                  ? 'border-border bg-muted/30 opacity-50 cursor-not-allowed'
                  : 'border-border hover:border-primary/50 hover:bg-card'
              }`}
              whileHover={!isDisabled ? { scale: 1.01 } : undefined}
              whileTap={!isDisabled ? { scale: 0.99 } : undefined}
            >
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground/30'
                }`}
              >
                {isSelected && <Check size={14} className="text-primary-foreground" />}
              </div>
              <span className={`font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                {goal.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between"
      >
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={selected.length === 0} size="lg">
          Continue
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};
