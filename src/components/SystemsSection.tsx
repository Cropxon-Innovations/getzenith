import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, Layout, GraduationCap, Zap, ArrowRight } from 'lucide-react';

const systems = [
  {
    icon: Database,
    name: 'Information System',
    studio: 'CMS Studio',
    description: 'Structured content that powers everything. One source of truth for all your digital assets.',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Layout,
    name: 'Experience System',
    studio: 'Canvas + Website',
    description: 'Design and deliver experiences that adapt. From marketing pages to full applications.',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: GraduationCap,
    name: 'Outcome System',
    studio: 'LMS Studio',
    description: 'Learning journeys that transform users into experts. Track progress, certify achievement.',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Zap,
    name: 'Action System',
    studio: 'Automation Studio',
    description: 'Workflows that run themselves. Connect events to actions without writing code.',
    color: 'from-orange-500/20 to-yellow-500/20',
  },
];

export const SystemsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="product" className="py-24 sm:py-32 relative" ref={ref}>
      {/* Ambient background - persistent */}
      <motion.div 
        animate={{ opacity: [0.02, 0.03, 0.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" 
      />
      
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header - animate once and stay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">
            The Zenith Model
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
            Four Systems. <span className="text-gradient">One Platform.</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Each system handles a distinct layer of your business. Together, they form a complete operating system.
          </p>
        </motion.div>

        {/* Systems grid - animate once and stay */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-20">
          {systems.map((system, index) => (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="group relative h-full p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${system.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <motion.div 
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/10 transition-colors"
                  >
                    <system.icon size={24} className="text-primary sm:w-7 sm:h-7" />
                  </motion.div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{system.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3 sm:mb-4 flex items-center gap-2">
                    {system.studio}
                    <ArrowRight size={14} />
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">{system.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Merge visualization - animate once and stay with idle animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 0 20px hsl(var(--primary) / 0.2)',
                '0 0 40px hsl(var(--primary) / 0.3)',
                '0 0 20px hsl(var(--primary) / 0.2)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-primary bg-primary/5"
          >
            <span className="text-base sm:text-lg font-semibold">All systems merge into</span>
            <span className="text-gradient text-lg sm:text-xl font-bold">Zenith Studio</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};