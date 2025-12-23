import { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          aria-label="Open theme selector"
        >
          {/* Mini preview dot with gradient */}
          <div 
            className="w-4 h-4 rounded-full ring-1 ring-border"
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.preview.accent} 0%, ${currentTheme.preview.background} 100%)` 
            }}
          />
          <span className="text-muted-foreground hidden sm:inline text-xs">
            {currentTheme.name}
          </span>
          <Palette size={14} className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">Theme Selector</DialogTitle>
        </DialogHeader>
        <ThemeSelector />
      </DialogContent>
    </Dialog>
  );
};