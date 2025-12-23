import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZenithLogo } from '@/components/ZenithLogo';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type ConfirmationState = 'waiting' | 'success' | 'error';

export default function EmailConfirmation() {
  const [state, setState] = useState<ConfirmationState>('waiting');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  
  const email = searchParams.get('email') || user?.email || '';

  // Check if user is already verified
  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.email_confirmed_at) {
        setState('success');
        setTimeout(() => navigate('/admin/onboarding'), 2000);
      }
    };
    
    checkVerification();
    
    // Poll for verification status
    const interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0 || !email) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/onboarding`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email sent!',
        description: 'Check your inbox for the verification link.',
      });
      setCountdown(60);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to resend',
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          {state === 'waiting' && (
            <>
              {/* Animated Email Icon */}
              <motion.div
                className="relative mx-auto w-24 h-24 mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center">
                  <Mail size={40} className="text-primary" />
                </div>
                {/* Pulsing dot */}
                <motion.div
                  className="absolute top-2 right-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-background"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Check your email
              </h1>
              <p className="text-muted-foreground mb-2">
                We've sent a verification link to
              </p>
              <p className="text-foreground font-medium mb-8 bg-muted px-4 py-2 rounded-lg inline-block">
                {email || 'your email address'}
              </p>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to verify your account and continue setup.
                </p>
                
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isResending || countdown > 0}
                    className="w-full"
                  >
                    {isResending ? (
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                    ) : (
                      <Mail size={16} className="mr-2" />
                    )}
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification email'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/auth')}
                    className="w-full text-muted-foreground"
                  >
                    Use a different email
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border text-left">
                <p className="text-sm font-medium text-foreground mb-2">Didn't receive the email?</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>
            </>
          )}

          {state === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="mx-auto w-24 h-24 mb-8 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle2 size={48} className="text-green-500" />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Email verified!
              </h1>
              <p className="text-muted-foreground mb-8">
                Your account has been verified. Redirecting to onboarding...
              </p>

              <Button onClick={() => navigate('/admin/onboarding')} className="w-full">
                Continue to Setup
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </>
          )}

          {state === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto w-24 h-24 mb-8 rounded-full bg-destructive/20 flex items-center justify-center"
              >
                <AlertCircle size={48} className="text-destructive" />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Verification failed
              </h1>
              <p className="text-muted-foreground mb-8">
                The verification link may have expired or is invalid.
              </p>

              <div className="space-y-3">
                <Button onClick={handleResendEmail} className="w-full">
                  <RefreshCw size={16} className="mr-2" />
                  Send new verification email
                </Button>
                <Button variant="outline" onClick={() => navigate('/auth')} className="w-full">
                  Back to Sign In
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
