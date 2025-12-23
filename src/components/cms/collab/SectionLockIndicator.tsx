import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SectionLockIndicatorProps {
  isLocked: boolean;
  lockedByName?: string | null;
  className?: string;
}

export const SectionLockIndicator = ({ 
  isLocked, 
  lockedByName, 
  className = '' 
}: SectionLockIndicatorProps) => {
  if (!isLocked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-destructive/5 border-2 border-destructive/30 rounded-lg" />
        
        {/* Lock badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute -top-3 right-2 flex items-center gap-1.5 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full shadow-lg pointer-events-auto cursor-default"
            >
              <Lock size={12} />
              <span>Locked</span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            <div className="flex items-center gap-2">
              <User size={12} />
              <span>{lockedByName || 'Another user'} is editing this section</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  );
};

interface SectionWrapperProps {
  children: React.ReactNode;
  sectionId: string;
  isLocked: boolean;
  lockedByName?: string | null;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SectionWrapper = ({
  children,
  sectionId,
  isLocked,
  lockedByName,
  onFocus,
  onBlur,
}: SectionWrapperProps) => {
  return (
    <div 
      className="relative group"
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
      <SectionLockIndicator 
        isLocked={isLocked} 
        lockedByName={lockedByName} 
      />
      
      {/* Disabled overlay for locked sections */}
      {isLocked && (
        <div 
          className="absolute inset-0 z-20 cursor-not-allowed"
          onClick={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
};
