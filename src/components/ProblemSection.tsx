import { useRef } from 'react';
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
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual: Chaos → Order */}
          <div className="relative h-[400px] flex items-center justify-center order-2 lg:order-1">
            {/* Chaos state - floating cards */}
            {chaosCards.map((card, index) => (
              <motion.div
                key={card.label}
                className="absolute"
                initial={{ 
                  x: card.x, 
                  y: card.y, 
                  opacity: 1,
                  rotate: Math.random() * 20 - 10 
                }}
                animate={isInView ? {
                  x: 0,
                  y: 0,
                  opacity: 0,
                  rotate: 0,
                  scale: 0,
                } : {
                  x: [card.x, card.x + 10, card.x - 10, card.x],
                  y: [card.y, card.y - 10, card.y + 10, card.y],
                }}
                transition={isInView ? {
                  delay: 1 + index * 0.1,
                  duration: 0.8,
                  ease: 'easeInOut',
                } : {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="px-4 py-3 bg-card border border-border rounded-lg shadow-md flex items-center gap-2">
                  <card.icon size={18} className="text-muted-foreground" />
                  <span className="text-sm">{card.label}</span>
                </div>
              </motion.div>
            ))}

            {/* Unified Zenith Core - appears after chaos collapses */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ delay: 2, duration: 0.5, type: 'spring' }}
              className="absolute"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
                <div className="relative w-32 h-32 rounded-full bg-card border border-primary flex items-center justify-center glow">
                  <ZenithLogo size={64} animated={false} />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2.5 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-semibold text-gradient whitespace-nowrap"
                >
                  Unified System
                </motion.div>
              </div>
            </motion.div>
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
              <p>• Separate tools for content, websites, learning, and automation</p>
              <p>• Endless integrations and custom code to maintain</p>
              <p>• Data silos that prevent real insights</p>
              <p>• Teams wasting time switching between platforms</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
