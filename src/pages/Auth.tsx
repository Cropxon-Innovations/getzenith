import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, Building2, Shield, Users, Zap, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ZenithLogo } from '@/components/ZenithLogo';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Separator } from '@/components/ui/separator';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Social login button component
interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

const SocialButton = ({ icon, label, onClick, disabled, comingSoon }: SocialButtonProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled || comingSoon}
    whileHover={{ scale: comingSoon ? 1 : 1.01 }}
    whileTap={{ scale: comingSoon ? 1 : 0.99 }}
    className="w-full h-12 px-4 rounded-xl border border-border bg-card hover:bg-secondary/50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors relative group"
  >
    <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
    <span className="text-sm font-medium text-foreground">{label}</span>
    {comingSoon && (
      <span className="absolute right-3 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
        Soon
      </span>
    )}
  </motion.button>
);

// Brand icons as SVG components
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-foreground">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const CropXonIcon = () => (
  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
    <span className="text-[10px] font-bold text-primary-foreground">C</span>
  </div>
);

const features = [
  { icon: Shield, text: 'Enterprise-grade security' },
  { icon: Users, text: 'Multi-tenant architecture' },
  { icon: Zap, text: 'AI-powered automation' },
];

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isSignUp) {
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
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Sign up failed',
            description: error.message,
          });
        } else {
          navigate('/admin/onboarding');
        }
      } else {
        const result = signInSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            fieldErrors[issue.path[0] as string] = issue.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Sign in failed',
            description: error.message,
          });
        } else {
          navigate('/admin');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/admin/onboarding`,
        },
      });
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComingSoon = (provider: string) => {
    toast({
      title: 'Coming Soon',
      description: `${provider} login will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Title */}
            <div className="text-center mb-6">
              <motion.h1 
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-foreground"
              >
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </motion.h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {isSignUp
                  ? 'Start your 30-day free trial'
                  : 'Sign in to your dashboard'}
              </p>
            </div>

            {/* Social Login Buttons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="space-y-2.5 mb-5"
            >
              <div className="grid grid-cols-2 gap-2.5">
                <SocialButton 
                  icon={<GoogleIcon />} 
                  label="Google"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                />
                <SocialButton 
                  icon={<MicrosoftIcon />} 
                  label="Microsoft"
                  onClick={() => handleComingSoon('Microsoft')}
                  comingSoon
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <SocialButton 
                  icon={<GitHubIcon />} 
                  label="GitHub"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                />
                <SocialButton 
                  icon={<CropXonIcon />} 
                  label="CropXon"
                  comingSoon
                />
              </div>
              
              {/* Enterprise SSO */}
              <SocialButton
                icon={<Building2 size={18} className="text-muted-foreground" />}
                label="Enterprise SSO"
                onClick={() => handleComingSoon('SSO')}
                comingSoon
              />
            </motion.div>

            {/* Divider */}
            <div className="relative mb-5">
              <Separator className="bg-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                or continue with email
              </span>
            </div>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-3.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="mt-1.5 h-11 bg-card border-border"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className="mt-1.5 h-11 bg-card border-border"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </motion.form>

            {/* Toggle */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-5 text-center"
            >
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <span className="font-medium text-primary">{isSignUp ? 'Sign in' : 'Sign up'}</span>
              </button>
            </motion.div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:flex w-[500px] bg-card border-l border-border flex-col items-center justify-center p-10"
      >
        {/* Animated visual */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
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

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground text-center mb-2">
          Your Business Operating System
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-8 max-w-xs">
          Everything you need to run your digital business from one unified platform.
        </p>

        {/* Features */}
        <div className="space-y-3 w-full max-w-xs">
          {features.map((feature, index) => (
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
              <CheckCircle2 size={14} className="text-green-500 ml-auto" />
            </motion.div>
          ))}
        </div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Shield size={14} className="text-green-500" />
          <span>SOC 2 Type II Certified</span>
          <span className="mx-2">•</span>
          <span>GDPR Compliant</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
