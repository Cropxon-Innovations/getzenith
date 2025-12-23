import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, Building2 } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ZenithLogo } from '@/components/ZenithLogo';
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
  <Button
    type="button"
    variant="outline"
    className="w-full h-11 gap-3 relative group"
    onClick={onClick}
    disabled={disabled || comingSoon}
  >
    {icon}
    <span className="text-sm">{label}</span>
    {comingSoon && (
      <span className="absolute right-2 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
        Soon
      </span>
    )}
  </Button>
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
  <div className="w-[18px] h-[18px] rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
    <span className="text-[10px] font-bold text-primary-foreground">C</span>
  </div>
);

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

  const handleSocialLogin = (provider: string) => {
    toast({
      title: 'Coming Soon',
      description: `${provider} login will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <ZenithLogo size={48} className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp
                ? 'Start building your business platform'
                : 'Sign in to continue to your dashboard'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <SocialButton 
              icon={<GoogleIcon />} 
              label="Continue with Google"
              onClick={() => handleSocialLogin('Google')}
            />
            <SocialButton 
              icon={<MicrosoftIcon />} 
              label="Continue with Microsoft"
              onClick={() => handleSocialLogin('Microsoft')}
            />
            <SocialButton 
              icon={<GitHubIcon />} 
              label="Continue with GitHub"
              onClick={() => handleSocialLogin('GitHub')}
            />
            <SocialButton 
              icon={<CropXonIcon />} 
              label="CropXon One Auth"
              comingSoon
            />
            
            {/* Enterprise SSO */}
            <Button
              type="button"
              variant="ghost"
              className="w-full h-11 gap-3 text-muted-foreground hover:text-foreground"
              onClick={() => handleSocialLogin('SSO')}
            >
              <Building2 size={18} />
              <span className="text-sm">Enterprise SSO</span>
              <ArrowRight size={14} className="ml-auto" />
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1.5"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1.5"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
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
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-lg text-center"
        >
          <div className="w-64 h-64 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <motion.div 
                className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/40 to-primary/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Your Business Operating System
          </h2>
          <p className="text-muted-foreground">
            Zenith Studio understands your business and builds the system for you. 
            No configuration needed.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
