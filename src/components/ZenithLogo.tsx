import { motion } from 'framer-motion';

interface ZenithLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export const ZenithLogo = ({ size = 48, animated = true, className = '' }: ZenithLogoProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      animate={animated ? { rotate: 360 } : undefined}
      transition={animated ? { duration: 60, repeat: Infinity, ease: 'linear' } : undefined}
    >
      {/* Infinity-inspired Zenith symbol */}
      <motion.path
        d="M25 50C25 36.2 36.2 25 50 25C63.8 25 75 36.2 75 50C75 63.8 86.2 75 100 75"
        stroke="url(#zenithGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M75 50C75 63.8 63.8 75 50 75C36.2 75 25 63.8 25 50C25 36.2 13.8 25 0 25"
        stroke="url(#zenithGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
      />
      {/* Center dot - uses currentColor for theme adaptability */}
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        className="fill-primary"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />
      <defs>
        <linearGradient id="zenithGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:hsl(var(--primary))]" />
          <stop offset="100%" className="[stop-color:hsl(var(--accent))]" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
