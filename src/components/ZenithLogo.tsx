import { motion } from 'framer-motion';

interface ZenithLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
  showText?: boolean;
}

export const ZenithLogo = ({ size = 48, animated = true, className = '', showText = false }: ZenithLogoProps) => {
  const strokeWidth = Math.max(2, size / 16);
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="overflow-visible"
      >
        <defs>
          {/* Primary gradient for Z */}
          <linearGradient id="zenithZGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--primary))]" />
            <stop offset="50%" className="[stop-color:hsl(var(--accent))]" />
            <stop offset="100%" className="[stop-color:hsl(var(--primary))]" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="zenithGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Orbit gradient */}
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0" />
            <stop offset="50%" className="[stop-color:hsl(var(--accent))]" stopOpacity="1" />
            <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background glow circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          className="fill-primary/5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={animated ? { 
            scale: [0.9, 1, 0.9], 
            opacity: [0.3, 0.5, 0.3] 
          } : { scale: 1, opacity: 0.3 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orbiting ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#orbitGradient)"
          strokeWidth="1"
          fill="none"
          className="opacity-60"
          initial={{ rotate: 0 }}
          animate={animated ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Bold Angular "Z" - Top horizontal */}
        <motion.path
          d="M 22 25 L 78 25 L 78 32 L 22 32 Z"
          fill="url(#zenithZGradient)"
          filter={animated ? "url(#zenithGlow)" : undefined}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        />

        {/* Bold Angular "Z" - Diagonal */}
        <motion.path
          d="M 68 32 L 78 32 L 32 68 L 22 68 Z"
          fill="url(#zenithZGradient)"
          filter={animated ? "url(#zenithGlow)" : undefined}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Bold Angular "Z" - Bottom horizontal */}
        <motion.path
          d="M 22 68 L 78 68 L 78 75 L 22 75 Z"
          fill="url(#zenithZGradient)"
          filter={animated ? "url(#zenithGlow)" : undefined}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
        />

        {/* Energy orb orbiting around Z */}
        <motion.g
          animate={animated ? { rotate: 360 } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        >
          <motion.circle
            cx="88"
            cy="50"
            r="5"
            className="fill-accent"
            filter="url(#zenithGlow)"
            animate={animated ? { 
              r: [4, 6, 4],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Orb trail */}
          <motion.circle
            cx="82"
            cy="50"
            r="2"
            className="fill-accent/50"
            animate={animated ? { opacity: [0.3, 0.6, 0.3] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
        </motion.g>

        {/* Center energy dot */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={animated ? { 
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8]
          } : { scale: 1 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: 0.8 
          }}
        />

        {/* Corner accent dots */}
        {[
          { cx: 20, cy: 20 },
          { cx: 80, cy: 80 },
        ].map((pos, i) => (
          <motion.circle
            key={i}
            cx={pos.cx}
            cy={pos.cy}
            r="2"
            className="fill-accent/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={animated ? { 
              opacity: [0.4, 0.8, 0.4], 
              scale: 1 
            } : { opacity: 0.5, scale: 1 }}
            transition={{ 
              opacity: { duration: 3, repeat: Infinity, delay: i * 0.5 },
              scale: { delay: 0.7 + i * 0.2, duration: 0.3 }
            }}
          />
        ))}
      </motion.svg>

      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Zenith
        </motion.span>
      )}
    </div>
  );
};
