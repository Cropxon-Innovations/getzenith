import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Rocket, Building2, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

const solutions = [
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
    <section id="solutions" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground">
            Adaptive Configurations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            One Platform. <span className="text-gradient">Your Configuration.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The same powerful platform, configured to match how you work.
          </p>
        </motion.div>

        {/* Solutions grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(solution.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
              <div className="h-full p-8 rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <solution.icon size={28} className="text-primary" />
                    </div>
                    <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                  <p className="text-muted-foreground mb-6">{solution.description}</p>

                  <ul className="space-y-2 mb-6">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Dashboard preview mockup */}
                  <AnimatePresence>
                    {hoveredId === solution.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-destructive/50" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                          <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-3/4 bg-border rounded" />
                          <div className="h-2 w-1/2 bg-border rounded" />
                          <div className="h-8 w-full bg-border/50 rounded mt-3" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                          {solution.dashboardPreview}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
