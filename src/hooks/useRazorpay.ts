import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Plan = 'starter' | 'professional' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export const useRazorpay = () => {
  const { tenant, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiateCheckout = useCallback(
    async (plan: Plan, billingCycle: BillingCycle) => {
      if (!tenant || !user) {
        toast({
          title: 'Error',
          description: 'Please log in to continue',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);

      try {
        // Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Failed to load payment gateway');
        }

        // Create order via edge function
        const { data, error } = await supabase.functions.invoke('razorpay-checkout', {
          body: { plan, billingCycle, tenantId: tenant.id },
        });

        if (error) throw error;

        const { orderId, amount, currency, keyId, prefill, notes } = data;

        // Open Razorpay checkout
        const options: RazorpayOptions = {
          key: keyId,
          amount,
          currency,
          order_id: orderId,
          name: 'Zenith Platform',
          description: `${notes.plan} Plan - ${notes.billingCycle === 'yearly' ? 'Annual' : 'Monthly'} Subscription`,
          prefill: {
            name: prefill.name,
            email: user.email,
          },
          theme: {
            color: '#3B82F6',
          },
          handler: async (response: RazorpayResponse) => {
            console.log('Payment successful:', response);
            toast({
              title: 'Payment Successful!',
              description: 'Your subscription is now active. Refreshing...',
            });
            // Refresh profile to get updated plan
            await refreshProfile();
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
              toast({
                title: 'Payment Cancelled',
                description: 'You can retry anytime.',
              });
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error: any) {
        console.error('Checkout error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to initiate payment',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [tenant, user, loadRazorpayScript, toast, refreshProfile]
  );

  return {
    initiateCheckout,
    isLoading,
  };
};
