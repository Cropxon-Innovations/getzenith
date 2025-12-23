import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Building2, GraduationCap, Briefcase, User, 
  ArrowRight, FileText, Globe, Zap, BarChart3,
  Users, BookOpen, Settings, CheckCircle2
} from 'lucide-react';

const solutions = [
  {
    id: 'solopreneurs',
    icon: User,
    title: 'Solopreneurs',
    tagline: 'Scale without complexity',
    color: '#06B6D4',
    modules: ['CMS', 'Website', 'Automation'],
    stats: { metric: '10x', label: 'Faster Launch' },
  },
  {
    id: 'startups',
    icon: Rocket,
    title: 'Startups',
    tagline: 'Ship faster, iterate quicker',
    color: '#F59E0B',
    modules: ['CMS', 'Website', 'LMS', 'Automation'],
    stats: { metric: '60%', label: 'Cost Saved' },
  },
  {
    id: 'agencies',
    icon: Briefcase,
    title: 'Agencies',
    tagline: 'Manage all clients in one place',
    color: '#8B5CF6',
    modules: ['Multi-tenant', 'White-label', 'Analytics'],
    stats: { metric: '50+', label: 'Clients Managed' },
  },
  {
    id: 'educators',
    icon: GraduationCap,
    title: 'Educators',
    tagline: 'Engage and certify learners',
    color: '#10B981',
    modules: ['LMS', 'Assessments', 'Certificates'],
    stats: { metric: '95%', label: 'Completion Rate' },
  },
  {
    id: 'enterprises',
    icon: Building2,
    title: 'Enterprises',
    tagline: 'Enterprise security, startup speed',
    color: '#EC4899',
    modules: ['SSO', 'Custom SLA', 'Dedicated Support'],
    stats: { metric: '99.9%', label: 'Uptime' },
  },
];

const moduleIcons: Record<string, any> = {
  'CMS': FileText,
  'Website': Globe,
  'Automation': Zap,
  'LMS': BookOpen,
  'Multi-tenant': Users,
  'White-label': Settings,
  'Analytics': BarChart3,
  'Assessments': CheckCircle2,
  'Certificates': GraduationCap,
  'SSO': Building2,
  'Custom SLA': FileText,
  'Dedicated Support': Users,
};

export const SolutionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate through solutions
  useEffect(() => {
    if (!isAutoPlaying || !isInView) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % solutions.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, isInView]);

  const activeSolution = solutions[activeIndex];

  return (
    <section id="solutions" className="py-24 sm:py-32 relative overflow-hidden" ref={ref}>
      {/* Dynamic background based on active solution */}
      <motion.div
        key={activeSolution.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${activeSolution.color}08 0%, transparent 60%)`
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">
            Built For Everyone
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">
            One Platform. <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Way.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Solution selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            {solutions.map((solution, index) => {
              const isActive = activeIndex === index;
              const Icon = solution.icon;

              return (
                <motion.button
                  key={solution.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all relative overflow-hidden ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-muted-foreground'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Progress bar for active */}
                  {isActive && isAutoPlaying && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4, ease: 'linear' }}
                      key={`progress-${activeIndex}`}
                    />
                  )}

                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ 
                        backgroundColor: isActive ? `${solution.color}20` : 'hsl(var(--muted))',
                      }}
                    >
                      <Icon 
                        size={22} 
                        style={{ color: isActive ? solution.color : 'hsl(var(--muted-foreground))' }}
                      />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base sm:text-lg font-semibold ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {solution.title}
                        </h3>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <ArrowRight size={16} className="text-primary" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {solution.tagline}
                      </p>
                    </div>

                    {/* Stat badge */}
                    <div className={`text-right ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                      <span 
                        className="text-lg sm:text-xl font-bold"
                        style={{ color: isActive ? solution.color : 'hsl(var(--muted-foreground))' }}
                      >
                        {solution.stats.metric}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground block">
                        {solution.stats.label}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Right: Visual preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSolution.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl"
                style={{ boxShadow: `0 20px 60px -20px ${activeSolution.color}30` }}
              >
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-3 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground">
                      {activeSolution.title.toLowerCase()}.zenith.app
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 min-h-[300px]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <motion.h4
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-bold text-foreground"
                      >
                        {activeSolution.title} Dashboard
                      </motion.h4>
                      <p className="text-xs text-muted-foreground">{activeSolution.tagline}</p>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${activeSolution.color}20`,
                        color: activeSolution.color
                      }}
                    >
                      {activeSolution.stats.metric} {activeSolution.stats.label}
                    </motion.div>
                  </div>

                  {/* Active modules */}
                  <div className="mb-6">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                      Active Modules
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeSolution.modules.map((module, i) => {
                        const ModuleIcon = moduleIcons[module] || Settings;
                        return (
                          <motion.div
                            key={module}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.1 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background"
                          >
                            <ModuleIcon size={14} style={{ color: activeSolution.color }} />
                            <span className="text-xs font-medium">{module}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visual metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Projects', value: Math.floor(Math.random() * 50) + 10 },
                      { label: 'Users', value: Math.floor(Math.random() * 500) + 100 },
                      { label: 'Active', value: `${Math.floor(Math.random() * 30) + 70}%` },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="p-3 rounded-lg bg-muted/50 text-center"
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xl font-bold block"
                          style={{ color: activeSolution.color }}
                        >
                          {stat.value}
                        </motion.span>
                        <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Activity visualization */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground mb-2 block">Activity</span>
                    <div className="flex items-end gap-1 h-12">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${20 + Math.random() * 80}%` }}
                          transition={{ delay: 0.4 + i * 0.02, duration: 0.3 }}
                          className="flex-1 rounded-t"
                          style={{ 
                            backgroundColor: i > 15 ? activeSolution.color : `${activeSolution.color}40`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: activeSolution.color }}
            >
              <activeSolution.icon size={28} className="text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
