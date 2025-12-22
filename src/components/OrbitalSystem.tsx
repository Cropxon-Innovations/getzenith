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
  const radius = 160;
  const containerSize = { sm: 380, md: 450, lg: 500 };

  return (
    <div className="relative w-[380px] h-[380px] sm:w-[450px] sm:h-[450px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
      {/* Outer ring with pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 rounded-full border border-border/30"
      />
      <motion.div
        animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full border border-primary/20"
      />

      {/* Middle ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-10 sm:inset-12 rounded-full border border-border/20"
      />

      {/* Inner ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute inset-20 sm:inset-24 rounded-full border border-border/10"
      />

      {/* Connection lines SVG - rendered first so they appear behind */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {orbitingItems.map((item, index) => {
          const angle = item.angle * (Math.PI / 180);
          // Calculate endpoint based on radius percentage of container
          const lineRadius = 32; // percentage from center
          const x = 50 + Math.cos(angle) * lineRadius;
          const y = 50 + Math.sin(angle) * lineRadius;
          
          return (
            <motion.line
              key={`line-${index}`}
              x1="50%"
              y1="50%"
              x2={`${x}%`}
              y2={`${y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Center: Zenith Core - absolutely centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
        className="relative z-20 flex flex-col items-center"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse-glow" />
          <motion.div 
            animate={{ boxShadow: ['0 0 20px hsl(var(--primary) / 0.3)', '0 0 40px hsl(var(--primary) / 0.5)', '0 0 20px hsl(var(--primary) / 0.3)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-card border border-border flex items-center justify-center"
          >
            <ZenithLogo size={56} animated />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-3 whitespace-nowrap text-sm font-medium text-gradient"
        >
          Zenith Core
        </motion.div>
      </motion.div>

      {/* Orbiting items */}
      {orbitingItems.map((item) => {
        const baseAngle = item.angle * (Math.PI / 180);
        
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + item.delay * 0.3, duration: 0.5, type: 'spring' }}
            className="absolute z-10"
            style={{
              left: '50%',
              top: '50%',
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
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-card border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                >
                  <item.icon size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-card/90 border border-border/50 text-xs font-medium text-foreground whitespace-nowrap shadow-sm">
                  {item.label}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
