import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Puzzle, ChevronRight, Database, Cloud, Server, Lock,
  ArrowRight, Check, Zap, Globe, Code, Key, Webhook,
  RefreshCw, Shield, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';

const integrationCategories = [
  {
    id: 'byob',
    title: 'Bring Your Own Backend',
    icon: Server,
    color: '#8B5CF6',
    description: 'Connect Zenith to your existing infrastructure',
    features: [
      'Connect any PostgreSQL, MySQL, or MongoDB database',
      'Use your existing authentication system',
      'Keep data in your own infrastructure',
      'Zero vendor lock-in',
    ]
  },
  {
    id: 'databases',
    title: 'Database Connectors',
    icon: Database,
    color: '#3B82F6',
    description: 'Native integrations with popular databases',
    features: [
      'PostgreSQL with full RLS support',
      'MySQL / MariaDB',
      'MongoDB Atlas',
      'Redis caching layer',
    ]
  },
  {
    id: 'identity',
    title: 'SSO & Identity',
    icon: Lock,
    color: '#10B981',
    description: 'Enterprise identity management',
    features: [
      'SAML 2.0 SSO',
      'OAuth 2.0 / OpenID Connect',
      'Active Directory / LDAP',
      'Custom identity providers',
    ]
  },
  {
    id: 'cloud',
    title: 'Cloud Providers',
    icon: Cloud,
    color: '#F59E0B',
    description: 'Deploy anywhere you want',
    features: [
      'AWS (S3, Lambda, RDS)',
      'Google Cloud Platform',
      'Microsoft Azure',
      'Vercel / Netlify edge',
    ]
  },
];

const connectors = [
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'MySQL', icon: '🐬', category: 'Database' },
  { name: 'MongoDB', icon: '🍃', category: 'Database' },
  { name: 'Redis', icon: '⚡', category: 'Cache' },
  { name: 'Okta', icon: '🔐', category: 'Identity' },
  { name: 'Auth0', icon: '🔑', category: 'Identity' },
  { name: 'Stripe', icon: '💳', category: 'Payments' },
  { name: 'Twilio', icon: '📱', category: 'Communication' },
  { name: 'SendGrid', icon: '📧', category: 'Email' },
  { name: 'Slack', icon: '💬', category: 'Communication' },
  { name: 'GitHub', icon: '🐙', category: 'DevOps' },
  { name: 'Zapier', icon: '⚡', category: 'Automation' },
];

const architectureFlow = [
  { id: 'app', label: 'Your App', x: 0, y: 50 },
  { id: 'zenith', label: 'Zenith API', x: 150, y: 50 },
  { id: 'adapter', label: 'Adapter Layer', x: 300, y: 50 },
  { id: 'backend', label: 'Your Backend', x: 450, y: 50 },
];

const Integrations = () => {
  const [activeCategory, setActiveCategory] = useState('byob');

  return (
    <>
      <SEO 
        title="Integrations | Zenith Studio Documentation"
        description="Connect Zenith to your existing tools. BYOB, database connectors, SSO, and cloud providers."
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
            >
              <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <ChevronRight size={14} />
              <span className="text-foreground">Integrations</span>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Puzzle size={14} />
                Integrations
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Connect Everything</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Zenith integrates seamlessly with your existing infrastructure. 
                No vendor lock-in—bring your own backend or use our managed services.
              </p>
            </motion.div>

            {/* BYOB Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12 p-8 rounded-2xl border border-border bg-card"
            >
              <h2 className="text-xl font-bold mb-6 text-center">BYOB Architecture</h2>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {architectureFlow.map((node, i) => (
                  <div key={node.id} className="flex items-center gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="px-6 py-4 rounded-xl border-2 border-primary/30 bg-primary/5 text-center"
                    >
                      <span className="text-sm font-semibold text-foreground">{node.label}</span>
                    </motion.div>
                    {i < architectureFlow.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <ArrowRight size={20} className="text-primary" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                The adapter layer translates Zenith API calls to your backend's native format
              </p>
            </motion.div>

            {/* Integration Categories */}
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              {integrationCategories.map((category, i) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-xl border transition-all cursor-pointer ${
                    activeCategory === category.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <category.icon size={24} style={{ color: category.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <ul className="space-y-2">
                        {category.features.map((feature, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + j * 0.05 }}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Check size={14} className="text-green-500 flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Connectors Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Available Connectors</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {connectors.map((connector, i) => (
                  <motion.div
                    key={connector.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-center cursor-pointer group"
                  >
                    <span className="text-2xl mb-2 block">{connector.icon}</span>
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {connector.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">{connector.category}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enterprise Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-secondary/30 mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Enterprise Features</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Shield, title: 'SOC 2 Compliant', description: 'Enterprise-grade security' },
                  { icon: RefreshCw, title: 'Auto Failover', description: 'High availability setup' },
                  { icon: Key, title: 'Key Management', description: 'Bring your own keys' },
                  { icon: Webhook, title: 'Custom Webhooks', description: 'Real-time integrations' },
                ].map((feature, i) => (
                  <div key={feature.title} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <feature.icon size={24} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5"
            >
              <h3 className="text-xl font-bold mb-2">Need a custom integration?</h3>
              <p className="text-muted-foreground mb-4">Our team can help you build custom connectors for your infrastructure.</p>
              <Link to="/get-started">
                <Button className="gap-2">
                  Contact Sales <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Integrations;
