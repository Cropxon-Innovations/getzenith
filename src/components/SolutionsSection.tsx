import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Rocket, Building2, GraduationCap, Briefcase, User, ArrowRight } from 'lucide-react';

const solutions = [
  {
    id: 'solopreneurs',
    icon: User,
    title: 'Solopreneurs',
    description: 'Serious individuals ready to scale without the complexity.',
    features: ['All-in-one platform', 'No technical overhead', 'Focus on growth'],
    dashboardPreview: 'Solopreneur Dashboard',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'startups',
    icon: Rocket,
    title: 'Startups',
    description: 'Ship faster with an integrated platform that grows with you.',
    features: ['Quick launch templates', 'Built-in analytics', 'Scalable infrastructure'],
    dashboardPreview: 'Startup Dashboard',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'agencies',
    icon: Briefcase,
    title: 'Agencies',
    description: 'Manage multiple client projects from a single control center.',
    features: ['Multi-tenant workspaces', 'White-label options', 'Client collaboration'],
    dashboardPreview: 'Agency Dashboard',
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'educators',
    icon: GraduationCap,
    title: 'Educators',
    description: 'Create learning experiences that engage and certify.',
    features: ['Course builder', 'Progress tracking', 'Certification system'],
    dashboardPreview: 'Education Dashboard',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'enterprises',
    icon: Building2,
    title: 'Enterprises',
    description: 'Enterprise-grade security with startup-speed deployment.',
    features: ['SSO integration', 'Custom SLAs', 'Dedicated support'],
    dashboardPreview: 'Enterprise Dashboard',
    color: 'from-purple-500 to-pink-500',
  },
];

export const SolutionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="solutions" className="py-24 sm:py-32 relative" ref={ref}>
      {/* Ambient background - persistent */}
      <motion.div 
        animate={{ 
          background: [
            'radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.05) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 50%, hsl(var(--primary) / 0.05) 0%, transparent 50%)',
            'radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.05) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0" 
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header - animate once and stay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">
            Adaptive Configurations
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
            One Platform. <span className="text-gradient">Your Configuration.</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            The same powerful platform, configured to match how you work.
          </p>
        </motion.div>

        {/* Solutions grid - animate once and stay */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(solution.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="h-full p-6 sm:p-8 rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <motion.div 
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                    >
                      <solution.icon size={24} className="text-primary sm:w-7 sm:h-7" />
                    </motion.div>
                    <motion.div
                      animate={{ x: hoveredId === solution.id ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-all sm:w-5 sm:h-5" />
                    </motion.div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{solution.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{solution.description}</p>

                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={feature} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity, delay: featureIndex * 0.5 }}
                          className="w-1.5 h-1.5 rounded-full bg-primary" 
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Dashboard preview mockup */}
                  <AnimatePresence>
                    {hoveredId === solution.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className="mt-4 p-3 sm:p-4 rounded-lg bg-secondary/50 border border-border overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-destructive/50" />
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/50" />
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="space-y-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 0.3 }}
                            className="h-1.5 sm:h-2 bg-border rounded" 
                          />
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '50%' }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="h-1.5 sm:h-2 bg-border rounded" 
                          />
                          <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100%', opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="h-6 sm:h-8 bg-border/50 rounded mt-2 sm:mt-3" 
                          />
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
                          {solution.dashboardPreview}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};