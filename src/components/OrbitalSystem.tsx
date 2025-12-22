import { motion } from 'framer-motion';
import { Database, Layout, Globe, GraduationCap, Zap } from 'lucide-react';
import { ZenithLogo } from './ZenithLogo';

const orbitingItems = [
  { icon: Database, label: 'CMS', delay: 0, angle: 0 },
  { icon: Layout, label: 'Canvas', delay: 0.5, angle: 72 },
  { icon: Globe, label: 'Website', delay: 1, angle: 144 },
  { icon: GraduationCap, label: 'LMS', delay: 1.5, angle: 216 },
  { icon: Zap, label: 'Automation', delay: 2, angle: 288 },
];

export const OrbitalSystem = () => {
  return (
    <div className="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]">
      {/* Outer ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 rounded-full border border-border/30"
      />

      {/* Middle ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-12 rounded-full border border-border/20"
      />

      {/* Inner ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute inset-24 rounded-full border border-border/10"
      />

      {/* Center: Zenith Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-glow" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-card border border-border flex items-center justify-center glow">
            <ZenithLogo size={60} animated />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gradient"
          >
            Zenith Core
          </motion.div>
        </div>
      </motion.div>

      {/* Orbiting items */}
      {orbitingItems.map((item, index) => {
        const radius = 180;
        const baseAngle = item.angle * (Math.PI / 180);
        
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + item.delay * 0.3, duration: 0.5, type: 'spring' }}
            className="absolute left-1/2 top-1/2 z-10"
            style={{
              marginLeft: -28,
              marginTop: -28,
            }}
          >
            <motion.div
              animate={{
                x: [
                  Math.cos(baseAngle) * radius,
                  Math.cos(baseAngle + Math.PI * 2) * radius,
                ],
                y: [
                  Math.sin(baseAngle) * radius,
                  Math.sin(baseAngle + Math.PI * 2) * radius,
                ],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="relative group cursor-pointer">
                <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:glow">
                  <item.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {orbitingItems.map((item, index) => {
          const angle = item.angle * (Math.PI / 180);
          const x = 50 + Math.cos(angle) * 36;
          const y = 50 + Math.sin(angle) * 36;
          return (
            <motion.line
              key={`line-${index}`}
              x1="50%"
              y1="50%"
              x2={`${x}%`}
              y2={`${y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
            />
          );
        })}
      </svg>
    </div>
  );
};
