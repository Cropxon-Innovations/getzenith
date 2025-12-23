import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { OnboardingState } from '@/pages/Onboarding';

interface BrandingStepProps {
  brandName: string;
  primaryColor: string;
  logoUrl: string | null;
  onUpdate: (updates: Partial<OnboardingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const colorPresets = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
];

export const BrandingStep = ({
  brandName,
  primaryColor,
  logoUrl,
  onUpdate,
  onNext,
  onBack,
}: BrandingStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          Make it yours
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          Customize your platform's look and feel
        </motion.p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Label htmlFor="brandName">Business Name</Label>
          <Input
            id="brandName"
            value={brandName}
            onChange={(e) => onUpdate({ brandName: e.target.value })}
            placeholder="Your Business"
            className="mt-1.5"
          />
        </motion.div>

        {/* Logo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label>Logo (Optional)</Label>
          <div className="mt-1.5">
            <button
              type="button"
              className="w-full h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-card transition-colors"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-16 object-contain" />
              ) : (
                <>
                  <Upload size={24} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Primary Color */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Label>Primary Color</Label>
          <div className="mt-3 flex flex-wrap gap-3">
            {colorPresets.map((color) => (
              <button
                key={color.value}
                onClick={() => onUpdate({ primaryColor: color.value })}
                className={`w-10 h-10 rounded-lg transition-all ${
                  primaryColor === color.value
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <div className="relative">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-dashed border-border"
              />
            </div>
          </div>
        </motion.div>

        {/* Live Preview Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-muted/50 border border-border"
        >
          <p className="text-sm text-muted-foreground text-center">
            👈 Watch the preview update as you make changes
          </p>
        </motion.div>
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
        <Button onClick={onNext} disabled={!brandName.trim()} size="lg">
          Continue
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};
