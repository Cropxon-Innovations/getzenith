import { useState, useEffect } from 'react';
import { differenceInDays, format } from 'date-fns';
import { Clock, Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

export const TrialBadge = () => {
  const { tenant } = useAuth();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);

  useEffect(() => {
    if (tenant?.trial_ends_at) {
      const endDate = new Date(tenant.trial_ends_at);
      const today = new Date();
      const days = differenceInDays(endDate, today);
      setDaysLeft(Math.max(0, days));
      setTrialEndDate(format(endDate, 'MMM d, yyyy'));
    } else {
      setDaysLeft(null);
      setTrialEndDate(null);
    }
  }, [tenant?.trial_ends_at]);

  const getPlanIcon = () => {
    switch (tenant?.plan) {
      case 'enterprise':
        return <Crown size={14} className="text-amber-500" />;
      case 'pro':
        return <Sparkles size={14} className="text-primary" />;
      default:
        return <Clock size={14} />;
    }
  };

  const getPlanLabel = () => {
    switch (tenant?.plan) {
      case 'enterprise':
        return 'Enterprise';
      case 'pro':
        return 'Pro';
      default:
        return 'Free Trial';
    }
  };

  const getBadgeVariant = () => {
    if (tenant?.plan === 'enterprise' || tenant?.plan === 'pro') {
      return 'default';
    }
    if (daysLeft !== null && daysLeft <= 7) {
      return 'destructive';
    }
    return 'secondary';
  };

  if (!tenant) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant()} className="flex items-center gap-1.5 px-2.5 py-1">
              {getPlanIcon()}
              <span className="font-medium">{getPlanLabel()}</span>
              {daysLeft !== null && tenant?.plan === 'free' && (
                <span className="text-xs opacity-80">
                  • {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                </span>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{getPlanLabel()} Plan</p>
            {daysLeft !== null && tenant?.plan === 'free' && (
              <>
                <p className="text-sm text-muted-foreground">
                  Your trial ends on {trialEndDate}
                </p>
                <p className="text-xs text-muted-foreground">
                  {daysLeft > 0 
                    ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} remaining`
                    : 'Trial expired - Upgrade now!'
                  }
                </p>
              </>
            )}
            {(tenant?.plan === 'pro' || tenant?.plan === 'enterprise') && (
              <p className="text-sm text-muted-foreground">
                Full access to all features
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
