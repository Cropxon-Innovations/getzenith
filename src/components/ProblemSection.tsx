import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, Globe, GraduationCap, Zap, Code, FileQuestion } from 'lucide-react';
import { ZenithLogo } from './ZenithLogo';
import { ParticleBackground } from './ParticleBackground';

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

  // Create looping animation
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setAnimationCycle(prev => prev + 1);
      }, 6000); // Full cycle every 6 seconds
      return () => clearInterval(interval);
    }
  }, [isInView]);

  const cyclePhase = animationCycle % 2; // 0 = chaos, 1 = unified

  return (
    <section className="py-32 relative overflow-hidden" ref={ref}>
      <ParticleBackground density={25000} className="opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual: Chaos → Order - Looping */}
          <div className="relative h-[400px] flex items-center justify-center order-2 lg:order-1">
            {/* Chaos state - floating cards */}
            {chaosCards.map((card, index) => (
              <motion.div
                key={`${card.label}-${animationCycle}`}
                className="absolute"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0,
                  scale: 0,
                }}
                animate={cyclePhase === 0 ? {
                  x: [0, card.x],
                  y: [0, card.y],
                  opacity: [0, 1],
                  scale: [0, 1],
                  rotate: [0, Math.random() * 10 - 5],
                } : {
                  x: [card.x, 0],
                  y: [card.y, 0],
                  opacity: [1, 0],
                  scale: [1, 0],
                  rotate: 0,
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                  ease: 'easeInOut',
                }}
              >
                <motion.div 
                  animate={cyclePhase === 0 ? {
                    x: [0, 8, -8, 0],
                    y: [0, -8, 8, 0],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                  }}
                  className="px-4 py-3 bg-card border border-border rounded-lg shadow-md flex items-center gap-2"
                >
                  <card.icon size={18} className="text-muted-foreground" />
                  <span className="text-sm">{card.label}</span>
                </motion.div>
              </motion.div>
            ))}

            {/* Unified Zenith Core - appears after chaos collapses */}
            <motion.div
              key={`core-${animationCycle}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={cyclePhase === 1 ? { 
                scale: [0, 1.1, 1], 
                opacity: 1 
              } : { 
                scale: 0, 
                opacity: 0 
              }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="absolute"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" 
                />
                <div className="relative w-32 h-32 rounded-full bg-card border border-primary flex items-center justify-center glow">
                  <ZenithLogo size={64} animated={false} />
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

            {/* Animated connection pulse during transition */}
            {cyclePhase === 1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 3], opacity: [0.5, 0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-32 h-32 rounded-full border-2 border-primary/50"
              />
            )}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm uppercase tracking-widest text-muted-foreground"
            >
              The Problem
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6"
            >
              Tool Chaos Kills Businesses
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Businesses don't fail because of ideas.
              <br />
              <span className="text-foreground font-medium">They fail because systems don't work together.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 text-muted-foreground"
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
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
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
