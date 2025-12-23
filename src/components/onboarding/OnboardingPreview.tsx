import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Globe, GraduationCap, Zap, LayoutDashboard, TrendingUp, Users, Eye, Activity, CheckCircle2, Bell, Settings, Search, ChevronRight } from 'lucide-react';
import type { OnboardingState } from '@/pages/Onboarding';
import { useEffect, useState } from 'react';
import { ZenithLogo } from '@/components/ZenithLogo';

interface OnboardingPreviewProps {
  state: OnboardingState;
  currentStep: string;
}

export const OnboardingPreview = ({ state, currentStep }: OnboardingPreviewProps) => {
  const primaryColor = state.primaryColor || '#3B82F6';
  const [stats, setStats] = useState({ content: 0, users: 0, views: 0, growth: 0 });
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [notifications, setNotifications] = useState<number[]>([]);
  const [progressValues, setProgressValues] = useState([0, 0, 0]);

  // Animate stats counting up
  useEffect(() => {
    if (state.businessType) {
      const targets = { content: 12, users: 48, views: 156, growth: 24 };
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
          growth: Math.round((targets.growth * step) / steps),
        });
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [state.businessType]);

  // Animate progress bars
  useEffect(() => {
    if (state.businessType) {
      const targets = [85, 62, 94];
      const timer = setTimeout(() => {
        setProgressValues(targets);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.businessType]);

  // Cycle through menu items for live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMenuIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Simulate notifications
  useEffect(() => {
    if (state.businessType) {
      const timer = setInterval(() => {
        setNotifications(prev => {
          const newId = Date.now();
          const updated = [...prev, newId].slice(-3);
          setTimeout(() => {
            setNotifications(p => p.filter(id => id !== newId));
          }, 3000);
          return updated;
        });
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [state.businessType]);

  // Pulse animation trigger
  useEffect(() => {
    if (currentStep === 'auto-config') {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const menuIcons = [LayoutDashboard, FileText, Globe, GraduationCap, Zap];
  const menuLabels = ['Dashboard', 'Content', 'Website', 'Academy', 'Automations'];

  return (
    <div className="h-full flex flex-col">
      {/* Header with logo */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ZenithLogo size={28} />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Live Preview</h3>
              <p className="text-xs text-muted-foreground">
                Your platform is taking shape
              </p>
            </div>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-[10px] font-medium text-green-600">LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
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
              className="rounded-xl border border-border bg-background overflow-hidden h-full relative shadow-lg"
              style={showPulse ? { boxShadow: `0 0 40px ${primaryColor}30` } : {}}
            >
              {/* Floating notifications */}
              <div className="absolute top-14 right-2 z-20 space-y-2">
                <AnimatePresence>
                  {notifications.map((id, i) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: 50, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.8 }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-card border border-border shadow-md text-xs"
                    >
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span className="text-foreground">New activity</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Configuration overlay animation */}
              <AnimatePresence>
                {currentStep === 'auto-config' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 bg-background/90 backdrop-blur-md flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-center"
                    >
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-primary/20"
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ZenithLogo size={32} animated={false} />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground">Configuring your platform...</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Setting up {state.businessType?.replace(/-/g, ' ')}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-3">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mock Header */}
              <div 
                className="h-10 border-b border-border flex items-center px-3 gap-2"
                style={{ backgroundColor: `${primaryColor}08` }}
              >
                <motion.div 
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                  animate={showPulse ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-white text-[8px] font-bold">
                    {(state.brandName || 'Y')[0].toUpperCase()}
                  </span>
                </motion.div>
                <span className="font-medium text-xs text-foreground truncate flex-1">
                  {state.brandName || 'Your Business'}
                </span>
                
                {/* Header actions */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
                    <Search size={10} className="text-muted-foreground" />
                  </div>
                  <motion.div 
                    className="w-5 h-5 rounded-md bg-muted flex items-center justify-center relative"
                    animate={{ scale: notifications.length > 0 ? [1, 1.1, 1] : 1 }}
                  >
                    <Bell size={10} className="text-muted-foreground" />
                    {notifications.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500"
                      />
                    )}
                  </motion.div>
                  <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
                    <Settings size={10} className="text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex h-[calc(100%-2.5rem)]">
                {/* Mock Sidebar with animated selection */}
                <div className="w-12 border-r border-border p-1.5 space-y-1.5 bg-muted/30">
                  {menuIcons.map((Icon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                      }}
                      transition={{ delay: i * 0.1, duration: 0.2 }}
                      className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        activeMenuIndex === i ? 'shadow-sm' : ''
                      }`}
                      style={activeMenuIndex === i ? { 
                        backgroundColor: `${primaryColor}15`,
                        borderLeft: `2px solid ${primaryColor}`
                      } : { 
                        backgroundColor: 'transparent' 
                      }}
                    >
                      <Icon 
                        size={14} 
                        style={activeMenuIndex === i ? { color: primaryColor } : {}} 
                        className={activeMenuIndex !== i ? 'text-muted-foreground' : ''}
                      />
                      <span 
                        className="text-[7px] truncate"
                        style={activeMenuIndex === i ? { color: primaryColor } : { color: 'hsl(var(--muted-foreground))' }}
                      >
                        {menuLabels[i]}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Mock Content Area */}
                <div className="flex-1 p-3 overflow-hidden">
                  {state.businessType ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3 h-full"
                    >
                      {/* Welcome Card with animated gradient */}
                      <motion.div 
                        className="p-3 rounded-lg border relative overflow-hidden"
                        style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-20"
                          style={{ 
                            background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)` 
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="relative flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-medium" style={{ color: primaryColor }}>
                              Welcome back to
                            </div>
                            <div className="font-semibold text-sm text-foreground">
                              {state.brandName || 'Your Platform'}
                            </div>
                          </div>
                          <motion.div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <TrendingUp size={14} style={{ color: primaryColor }} />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'Content', value: stats.content, icon: FileText, color: primaryColor },
                          { label: 'Users', value: stats.users, icon: Users, color: '#22c55e' },
                          { label: 'Views', value: stats.views, icon: Eye, color: '#8b5cf6' },
                          { label: 'Growth', value: `${stats.growth}%`, icon: TrendingUp, color: '#f59e0b' },
                        ].map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="p-2 rounded-lg bg-card border border-border text-center relative overflow-hidden"
                          >
                            <stat.icon size={10} className="mx-auto mb-1" style={{ color: stat.color }} />
                            <div className="text-sm font-bold text-foreground">{stat.value}</div>
                            <div className="text-[8px] text-muted-foreground">{stat.label}</div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Progress indicators */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                      >
                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Performance</p>
                        {['Engagement', 'Completion', 'Satisfaction'].map((label, i) => (
                          <div key={label} className="space-y-1">
                            <div className="flex justify-between text-[8px]">
                              <span className="text-muted-foreground">{label}</span>
                              <span className="font-medium text-foreground">{progressValues[i]}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: primaryColor }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressValues[i]}%` }}
                                transition={{ duration: 1, delay: 0.6 + i * 0.2, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </motion.div>

                      {/* Goal Cards */}
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Active Goals</p>
                        {state.businessGoals.slice(0, 2).map((goal, i) => (
                          <motion.div
                            key={goal}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.15 }}
                            className="p-2 rounded-lg bg-muted/50 border border-border flex items-center gap-2 group hover:bg-muted/70 transition-colors"
                          >
                            <motion.div 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: primaryColor }}
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <span className="text-[10px] text-muted-foreground capitalize flex-1 truncate">
                              {goal.replace(/-/g, ' ')}
                            </span>
                            <ChevronRight size={10} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Live activity feed */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center gap-1">
                          <Activity size={10} className="text-muted-foreground" />
                          <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</p>
                        </div>
                        {[1, 2].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7 }}
                            className="flex items-center gap-2 p-1.5 rounded bg-muted/30"
                          >
                            <div className="w-4 h-4 rounded-full bg-muted" />
                            <div className="flex-1 space-y-1">
                              <div className="h-1.5 bg-muted rounded w-3/4" />
                              <div className="h-1 bg-muted/70 rounded w-1/2" />
                            </div>
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
                        <div className="relative w-16 h-16 mx-auto mb-3">
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <LayoutDashboard size={24} className="opacity-50" />
                          </div>
                        </div>
                        <p className="text-xs">Select a business type</p>
                        <p className="text-[10px] text-muted-foreground/70">to see your preview</p>
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
