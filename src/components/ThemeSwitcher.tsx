import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme, themes, ThemeName } from '@/contexts/ThemeContext';

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
        aria-label="Switch theme"
      >
        <Palette size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-64 p-2 bg-card border border-border rounded-lg shadow-lg"
            >
              <div className="text-xs text-muted-foreground px-3 py-2 uppercase tracking-wider">
                Theme
              </div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as ThemeName);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    theme === t.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className={`text-xs ${theme === t.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {t.description}
                    </div>
                  </div>
                  {theme === t.id && <Check size={16} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
