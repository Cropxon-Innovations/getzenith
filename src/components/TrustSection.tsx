import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [animationPhase, setAnimationPhase] = useState(0);
  const [activeSignals, setActiveSignals] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Animation sequence - persistent loop
  useEffect(() => {
    if (!isVisible) return;
    
    const startSequence = () => {
      // Phase 1: Inbound signals
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
            // Phase 0: Idle (but still visible)
            setAnimationPhase(0);
            setActiveSignals([]);
          }, 2000);
        }, 1500);
      }, 2000);
    };
    
    const initialTimeout = setTimeout(() => {
      startSequence();
    }, 800);
    
    const interval = setInterval(startSequence, 8000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isVisible]);

  const radius = 140;
  const centerX = 200;
  const centerY = 200;

  return (
    <section id="enterprise" className="py-24 sm:py-32 relative bg-background overflow-hidden" ref={ref}>
      {/* Ambient grid background - persistent */}
      <motion.div 
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} 
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          {/* Left: Copy + Trust Signals (40%) - animate once and stay */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Open & Enterprise-Safe
            </span>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6 leading-tight">
              Built to Scale{' '}
              <span className="text-gradient">Without Lock-In</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
              Your data, your infrastructure, your choice.
              <br />
              Zenith stays central while you stay in control.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className="w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center flex-shrink-0"
                  >
                    <Check size={12} className="text-primary" />
                  </motion.div>
                  <span className="text-xs sm:text-sm">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Architectural Animation (60%) - always visible with persistent idle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-3 relative"
          >
            <div className="relative aspect-square max-w-[400px] sm:max-w-[450px] mx-auto">
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

                {/* Orbital rings - persistent with slow rotation */}
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
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 0.4 - i * 0.1,
                      rotate: i % 2 === 0 ? 360 : -360
                    }}
                    transition={{ 
                      opacity: { duration: 0.8, delay: 0.3 + i * 0.15 },
                      rotate: { duration: 60 + i * 20, repeat: Infinity, ease: 'linear' }
                    }}
                    style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                  />
                ))}

                {/* Connection lines - always visible */}
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    />
                  );
                })}

                {/* Event pulse signals - visible during animation phases */}
                <AnimatePresence>
                  {systemZones.map((zone, index) => {
                    const angleRad = zone.angle * (Math.PI / 180);
                    const endX = centerX + Math.cos(angleRad) * radius;
                    const endY = centerY + Math.sin(angleRad) * radius;
                    const isActive = activeSignals.includes(index);
                    
                    if (!isActive) return null;
                    
                    return (
                      <motion.g key={`pulse-${zone.id}-${animationPhase}`}>
                        {animationPhase === 1 && (
                          <motion.circle
                            r="6"
                            fill="hsl(var(--primary))"
                            filter="url(#glow)"
                            initial={{ cx: endX, cy: endY, opacity: 1 }}
                            animate={{ cx: centerX, cy: centerY, opacity: [1, 1, 0] }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          />
                        )}
                        {animationPhase === 3 && (
                          <motion.circle
                            r="6"
                            fill="hsl(var(--primary))"
                            filter="url(#glow)"
                            initial={{ cx: centerX, cy: centerY, opacity: 1 }}
                            animate={{ cx: endX, cy: endY, opacity: [1, 1, 0] }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          />
                        )}
                      </motion.g>
                    );
                  })}
                </AnimatePresence>

                {/* Center Zenith node - always visible with persistent glow */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                >
                  {/* Processing glow - persistent subtle pulse */}
                  <motion.circle
                    cx={centerX}
                    cy={centerY}
                    r="50"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    animate={{ 
                      opacity: animationPhase === 2 ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
                      scale: animationPhase === 2 ? [1, 1.2, 1] : [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                  />
                  
                  {/* Main center circle */}
                  <motion.circle
                    cx={centerX}
                    cy={centerY}
                    r="40"
                    fill="hsl(var(--card))"
                    stroke={animationPhase === 2 ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth="2"
                    animate={{ strokeWidth: animationPhase === 2 ? 3 : 2 }}
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

                {/* External system nodes - always visible */}
                {systemZones.map((zone, index) => {
                  const angleRad = zone.angle * (Math.PI / 180);
                  const x = centerX + Math.cos(angleRad) * radius;
                  const y = centerY + Math.sin(angleRad) * radius;
                  const isActive = activeSignals.includes(index);
                  
                  return (
                    <motion.g
                      key={zone.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    >
                      <motion.rect
                        x={x - 50}
                        y={y - 12}
                        width="100"
                        height="24"
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
                        className="text-[10px] sm:text-xs fill-muted-foreground"
                      >
                        {zone.label}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>
              
              {/* Status indicator - always visible */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground"
              >
                <motion.div
                  animate={{ 
                    backgroundColor: animationPhase === 2 
                      ? 'hsl(var(--primary))' 
                      : animationPhase > 0 
                        ? 'hsl(142 76% 36%)' 
                        : 'hsl(var(--muted-foreground))',
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ scale: { duration: 2, repeat: Infinity } }}
                  className="w-2 h-2 rounded-full"
                />
                <span>
                  {animationPhase === 0 && 'Idle'}
                  {animationPhase === 1 && 'Receiving...'}
                  {animationPhase === 2 && 'Processing...'}
                  {animationPhase === 3 && 'Dispatching...'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Live Dashboard Preview - always visible after animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 sm:mt-20"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <DashboardCard
              title="API Events"
              value={12847}
              subtitle="Last 24 hours"
              trend="+12%"
              delay={1.3}
            />
            <DashboardCard
              title="Webhook Deliveries"
              value={99.8}
              suffix="%"
              subtitle="Success rate"
              trend="Healthy"
              status="green"
              delay={1.4}
            />
            <DashboardCard
              title="Integration Health"
              value={6}
              suffix="/6"
              subtitle="Connected"
              trend="All systems"
              status="green"
              delay={1.5}
            />
            <DashboardCard
              title="System Status"
              value="Operational"
              subtitle="All regions"
              trend="99.99% uptime"
              status="green"
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
  delay: number;
}

const DashboardCard = ({ title, value, suffix = '', subtitle, trend, status, delay }: DashboardCardProps) => {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Animate number counting up
  useEffect(() => {
    if (!hasAnimated || typeof value !== 'number') return;
    
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
  }, [hasAnimated, value]);

  // Subtle random updates for realism - persistent
  useEffect(() => {
    if (!hasAnimated || typeof value !== 'number' || value < 100) return;
    
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
  }, [hasAnimated, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-card border border-border rounded-xl p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm text-muted-foreground">{title}</span>
        {status && (
          <motion.div 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${status === 'green' ? 'bg-green-500' : 'bg-amber-500'}`} 
          />
        )}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
        {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
        {suffix && <span className="text-base sm:text-lg text-muted-foreground">{suffix}</span>}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</span>
        <span className="text-[10px] sm:text-xs text-primary">{trend}</span>
      </div>
      
      {/* Mini sparkline - persistent */}
      <div className="mt-2 sm:mt-3 flex items-end gap-0.5 h-4 sm:h-6">
        {[30, 45, 35, 60, 50, 70, 55, 80, 65, 75].map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: [`${h * 0.8}%`, `${h}%`, `${h * 0.9}%`] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            className="flex-1 bg-primary/30 rounded-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
};