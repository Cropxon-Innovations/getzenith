import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, X, Zap, Users, Building2, Crown, ArrowRight,
  Star, Shield, Clock, Infinity, ChevronDown, HelpCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for solo creators and small teams getting started',
    icon: Zap,
    color: '#3B82F6',
    pricing: {
      solo: { monthly: 29, yearly: 24 },
      team: { monthly: 19, yearly: 15, perUser: true },
    },
    features: [
      { name: '1 Studio (CMS, Website, or LMS)', included: true },
      { name: 'Up to 5 team members', included: true },
      { name: '10,000 content items', included: true },
      { name: '50GB storage', included: true },
      { name: 'Basic automation (10 workflows)', included: true },
      { name: 'Community support', included: true },
      { name: 'API access (1,000 req/min)', included: true },
      { name: 'Custom domain', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'SSO / SAML', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For growing businesses that need more power and flexibility',
    icon: Star,
    color: '#8B5CF6',
    pricing: {
      solo: { monthly: 99, yearly: 79 },
      team: { monthly: 49, yearly: 39, perUser: true },
    },
    features: [
      { name: 'All Studios included', included: true },
      { name: 'Up to 25 team members', included: true },
      { name: 'Unlimited content items', included: true },
      { name: '500GB storage', included: true },
      { name: 'Advanced automation (100 workflows)', included: true },
      { name: 'Email support', included: true },
      { name: 'API access (10,000 req/min)', included: true },
      { name: 'Custom domain', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'SSO / SAML', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced security and compliance needs',
    icon: Building2,
    color: '#10B981',
    pricing: {
      custom: true,
    },
    features: [
      { name: 'All Studios included', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Unlimited content items', included: true },
      { name: 'Unlimited storage', included: true },
      { name: 'Unlimited automation', included: true },
      { name: 'Dedicated support manager', included: true },
      { name: 'Unlimited API access', included: true },
      { name: 'Custom domain', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'SSO / SAML', included: true },
      { name: 'Priority support (SLA)', included: true },
      { name: 'Custom integrations', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What happens after my 30-day trial?',
    answer: 'After your trial ends, you can choose to continue with a paid plan or downgrade to our limited free tier. Your data is always preserved, and you can upgrade anytime.'
  },
  {
    question: 'Can I change plans at any time?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
  },
  {
    question: 'Is there any lock-in?',
    answer: 'No lock-in whatsoever. You can export your data at any time, and with BYOB (Bring Your Own Backend), your data stays in your infrastructure.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and for Enterprise customers, we offer invoicing and bank transfers.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.'
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [teamType, setTeamType] = useState<'solo' | 'team'>('solo');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <>
      <SEO 
        title="Pricing | Zenith Studio"
        description="Simple, transparent pricing. Start with a 30-day free trial. No credit card required. Upgrade or downgrade anytime."
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="pt-20">
          {/* Hero */}
          <section className="py-16 sm:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-3xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-sm font-medium text-green-500 mb-6">
                  <Clock size={16} />
                  30-Day Free Trial • No Credit Card Required
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Simple, Transparent{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Pricing
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                  Start free, scale as you grow. No hidden fees, no lock-in. 
                  Upgrade or downgrade anytime.
                </p>

                {/* Billing Toggle */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  {/* Team Type */}
                  <div className="flex items-center gap-2 p-1 rounded-lg bg-secondary/50 border border-border">
                    <button
                      onClick={() => setTeamType('solo')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        teamType === 'solo'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Solo
                    </button>
                    <button
                      onClick={() => setTeamType('team')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        teamType === 'team'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Team
                    </button>
                  </div>

                  {/* Billing Cycle */}
                  <div className="flex items-center gap-2 p-1 rounded-lg bg-secondary/50 border border-border">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        billingCycle === 'monthly'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        billingCycle === 'yearly'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Yearly
                      <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-bold">
                        -20%
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-12 -mt-8">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-2xl border transition-all ${
                      plan.popular
                        ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        Most Popular
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${plan.color}15` }}
                      >
                        <plan.icon size={24} style={{ color: plan.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                    {/* Pricing */}
                    <div className="mb-6">
                      {'custom' in plan.pricing ? (
                        <div>
                          <span className="text-3xl font-bold text-foreground">Custom</span>
                          <p className="text-sm text-muted-foreground mt-1">Tailored to your needs</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-foreground">
                              ${teamType === 'solo' 
                                ? plan.pricing.solo[billingCycle]
                                : plan.pricing.team[billingCycle]
                              }
                            </span>
                            <span className="text-muted-foreground">
                              /{teamType === 'team' && plan.pricing.team.perUser ? 'user/' : ''}{billingCycle === 'monthly' ? 'mo' : 'mo'}
                            </span>
                          </div>
                          {billingCycle === 'yearly' && (
                            <p className="text-sm text-green-500 mt-1">
                              Billed annually (save 20%)
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <Link to="/get-started">
                      <Button 
                        className={`w-full mb-6 ${
                          plan.popular 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.cta}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div 
                          key={i}
                          className={`flex items-center gap-2 text-sm ${
                            feature.included ? 'text-foreground' : 'text-muted-foreground/50'
                          }`}
                        >
                          {feature.included ? (
                            <Check size={16} className="text-green-500 flex-shrink-0" />
                          ) : (
                            <X size={16} className="flex-shrink-0" />
                          )}
                          <span>{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Signals */}
          <section className="py-16 border-y border-border bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  { icon: Shield, label: 'SOC 2 Compliant', description: 'Enterprise security' },
                  { icon: Infinity, label: 'No Lock-in', description: 'Export anytime' },
                  { icon: Clock, label: '30-Day Trial', description: 'Full access, no card' },
                  { icon: Users, label: '10,000+ Teams', description: 'Trust Zenith' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <item.icon size={28} className="text-primary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground">{item.label}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Everything you need to know about pricing</p>
              </motion.div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left bg-card hover:bg-secondary/50 transition-colors"
                    >
                      <span className="font-medium text-foreground">{faq.question}</span>
                      <ChevronDown 
                        size={20} 
                        className={`text-muted-foreground transition-transform ${
                          expandedFaq === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 sm:py-24 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Ready to get started?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Start your 30-day free trial today. No credit card required. 
                  Full access to all features.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/get-started">
                    <Button size="lg" className="gap-2">
                      Start Free Trial <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link to="/docs">
                    <Button size="lg" variant="outline">
                      View Documentation
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;
