import { motion } from 'framer-motion';
import { Layout, Globe, GraduationCap, Zap, FileText } from 'lucide-react';
import { ZenithLogo } from './ZenithLogo';

const orbitingItems = [
  { icon: FileText, label: 'CMS', delay: 0, angle: 0 },
  { icon: Layout, label: 'Canvas', delay: 0.5, angle: 72 },
  { icon: Globe, label: 'Website', delay: 1, angle: 144 },
  { icon: GraduationCap, label: 'LMS', delay: 1.5, angle: 216 },
  { icon: Zap, label: 'Automation', delay: 2, angle: 288 },
];

export const OrbitalSystem = () => {
  const radius = 160;

  return (
    <div className="relative w-[380px] h-[380px] sm:w-[450px] sm:h-[450px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
      {/* Outer ring with rotating animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ 
          opacity: { duration: 1 },
          scale: { duration: 1 },
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' }
        }}
        className="absolute inset-0 rounded-full border border-border/30"
        style={{ borderStyle: 'dashed', borderSpacing: '10px' }}
      />
      <motion.div
        animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3], rotate: -360 }}
        transition={{ 
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 45, repeat: Infinity, ease: 'linear' }
        }}
        className="absolute inset-0 rounded-full border border-primary/20"
      />

      {/* Middle ring - subtle counter rotation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, rotate: -360 }}
        transition={{ 
          opacity: { duration: 1, delay: 0.2 },
          scale: { duration: 1, delay: 0.2 },
          rotate: { duration: 90, repeat: Infinity, ease: 'linear' }
        }}
        className="absolute inset-10 sm:inset-12 rounded-full border border-border/20"
        style={{ borderStyle: 'dotted' }}
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
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
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
          // Increase line radius to actually reach the orbiting items
          const lineRadius = 32;
          const x = 50 + Math.cos(angle) * lineRadius;
          const y = 50 + Math.sin(angle) * lineRadius;
          
          return (
            <g key={`line-group-${index}`}>
              {/* Main connection line - thicker and more visible */}
              <motion.line
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke="url(#lineGradientActive)"
                strokeWidth="2.5"
                filter="url(#glow)"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.0 + index * 0.12, duration: 0.5 }}
              />
              {/* Animated pulse along the line */}
              <motion.circle
                r="4"
                fill="hsl(var(--primary))"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{
                  cx: ['50%', `${x}%`],
                  cy: ['50%', `${y}%`],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  delay: 1.8 + index * 0.25,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2.5,
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
          <div className="absolute -inset-8 bg-primary/25 blur-3xl rounded-full animate-pulse" />
          
          {/* Main circle with curved text */}
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 0 30px hsl(var(--primary) / 0.4)', 
                '0 0 50px hsl(var(--primary) / 0.6)', 
                '0 0 30px hsl(var(--primary) / 0.4)'
              ] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center overflow-hidden"
          >
            {/* Curved "Zenith Core" text at top */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="curvedTextPath"
                  d="M 50,50 m -34,0 a 34,34 0 1,1 68,0"
                  fill="none"
                />
              </defs>
              <text
                className="fill-primary"
                style={{ 
                  fontSize: '7.5px', 
                  fontWeight: 700, 
                  letterSpacing: '0.18em',
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
            <div className="mt-5">
              <ZenithLogo size={44} animated />
            </div>
            
            {/* Inner glow ring */}
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-3 rounded-full border border-primary/30"
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
