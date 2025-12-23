import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Globe, GraduationCap, Zap, LayoutDashboard, TrendingUp, Users, Eye, Activity } from 'lucide-react';
import type { OnboardingState } from '@/pages/Onboarding';
import { useEffect, useState } from 'react';

interface OnboardingPreviewProps {
  state: OnboardingState;
  currentStep: string;
}

export const OnboardingPreview = ({ state, currentStep }: OnboardingPreviewProps) => {
  const primaryColor = state.primaryColor || '#3B82F6';
  const [stats, setStats] = useState({ content: 0, users: 0, views: 0 });
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  // Animate stats counting up
  useEffect(() => {
    if (state.businessType) {
      const targets = { content: 12, users: 48, views: 156 };
      const duration = 1500;
      const steps = 30;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        setStats({
          content: Math.round((targets.content * step) / steps),
          users: Math.round((targets.users * step) / steps),
          views: Math.round((targets.views * step) / steps),
        });
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [state.businessType]);

  // Cycle through menu items for live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMenuIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Pulse animation trigger
  useEffect(() => {
    if (currentStep === 'auto-config') {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const menuIcons = [LayoutDashboard, FileText, Globe, GraduationCap, Zap];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Live Preview</h3>
            <p className="text-sm text-muted-foreground mt-1">
              See your platform take shape
            </p>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {/* Mock Dashboard Preview */}
            <div 
              className="rounded-xl border border-border bg-background overflow-hidden h-full relative"
              style={showPulse ? { boxShadow: `0 0 30px ${primaryColor}40` } : {}}
            >
              {/* Configuration overlay animation */}
              <AnimatePresence>
                {currentStep === 'auto-config' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-primary border-t-transparent"
                      />
                      <p className="text-sm font-medium text-foreground">Configuring your platform...</p>
                      <p className="text-xs text-muted-foreground mt-1">Setting up {state.businessType?.replace(/-/g, ' ')}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mock Header */}
              <div 
                className="h-12 border-b border-border flex items-center px-4 gap-3"
                style={{ backgroundColor: `${primaryColor}08` }}
              >
                <motion.div 
                  className="w-6 h-6 rounded-md"
                  style={{ backgroundColor: primaryColor }}
                  animate={showPulse ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
                <span className="font-medium text-sm text-foreground">
                  {state.brandName || 'Your Business'}
                </span>
                
                {/* Activity indicator in header */}
                <div className="ml-auto flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Activity size={14} className="text-muted-foreground" />
                  </motion.div>
                </div>
              </div>

              <div className="flex h-[calc(100%-3rem)]">
                {/* Mock Sidebar with animated selection */}
                <div className="w-14 border-r border-border p-2 space-y-2">
                  {menuIcons.map((Icon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        scale: activeMenuIndex === i ? 1.05 : 1,
                      }}
                      transition={{ delay: i * 0.1, duration: 0.2 }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      style={activeMenuIndex === i ? { backgroundColor: `${primaryColor}20` } : { backgroundColor: 'hsl(var(--muted))' }}
                    >
                      <Icon 
                        size={18} 
                        style={activeMenuIndex === i ? { color: primaryColor } : {}} 
                        className={activeMenuIndex !== i ? 'text-muted-foreground' : ''}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Mock Content Area */}
                <div className="flex-1 p-4 overflow-hidden">
                  {state.businessType ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 h-full"
                    >
                      {/* Welcome Card with animated gradient */}
                      <motion.div 
                        className="p-4 rounded-lg border relative overflow-hidden"
                        style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-10"
                          style={{ 
                            background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)` 
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="relative">
                          <div className="text-xs font-medium" style={{ color: primaryColor }}>
                            Welcome to
                          </div>
                          <div className="font-semibold text-foreground">
                            {state.brandName || 'Your Platform'}
                          </div>
                        </div>
                      </motion.div>

                      {/* Animated Goal Cards */}
                      <div className="space-y-2">
                        {state.businessGoals.slice(0, 3).map((goal, i) => (
                          <motion.div
                            key={goal}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            className="p-3 rounded-lg bg-muted/50 border border-border flex items-center gap-3"
                          >
                            <motion.div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: primaryColor }}
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <span className="text-xs text-muted-foreground capitalize flex-1">
                              {goal.replace(/-/g, ' ')}
                            </span>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + i * 0.15 }}
                            >
                              <TrendingUp size={12} className="text-green-500" />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Animated Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                          { label: 'Content', value: stats.content, icon: FileText },
                          { label: 'Users', value: stats.users, icon: Users },
                          { label: 'Views', value: stats.views, icon: Eye },
                        ].map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="p-3 rounded-lg bg-card border border-border text-center relative overflow-hidden"
                          >
                            <motion.div
                              className="absolute inset-0 opacity-5"
                              style={{ backgroundColor: primaryColor }}
                              animate={{ opacity: [0.05, 0.1, 0.05] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <div className="relative">
                              <stat.icon size={12} className="mx-auto mb-1 text-muted-foreground" />
                              <div className="text-lg font-bold" style={{ color: primaryColor }}>
                                {stat.value}
                              </div>
                              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Live activity feed */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-4 space-y-1"
                      >
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Live Activity</p>
                        {[1, 2].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: [0.5, 1, 0.5], x: 0 }}
                            transition={{ 
                              opacity: { duration: 2, repeat: Infinity, delay: i * 0.5 },
                              x: { delay: 0.9 + i * 0.1 }
                            }}
                            className="flex items-center gap-2 p-2 rounded bg-muted/30"
                          >
                            <div className="w-4 h-4 rounded-full bg-muted" />
                            <div className="flex-1 h-2 bg-muted rounded" />
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-center"
                      >
                        <LayoutDashboard size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Select a business type to see preview</p>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
