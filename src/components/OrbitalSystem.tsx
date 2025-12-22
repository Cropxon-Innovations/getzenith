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

      {/* Connection lines SVG - connecting all items to center */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {orbitingItems.map((item, index) => {
          const angle = item.angle * (Math.PI / 180);
          const lineRadius = 32;
          const x = 50 + Math.cos(angle) * lineRadius;
          const y = 50 + Math.sin(angle) * lineRadius;
          
          return (
            <g key={`line-group-${index}`}>
              {/* Main connection line */}
              <motion.line
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke="url(#lineGradientActive)"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
              />
              {/* Animated pulse along the line */}
              <motion.circle
                r="3"
                fill="hsl(var(--primary))"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{
                  cx: ['50%', `${x}%`],
                  cy: ['50%', `${y}%`],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  delay: 2 + index * 0.3,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Center: Zenith Core with curved text */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
        className="relative z-20 flex flex-col items-center"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
          
          {/* Main circle with curved text */}
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 0 20px hsl(var(--primary) / 0.3)', 
                '0 0 40px hsl(var(--primary) / 0.5)', 
                '0 0 20px hsl(var(--primary) / 0.3)'
              ] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center overflow-hidden"
          >
            {/* Curved "Zenith Core" text at top */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="curvedTextPath"
                  d="M 50,50 m -32,0 a 32,32 0 1,1 64,0"
                  fill="none"
                />
              </defs>
              <text
                className="fill-primary"
                style={{ 
                  fontSize: '8px', 
                  fontWeight: 600, 
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}
              >
                <textPath 
                  href="#curvedTextPath" 
                  startOffset="50%" 
                  textAnchor="middle"
                >
                  Zenith Core
                </textPath>
              </text>
            </svg>
            
            {/* Logo centered below the curved text */}
            <div className="mt-4">
              <ZenithLogo size={48} animated />
            </div>
            
            {/* Inner glow ring */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-2 rounded-full border border-primary/20"
            />
          </motion.div>
        </div>
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
