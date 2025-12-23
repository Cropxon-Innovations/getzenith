import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Check, GraduationCap, Building2, ShoppingBag, Users, FlaskConical, Shield, Zap } from 'lucide-react';
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

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
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
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message,
      });
    } else {
      setCurrentStep('business-type');
    }
  };

  const handleComplete = async () => {
    setIsSettingUp(true);
    
    if (user) {
      await supabase.from('profiles').update({
        onboarding_completed: true
      }).eq('id', user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('current_tenant_id')
        .eq('id', user.id)
        .single();

      if (profile?.current_tenant_id) {
        await supabase.from('tenants').update({
          business_type: businessType,
          business_goals: businessGoals,
        }).eq('id', profile.current_tenant_id);
      }
    }

    setTimeout(() => {
      navigate('/admin');
    }, 2000);
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
    setBusinessGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal) 
        : [...prev, goal]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'account':
        return (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create your account</h1>
              <p className="text-muted-foreground mt-2">Start your 30-day free trial</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1.5 h-11 bg-card border-border"
                />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className="mt-1.5 h-11 bg-card border-border"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="h-11 pr-10 bg-card border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>

              <Button onClick={handleAccountSubmit} className="w-full h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight size={16} className="ml-2" /></>}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/auth" className="text-primary hover:underline">Sign in</Link>
              </p>
            </div>
          </motion.div>
        );

      case 'business-type':
        return (
          <motion.div
            key="business-type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
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
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                    businessType === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-card'
                  }`}
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
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
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
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                    businessGoals.includes(goal)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    businessGoals.includes(goal) ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`}>
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
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 text-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: isSettingUp ? Infinity : 0, ease: 'linear' }}
              className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
            >
              {isSettingUp ? (
                <Loader2 size={32} className="text-primary animate-spin" />
              ) : (
                <Check size={32} className="text-primary" />
              )}
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isSettingUp ? 'Setting up your workspace...' : 'Welcome to Zenith!'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isSettingUp ? 'This will only take a moment' : 'Your workspace is ready'}
              </p>
            </div>

            {isSettingUp && (
              <div className="space-y-3 max-w-xs mx-auto">
                {['Creating your workspace', 'Configuring modules', 'Setting up dashboard'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.5 + 0.3 }}
                    >
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
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 flex items-center justify-between px-4 sm:px-8"
        >
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
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= stepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-[500px] bg-card border-l border-border flex-col items-center justify-center p-10"
      >
        <div className="relative mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-48 h-48 rounded-full border border-dashed border-border relative"
          >
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border border-primary/30"
            />
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
            >
              <ZenithLogo size={48} animated />
            </motion.div>
          </motion.div>
        </div>

        <h2 className="text-xl font-bold text-foreground text-center mb-2">Your Business Operating System</h2>
        <p className="text-muted-foreground text-center text-sm mb-8 max-w-xs">
          Everything you need to run your digital business from one unified platform.
        </p>

        <div className="space-y-3 w-full max-w-xs">
          {[{ icon: Shield, text: 'Enterprise-grade security' }, { icon: Zap, text: 'AI-powered automation' }].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon size={16} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{feature.text}</span>
              <Check size={14} className="text-green-500 ml-auto" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
