import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme, themes, ThemeDefinition } from '@/contexts/ThemeContext';

interface ThemePreviewCardProps {
  theme: ThemeDefinition;
  isSelected: boolean;
  onSelect: () => void;
}

const ThemePreviewCard = ({ theme, isSelected, onSelect }: ThemePreviewCardProps) => {
  const { preview } = theme;
  
  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'ring-1 ring-border hover:ring-primary/50'
      }`}
    >
      {/* Preview Area */}
      <div 
        className="relative h-28 p-2.5 overflow-hidden"
        style={{ backgroundColor: preview.background }}
      >
        {/* Abstract UI Mock */}
        <div className="flex h-full gap-1.5">
          {/* Sidebar hint */}
          <div 
            className="w-8 rounded flex flex-col gap-1.5 p-1.5"
            style={{ backgroundColor: preview.sidebar }}
          >
            <div 
              className="w-full h-1.5 rounded-full"
              style={{ backgroundColor: preview.accent }}
            />
            <div 
              className="w-full h-1.5 rounded-full"
              style={{ backgroundColor: preview.muted, opacity: 0.3 }}
            />
            <div 
              className="w-3/4 h-1.5 rounded-full"
              style={{ backgroundColor: preview.muted, opacity: 0.2 }}
            />
          </div>
          
          {/* Main content hint */}
          <div className="flex-1 flex flex-col gap-1.5">
            {/* Header bar */}
            <div 
              className="h-4 rounded flex items-center px-1.5"
              style={{ backgroundColor: preview.card, borderColor: preview.border, borderWidth: 1 }}
            >
              <div 
                className="w-8 h-1.5 rounded-full"
                style={{ backgroundColor: preview.muted, opacity: 0.4 }}
              />
            </div>
            
            {/* Content card */}
            <div 
              className="flex-1 rounded p-1.5"
              style={{ backgroundColor: preview.card, borderColor: preview.border, borderWidth: 1 }}
            >
              <div 
                className="w-full h-1.5 rounded-full mb-1"
                style={{ backgroundColor: preview.text, opacity: 0.2 }}
              />
              <div 
                className="w-3/4 h-1.5 rounded-full"
                style={{ backgroundColor: preview.muted, opacity: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Area */}
      <div className="p-3 bg-card border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground text-sm">
              {theme.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {theme.description}
            </p>
          </div>
          
          {/* Selection indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
            >
              <Check size={12} className="text-primary-foreground" />
            </motion.div>
          )}
        </div>
      </div>
    </button>
  );
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Appearance
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose your preferred visual style
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => (
          <ThemePreviewCard
            key={t.id}
            theme={t}
            isSelected={theme === t.id}
            onSelect={() => setTheme(t.id)}
          />
        ))}
      </div>
    </div>
  );
};
