import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Database, Server, Cloud, Lock, Webhook } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

const trustPoints = [
  { icon: Code2, label: 'API-First', description: 'Every feature accessible via REST & GraphQL' },
  { icon: Webhook, label: 'Event-Driven', description: 'React to changes in real-time' },
  { icon: Database, label: 'Bring Your Backend', description: 'Connect your existing infrastructure' },
  { icon: Server, label: 'Custom Hosting', description: 'Deploy anywhere you need' },
  { icon: Lock, label: 'Enterprise Security', description: 'SOC2, GDPR, and HIPAA ready' },
  { icon: Cloud, label: 'Global CDN', description: '99.99% uptime SLA' },
];

const externalSystems = ['PostgreSQL', 'Redis', 'S3', 'Auth0', 'Stripe', 'SendGrid'];

export const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="enterprise" className="py-32 relative bg-secondary/30 overflow-hidden" ref={ref}>
      <ParticleBackground density={30000} className="opacity-20" />
      
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

        {/* API visualization - Fixed alignment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative max-w-4xl mx-auto h-[320px] sm:h-[380px]">
            {/* Connection lines SVG - positioned first */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {externalSystems.map((_, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const endX = 50 + Math.cos(angle) * 30;
                const endY = 50 + Math.sin(angle) * 35;
                return (
                  <motion.line
                    key={index}
                    x1="50%"
                    y1="50%"
                    x2={`${endX}%`}
                    y2={`${endY}%`}
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  />
                );
              })}
            </svg>

            {/* Center: Zenith */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <motion.div
                animate={{ boxShadow: ['0 0 30px hsl(var(--primary) / 0.2)', '0 0 50px hsl(var(--primary) / 0.4)', '0 0 30px hsl(var(--primary) / 0.2)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-card border border-primary flex items-center justify-center"
              >
                <span className="text-lg sm:text-xl font-bold text-gradient">Zenith</span>
              </motion.div>
            </motion.div>

            {/* External systems - positioned around */}
            {externalSystems.map((system, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180);
              const radiusX = 140;
              const radiusY = 120;
              const x = Math.cos(angle) * radiusX;
              const y = Math.sin(angle) * radiusY;

              return (
                <motion.div
                  key={system}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4, type: 'spring' }}
                  className="absolute left-1/2 top-1/2 z-20"
                  style={{ 
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                  >
                    {system}
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Animated pulse rings */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border border-primary/30"
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
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
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
