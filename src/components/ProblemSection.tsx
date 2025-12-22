import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, Globe, GraduationCap, Zap, Code, FileQuestion } from 'lucide-react';
import { ZenithLogo } from './ZenithLogo';

const chaosCards = [
  { icon: Database, label: 'CMS', x: -120, y: -80 },
  { icon: Globe, label: 'Website Builder', x: 100, y: -60 },
  { icon: GraduationCap, label: 'LMS', x: -80, y: 60 },
  { icon: Zap, label: 'Automation', x: 140, y: 80 },
  { icon: Code, label: 'Glue Code', x: 0, y: -120 },
  { icon: FileQuestion, label: 'Custom Integrations', x: -140, y: 0 },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });
  const [animationCycle, setAnimationCycle] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Create looping animation - but elements remain visible
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
    
    if (hasAnimated) {
      const interval = setInterval(() => {
        setAnimationCycle(prev => prev + 1);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isInView, hasAnimated]);

  const cyclePhase = animationCycle % 2;

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" ref={ref}>
      {/* Ambient background grid - persistent */}
      <motion.div 
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual: Chaos → Order - Looping but always visible */}
          <div className="relative h-[350px] sm:h-[400px] flex items-center justify-center order-2 lg:order-1">
            {/* Chaos state - floating cards - always rendered */}
            {chaosCards.map((card, index) => (
              <motion.div
                key={card.label}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={hasAnimated ? (cyclePhase === 0 ? {
                  x: card.x,
                  y: card.y,
                  opacity: 1,
                  scale: 1,
                  rotate: Math.random() * 6 - 3,
                } : {
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0.5,
                }) : { opacity: 0, scale: 0 }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.08,
                  ease: 'easeInOut',
                }}
              >
                <motion.div 
                  animate={cyclePhase === 0 && hasAnimated ? {
                    y: [0, -6, 6, 0],
                  } : {}}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg shadow-md flex items-center gap-2"
                >
                  <card.icon size={16} className="text-muted-foreground sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm whitespace-nowrap">{card.label}</span>
                </motion.div>
              </motion.div>
            ))}

            {/* Unified Zenith Core - always rendered once animated */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={hasAnimated ? (cyclePhase === 1 ? { 
                scale: 1, 
                opacity: 1 
              } : { 
                scale: 0, 
                opacity: 0 
              }) : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="absolute"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" 
                />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-card border border-primary flex items-center justify-center glow">
                  <ZenithLogo size={56} animated={false} />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-semibold text-gradient whitespace-nowrap"
                >
                  Unified System
                </motion.div>
              </div>
            </motion.div>

            {/* Animated pulse during transition - persistent loop */}
            {cyclePhase === 1 && hasAnimated && (
              <motion.div
                animate={{ scale: [0, 2, 3], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-32 h-32 rounded-full border-2 border-primary/50"
              />
            )}
          </div>

          {/* Content - animate in and STAY */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground"
            >
              The Problem
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6"
            >
              Tool Chaos Kills Businesses
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8"
            >
              Businesses don't fail because of ideas.
              <br />
              <span className="text-foreground font-medium">They fail because systems don't work together.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 sm:space-y-4 text-muted-foreground"
            >
              {[
                'Separate tools for content, websites, learning, and automation',
                'Endless integrations and custom code to maintain',
                'Data silos that prevent real insights',
                'Teams wasting time switching between platforms',
              ].map((item, index) => (
                <motion.p 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 text-sm sm:text-base"
                >
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" 
                  />
                  {item}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};