import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useTheme, themes, ThemeName } from '@/contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors text-sm"
          aria-label="Open theme selector"
        >
          {/* Mini preview dot */}
          <div 
            className="w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: currentTheme.preview.accent }}
          />
          <span className="text-muted-foreground hidden sm:inline">
            {currentTheme.name}
          </span>
          <Palette size={16} className="text-muted-foreground" />
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Theme Selector</DialogTitle>
        </DialogHeader>
        <ThemeSelector />
      </DialogContent>
    </Dialog>
  );
};