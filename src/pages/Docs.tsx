import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Book, Code, Zap, Server, Puzzle, Bot, Workflow,
  ChevronRight, Search, ExternalLink, Copy, Check,
  FileText, Globe, GraduationCap, Settings, Database,
  ArrowRight, Play, Terminal, Box, Layers, Shield,
  RefreshCw, Webhook, Key, CloudCog
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';

const docCategories = [
  {
    id: 'getting-started',
    icon: Book,
    title: 'Getting Started',
    description: 'Quick start guides and tutorials',
    color: '#3B82F6',
    articles: [
      { title: 'Introduction to Zenith', time: '5 min' },
      { title: 'Your First Project', time: '10 min' },
      { title: 'Understanding Studios', time: '8 min' },
    ]
  },
  {
    id: 'api-reference',
    icon: Code,
    title: 'API Reference',
    description: 'Complete REST & GraphQL documentation',
    color: '#8B5CF6',
    articles: [
      { title: 'Authentication', time: '3 min' },
      { title: 'Content API', time: '15 min' },
      { title: 'Webhooks', time: '10 min' },
    ]
  },
  {
    id: 'sdk',
    icon: Box,
    title: 'Zenith SDK',
    description: 'Client libraries for all platforms',
    color: '#10B981',
    articles: [
      { title: 'JavaScript SDK', time: '12 min' },
      { title: 'Python SDK', time: '12 min' },
      { title: 'Go SDK', time: '10 min' },
    ]
  },
  {
    id: 'integrations',
    icon: Puzzle,
    title: 'Integrations',
    description: 'Connect with your existing tools',
    color: '#F59E0B',
    articles: [
      { title: 'BYOB (Bring Your Own Backend)', time: '15 min' },
      { title: 'Database Connectors', time: '10 min' },
      { title: 'SSO & Identity', time: '8 min' },
    ]
  },
  {
    id: 'ai-systems',
    icon: Bot,
    title: 'AI Systems',
    description: 'AI-powered features and integrations',
    color: '#EC4899',
    articles: [
      { title: 'AI Content Generation', time: '10 min' },
      { title: 'MCP Connectors', time: '12 min' },
      { title: 'Custom AI Models', time: '15 min' },
    ]
  },
  {
    id: 'automation',
    icon: Workflow,
    title: 'Automation',
    description: 'Workflow triggers and actions',
    color: '#06B6D4',
    articles: [
      { title: 'Workflow Builder', time: '12 min' },
      { title: 'Event Triggers', time: '8 min' },
      { title: 'n8n Integration', time: '10 min' },
    ]
  },
];

const studioGuides = [
  { id: 'cms', icon: FileText, title: 'CMS Studio', color: '#3B82F6' },
  { id: 'website', icon: Globe, title: 'Website Builder', color: '#10B981' },
  { id: 'lms', icon: GraduationCap, title: 'LMS Studio', color: '#F59E0B' },
  { id: 'automation', icon: Zap, title: 'Automation Hub', color: '#8B5CF6' },
];

const codeExample = `import { Zenith } from '@zenith/sdk';

// Initialize the Zenith client
const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  tenantId: 'your-tenant-id'
});

// Create content programmatically
const content = await zenith.cms.create({
  title: 'My First Post',
  type: 'blog',
  data: {
    body: 'Hello from Zenith SDK!',
    author: 'John Doe'
  }
});

// Publish to multiple channels
await zenith.distribute(content.id, {
  channels: ['website', 'email', 'social']
});`;

const architectureNodes = [
  { id: 'client', label: 'Your App', x: 50, y: 100, icon: Globe },
  { id: 'api', label: 'Zenith API', x: 200, y: 100, icon: Server },
  { id: 'cms', label: 'CMS', x: 350, y: 50, icon: FileText },
  { id: 'lms', label: 'LMS', x: 350, y: 150, icon: GraduationCap },
  { id: 'backend', label: 'Your Backend', x: 500, y: 100, icon: Database },
];

