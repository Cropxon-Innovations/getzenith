import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZenithLogo } from './ZenithLogo';
import { Link } from 'react-router-dom';
import { LiveDashboardPreview } from './hero/LiveDashboardPreview';
import { DemoModal } from './demo/DemoModal';

export const HeroSection = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background gradient - theme aware */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      
      {/* Grid pattern overlay for visual depth */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Animated gradient orbs */}
      <motion.div 
        animate={{ 
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px]" 
      />
      
      {/* Additional accent orb */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px]" 
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            {/* Badge with Z Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-foreground mb-6"
            >
              <ZenithLogo size={20} animated={false} />
              <span>Introducing Zenith Studio</span>
              <motion.span 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary" 
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 text-foreground"
            >
              Run Your Digital Business From{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  One Control Plane
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Zenith Studio orchestrates content, experiences, learning, and automation — 
              without locking you into tools or infrastructure.
            </motion.p>

            {/* Feature checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-x-4 gap-y-2 mb-8 justify-center lg:justify-start"
            >
              {['No code required', 'Enterprise ready', 'Free 30-day trial'].map((feature, i) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link to="/get-started">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base font-semibold px-6 sm:px-8 w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Start Free — 30-Day Trial
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setDemoOpen(true)}
                className="gap-2 text-base font-medium px-6 sm:px-8 w-full sm:w-auto border-border text-foreground hover:bg-secondary hover:text-foreground"
              >
                <Play size={18} className="text-primary" />
                See How It Works
              </Button>
            </motion.div>

            {/* Demo Modal */}
            <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-sm"
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-foreground font-bold">2,500+</span> teams already building
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Live Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative flex items-center justify-center mt-8 lg:mt-0"
          >
            <LiveDashboardPreview />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center p-2"
        >
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary" 
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
