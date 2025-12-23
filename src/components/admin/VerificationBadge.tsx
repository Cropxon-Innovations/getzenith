import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

interface VerificationBadgeProps {
  type: 'email' | 'phone';
  status: VerificationStatus;
  value?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  verified: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: 'Verified',
    pulse: false,
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    label: 'Pending',
    pulse: true,
  },
  unverified: {
    icon: AlertCircle,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-muted',
    label: 'Not verified',
    pulse: false,
  },
};

const sizeConfig = {
  sm: { badge: 'w-5 h-5', icon: 12, text: 'text-xs' },
  md: { badge: 'w-6 h-6', icon: 14, text: 'text-sm' },
  lg: { badge: 'w-8 h-8', icon: 18, text: 'text-base' },
};

export const VerificationBadge = forwardRef<HTMLDivElement, VerificationBadgeProps>(
  function VerificationBadge({ 
    type, 
    status, 
    value, 
    className,
    showLabel = false,
    size = 'md'
  }, ref) {
    const config = statusConfig[status];
    const sizeStyles = sizeConfig[size];
    const TypeIcon = type === 'email' ? Mail : Phone;
    const StatusIcon = config.icon;

    const tooltipText = `${type === 'email' ? 'Email' : 'Phone'}: ${config.label}${value ? ` (${value})` : ''}`;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            ref={ref}
            className={cn(
              'inline-flex items-center gap-2 px-2 py-1 rounded-full border transition-colors cursor-default',
              config.bgColor,
              config.borderColor,
              className
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative">
              <TypeIcon size={sizeStyles.icon} className={config.color} />
              {config.pulse && (
                <motion.div
                  className={cn('absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-500')}
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
            
            {showLabel && (
              <span className={cn('font-medium', config.color, sizeStyles.text)}>
                {config.label}
              </span>
            )}
            
            <StatusIcon size={sizeStyles.icon - 2} className={config.color} />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

interface VerificationStatusCardProps {
  emailStatus: VerificationStatus;
  phoneStatus: VerificationStatus;
  email?: string;
  phone?: string;
  onVerifyEmail?: () => void;
  onVerifyPhone?: () => void;
}

export function VerificationStatusCard({
  emailStatus,
  phoneStatus,
  email,
  phone,
  onVerifyEmail,
  onVerifyPhone,
}: VerificationStatusCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-3">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <CheckCircle2 size={16} className="text-primary" />
        Verification Status
      </h4>
      
      <div className="space-y-2">
        {/* Email Verification */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Mail size={16} className={statusConfig[emailStatus].color} />
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              {email && <p className="text-xs text-muted-foreground truncate max-w-[150px]">{email}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <VerificationBadge type="email" status={emailStatus} size="sm" />
            {emailStatus !== 'verified' && onVerifyEmail && (
              <motion.button
                onClick={onVerifyEmail}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs font-medium text-primary hover:underline"
              >
                Verify
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Phone Verification */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Phone size={16} className={statusConfig[phoneStatus].color} />
            <div>
              <p className="text-sm font-medium text-foreground">Phone</p>
              {phone && <p className="text-xs text-muted-foreground">{phone}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <VerificationBadge type="phone" status={phoneStatus} size="sm" />
            {phoneStatus !== 'verified' && onVerifyPhone && (
              <motion.button
                onClick={onVerifyPhone}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs font-medium text-primary hover:underline"
              >
                Verify
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
