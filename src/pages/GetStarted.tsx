import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Check, GraduationCap, Building2, ShoppingBag, Users, FlaskConical, FileText, Globe, Zap, TrendingUp, LayoutDashboard, Bell, Settings, Search, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ZenithLogo } from '@/components/ZenithLogo';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { supabase } from '@/integrations/supabase/client';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type BusinessType = 'education' | 'agency' | 'product' | 'enterprise' | 'exploring';

const businessTypes = [
  { id: 'education', icon: GraduationCap, title: 'Education / Coaching', description: 'Courses, certifications, live classes', color: '#F97316' },
  { id: 'agency', icon: Building2, title: 'Agency / Services', description: 'Client work, portfolios, proposals', color: '#8B5CF6' },
  { id: 'product', icon: ShoppingBag, title: 'Product / Community', description: 'Memberships, digital products', color: '#10B981' },
  { id: 'enterprise', icon: Users, title: 'Internal Team / Enterprise', description: 'Team tools, knowledge base', color: '#3B82F6' },
  { id: 'exploring', icon: FlaskConical, title: 'Just Exploring', description: 'See what Zenith can do', color: '#6B7280' },
];

const STEPS = ['account', 'business-type', 'goals', 'complete'] as const;
type Step = typeof STEPS[number];

// Live Preview Component
const LivePreview = ({ businessType, businessGoals, fullName }: { businessType: BusinessType | null; businessGoals: string[]; fullName: string }) => {
  const [stats, setStats] = useState({ content: 0, users: 0, views: 0, growth: 0 });
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [notifications, setNotifications] = useState<number[]>([]);
  const [progressValues, setProgressValues] = useState([0, 0, 0]);

  const primaryColor = businessType === 'education' ? '#F97316' 
    : businessType === 'agency' ? '#8B5CF6' 
    : businessType === 'product' ? '#10B981' 
    : businessType === 'enterprise' ? '#3B82F6' 
    : '#6B7280';

  useEffect(() => {
    if (businessType) {
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
  }, [businessType]);

  useEffect(() => {
    if (businessType) {
      setTimeout(() => setProgressValues([85, 62, 94]), 500);
    }
  }, [businessType]);

  useEffect(() => {
    const timer = setInterval(() => setActiveMenuIndex((prev) => (prev + 1) % 5), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (businessType) {
      const timer = setInterval(() => {
        setNotifications(prev => {
          const newId = Date.now();
          const updated = [...prev, newId].slice(-3);
          setTimeout(() => setNotifications(p => p.filter(id => id !== newId)), 3000);
          return updated;
        });
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [businessType]);

  const menuIcons = [LayoutDashboard, FileText, Globe, GraduationCap, Zap];
  const menuLabels = ['Dashboard', 'Content', 'Website', 'Academy', 'Automations'];
  const brandName = fullName ? `${fullName.split(' ')[0]}'s Workspace` : 'Your Workspace';

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ZenithLogo size={28} />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Live Preview</h3>
              <p className="text-xs text-muted-foreground">Your platform is taking shape</p>
            </div>
          </div>
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
        <div className="rounded-xl border border-border bg-background overflow-hidden h-full relative shadow-lg">
          {/* Notifications */}
          <div className="absolute top-14 right-2 z-20 space-y-2">
            <AnimatePresence>
              {notifications.map((id) => (
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

          {/* Header */}
          <div className="h-10 border-b border-border flex items-center px-3 gap-2" style={{ backgroundColor: `${primaryColor}08` }}>
            <motion.div 
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="text-white text-[8px] font-bold">{brandName[0].toUpperCase()}</span>
            </motion.div>
            <span className="font-medium text-xs text-foreground truncate flex-1">{brandName}</span>
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
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </motion.div>
              <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
                <Settings size={10} className="text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex h-[calc(100%-2.5rem)]">
            {/* Sidebar */}
            <div className="w-12 border-r border-border p-1.5 space-y-1.5 bg-muted/30">
              {menuIcons.map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
                  style={activeMenuIndex === i ? { backgroundColor: `${primaryColor}15`, borderLeft: `2px solid ${primaryColor}` } : {}}
                >
                  <Icon size={14} style={activeMenuIndex === i ? { color: primaryColor } : {}} className={activeMenuIndex !== i ? 'text-muted-foreground' : ''} />
                  <span className="text-[7px] truncate" style={activeMenuIndex === i ? { color: primaryColor } : { color: 'hsl(var(--muted-foreground))' }}>{menuLabels[i]}</span>
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-3 overflow-hidden">
              {businessType ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 h-full">
                  {/* Welcome Card */}
                  <motion.div className="p-3 rounded-lg border relative overflow-hidden" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}>
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{ background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)` }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-medium" style={{ color: primaryColor }}>Welcome to</div>
                        <div className="font-semibold text-sm text-foreground">{brandName}</div>
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

                  {/* Stats Grid */}
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
                        className="p-2 rounded-lg bg-card border border-border text-center"
                      >
                        <stat.icon size={10} className="mx-auto mb-1" style={{ color: stat.color }} />
                        <div className="text-sm font-bold text-foreground">{stat.value}</div>
                        <div className="text-[8px] text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
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
                            transition={{ duration: 1, delay: 0.6 + i * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Goals */}
                  {businessGoals.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Your Goals</p>
                      {businessGoals.slice(0, 2).map((goal, i) => (
                        <motion.div
                          key={goal}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.15 }}
                          className="p-2 rounded-lg bg-muted/50 border border-border flex items-center gap-2"
                        >
                          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                          <span className="text-[9px] text-foreground truncate">{goal}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <div>
                    <ZenithLogo size={40} animated />
                    <p className="text-sm text-muted-foreground mt-4">Select your business type to see your preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSettingUp, setIsSettingUp] = useState(false);

  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const stepIndex = STEPS.indexOf(currentStep);

  useEffect(() => {
    if (user && currentStep === 'account') {
      setCurrentStep('business-type');
    }
  }, [user, currentStep]);

  const handleAccountSubmit = async () => {
    setErrors({});
    setIsLoading(true);

    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, formData.fullName);
    setIsLoading(false);
    
    if (error) {
      toast({ variant: 'destructive', title: 'Sign up failed', description: error.message });
    } else {
      setCurrentStep('business-type');
    }
  };

  const handleComplete = async () => {
    setIsSettingUp(true);
    
    if (user) {
      await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);

      const { data: profile } = await supabase.from('profiles').select('current_tenant_id').eq('id', user.id).single();

      if (profile?.current_tenant_id) {
        await supabase.from('tenants').update({
          business_type: businessType,
          business_goals: businessGoals,
        }).eq('id', profile.current_tenant_id);
      }
    }

    setTimeout(() => navigate('/admin'), 2000);
  };

  const goalOptions = businessType === 'education' 
    ? ['Create online courses', 'Sell certifications', 'Host live classes', 'Build a community']
    : businessType === 'agency'
    ? ['Showcase portfolio', 'Manage client projects', 'Send proposals', 'Track time & billing']
    : businessType === 'product'
    ? ['Sell digital products', 'Run a membership', 'Build a newsletter', 'Community forums']
    : businessType === 'enterprise'
    ? ['Internal knowledge base', 'Team collaboration', 'Training & onboarding', 'Process automation']
    : ['Explore all features', 'Test the platform', 'Learn the basics', 'Build a prototype'];

  const toggleGoal = (goal: string) => {
    setBusinessGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'account':
        return (
          <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create your account</h1>
              <p className="text-muted-foreground mt-2">Start your 30-day free trial</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" className="mt-1.5 h-11 bg-card border-border" />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" className="mt-1.5 h-11 bg-card border-border" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="h-11 pr-10 bg-card border-border" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>
              <Button onClick={handleAccountSubmit} className="w-full h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight size={16} className="ml-2" /></>}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link to="/auth" className="text-primary hover:underline">Sign in</Link>
              </p>
            </div>
          </motion.div>
        );

      case 'business-type':
        return (
          <motion.div key="business-type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">What kind of business are you running?</h1>
              <p className="text-muted-foreground mt-2">We'll customize your platform based on your needs</p>
            </div>
            <div className="grid gap-3">
              {businessTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setBusinessType(type.id as BusinessType)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${businessType === type.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-card'}`}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${type.color}15` }}>
                    <type.icon size={24} style={{ color: type.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  {businessType === type.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check size={14} className="text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            <Button onClick={() => setCurrentStep('goals')} disabled={!businessType} className="w-full h-11">
              Continue <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        );

      case 'goals':
        return (
          <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">What do you want to achieve?</h1>
              <p className="text-muted-foreground mt-2">Select all that apply</p>
            </div>
            <div className="grid gap-3">
              {goalOptions.map((goal, index) => (
                <motion.button
                  key={goal}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleGoal(goal)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${businessGoals.includes(goal) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${businessGoals.includes(goal) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {businessGoals.includes(goal) && <Check size={12} className="text-primary-foreground" />}
                  </div>
                  <span className="font-medium text-foreground">{goal}</span>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('business-type')} className="flex-1 h-11">
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
              <Button onClick={() => { setCurrentStep('complete'); handleComplete(); }} disabled={businessGoals.length === 0} className="flex-1 h-11">
                Complete Setup <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-8">
            <motion.div
              animate={isSettingUp ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: isSettingUp ? Infinity : 0, ease: 'linear' }}
              className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
            >
              {isSettingUp ? <Loader2 size={32} className="text-primary animate-spin" /> : <Check size={32} className="text-primary" />}
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{isSettingUp ? 'Setting up your workspace...' : 'Welcome to Zenith!'}</h1>
              <p className="text-muted-foreground mt-2">{isSettingUp ? 'This will only take a moment' : 'Your workspace is ready'}</p>
            </div>
            {isSettingUp && (
              <div className="space-y-3 max-w-xs mx-auto">
                {['Creating your workspace', 'Configuring modules', 'Setting up dashboard'].map((step, i) => (
                  <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.5 + 0.3 }}>
                      <Check size={16} className="text-green-500" />
                    </motion.div>
                    {step}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="h-16 flex items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <ZenithLogo size={32} />
            <span className="font-bold text-foreground group-hover:text-primary transition-colors">Zenith</span>
          </Link>
          <ThemeSwitcher />
        </motion.header>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stepIndex ? 'bg-primary' : 'bg-muted'}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block w-[480px] border-l border-border bg-card/50 backdrop-blur-sm"
      >
        <LivePreview businessType={businessType} businessGoals={businessGoals} fullName={formData.fullName} />
      </motion.div>
    </div>
  );
}
