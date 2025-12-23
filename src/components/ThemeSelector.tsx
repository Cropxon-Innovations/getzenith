import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme, themes, ThemeDefinition } from '@/contexts/ThemeContext';

interface ThemeCardProps {
  theme: ThemeDefinition;
  isSelected: boolean;
  onSelect: () => void;
}

const ThemeCard = ({ theme, isSelected, onSelect }: ThemeCardProps) => {
  const { preview } = theme;
  
  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
          : 'ring-1 ring-border hover:ring-primary/50 hover:scale-[1.01]'
      }`}
    >
      {/* Color Swatch Pill */}
      <div 
        className="h-8 w-full"
        style={{ 
          background: `linear-gradient(135deg, ${preview.accent} 0%, ${preview.background} 100%)` 
        }}
      />
      
      {/* Theme Name */}
      <div className="p-3 bg-card border-t border-border text-center">
        <span className="text-sm font-medium text-foreground">
          {theme.name}
        </span>
      </div>
      
      {/* Selected Check Badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg"
        >
          <Check size={12} className="text-primary-foreground" />
        </motion.div>
      )}
    </button>
  );
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Theme
        </h2>
        <p className="text-xs text-muted-foreground">
          Choose your visual style
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => (
          <ThemeCard
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
