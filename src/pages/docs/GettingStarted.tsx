import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Book, Check, Copy, Clock, Star, Terminal, ArrowRight,
  FileText, Globe, GraduationCap, Zap, Rocket, Layers,
  Play, Settings, CheckCircle2, Circle
} from 'lucide-react';
import { useState } from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { SyntaxHighlighter } from '@/components/docs/SyntaxHighlighter';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';

const studios = [
  { name: 'CMS Studio', icon: FileText, color: '#3B82F6', description: 'Create and manage structured content with a powerful headless CMS.' },
  { name: 'Website Builder', icon: Globe, color: '#10B981', description: 'Build beautiful, responsive websites with drag-and-drop simplicity.' },
  { name: 'LMS Studio', icon: GraduationCap, color: '#F59E0B', description: 'Create engaging courses and learning experiences.' },
  { name: 'Automation Hub', icon: Zap, color: '#8B5CF6', description: 'Automate workflows and connect your tools.' },
];

const quickStartSteps = [
  { 
    step: 1, 
    title: 'Create Your Account', 
    description: 'Sign up with email, Google, or SSO in under a minute.',
    code: null,
    completed: true
  },
  { 
    step: 2, 
    title: 'Create a Tenant', 
    description: 'Set up your organization workspace with branding.',
    code: null,
    completed: true
  },
  { 
    step: 3, 
    title: 'Choose Your Studio', 
    description: 'Select the studio that matches your use case.',
    code: null,
    completed: false
  },
  { 
    step: 4, 
    title: 'Start Building', 
    description: 'Create your first piece of content or page.',
    code: `import { Zenith } from '@zenith/sdk';

const zenith = new Zenith({ 
  apiKey: process.env.ZENITH_API_KEY 
});

// Create your first content
const post = await zenith.cms.create({
  type: 'blog',
  title: 'Hello World',
  data: { body: 'My first Zenith content!' }
});`,
    completed: false
  },
];

const tableOfContents = [
  { id: 'introduction', title: 'Introduction', level: 2 },
  { id: 'what-is-zenith', title: 'What is Zenith?', level: 3 },
  { id: 'key-features', title: 'Key Features', level: 3 },
  { id: 'quickstart', title: 'Quick Start', level: 2 },
  { id: 'prerequisites', title: 'Prerequisites', level: 3 },
  { id: 'step-by-step', title: 'Step by Step', level: 3 },
  { id: 'studios', title: 'Understanding Studios', level: 2 },
  { id: 'studio-overview', title: 'Studio Overview', level: 3 },
  { id: 'next-steps', title: 'Next Steps', level: 2 },
];

