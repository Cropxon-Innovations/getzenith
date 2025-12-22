import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const trustPoints = [
  'API-first by design',
  'Event-driven, not tightly coupled',
  'Works with your existing backend',
  'Deploy anywhere, scale independently',
];

const systemZones = [
  { id: 'backend', label: 'Backend Services', angle: 270 },
  { id: 'database', label: 'Databases', angle: 330 },
  { id: 'events', label: 'Events / Streaming', angle: 30 },
  { id: 'apps', label: 'External Apps', angle: 90 },
  { id: 'analytics', label: 'Analytics / BI', angle: 150 },
  { id: 'infra', label: 'Infrastructure', angle: 210 },
];

export const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [animationPhase, setAnimationPhase] = useState(0);
  const [activeSignals, setActiveSignals] = useState<number[]>([]);

  // Animation sequence
  useEffect(() => {
    if (!isInView) return;
    
    let interval: NodeJS.Timeout;
    
    const startSequence = () => {
      // Phase 1: Inbound signals (random nodes send to center)
      setAnimationPhase(1);
      const inbound = [0, 2, 4].sort(() => Math.random() - 0.5).slice(0, 2);
      setActiveSignals(inbound);
      
      setTimeout(() => {
        // Phase 2: Processing
        setAnimationPhase(2);
        setActiveSignals([]);
        
        setTimeout(() => {
          // Phase 3: Outbound signals
          setAnimationPhase(3);
          const outbound = [1, 3, 5].sort(() => Math.random() - 0.5).slice(0, 2);
          setActiveSignals(outbound);
          
          setTimeout(() => {
            // Phase 0: Idle
            setAnimationPhase(0);
            setActiveSignals([]);
          }, 2000);
        }, 1500);
      }, 2000);
    };
    
    // Initial delay then start
    const initialTimeout = setTimeout(() => {
      startSequence();
      interval = setInterval(startSequence, 8000);
    }, 1000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isInView]);

  const radius = 140;
  const centerX = 200;
  const centerY = 200;

  return (
    <section id="enterprise" className="py-32 relative bg-background overflow-hidden" ref={ref}>
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
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
            <div className="relative aspect-square max-w-[450px] mx-auto">
              <svg 
                viewBox="0 0 400 400" 
                className="w-full h-full"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Orbital rings */}
                {[140, 100, 60].map((r, i) => (
                  <motion.circle
                    key={r}
                    cx={centerX}
                    cy={centerY}
                    r={r}
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="6 6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 0.5 - i * 0.15, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                  />
                ))}

                {/* Connection lines to each zone */}
                {systemZones.map((zone, index) => {
                  const angleRad = zone.angle * (Math.PI / 180);
                  const endX = centerX + Math.cos(angleRad) * radius;
                  const endY = centerY + Math.sin(angleRad) * radius;
                  
                  return (
                    <motion.line
                      key={zone.id}
                      x1={centerX}
                      y1={centerY}
                      x2={endX}
                      y2={endY}
                      stroke="hsl(var(--border))"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    />
                  );
                })}

                {/* Event pulse signals */}
                <AnimatePresence>
                  {systemZones.map((zone, index) => {
                    const angleRad = zone.angle * (Math.PI / 180);
                    const endX = centerX + Math.cos(angleRad) * radius;
                    const endY = centerY + Math.sin(angleRad) * radius;
                    const isActive = activeSignals.includes(index);
                    
                    if (!isActive) return null;
                    
                    return (
                      <motion.g key={`pulse-${zone.id}-${animationPhase}`}>
                        {/* Inbound pulse */}
                        {animationPhase === 1 && (
                          <motion.circle
                            r="6"
                            fill="hsl(var(--primary))"
                            filter="url(#glow)"
                            initial={{ cx: endX, cy: endY, opacity: 1, scale: 1 }}
                            animate={{ 
                              cx: centerX, 
                              cy: centerY, 
                              opacity: [1, 1, 0],
                              scale: [1, 1.2, 0.5]
                            }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          />
                        )}
                        
                        {/* Outbound pulse */}
                        {animationPhase === 3 && (
                          <motion.circle
                            r="6"
                            fill="hsl(var(--primary))"
                            filter="url(#glow)"
                            initial={{ cx: centerX, cy: centerY, opacity: 1, scale: 0.5 }}
                            animate={{ 
                              cx: endX, 
                              cy: endY, 
                              opacity: [1, 1, 0],
                              scale: [0.5, 1.2, 1]
                            }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          />
                        )}
                      </motion.g>
                    );
                  })}
                </AnimatePresence>

                {/* Center Zenith node */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                >
                  {/* Processing glow */}
                  <AnimatePresence>
                    {animationPhase === 2 && (
                      <motion.circle
                        cx={centerX}
                        cy={centerY}
                        r="45"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: [0, 0.6, 0],
                          scale: [0.8, 1.3, 1.5]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Main center circle */}
                  <motion.circle
                    cx={centerX}
                    cy={centerY}
                    r="40"
                    fill="hsl(var(--card))"
                    stroke={animationPhase === 2 ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth="2"
                    animate={{ 
                      strokeWidth: animationPhase === 2 ? 3 : 2,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <text
                    x={centerX}
                    y={centerY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-semibold fill-foreground"
                  >
                    Zenith
                  </text>
                </motion.g>

                {/* External system nodes */}
                {systemZones.map((zone, index) => {
                  const angleRad = zone.angle * (Math.PI / 180);
                  const x = centerX + Math.cos(angleRad) * radius;
                  const y = centerY + Math.sin(angleRad) * radius;
                  const isActive = activeSignals.includes(index);
                  
                  return (
                    <motion.g
                      key={zone.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    >
                      <motion.rect
                        x={x - 55}
                        y={y - 14}
                        width="110"
                        height="28"
                        rx="6"
                        fill="hsl(var(--secondary))"
                        stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth={isActive ? 2 : 1}
                        animate={{ 
                          stroke: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                          strokeWidth: isActive ? 2 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs fill-muted-foreground"
                      >
                        {zone.label}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>
              
              {/* Status indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground"
              >
                <motion.div
                  animate={{ 
                    backgroundColor: animationPhase === 2 
                      ? 'hsl(var(--primary))' 
                      : animationPhase > 0 
                        ? 'hsl(142 76% 36%)' 
                        : 'hsl(var(--muted-foreground))'
                  }}
                  className="w-2 h-2 rounded-full"
                />
                <span>
                  {animationPhase === 0 && 'Idle'}
                  {animationPhase === 1 && 'Receiving events...'}
                  {animationPhase === 2 && 'Processing...'}
                  {animationPhase === 3 && 'Dispatching...'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Live Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="API Events"
              value={12847}
              subtitle="Last 24 hours"
              trend="+12%"
              isInView={isInView}
              delay={1.3}
            />
            <DashboardCard
              title="Webhook Deliveries"
              value={99.8}
              suffix="%"
              subtitle="Success rate"
              trend="Healthy"
              status="green"
              isInView={isInView}
              delay={1.4}
            />
            <DashboardCard
              title="Integration Health"
              value={6}
              suffix="/6"
              subtitle="Connected"
              trend="All systems"
              status="green"
              isInView={isInView}
              delay={1.5}
            />
            <DashboardCard
              title="System Status"
              value="Operational"
              subtitle="All regions"
              trend="99.99% uptime"
              status="green"
              isInView={isInView}
              delay={1.6}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface DashboardCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  subtitle: string;
  trend: string;
  status?: 'green' | 'amber';
  isInView: boolean;
  delay: number;
}

const DashboardCard = ({ title, value, suffix = '', subtitle, trend, status, isInView, delay }: DashboardCardProps) => {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);
  
  // Animate number counting up
  useEffect(() => {
    if (!isInView || typeof value !== 'number') return;
    
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayValue(Math.round(current * 10) / 10);
      
      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [isInView, value]);

  // Subtle random updates for realism
  useEffect(() => {
    if (!isInView || typeof value !== 'number' || value < 100) return;
    
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 50) - 25;
      setDisplayValue(prev => {
        if (typeof prev === 'number') {
          return Math.max(0, prev + variation);
        }
        return prev;
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isInView, value]);

  const formattedValue = typeof displayValue === 'number' 
    ? displayValue.toLocaleString() 
    : displayValue;
  
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
          <motion.div 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${status === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} 
          />
        )}
      </div>
      <div className="text-2xl font-semibold mb-1">
        {formattedValue}{suffix}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{subtitle}</span>
        <span className={`text-xs ${status === 'green' ? 'text-green-500' : 'text-muted-foreground'}`}>
          {trend}
        </span>
      </div>
      
      {/* Mini activity chart */}
      <div className="mt-3 h-8 flex items-end gap-0.5">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={isInView ? { height: `${15 + Math.random() * 85}%` } : { height: 0 }}
            transition={{ delay: delay + 0.3 + i * 0.03, duration: 0.4 }}
            className="flex-1 bg-primary/15 rounded-sm"
          />
        ))}
      </div>
    </motion.div>
  );
};
