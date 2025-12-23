import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

const comparisonFeatures = [
  {
    category: 'Studios & Content',
    features: [
      { name: 'CMS Studio', starter: true, growth: true, enterprise: true },
      { name: 'Website Builder', starter: false, growth: true, enterprise: true },
      { name: 'LMS Studio', starter: false, growth: true, enterprise: true },
      { name: 'Automation Hub', starter: 'Basic', growth: 'Advanced', enterprise: 'Unlimited' },
      { name: 'Content Items', starter: '10,000', growth: 'Unlimited', enterprise: 'Unlimited' },
    ]
  },
  {
    category: 'Team & Collaboration',
    features: [
      { name: 'Team Members', starter: '5', growth: '25', enterprise: 'Unlimited' },
      { name: 'Role-Based Access', starter: true, growth: true, enterprise: true },
      { name: 'Content Workflows', starter: 'Basic', growth: 'Advanced', enterprise: 'Custom' },
      { name: 'Version History', starter: '30 days', growth: '1 year', enterprise: 'Unlimited' },
      { name: 'Real-time Collaboration', starter: false, growth: true, enterprise: true },
    ]
  },
  {
    category: 'Infrastructure',
    features: [
      { name: 'Storage', starter: '50GB', growth: '500GB', enterprise: 'Unlimited' },
      { name: 'Bandwidth', starter: '100GB/mo', growth: '1TB/mo', enterprise: 'Unlimited' },
      { name: 'Custom Domain', starter: true, growth: true, enterprise: true },
      { name: 'SSL Certificate', starter: true, growth: true, enterprise: true },
      { name: 'CDN', starter: true, growth: true, enterprise: 'Premium' },
    ]
  },
  {
    category: 'API & Integrations',
    features: [
      { name: 'API Access', starter: '1K req/min', growth: '10K req/min', enterprise: 'Unlimited' },
      { name: 'Webhooks', starter: '10', growth: '100', enterprise: 'Unlimited' },
      { name: 'BYOB (Bring Your Own Backend)', starter: false, growth: true, enterprise: true },
      { name: 'Custom Integrations', starter: false, growth: false, enterprise: true },
      { name: 'MCP Connectors', starter: false, growth: true, enterprise: true },
    ]
  },
  {
    category: 'Security & Compliance',
    features: [
      { name: 'SSO / SAML', starter: false, growth: false, enterprise: true },
      { name: 'Two-Factor Auth', starter: true, growth: true, enterprise: true },
      { name: 'Audit Logs', starter: false, growth: true, enterprise: true },
      { name: 'SOC 2 Compliance', starter: false, growth: false, enterprise: true },
      { name: 'Custom DPA', starter: false, growth: false, enterprise: true },
    ]
  },
  {
    category: 'Support',
    features: [
      { name: 'Support Channel', starter: 'Community', growth: 'Email', enterprise: 'Dedicated' },
      { name: 'Response Time', starter: '48h', growth: '24h', enterprise: '< 4h SLA' },
      { name: 'Onboarding', starter: 'Self-serve', growth: 'Guided', enterprise: 'White-glove' },
      { name: 'Training Sessions', starter: false, growth: false, enterprise: true },
      { name: 'Success Manager', starter: false, growth: false, enterprise: true },
    ]
  },
];

const renderValue = (value: boolean | string) => {
  if (value === true) {
    return <Check size={18} className="text-green-500" />;
  }
  if (value === false) {
    return <X size={18} className="text-muted-foreground/30" />;
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
};

export const FeatureComparisonTable = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Compare Plans</h2>
          <p className="text-muted-foreground">See exactly what you get with each plan</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto overflow-x-auto"
        >
          <table className="w-full border-collapse">
            {/* Header */}
            <thead>
              <tr>
                <th className="text-left p-4 border-b border-border bg-muted/30 rounded-tl-xl min-w-[200px]">
                  <span className="text-sm font-semibold text-foreground">Feature</span>
                </th>
                <th className="p-4 border-b border-border bg-muted/30 text-center min-w-[120px]">
                  <span className="text-sm font-semibold text-foreground">Starter</span>
                </th>
                <th className="p-4 border-b border-border bg-primary/10 text-center min-w-[120px]">
                  <span className="text-sm font-semibold text-primary">Growth</span>
                  <span className="block text-xs text-primary/70">Popular</span>
                </th>
                <th className="p-4 border-b border-border bg-muted/30 text-center rounded-tr-xl min-w-[120px]">
                  <span className="text-sm font-semibold text-foreground">Enterprise</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((section, sectionIndex) => (
                <>
                  {/* Category Header */}
                  <tr key={`${section.category}-header`}>
                    <td 
                      colSpan={4} 
                      className="p-4 bg-secondary/50 border-b border-border"
                    >
                      <span className="text-sm font-bold text-foreground uppercase tracking-wider">
                        {section.category}
                      </span>
                    </td>
                  </tr>
                  {/* Features */}
                  {section.features.map((feature, featureIndex) => (
                    <motion.tr
                      key={feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: featureIndex * 0.02 }}
                      className="group hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 border-b border-border">
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {feature.name}
                        </span>
                      </td>
                      <td className="p-4 border-b border-border text-center">
                        {renderValue(feature.starter)}
                      </td>
                      <td className="p-4 border-b border-border bg-primary/5 text-center">
                        {renderValue(feature.growth)}
                      </td>
                      <td className="p-4 border-b border-border text-center">
                        {renderValue(feature.enterprise)}
                      </td>
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};