const GettingStarted = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <SEO 
        title="Getting Started | Zenith Studio Documentation"
        description="Learn how to get started with Zenith Studio. Quick start guides, tutorials, and step-by-step instructions."
      />
      <DocsLayout
        title="Getting Started"
        description="Get up and running with Zenith in minutes. This guide will walk you through creating your first project and understanding the core concepts."
        icon={Book}
        iconColor="#3B82F6"
        readTime="10 min"
        difficulty="Beginner"
        tableOfContents={tableOfContents}
        nextPage={{ title: 'API Reference', href: '/docs/api-reference' }}
      >
        {/* Introduction */}
        <section id="introduction" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Book size={18} className="text-primary" />
            </div>
            Introduction
          </h2>
          
          <div id="what-is-zenith" className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">What is Zenith?</h3>
            <p className="text-muted-foreground mb-4">
              Zenith Studio is the operating system for digital businesses. It provides a unified 
              platform to manage content, build websites, create learning experiences, and automate 
              workflows—all without vendor lock-in.
            </p>
            
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Rocket size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Why Zenith?</h4>
                  <p className="text-sm text-muted-foreground">
                    Unlike traditional SaaS platforms that lock you into their ecosystem, Zenith lets you 
                    bring your own backend, customize everything via APIs, and own your data completely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="key-features" className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Key Features</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Layers, title: 'Modular Studios', desc: 'Pick only the tools you need' },
                { icon: Settings, title: 'BYOB Architecture', desc: 'Bring your own backend' },
                { icon: Zap, title: 'AI-Powered', desc: 'Built-in AI content generation' },
                { icon: Globe, title: 'Multi-tenant', desc: 'Built for SaaS from day one' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Play size={18} className="text-green-500" />
            </div>
            Quick Start
          </h2>

          <div id="prerequisites" className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Prerequisites</h3>
            <div className="p-4 rounded-xl border border-border bg-card">
              <ul className="space-y-2">
                {[
                  'A modern web browser (Chrome, Firefox, Safari, Edge)',
                  'An email address for account creation',
                  'Optional: Node.js 18+ for SDK usage',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="step-by-step" className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Step by Step</h3>
            <div className="space-y-4">
              {quickStartSteps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Connector line */}
                  {i < quickStartSteps.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.completed 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <div className="flex-1 pb-6">
                      <h4 className="font-semibold text-foreground mb-1">
                        Step {item.step}: {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      
                      {item.code && (
                        <div className="rounded-xl border border-border overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Terminal size={14} className="text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">TypeScript</span>
                            </div>
                            <button
                              onClick={() => handleCopy(item.code!, `step-${item.step}`)}
                              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {copiedCode === `step-${item.step}` ? (
                                <>
                                  <Check size={12} className="text-green-500" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <SyntaxHighlighter code={item.code} language="typescript" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Understanding Studios */}
        <section id="studios" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Layers size={18} className="text-purple-500" />
            </div>
            Understanding Studios
          </h2>

          <p className="text-muted-foreground mb-6">
            Studios are modular workspaces designed for specific functions. Each studio can 
            work independently or together for powerful cross-functional workflows.
          </p>

          <div id="studio-overview" className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Studio Overview</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {studios.map((studio, i) => (
                <motion.div
                  key={studio.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${studio.color}15` }}
                    >
                      <studio.icon size={24} style={{ color: studio.color }} />
                    </div>
                    <h4 className="font-semibold text-foreground">{studio.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{studio.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual diagram */}
          <div className="p-8 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {/* Center hub */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">Zenith</span>
                </div>
                
                {/* Orbiting studios */}
                {studios.map((studio, i) => {
                  const angle = (i * 90 - 45) * (Math.PI / 180);
                  const x = Math.cos(angle) * 100;
                  const y = Math.sin(angle) * 100;
                  
                  return (
                    <motion.div
                      key={studio.name}
                      className="absolute w-14 h-14 rounded-xl flex flex-col items-center justify-center border"
                      style={{
                        left: `calc(50% + ${x}px - 28px)`,
                        top: `calc(50% + ${y}px - 28px)`,
                        backgroundColor: `${studio.color}10`,
                        borderColor: `${studio.color}40`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <studio.icon size={18} style={{ color: studio.color }} />
                      <span className="text-[8px] font-medium mt-0.5 text-muted-foreground">
                        {studio.name.split(' ')[0]}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section id="next-steps" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <ArrowRight size={18} className="text-orange-500" />
            </div>
            Next Steps
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { title: 'API Reference', desc: 'Explore our complete API documentation', href: '/docs/api-reference', color: '#8B5CF6' },
              { title: 'SDK Guide', desc: 'Learn how to use our client libraries', href: '/docs/sdk', color: '#10B981' },
              { title: 'Integrations', desc: 'Connect with your existing tools', href: '/docs/integrations', color: '#F59E0B' },
              { title: 'Automation', desc: 'Build powerful workflows', href: '/docs/automation', color: '#06B6D4' },
            ].map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full"
                >
                  <div 
                    className="w-2 h-2 rounded-full mb-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
            <h3 className="text-xl font-bold mb-2 text-foreground">Ready to build?</h3>
            <p className="text-muted-foreground mb-4">Start your 30-day free trial and experience the power of Zenith.</p>
            <Link to="/get-started">
              <Button className="gap-2">
                Start Free Trial <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </section>
      </DocsLayout>
    </>
  );
};

export default GettingStarted;