const Docs = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      <SEO 
        title="Documentation | Zenith Studio"
        description="Comprehensive documentation for Zenith Studio - API reference, SDKs, integrations, and tutorials."
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section ref={heroRef} className="py-16 sm:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
                  <Book size={14} />
                  Documentation
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Build Anything with{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Zenith
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                  Comprehensive guides, API references, and SDKs to help you integrate and extend Zenith Studio.
                </p>

                {/* Search bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="relative max-w-xl mx-auto"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="py-12 border-y border-border bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-wrap justify-center gap-3">
                {studioGuides.map((studio, i) => (
                  <motion.button
                    key={studio.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <studio.icon size={16} style={{ color: studio.color }} />
                    <span className="text-sm font-medium">{studio.title}</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          {/* Documentation Categories */}
          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-bold text-center mb-12"
              >
                Explore the Documentation
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docCategories.map((category, index) => {
                  const categoryRoutes: Record<string, string> = {
                    'getting-started': '/docs/getting-started',
                    'api-reference': '/docs/api-reference',
                    'sdk': '/docs/sdk',
                    'integrations': '/docs/integrations',
                    'ai-systems': '/docs/ai-systems',
                    'automation': '/docs/automation',
                  };
                  
                  return (
                    <Link key={category.id} to={categoryRoutes[category.id] || '/docs'}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="p-6 rounded-xl border cursor-pointer transition-all border-border bg-card hover:border-primary/50 h-full"
                      >
                        <div className="flex items-start gap-4">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <category.icon size={22} style={{ color: category.color }} />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-1">{category.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                            
                            <div className="space-y-2">
                              {category.articles.map((article, i) => (
                                <motion.div
                                  key={article.title}
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 0.3 + i * 0.1 }}
                                  className="flex items-center justify-between text-sm group"
                                >
                                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                    {article.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground/50">{article.time}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Code Example Section */}
          <section className="py-16 sm:py-24 bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                    <Terminal size={14} />
                    Zenith SDK
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Powerful SDKs for Every Platform
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Our SDKs make it easy to integrate Zenith into your applications. 
                    Available for JavaScript, Python, Go, Ruby, and more.
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {['JavaScript', 'Python', 'Go', 'Ruby', 'PHP'].map((lang, i) => (
                      <motion.div
                        key={lang}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-medium"
                      >
                        {lang}
                      </motion.div>
                    ))}
                  </div>

                  <Link to="/docs/sdk">
                    <Button className="gap-2">
                      View SDK Documentation
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </motion.div>

                {/* Code block */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive/60" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                          <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">example.ts</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                      >
                        {copiedCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        {copiedCode ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                    
                    {/* Code */}
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-muted-foreground">
                        {codeExample.split('\n').map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.02 }}
                            className="leading-relaxed"
                          >
                            <span className="text-muted-foreground/50 mr-4 select-none">{String(i + 1).padStart(2, '0')}</span>
                            <span dangerouslySetInnerHTML={{ 
                              __html: line
                                .replace(/(import|from|const|await|new|process)/g, '<span class="text-primary">$1</span>')
                                .replace(/('.*?')/g, '<span class="text-green-400">$1</span>')
                                .replace(/(\/\/.*)/g, '<span class="text-muted-foreground/60">$1</span>')
                            }} />
                          </motion.div>
                        ))}
                      </code>
                    </pre>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Architecture Diagram Section */}
          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                  <Layers size={14} />
                  Enterprise Architecture
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Bring Your Own Backend
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Zenith integrates seamlessly with your existing infrastructure. 
                  Connect your databases, backends, and services through our flexible API layer.
                </p>
              </motion.div>

              {/* Architecture visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto p-8 rounded-2xl border border-border bg-card"
              >
                <svg viewBox="0 0 600 200" className="w-full">
                  {/* Connection lines */}
                  <motion.path
                    d="M 90 100 L 170 100"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                  <motion.path
                    d="M 240 100 L 310 60 M 240 100 L 310 140"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  />
                  <motion.path
                    d="M 390 60 L 460 100 M 390 140 L 460 100"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  />

                  {/* Nodes */}
                  {architectureNodes.map((node, i) => (
                    <motion.g
                      key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.15 }}
                    >
                      <rect
                        x={node.x - 40}
                        y={node.y - 25}
                        width="80"
                        height="50"
                        rx="8"
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="text-xs font-medium fill-foreground"
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  ))}

                  {/* Animated pulse */}
                  <motion.circle
                    r="4"
                    fill="hsl(var(--primary))"
                    animate={{
                      cx: [90, 200, 350, 500],
                      cy: [100, 100, 100, 100],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </svg>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-border">
                  {[
                    { icon: Globe, label: 'Client Apps', color: '#3B82F6' },
                    { icon: Server, label: 'Zenith API', color: '#8B5CF6' },
                    { icon: Database, label: 'Your Backend', color: '#10B981' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <item.icon size={16} style={{ color: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Integration Cards */}
          <section className="py-16 sm:py-24 bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-bold text-center mb-12"
              >
                Enterprise Integrations
              </motion.h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Database, title: 'Database Connectors', desc: 'PostgreSQL, MySQL, MongoDB, and more', color: '#3B82F6' },
                  { icon: Webhook, title: 'Webhooks', desc: 'Real-time event notifications', color: '#10B981' },
                  { icon: Key, title: 'SSO & Auth', desc: 'SAML, OAuth, LDAP integration', color: '#F59E0B' },
                  { icon: CloudCog, title: 'MCP Connectors', desc: 'Model Context Protocol support', color: '#8B5CF6' },
                  { icon: Bot, title: 'AI Models', desc: 'OpenAI, Anthropic, custom models', color: '#EC4899' },
                  { icon: RefreshCw, title: 'Sync Engine', desc: 'Bi-directional data sync', color: '#06B6D4' },
                  { icon: Shield, title: 'Security', desc: 'SOC2, GDPR, HIPAA compliant', color: '#EF4444' },
                  { icon: Workflow, title: 'n8n Workflows', desc: 'Advanced automation pipelines', color: '#84CC16' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                      className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon size={20} style={{ color: item.color }} />
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Explore our documentation and start building with Zenith today.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/docs/getting-started">
                    <Button size="lg" className="gap-2">
                      <Play size={16} />
                      Quick Start Guide
                    </Button>
                  </Link>
                  <Link to="/docs/api-reference">
                    <Button size="lg" variant="outline" className="gap-2">
                      <ExternalLink size={16} />
                      API Reference
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

export default Docs;
