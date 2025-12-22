import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Database, Server, Cloud, Lock, Webhook } from 'lucide-react';

const trustPoints = [
  { icon: Code2, label: 'API-First', description: 'Every feature accessible via REST & GraphQL' },
  { icon: Webhook, label: 'Event-Driven', description: 'React to changes in real-time' },
  { icon: Database, label: 'Bring Your Backend', description: 'Connect your existing infrastructure' },
  { icon: Server, label: 'Custom Hosting', description: 'Deploy anywhere you need' },
  { icon: Lock, label: 'Enterprise Security', description: 'SOC2, GDPR, and HIPAA ready' },
  { icon: Cloud, label: 'Global CDN', description: '99.99% uptime SLA' },
];

const externalSystems = [
  { name: 'PostgreSQL', angle: -90 },
  { name: 'Redis', angle: -30 },
  { name: 'S3', angle: 30 },
  { name: 'Auth0', angle: 90 },
  { name: 'Stripe', angle: 150 },
  { name: 'SendGrid', angle: 210 },
];

export const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerSize = 320;
  const radius = 130;

  return (
    <section id="enterprise" className="py-32 relative bg-secondary/30 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground">
            Open & Enterprise-Safe
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Built to Scale <span className="text-gradient">Without Lock-In</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your data, your infrastructure, your choice. Zenith stays central while you stay in control.
          </p>
        </motion.div>

        {/* API visualization - Clean centered layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div 
            className="relative mx-auto"
            style={{ width: containerSize * 2, height: containerSize * 2, maxWidth: '100%' }}
          >
            {/* Center: Zenith */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-4 bg-primary/20 blur-2xl rounded-2xl"
                />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-card border-2 border-primary flex items-center justify-center shadow-lg">
                  <span className="text-lg sm:text-xl font-bold text-gradient">Zenith</span>
                </div>
              </div>
            </motion.div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              <defs>
                <linearGradient id="trustLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {externalSystems.map((system, index) => {
                const angleRad = system.angle * (Math.PI / 180);
                const endX = 50 + (Math.cos(angleRad) * radius / containerSize) * 50;
                const endY = 50 + (Math.sin(angleRad) * radius / containerSize) * 50;
                
                return (
                  <motion.line
                    key={`line-${index}`}
                    x1="50%"
                    y1="50%"
                    x2={`${endX}%`}
                    y2={`${endY}%`}
                    stroke="url(#trustLineGradient)"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  />
                );
              })}
            </svg>

            {/* External systems - positioned in a circle */}
            {externalSystems.map((system, index) => {
              const angleRad = system.angle * (Math.PI / 180);
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.div
                  key={system.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4, type: 'spring' }}
                  className="absolute z-30"
                  style={{ 
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium shadow-md hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                  >
                    {system.name}
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Subtle orbit ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/40"
              style={{ width: radius * 2 + 60, height: radius * 2 + 60 }}
            />
          </div>
        </motion.div>

        {/* Trust points grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl hover:bg-card/50 transition-all cursor-pointer group"
            >
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors"
              >
                <point.icon size={24} className="text-primary" />
              </motion.div>
              <h3 className="font-semibold mb-2">{point.label}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
