import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Building2, Rocket, GraduationCap, Briefcase, Target, Check } from 'lucide-react';

const businessTypes = [
  { id: 'startup', icon: Rocket, label: 'Startup' },
  { id: 'agency', icon: Briefcase, label: 'Agency' },
  { id: 'education', icon: GraduationCap, label: 'Education' },
  { id: 'enterprise', icon: Building2, label: 'Enterprise' },
];

const goals = [
  'Launch a marketing site',
  'Build a learning platform',
  'Create a customer portal',
  'Automate workflows',
];

const configuredSteps = [
  { name: 'CMS Studio', description: 'Content management configured' },
  { name: 'Website Builder', description: 'Marketing templates ready' },
  { name: 'Automation Hub', description: 'Workflows initialized' },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSelectedGoal(null);
    setShowDashboard(false);
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setIsConfiguring(true);
    setTimeout(() => {
      setIsConfiguring(false);
      setShowDashboard(true);
    }, 2000);
  };

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-secondary/30" ref={ref}>
      {/* Ambient background - persistent */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" 
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
            Intent-Based Setup
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
            You Choose Intent. <span className="text-gradient">Zenith Builds the System.</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            No manual configuration. Tell us what you're building, and we'll configure everything automatically.
          </p>
        </motion.div>

        {/* Interactive flow - animate once and stay */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
            {/* Step 1: Business Type */}
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">1</div>
                <h3 className="text-base sm:text-lg font-semibold">What type of business are you?</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {businessTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 sm:p-4 rounded-xl border transition-all ${
                      selectedType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <type.icon size={20} className={`mx-auto sm:w-6 sm:h-6 ${selectedType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="block mt-2 text-xs sm:text-sm font-medium">{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Step 2: Goal */}
            <AnimatePresence>
              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 sm:mb-10"
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</div>
                    <h3 className="text-base sm:text-lg font-semibold">What's your primary goal?</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {goals.map((goal) => (
                      <motion.button
                        key={goal}
                        onClick={() => handleGoalSelect(goal)}
                        disabled={isConfiguring || showDashboard}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 sm:p-4 rounded-xl border text-left transition-all ${
                          selectedGoal === goal
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-muted-foreground'
                        } disabled:opacity-50`}
                      >
                        <Target size={18} className={`sm:w-5 sm:h-5 ${selectedGoal === goal ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="block mt-2 text-xs sm:text-sm font-medium">{goal}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Configuring */}
            <AnimatePresence>
              {isConfiguring && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6 sm:py-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"
                  />
                  <p className="text-sm sm:text-base text-muted-foreground">Configuring your workspace...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Dashboard Preview */}
            <AnimatePresence>
              {showDashboard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-secondary border border-border"
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check size={14} className="sm:w-4 sm:h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-primary">Your workspace is ready!</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {configuredSteps.map((step, index) => (
                      <motion.div
                        key={step.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-background border border-border"
                      >
                        <Check size={14} className="text-primary sm:w-4 sm:h-4" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium">{step.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};