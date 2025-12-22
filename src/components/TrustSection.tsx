import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';

const trustPoints = [
  'API-first by design',
  'Event-driven, not tightly coupled',
  'Works with your existing backend',
  'Deploy anywhere, scale independently',
];

const systemZones = [
  { id: 'backend', label: 'Backend Services', angle: -60, distance: 180 },
  { id: 'database', label: 'Databases', angle: 0, distance: 200 },
  { id: 'events', label: 'Events / Streaming', angle: 60, distance: 180 },
  { id: 'apps', label: 'External Apps', angle: 120, distance: 200 },
  { id: 'analytics', label: 'Analytics / BI', angle: 180, distance: 180 },
  { id: 'infra', label: 'Infrastructure', angle: 240, distance: 200 },
];

export const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animation sequence: 0=idle, 1=inbound, 2=process, 3=outbound, 4=idle
  useEffect(() => {
    if (!isInView) return;
    
    const sequence = [
      { phase: 1, delay: 2000 },  // Inbound signals
      { phase: 2, delay: 1500 },  // Processing
      { phase: 3, delay: 1500 },  // Outbound signals
      { phase: 0, delay: 2000 },  // Return to idle
    ];
    
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    
    const runSequence = () => {
      setAnimationPhase(sequence[currentIndex].phase);
      timeoutId = setTimeout(() => {
        currentIndex = (currentIndex + 1) % sequence.length;
        runSequence();
      }, sequence[currentIndex].delay);
    };
    
    const initialDelay = setTimeout(() => {
      runSequence();
    }, 1500);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialDelay);
    };
  }, [isInView]);

  return (
    <section id="enterprise" className="py-32 relative bg-background overflow-hidden" ref={ref}>
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          {/* Left: Copy + Trust Signals (40%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Open & Enterprise-Safe
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
              Built to Scale{' '}
              <span className="text-gradient">Without Lock-In</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Your data, your infrastructure, your choice.
              <br />
              Zenith stays central while you stay in control.
            </p>

            <div className="space-y-4">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Architectural Animation (60%) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-3 relative"
          >
            <div className="relative h-[500px] flex items-center justify-center">
              {/* Subtle radial zones */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
                <defs>
                  <radialGradient id="zoneGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* Zone rings */}
                {[180, 140, 100].map((r, i) => (
                  <motion.circle
                    key={r}
                    cx="250"
                    cy="250"
                    r={r}
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.4 - i * 0.1 } : { opacity: 0 }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                  />
                ))}
                
                {/* Event pulse paths */}
                {systemZones.map((zone, index) => {
                  const angleRad = (zone.angle - 90) * (Math.PI / 180);
                  const endX = 250 + Math.cos(angleRad) * 140;
                  const endY = 250 + Math.sin(angleRad) * 140;
                  
                  return (
                    <g key={zone.id}>
                      {/* Static connection line */}
                      <motion.line
                        x1="250"
                        y1="250"
                        x2={endX}
                        y2={endY}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isInView ? { pathLength: 1, opacity: 0.3 } : { pathLength: 0, opacity: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                      />
                      
                      {/* Inbound pulse */}
                      <motion.circle
                        r="4"
                        fill="hsl(var(--primary))"
                        initial={{ cx: endX, cy: endY, opacity: 0 }}
                        animate={animationPhase === 1 ? {
                          cx: [endX, 250],
                          cy: [endY, 250],
                          opacity: [0.8, 0],
                        } : { opacity: 0 }}
                        transition={{
                          duration: 1.2,
                          delay: index * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                      
                      {/* Outbound pulse */}
                      <motion.circle
                        r="4"
                        fill="hsl(var(--primary))"
                        initial={{ cx: 250, cy: 250, opacity: 0 }}
                        animate={animationPhase === 3 ? {
                          cx: [250, endX],
                          cy: [250, endY],
                          opacity: [0.8, 0],
                        } : { opacity: 0 }}
                        transition={{
                          duration: 1.2,
                          delay: index * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Zenith Control Plane - Center */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 200 }}
                className="absolute z-20"
              >
                <motion.div
                  animate={animationPhase === 2 ? { 
                    boxShadow: ['0 0 0 0 hsl(var(--primary) / 0)', '0 0 40px 10px hsl(var(--primary) / 0.15)', '0 0 0 0 hsl(var(--primary) / 0)']
                  } : {}}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="w-28 h-28 rounded-2xl bg-card border border-border flex items-center justify-center"
                >
                  <span className="text-lg font-semibold text-gradient">Zenith</span>
                </motion.div>
              </motion.div>

              {/* External System Nodes */}
              {systemZones.map((zone, index) => {
                const angleRad = (zone.angle - 90) * (Math.PI / 180);
                const x = Math.cos(angleRad) * 160;
                const y = Math.sin(angleRad) * 160;
                
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="absolute z-10"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <div className="px-3 py-2 rounded-lg bg-secondary/80 border border-border/50 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {zone.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Live Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-20"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <DashboardCard
              title="API Events"
              value="12,847"
              subtitle="Last 24 hours"
              trend="+12%"
              delay={1.6}
              isInView={isInView}
            />
            <DashboardCard
              title="Webhook Deliveries"
              value="99.8%"
              subtitle="Success rate"
              trend="Healthy"
              status="green"
              delay={1.7}
              isInView={isInView}
            />
            <DashboardCard
              title="Integration Health"
              value="6/6"
              subtitle="Connected"
              trend="All systems"
              status="green"
              delay={1.8}
              isInView={isInView}
            />
            <DashboardCard
              title="System Status"
              value="Operational"
              subtitle="All regions"
              trend="99.99% uptime"
              status="green"
              delay={1.9}
              isInView={isInView}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  status?: 'green' | 'amber';
  delay: number;
  isInView: boolean;
}

const DashboardCard = ({ title, value, subtitle, trend, status, delay, isInView }: DashboardCardProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  // Subtle value updates for realism
  useEffect(() => {
    if (!isInView || !value.match(/^\d/)) return;
    
    const interval = setInterval(() => {
      const baseNum = parseInt(value.replace(/,/g, ''));
      const variation = Math.floor(Math.random() * 20) - 10;
      const newValue = (baseNum + variation).toLocaleString();
      setDisplayValue(newValue);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isInView, value]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
      className="p-5 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{title}</span>
        {status && (
          <div className={`w-2 h-2 rounded-full ${status === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} />
        )}
      </div>
      <div className="text-2xl font-semibold mb-1">{displayValue}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{subtitle}</span>
        <span className={`text-xs ${status === 'green' ? 'text-green-500' : 'text-muted-foreground'}`}>
          {trend}
        </span>
      </div>
      
      {/* Mini sparkline */}
      <div className="mt-3 h-8 flex items-end gap-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={isInView ? { height: `${20 + Math.random() * 80}%` } : { height: 0 }}
            transition={{ delay: delay + i * 0.05, duration: 0.3 }}
            className="flex-1 bg-primary/20 rounded-sm"
          />
        ))}
      </div>
    </motion.div>
  );
};
