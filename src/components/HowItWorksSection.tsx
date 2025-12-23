import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Building2, Rocket, GraduationCap, Briefcase, Target, Check } from 'lucide-react';
import { BrowserFrame } from './platform-preview/BrowserFrame';
import { TenantAdminPreview } from './platform-preview/TenantAdminPreview';
import { CMSStudioPreview } from './platform-preview/CMSStudioPreview';
import { WebsiteBuilderPreview } from './platform-preview/WebsiteBuilderPreview';
import { LMSStudioPreview } from './platform-preview/LMSStudioPreview';
import { AutomationStudioPreview } from './platform-preview/AutomationStudioPreview';

const tabs = [
  { id: 'admin', label: 'Tenant Admin', url: '/admin', description: 'Manage your entire workspace' },
  { id: 'cms', label: 'CMS Studio', url: '/studio/cms', description: 'Create and publish content' },
  { id: 'website', label: 'Website Builder', url: '/studio/website', description: 'Design stunning websites' },
  { id: 'lms', label: 'LMS Studio', url: '/studio/lms', description: 'Build learning experiences' },
  { id: 'automation', label: 'Automation', url: '/studio/automation', description: 'Automate workflows' },
];

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

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState('admin');
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const currentTab = tabs.find(t => t.id === activeTab)!;

  // Auto-rotate tabs
  useEffect(() => {
    if (!autoRotate || !isInView) return;
    
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = tabs.findIndex(t => t.id === prev);
        return tabs[(currentIndex + 1) % tabs.length].id;
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoRotate, isInView]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setAutoRotate(false);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowPreview(true);
  };

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-secondary/30" ref={ref}>
      {/* Ambient background */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" 
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            Live Platform Preview
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            See <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Zenith</span> in Action
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Explore how Zenith Studio adapts across dashboards and studios — watch it work in real time.
          </p>
        </motion.div>

        {/* Intent selection row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6"
        >
          {businessTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                selectedType === type.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <type.icon size={16} />
              <span className="hidden sm:inline">{type.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8"
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
              {activeTab === tab.id && autoRotate && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary-foreground/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  key={activeTab}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Current tab description */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground mb-6"
        >
          {currentTab.description}
        </motion.p>

        {/* Browser Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <BrowserFrame url={currentTab.url}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full min-h-[400px] sm:min-h-[500px]"
              >
                {activeTab === 'admin' && <TenantAdminPreview />}
                {activeTab === 'cms' && <CMSStudioPreview />}
                {activeTab === 'website' && <WebsiteBuilderPreview />}
                {activeTab === 'lms' && <LMSStudioPreview />}
                {activeTab === 'automation' && <AutomationStudioPreview />}
              </motion.div>
            </AnimatePresence>
          </BrowserFrame>
        </motion.div>

        {/* Goal selection CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Ready to build your platform?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {goals.map((goal) => (
              <motion.button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedGoal === goal
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/50'
                }`}
              >
                {goal}
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {selectedGoal && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30"
              >
                <Check size={16} className="text-primary" />
                <span className="text-sm text-foreground">
                  Perfect! Zenith will configure your workspace for: <strong className="text-primary">{selectedGoal}</strong>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};