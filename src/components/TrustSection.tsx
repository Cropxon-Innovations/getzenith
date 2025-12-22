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

export const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="enterprise" className="py-32 relative bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-6">
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

        {/* API visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative max-w-4xl mx-auto h-64 sm:h-80">
            {/* Center: Zenith */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-card border border-primary flex items-center justify-center glow">
                <span className="text-lg sm:text-xl font-bold text-gradient">Zenith</span>
              </div>
            </div>

            {/* External systems - positioned around */}
            {['PostgreSQL', 'Redis', 'S3', 'Auth0', 'Stripe', 'SendGrid'].map((system, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180);
              const radius = 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={system}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                >
                  <div className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium">
                    {system}
                  </div>
                </motion.div>
              );
            })}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = 100;
                const x = 50 + (Math.cos(angle) * radius) / 4;
                const y = 50 + (Math.sin(angle) * radius) / 3;
                return (
                  <motion.line
                    key={index}
                    x1="50%"
                    y1="50%"
                    x2={`${x}%`}
                    y2={`${y}%`}
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                );
              })}
            </svg>
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
              className="text-center p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <point.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{point.label}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
