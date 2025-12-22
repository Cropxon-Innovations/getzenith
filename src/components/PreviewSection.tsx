import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const previews = [
  {
    name: 'Tenant Admin Dashboard',
    description: 'Complete control over your workspace',
  },
  {
    name: 'CMS Studio',
    description: 'Block-based content editing',
  },
  {
    name: 'Website Builder',
    description: 'Visual page composition',
  },
  {
    name: 'LMS Studio',
    description: 'Course and curriculum design',
  },
  {
    name: 'Automation Studio',
    description: 'Visual workflow builder',
  },
];

export const PreviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % previews.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground">
            Live Platform Preview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            See <span className="text-gradient">Zenith in Action</span>
          </h2>
        </motion.div>

        {/* Preview tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {previews.map((preview, index) => (
            <button
              key={preview.name}
              onClick={() => setActiveIndex(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeIndex === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {preview.name}
            </button>
          ))}
        </motion.div>

        {/* Preview window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground">
                  app.zenith.studio/{previews[activeIndex].name.toLowerCase().replace(/\s+/g, '-')}
                </div>
              </div>
            </div>

            {/* Preview content */}
            <div className="relative h-[400px] sm:h-[500px] overflow-hidden bg-background">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 p-6"
                >
                  {/* Simulated dashboard content */}
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="h-4 w-48 bg-muted rounded mb-2" />
                        <div className="h-3 w-32 bg-muted/50 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-9 w-24 bg-muted rounded" />
                        <div className="h-9 w-9 bg-primary/20 rounded" />
                      </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 grid grid-cols-12 gap-4">
                      {/* Sidebar */}
                      <div className="col-span-3 space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`h-8 rounded ${i === 1 ? 'bg-primary/20' : 'bg-muted/30'}`} />
                        ))}
                      </div>

                      {/* Content */}
                      <div className="col-span-9 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                              className="h-24 bg-muted/50 rounded-lg"
                            />
                          ))}
                        </div>
                        <div className="h-40 bg-muted/30 rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-20 bg-muted/20 rounded-lg" />
                          <div className="h-20 bg-muted/20 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating label */}
                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-card border border-border rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{previews[activeIndex].name}</p>
                    <p className="text-xs text-muted-foreground">{previews[activeIndex].description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
