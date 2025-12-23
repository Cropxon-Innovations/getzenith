import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZenithLogo } from './ZenithLogo';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration = 2500 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'logo' | 'text' | 'exit'>('logo');

  useEffect(() => {
    // Phase 1: Logo draws in (0-800ms)
    const textTimer = setTimeout(() => setPhase('text'), 800);
    
    // Phase 2: Text appears (800-2000ms)
    const exitTimer = setTimeout(() => setPhase('exit'), duration - 500);
    
    // Phase 3: Exit animation (2000-2500ms)
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Animated background gradients */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Central glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            
            {/* Accent orbs */}
            <motion.div
              className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px]"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-[250px] h-[250px] bg-primary/10 rounded-full blur-[80px]"
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]" 
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Logo with draw animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: phase === 'exit' ? 1.2 : 1, 
                opacity: phase === 'exit' ? 0 : 1 
              }}
              transition={{ 
                duration: phase === 'exit' ? 0.4 : 0.6, 
                ease: 'easeOut' 
              }}
            >
              <ZenithLogo size={120} animated />
            </motion.div>

            {/* Brand text */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: phase === 'text' || phase === 'exit' ? (phase === 'exit' ? 0 : 1) : 0,
                y: phase === 'text' ? 0 : (phase === 'exit' ? -10 : 20)
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Zenith
              </h1>
              <motion.p 
                className="text-sm text-muted-foreground font-medium tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: phase === 'text' ? 1 : 0 
                }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Studio
              </motion.p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: phase !== 'exit' ? 1 : 0 
              }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Corner accents */}
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/20 rounded-tl-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/20 rounded-br-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
