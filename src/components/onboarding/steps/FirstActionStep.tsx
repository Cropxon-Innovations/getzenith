import { motion } from 'framer-motion';
import { ArrowRight, FileText, GraduationCap, Globe, Sparkles, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BusinessType } from '@/pages/Onboarding';

interface FirstActionStepProps {
  businessType: BusinessType | null;
  onComplete: () => void;
}

const actionsByType: Record<string, {
  primary: { icon: React.ElementType; label: string; href: string };
  secondary: { label: string; href: string }[];
}> = {
  education: {
    primary: {
      icon: GraduationCap,
      label: 'Create your first course',
      href: '/studio/lms',
    },
    secondary: [
      { label: 'Start with a template', href: '/studio/lms?template=true' },
      { label: 'Import existing content', href: '/studio/cms' },
    ],
  },
  agency: {
    primary: {
      icon: Globe,
      label: 'Build your website',
      href: '/studio/website',
    },
    secondary: [
      { label: 'Create a case study', href: '/studio/cms' },
      { label: 'Design a proposal', href: '/studio/canvas' },
    ],
  },
  product: {
    primary: {
      icon: FileText,
      label: 'Create your first product',
      href: '/studio/cms',
    },
    secondary: [
      { label: 'Build a landing page', href: '/studio/website' },
      { label: 'Set up memberships', href: '/admin/settings' },
    ],
  },
  enterprise: {
    primary: {
      icon: FileText,
      label: 'Create your knowledge base',
      href: '/studio/cms',
    },
    secondary: [
      { label: 'Build team training', href: '/studio/lms' },
      { label: 'Set up workflows', href: '/studio/automation' },
    ],
  },
  exploring: {
    primary: {
      icon: Sparkles,
      label: 'Explore the platform',
      href: '/admin',
    },
    secondary: [
      { label: 'Try the CMS', href: '/studio/cms' },
      { label: 'Build a website', href: '/studio/website' },
    ],
  },
};

export const FirstActionStep = ({ businessType, onComplete }: FirstActionStepProps) => {
  const actions = actionsByType[businessType || 'exploring'];
  const PrimaryIcon = actions.primary.icon;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
        >
          <Sparkles size={32} className="text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          Your platform is ready!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          What would you like to do first?
        </motion.p>
      </div>

      <div className="space-y-4">
        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full h-16 text-lg justify-between group"
          >
            <div className="flex items-center gap-3">
              <PrimaryIcon size={24} />
              {actions.primary.label}
            </div>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Secondary Options */}
        <div className="grid gap-2">
          {actions.secondary.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Button
                variant="outline"
                onClick={onComplete}
                className="w-full justify-start"
              >
                {action.label}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Skip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4"
        >
          <button
            onClick={onComplete}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <SkipForward size={14} />
            Skip for now — go to dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};
