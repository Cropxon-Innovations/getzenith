import { motion } from 'framer-motion';
import { Check, Sun, Moon, Waves, Sunset } from 'lucide-react';
import { useTheme, themes, ThemeDefinition } from '@/contexts/ThemeContext';

interface ThemeCardProps {
  theme: ThemeDefinition;
  isSelected: boolean;
  onSelect: () => void;
}

const themeIcons: Record<string, React.ElementType> = {
  'theme-light': Sun,
  'theme-dark': Moon,
  'theme-enterprise': Waves,
  'theme-high-contrast': Sunset,
};

const ThemeCard = ({ theme, isSelected, onSelect }: ThemeCardProps) => {
  const { preview } = theme;
  const Icon = themeIcons[theme.id] || Moon;
  
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'ring-1 ring-border hover:ring-primary/50'
      }`}
    >
      {/* Color Swatch - Gradient based on theme */}
      <div 
        className="h-10 w-full flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${preview.accent} 0%, ${preview.background} 100%)` 
        }}
      >
        <Icon size={18} style={{ color: preview.text }} className="opacity-80" />
      </div>
      
      {/* Theme Name */}
      <div 
        className="p-2.5 text-center border-t"
        style={{ 
          backgroundColor: preview.card,
          borderColor: preview.border,
        }}
      >
        <span 
          className="text-sm font-medium"
          style={{ color: preview.text }}
        >
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
    </motion.button>
  );
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="w-full max-w-xs mx-auto">
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
