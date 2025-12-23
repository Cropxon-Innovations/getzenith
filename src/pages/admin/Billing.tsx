import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Crown,
  Sparkles,
  Check,
  Download,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Database,
  Cloud,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useRazorpay, Plan, BillingCycle } from '@/hooks/useRazorpay';

const plans = [
  {
    id: 'starter' as Plan,
    name: 'Starter',
    priceMonthly: 999,
    priceYearly: 9999,
    currency: '₹',
    description: 'Perfect for small businesses getting started',
    features: [
      '5 team members',
      '10 GB storage',
      'Basic analytics',
      'Email support',
      '1 custom domain',
    ],
    popular: false,
  },
  {
    id: 'professional' as Plan,
    name: 'Professional',
    priceMonthly: 2499,
    priceYearly: 24999,
    currency: '₹',
    description: 'For growing teams that need more power',
    features: [
      '25 team members',
      '100 GB storage',
      'Advanced analytics',
      'Priority support',
      '5 custom domains',
      'API access',
      'White-label branding',
    ],
    popular: true,
  },
  {
    id: 'enterprise' as Plan,
    name: 'Enterprise',
    priceMonthly: 4999,
    priceYearly: 49999,
    currency: '₹',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited team members',
      'Unlimited storage',
      'Custom analytics',
      '24/7 dedicated support',
      'Unlimited domains',
      'Full API access',
      'SSO & SAML',
      'Custom integrations',
      'Messaging Hub',
      'Video Meetings',
    ],
    popular: false,
  },
];

const paymentHistory = [
  { id: '1', date: '2024-06-01', amount: 79, status: 'paid', invoice: 'INV-2024-0612' },
  { id: '2', date: '2024-05-01', amount: 79, status: 'paid', invoice: 'INV-2024-0511' },
  { id: '3', date: '2024-04-01', amount: 79, status: 'paid', invoice: 'INV-2024-0410' },
  { id: '4', date: '2024-03-01', amount: 79, status: 'paid', invoice: 'INV-2024-0309' },
  { id: '5', date: '2024-02-01', amount: 29, status: 'paid', invoice: 'INV-2024-0208' },
];

const usageMetrics = [
  { label: 'Team Members', used: 12, limit: 25, icon: Users, color: 'text-blue-500' },
  { label: 'Storage', used: 45, limit: 100, unit: 'GB', icon: Database, color: 'text-green-500' },
  { label: 'API Calls', used: 8500, limit: 50000, icon: Cloud, color: 'text-purple-500' },
  { label: 'Content Items', used: 234, limit: 1000, icon: FileText, color: 'text-orange-500' },
];

export default function Billing() {
  const { tenant } = useAuth();
  const { toast } = useToast();
  const { initiateCheckout, isLoading: isPaymentLoading } = useRazorpay();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('professional');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;
  
  const isTrialExpired = trialDaysLeft <= 0;
  const currentPlan = tenant?.plan || 'trial';

  const handleUpgrade = async (planId: Plan) => {
    setSelectedPlan(planId);
    await initiateCheckout(planId, billingCycle);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: 'Downloading Invoice',
      description: `Downloading ${invoiceId}...`,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
            <p className="text-muted-foreground">Manage your plan, usage, and payment methods</p>
          </div>
          <div className="flex items-center gap-3">
            {currentPlan === 'trial' && (
              <Badge variant="secondary" className={isTrialExpired ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}>
                <Clock size={14} className="mr-1" />
                {isTrialExpired ? 'Trial Expired' : `${trialDaysLeft} days left`}
              </Badge>
            )}
          </div>
        </div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20">
            <CardContent className="py-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Crown size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {currentPlan === 'trial' ? 'Free Trial' : 'Professional Plan'}
                    </h3>
                    {currentPlan !== 'trial' && (
                      <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {currentPlan === 'trial'
                      ? isTrialExpired
                        ? 'Your trial has expired. Upgrade now to continue using all features.'
                        : `You have ${trialDaysLeft} days left in your trial. Upgrade anytime to unlock premium features.`
                      : 'Next billing date: July 1, 2024 • $79.00/month'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline">
                    <CreditCard size={16} className="mr-2" />
                    Manage Payment
                  </Button>
                  <Button>
                    <Sparkles size={16} className="mr-2" />
                    {currentPlan === 'trial' ? 'Upgrade Now' : 'Change Plan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="usage" className="space-y-6">
          <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3 gap-2">
            <TabsTrigger value="usage" className="gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Usage</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="gap-2">
              <Zap size={16} />
              <span className="hidden sm:inline">Plans</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {usageMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <metric.icon size={20} className={metric.color} />
                        </div>
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-bold text-foreground">
                            {metric.used.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {metric.limit.toLocaleString()} {metric.unit || ''}
                          </span>
                        </div>
                        <Progress value={(metric.used / metric.limit) * 100} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round((metric.used / metric.limit) * 100)}% used
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Usage Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Usage Trends
                  </CardTitle>
                  <CardDescription>Your usage over the past 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'API Calls', trend: '+12%', value: '8,500' },
                      { label: 'Storage', trend: '+5%', value: '45 GB' },
                      { label: 'Active Users', trend: '+8%', value: '12' },
                      { label: 'Content Views', trend: '+23%', value: '15,234' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.value}</span>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            {item.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    Plan Features
                  </CardTitle>
                  <CardDescription>Features included in your current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { feature: 'Team Members', included: true, limit: '25' },
                      { feature: 'Storage Space', included: true, limit: '100 GB' },
                      { feature: 'Custom Domains', included: true, limit: '5' },
                      { feature: 'API Access', included: true, limit: 'Unlimited' },
                      { feature: 'White-label', included: true, limit: 'Yes' },
                      { feature: 'SSO / SAML', included: false, limit: 'Enterprise' },
                    ].map((item) => (
                      <div key={item.feature} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          {item.included ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <AlertCircle size={16} className="text-muted-foreground" />
                          )}
                          <span className={item.included ? 'text-foreground' : 'text-muted-foreground'}>
                            {item.feature}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.limit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          <Sparkles size={12} className="mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.currency}{billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                        </span>
                        <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      </div>
                      
                      <Separator />
                      
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check size={16} className="text-green-500 shrink-0" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                        <ChevronRight size={16} className="ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { q: 'Can I change plans at any time?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
                  { q: 'What happens if I exceed my limits?', a: 'We\'ll notify you when you\'re close to your limits. You can upgrade or purchase add-ons as needed.' },
                  { q: 'Do you offer annual billing?', a: 'Yes! Annual billing saves you 20% compared to monthly billing.' },
                ].map((faq) => (
                  <div key={faq.q} className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium text-foreground mb-1">{faq.q}</p>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText size={20} className="text-primary" />
                      Payment History
                    </CardTitle>
                    <CardDescription>View and download your invoices</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download size={16} className="mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle size={20} className="text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{payment.invoice}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-foreground">${payment.amount}.00</span>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          Paid
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(payment.invoice)}
                        >
                          <Download size={14} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" />
                  Payment Method
                </CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Default</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  <CreditCard size={16} className="mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
