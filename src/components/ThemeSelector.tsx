import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme, themes, ThemeName, ThemeDefinition } from '@/contexts/ThemeContext';

interface ThemePreviewCardProps {
  theme: ThemeDefinition;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const ThemePreviewCard = ({ theme, isSelected, onSelect, index }: ThemePreviewCardProps) => {
  const { preview } = theme;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onSelect}
      className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-300 group ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
          : 'ring-1 ring-border hover:ring-primary/50'
      }`}
      style={{
        transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Preview Area */}
      <div 
        className="relative h-40 p-3 overflow-hidden"
        style={{ backgroundColor: preview.background }}
      >
        {/* Abstract UI Mock */}
        <div className="flex h-full gap-2">
          {/* Sidebar hint */}
          <div 
            className="w-12 rounded-lg flex flex-col gap-2 p-2"
            style={{ backgroundColor: preview.sidebar }}
          >
            <div 
              className="w-full h-2 rounded-full"
              style={{ backgroundColor: preview.muted, opacity: 0.4 }}
            />
            <div 
              className="w-full h-2 rounded-full"
              style={{ backgroundColor: preview.accent }}
            />
            <div 
              className="w-3/4 h-2 rounded-full"
              style={{ backgroundColor: preview.muted, opacity: 0.3 }}
            />
            <div 
              className="w-full h-2 rounded-full"
              style={{ backgroundColor: preview.muted, opacity: 0.3 }}
            />
          </div>
          
          {/* Main content hint */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Header bar */}
            <div 
              className="h-6 rounded-md flex items-center px-2 gap-2"
              style={{ backgroundColor: preview.card, borderColor: preview.border, borderWidth: 1 }}
            >
              <div 
                className="w-16 h-2 rounded-full"
                style={{ backgroundColor: preview.muted, opacity: 0.5 }}
              />
              <div className="flex-1" />
              <div 
                className="w-8 h-3 rounded"
                style={{ backgroundColor: preview.accent }}
              />
            </div>
            
            {/* Content cards */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div 
                className="rounded-md p-2 flex flex-col gap-1"
                style={{ backgroundColor: preview.card, borderColor: preview.border, borderWidth: 1 }}
              >
                <div 
                  className="w-full h-2 rounded-full"
                  style={{ backgroundColor: preview.text, opacity: 0.15 }}
                />
                <div 
                  className="w-3/4 h-2 rounded-full"
                  style={{ backgroundColor: preview.muted, opacity: 0.3 }}
                />
                <div className="flex-1" />
                <div 
                  className="w-12 h-4 rounded"
                  style={{ backgroundColor: preview.accent, opacity: 0.8 }}
                />
              </div>
              <div 
                className="rounded-md p-2 flex flex-col gap-1"
                style={{ backgroundColor: preview.card, borderColor: preview.border, borderWidth: 1 }}
              >
                <div 
                  className="w-full h-2 rounded-full"
                  style={{ backgroundColor: preview.text, opacity: 0.15 }}
                />
                <div 
                  className="w-2/3 h-2 rounded-full"
                  style={{ backgroundColor: preview.muted, opacity: 0.3 }}
                />
                <div className="flex-1" />
                <div 
                  className="w-10 h-4 rounded"
                  style={{ backgroundColor: preview.muted, opacity: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Selection overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isSelected ? 1 : 0 }}
          className="absolute inset-0 bg-primary/5 pointer-events-none"
        />
      </div>
      
      {/* Info Area */}
      <div 
        className="p-4 border-t transition-colors"
        style={{ 
          backgroundColor: isSelected ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))'
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm mb-1">
              {theme.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {theme.description}
            </p>
          </div>
          
          {/* Selection indicator */}
          <motion.div
            initial={false}
            animate={{ 
              scale: isSelected ? 1 : 0.8,
              opacity: isSelected ? 1 : 0 
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
          >
            <Check size={14} className="text-primary-foreground" />
          </motion.div>
        </div>
      </div>
      
      {/* Subtle glow on selection */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            boxShadow: `inset 0 0 0 1px hsl(var(--primary) / 0.3), 0 0 30px -10px hsl(var(--primary) / 0.3)`
          }}
        />
      )}
    </motion.button>
  );
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Visual Identity
        </h2>
        <p className="text-muted-foreground">
          Choose how your business presents itself. This affects all studios and experiences.
        </p>
      </div>
      
      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((t, index) => (
          <ThemePreviewCard
            key={t.id}
            theme={t}
            isSelected={theme === t.id}
            onSelect={() => setTheme(t.id)}
            index={index}
          />
        ))}
      </div>
      
      {/* Live indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <span>Changes apply instantly across all studios</span>
      </motion.div>
    </div>
  );
};