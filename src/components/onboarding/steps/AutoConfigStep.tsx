import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, FileText, Palette, Globe, GraduationCap, Zap } from 'lucide-react';
import type { BusinessType } from '@/pages/Onboarding';

interface AutoConfigStepProps {
  businessType: BusinessType | null;
  goals: string[];
  onComplete: () => void;
}

interface ConfigItem {
  id: string;
  label: string;
  icon: React.ElementType;
  status: 'pending' | 'loading' | 'complete' | 'limited';
}

const getConfigItems = (businessType: BusinessType | null): ConfigItem[] => {
  const baseItems: ConfigItem[] = [
    { id: 'cms', label: 'CMS Studio', icon: FileText, status: 'pending' },
    { id: 'canvas', label: 'Canvas Studio', icon: Palette, status: 'pending' },
    { id: 'website', label: 'Website Builder', icon: Globe, status: 'pending' },
  ];

  if (businessType === 'education') {
    baseItems.push({ id: 'lms', label: 'LMS Studio', icon: GraduationCap, status: 'pending' });
  }

  baseItems.push({ id: 'automation', label: 'Automation', icon: Zap, status: 'pending' });

  return baseItems;
};

export const AutoConfigStep = ({ businessType, goals, onComplete }: AutoConfigStepProps) => {
  const [items, setItems] = useState<ConfigItem[]>(() => getConfigItems(businessType));
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState<'studios' | 'assets' | 'complete'>('studios');

  useEffect(() => {
    // Start the configuration sequence
    const startDelay = setTimeout(() => {
      setCurrentIndex(0);
    }, 500);

    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (currentIndex < 0) return;

    if (currentIndex < items.length) {
      // Set current item to loading
      setItems(prev => prev.map((item, i) => 
        i === currentIndex ? { ...item, status: 'loading' } : item
      ));

      // Complete after delay
      const completeDelay = setTimeout(() => {
        setItems(prev => prev.map((item, i) => 
          i === currentIndex 
            ? { ...item, status: item.id === 'automation' ? 'limited' : 'complete' } 
            : item
        ));
        setCurrentIndex(prev => prev + 1);
      }, 800 + Math.random() * 400);

      return () => clearTimeout(completeDelay);
    } else if (phase === 'studios') {
      // Move to assets phase
      const phaseDelay = setTimeout(() => {
        setPhase('assets');
      }, 500);

      return () => clearTimeout(phaseDelay);
    } else if (phase === 'assets') {
      // Complete
      const completeDelay = setTimeout(() => {
        setPhase('complete');
        setTimeout(onComplete, 1500);
      }, 1500);

      return () => clearTimeout(completeDelay);
    }
  }, [currentIndex, items.length, phase, onComplete]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {phase === 'complete' 
            ? "We've set up everything you need"
            : 'Setting up your platform...'
          }
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          {phase === 'complete'
            ? 'Your personalized workspace is ready'
            : 'This will only take a moment'
          }
        </motion.p>
      </div>

      {/* Studios Configuration */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              item.status === 'complete' || item.status === 'limited'
                ? 'border-primary/30 bg-primary/5'
                : item.status === 'loading'
                ? 'border-border bg-card'
                : 'border-border bg-background'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              item.status === 'complete' ? 'bg-primary' : 
              item.status === 'limited' ? 'bg-yellow-500' : 'bg-muted'
            }`}>
              {item.status === 'loading' ? (
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              ) : item.status === 'complete' ? (
                <Check size={20} className="text-primary-foreground" />
              ) : item.status === 'limited' ? (
                <item.icon size={20} className="text-yellow-900" />
              ) : (
                <item.icon size={20} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <span className={`font-medium ${
                item.status === 'complete' || item.status === 'limited' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
              {item.status === 'limited' && (
                <span className="text-xs text-yellow-600 ml-2">Limited on trial</span>
              )}
            </div>
            {item.status === 'complete' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs text-primary font-medium"
              >
                Enabled
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Assets Animation */}
      {phase === 'assets' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Creating sample content...</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Homepage', 'About Page', 'Sample Course'].slice(0, businessType === 'education' ? 3 : 2).map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.3 }}
                className="p-3 rounded-lg bg-muted/50 text-center"
              >
                <div className="text-xs text-muted-foreground">{item}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Complete State */}
      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Check size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground">Redirecting to branding setup...</p>
        </motion.div>
      )}
    </div>
  );
};
