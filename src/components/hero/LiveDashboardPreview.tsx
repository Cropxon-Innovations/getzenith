import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FileText, Send, BarChart3, Users, TrendingUp, Bell, 
  CheckCircle2, Clock, Edit3, Eye, Zap, Plus, 
  ArrowRight, Sparkles, Globe, BookOpen
} from 'lucide-react';

const notifications = [
  { id: 1, text: 'New signup from enterprise lead', icon: Users, type: 'success' },
  { id: 2, text: 'Blog post published successfully', icon: CheckCircle2, type: 'success' },
  { id: 3, text: 'Course completion rate up 24%', icon: TrendingUp, type: 'info' },
  { id: 4, text: 'Automation workflow triggered', icon: Zap, type: 'info' },
];

const contentItems = [
  { title: 'Getting Started Guide', status: 'published', views: '2.4k', icon: BookOpen },
  { title: 'Product Launch Blog', status: 'draft', views: '—', icon: FileText },
  { title: 'Q4 Marketing Campaign', status: 'scheduled', views: '—', icon: Globe },
];

const metrics = [
  { label: 'Total Views', value: 24580, change: '+12%', icon: Eye },
  { label: 'Engagements', value: 1842, change: '+8%', icon: Users },
  { label: 'Conversions', value: 156, change: '+24%', icon: TrendingUp },
];

export const LiveDashboardPreview = () => {
  const [activeNotification, setActiveNotification] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animatedMetrics, setAnimatedMetrics] = useState(metrics.map(m => ({ ...m, animatedValue: 0 })));
  const [activeTab, setActiveTab] = useState(0);
  
  const targetText = "Introducing our new AI-powered features for seamless content creation...";
  
  // Typing animation
  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= targetText.length) {
        setTypingText(targetText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setIsPublishing(true);
          setTimeout(() => {
            setIsPublishing(false);
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              setTypingText('');
              index = 0;
            }, 2000);
          }, 1500);
        }, 1000);
      }
    }, 60);
    
    return () => clearInterval(typeInterval);
  }, [showSuccess]);
  
  // Notification rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotification(prev => (prev + 1) % notifications.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Metrics animation
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      if (step <= steps) {
        setAnimatedMetrics(metrics.map(m => ({
          ...m,
          animatedValue: Math.floor((m.value * step) / steps)
        })));
        step++;
      } else {
        clearInterval(interval);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, []);
  
  // Tab rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative w-full max-w-[500px] mx-auto"
    >
      {/* Browser chrome */}
      <div className="rounded-xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
        {/* Browser header */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground">
              <Globe size={10} />
              <span>studio.zenith.app/dashboard</span>
              <motion.span 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-500"
              />
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <Bell size={14} className="text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </motion.div>
        </div>
        
        {/* Dashboard content */}
        <div className="p-4 bg-background min-h-[320px]">
          {/* Top notification bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNotification}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 mb-4"
            >
              {(() => {
                const NotifIcon = notifications[activeNotification].icon;
                return <NotifIcon size={14} className="text-primary" />;
              })()}
              <span className="text-xs text-foreground font-medium flex-1">
                {notifications[activeNotification].text}
              </span>
              <span className="text-[10px] text-muted-foreground">Just now</span>
            </motion.div>
          </AnimatePresence>
          
          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {animatedMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="p-2.5 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <metric.icon size={12} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-foreground">
                    {metric.animatedValue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-green-500 font-medium">{metric.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Tab navigation */}
          <div className="flex gap-1 mb-3">
            {['Content', 'Analytics', 'Automation'].map((tab, i) => (
              <motion.button
                key={tab}
                animate={{ 
                  backgroundColor: activeTab === i ? 'hsl(var(--primary))' : 'transparent',
                  color: activeTab === i ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))'
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                {tab}
              </motion.button>
            ))}
          </div>
          
          {/* Content area based on tab */}
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-2"
              >
                {/* Live editor preview */}
                <div className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Edit3 size={12} className="text-primary" />
                    <span className="text-xs font-medium text-foreground">Live Editor</span>
                    {isPublishing && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-auto text-[10px] text-primary flex items-center gap-1"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-3 h-3 border border-primary border-t-transparent rounded-full"
                        />
                        Publishing...
                      </motion.span>
                    )}
                    {showSuccess && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto text-[10px] text-green-500 flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        Published!
                      </motion.span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground min-h-[40px]">
                    {typingText}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-3 bg-primary ml-0.5 align-middle"
                    />
                  </div>
                </div>
                
                {/* Content list */}
                {contentItems.slice(0, 2).map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <item.icon size={14} className="text-muted-foreground" />
                    <span className="text-xs text-foreground flex-1">{item.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      item.status === 'published' ? 'bg-green-500/10 text-green-500' :
                      item.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {activeTab === 1 && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-3 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 size={12} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">Performance</span>
                </div>
                {/* Mini chart */}
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.05 * i, duration: 0.4 }}
                      className="flex-1 bg-primary/60 rounded-t hover:bg-primary transition-colors"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>Last 12 weeks</span>
                  <span className="text-green-500">+32% growth</span>
                </div>
              </motion.div>
            )}
            
            {activeTab === 2 && (
              <motion.div
                key="automation"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-3 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={12} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">Active Workflows</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Lead Nurture', runs: 156, status: 'active' },
                    { name: 'Content Distribution', runs: 89, status: 'active' },
                  ].map((workflow, i) => (
                    <motion.div
                      key={workflow.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center gap-2 p-2 rounded bg-muted/30"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        className="w-2 h-2 rounded-full bg-green-500"
                      />
                      <span className="text-xs text-foreground flex-1">{workflow.name}</span>
                      <span className="text-[10px] text-muted-foreground">{workflow.runs} runs</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium cursor-pointer"
            >
              <Plus size={12} />
              <span>Create</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-primary" />
            <span className="text-[10px] text-muted-foreground">AI-Powered</span>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center"
      >
        <Send size={14} className="text-primary" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center"
      >
        <BarChart3 size={10} className="text-accent" />
      </motion.div>
    </motion.div>
  );
};
