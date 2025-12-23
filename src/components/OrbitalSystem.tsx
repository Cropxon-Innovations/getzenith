import { motion } from 'framer-motion';
import { Layout, Globe, GraduationCap, Zap, FileText } from 'lucide-react';
import { ZenithLogo } from './ZenithLogo';

const orbitingItems = [
  { icon: FileText, label: 'CMS', delay: 0, angle: 0, color: 'hsl(217 91% 60%)' },
  { icon: Layout, label: 'Canvas', delay: 0.5, angle: 72, color: 'hsl(262 83% 58%)' },
  { icon: Globe, label: 'Website', delay: 1, angle: 144, color: 'hsl(142 76% 45%)' },
  { icon: GraduationCap, label: 'LMS', delay: 1.5, angle: 216, color: 'hsl(38 92% 50%)' },
  { icon: Zap, label: 'Automation', delay: 2, angle: 288, color: 'hsl(0 84% 60%)' },
];

export const OrbitalSystem = () => {
  const radius = 150;

  return (
    <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] flex items-center justify-center">
      {/* Outer ring with dashed border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-border/50"
      />
      
      {/* Animated outer glow ring */}
      <motion.div
        animate={{ 
          rotate: 360,
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ 
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute inset-2 rounded-full border border-primary/30"
      />

      {/* Middle ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-12 sm:inset-16 rounded-full border border-border/30"
      />

      {/* Inner ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute inset-20 sm:inset-24 rounded-full border border-border/20"
      />

      {/* Connection lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
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
              <motion.line
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                filter="url(#glow)"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              />
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
                  delay: 1.5 + index * 0.2,
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Center: Zenith Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200 }}
        className="relative z-20 flex flex-col items-center"
      >
        <div className="relative">
          {/* Outer glow */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-6 bg-primary/20 blur-2xl rounded-full" 
          />
          
          {/* Main circle */}
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 0 20px hsl(var(--primary) / 0.3)', 
                '0 0 40px hsl(var(--primary) / 0.5)', 
                '0 0 20px hsl(var(--primary) / 0.3)'
              ] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center overflow-hidden"
          >
            {/* Curved text */}
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
                  fontSize: '7px', 
                  fontWeight: 700, 
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
            
            {/* Logo */}
            <div className="mt-4">
              <ZenithLogo size={40} animated />
            </div>
            
            {/* Inner ring */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-2 rounded-full border border-primary/40"
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
            transition={{ delay: 0.6 + item.delay * 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
            className="absolute z-10"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: -26,
              marginTop: -26,
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
                duration: 35,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="relative group cursor-pointer">
                {/* Glow behind item */}
                <motion.div
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: item.delay * 0.5 }}
                  className="absolute inset-0 rounded-xl blur-md"
                  style={{ backgroundColor: item.color, opacity: 0.3 }}
                />
                
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-card border-2 border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary shadow-lg"
                >
                  <item.icon 
                    size={22} 
                    className="text-foreground group-hover:text-primary transition-colors"
                  />
                </motion.div>
                
                {/* Label */}
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + item.delay * 0.2 }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-card border border-border text-xs font-semibold text-foreground whitespace-nowrap shadow-md"
                >
                  {item.label}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
