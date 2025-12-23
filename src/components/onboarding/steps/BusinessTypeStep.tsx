import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShoppingBag, Users, FlaskConical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BusinessType } from '@/pages/Onboarding';

interface BusinessTypeStepProps {
  selected: BusinessType | null;
  onSelect: (type: BusinessType) => void;
  onNext: () => void;
}

const businessTypes: {
  id: BusinessType;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Education / Coaching',
    description: 'Courses, certifications, live classes',
    color: '#F97316',
  },
  {
    id: 'agency',
    icon: Building2,
    title: 'Agency / Services',
    description: 'Client work, portfolios, proposals',
    color: '#8B5CF6',
  },
  {
    id: 'product',
    icon: ShoppingBag,
    title: 'Product / Community',
    description: 'Memberships, digital products',
    color: '#10B981',
  },
  {
    id: 'enterprise',
    icon: Users,
    title: 'Internal Team / Enterprise',
    description: 'Team tools, knowledge base',
    color: '#3B82F6',
  },
  {
    id: 'exploring',
    icon: FlaskConical,
    title: 'Just Exploring',
    description: 'See what Zenith can do',
    color: '#6B7280',
  },
];

export const BusinessTypeStep = ({ selected, onSelect, onNext }: BusinessTypeStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          What kind of business are you running?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          We'll customize your platform based on your needs
        </motion.p>
      </div>

      <div className="grid gap-3">
        {businessTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => onSelect(type.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-4 ${
              selected === type.id
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-border hover:border-primary/50 hover:bg-card'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${type.color}15` }}
            >
              <type.icon size={24} style={{ color: type.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{type.title}</h3>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
            {selected === type.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button onClick={onNext} disabled={!selected} size="lg">
          Continue
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};
