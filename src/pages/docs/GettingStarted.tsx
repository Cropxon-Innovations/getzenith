import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, ChevronRight, ChevronDown, Play, Rocket, Settings, 
  Check, ArrowRight, Copy, Terminal, Layers, FileText,
  Globe, GraduationCap, Zap, Clock, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'intro', title: 'Introduction', icon: Book },
  { id: 'quickstart', title: 'Quick Start', icon: Rocket },
  { id: 'first-project', title: 'Your First Project', icon: FileText },
  { id: 'studios', title: 'Understanding Studios', icon: Layers },
  { id: 'next-steps', title: 'Next Steps', icon: ArrowRight },
];

const studios = [
  { name: 'CMS Studio', icon: FileText, color: '#3B82F6', description: 'Create and manage content' },
  { name: 'Website Builder', icon: Globe, color: '#10B981', description: 'Build beautiful websites' },
  { name: 'LMS Studio', icon: GraduationCap, color: '#F59E0B', description: 'Create learning experiences' },
  { name: 'Automation Hub', icon: Zap, color: '#8B5CF6', description: 'Automate workflows' },
];

const steps = [
  { step: 1, title: 'Create Account', description: 'Sign up with email or SSO', time: '1 min' },
  { step: 2, title: 'Create Tenant', description: 'Set up your organization', time: '2 min' },
  { step: 3, title: 'Choose Studio', description: 'Select your first studio', time: '1 min' },
  { step: 4, title: 'Start Building', description: 'Create your first content', time: '5 min' },
];

const GettingStarted = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      <SEO 
        title="Getting Started | Zenith Studio Documentation"
        description="Learn how to get started with Zenith Studio. Quick start guides, tutorials, and step-by-step instructions."
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
              <span className="text-foreground">Getting Started</span>
            </motion.div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-12">
              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:block"
              >
                <div className="sticky top-28 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    On This Page
                  </h3>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <section.icon size={16} />
                      {section.title}
                    </button>
                  ))}
                </div>
              </motion.aside>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                {/* Header */}
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                    <Book size={14} />
                    Getting Started
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome to Zenith Studio</h1>
                  <p className="text-lg text-muted-foreground">
                    Get up and running with Zenith in minutes. This guide will walk you through 
                    creating your first project and understanding the core concepts.
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={14} /> 10 min read</span>
                    <span className="flex items-center gap-1"><Star size={14} /> Beginner</span>
                  </div>
                </div>

                {/* Introduction */}
                <section id="intro" className="mb-16">
                  <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-4">
                      Zenith Studio is the operating system for digital businesses. It provides a unified 
                      platform to manage content, build websites, create learning experiences, and automate 
                      workflows—all without vendor lock-in.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                      {studios.map((studio, i) => (
                        <motion.div
                          key={studio.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${studio.color}20` }}
                            >
                              <studio.icon size={20} style={{ color: studio.color }} />
                            </div>
                            <h4 className="font-semibold text-foreground">{studio.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{studio.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Quick Start */}
                <section id="quickstart" className="mb-16">
                  <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
                  <p className="text-muted-foreground mb-6">
                    Follow these steps to get your first Zenith project running in under 10 minutes.
                  </p>
                  
                  <div className="space-y-4">
                    {steps.map((item, i) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                          <Clock size={12} /> {item.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* First Project */}
                <section id="first-project" className="mb-16">
                  <h2 className="text-2xl font-bold mb-4">Your First Project</h2>
                  <p className="text-muted-foreground mb-6">
                    Let's create a simple blog post using the CMS Studio.
                  </p>

                  <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">Creating Content via SDK</span>
                      </div>
                      <button
                        onClick={() => handleCopy(`import { Zenith } from '@zenith/sdk';

const zenith = new Zenith({ apiKey: 'your-api-key' });

// Create a blog post
const post = await zenith.cms.create({
  type: 'blog',
  title: 'My First Post',
  data: {
    body: 'Hello, Zenith!',
    published: true
  }
});`)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                      >
                        {copiedCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        {copiedCode ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-muted-foreground">
{`import { Zenith } from '@zenith/sdk';

const zenith = new Zenith({ apiKey: 'your-api-key' });

// Create a blog post
const post = await zenith.cms.create({
  type: 'blog',
  title: 'My First Post',
  data: {
    body: 'Hello, Zenith!',
    published: true
  }
});`}
                      </code>
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                    <div className="flex items-start gap-3">
                      <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Success!</h4>
                        <p className="text-sm text-muted-foreground">
                          Your content is now created and ready to be distributed across channels.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Understanding Studios */}
                <section id="studios" className="mb-16">
                  <h2 className="text-2xl font-bold mb-4">Understanding Studios</h2>
                  <p className="text-muted-foreground mb-6">
                    Studios are modular workspaces designed for specific functions. Each studio can 
                    work independently or together for powerful workflows.
                  </p>

                  <div className="aspect-video rounded-xl border border-border bg-card p-8 mb-6">
                    <div className="h-full flex items-center justify-center">
                      <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                      >
                        {/* Center hub */}
                        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">Zenith</span>
                        </div>
                        
                        {/* Orbiting studios */}
                        {studios.map((studio, i) => {
                          const angle = (i * 90) * (Math.PI / 180);
                          const x = Math.cos(angle) * 120;
                          const y = Math.sin(angle) * 120;
                          
                          return (
                            <motion.div
                              key={studio.name}
                              className="absolute w-16 h-16 rounded-xl flex flex-col items-center justify-center border"
                              style={{
                                left: `calc(50% + ${x}px - 32px)`,
                                top: `calc(50% + ${y}px - 32px)`,
                                backgroundColor: `${studio.color}10`,
                                borderColor: `${studio.color}50`,
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                            >
                              <studio.icon size={20} style={{ color: studio.color }} />
                              <span className="text-[8px] font-medium mt-1 text-muted-foreground">
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
                <section id="next-steps" className="mb-16">
                  <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link to="/docs/api-reference">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground mb-1">API Reference</h4>
                        <p className="text-sm text-muted-foreground">Explore our complete API documentation</p>
                      </motion.div>
                    </Link>
                    <Link to="/docs/sdk">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground mb-1">SDK Guide</h4>
                        <p className="text-sm text-muted-foreground">Learn how to use our client libraries</p>
                      </motion.div>
                    </Link>
                    <Link to="/docs/integrations">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground mb-1">Integrations</h4>
                        <p className="text-sm text-muted-foreground">Connect with your existing tools</p>
                      </motion.div>
                    </Link>
                    <Link to="/docs/automation">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground mb-1">Automation</h4>
                        <p className="text-sm text-muted-foreground">Build powerful workflows</p>
                      </motion.div>
                    </Link>
                  </div>
                </section>

                {/* CTA */}
                <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
                  <h3 className="text-xl font-bold mb-2">Ready to build?</h3>
                  <p className="text-muted-foreground mb-4">Start your 30-day free trial and experience the power of Zenith.</p>
                  <Link to="/get-started">
                    <Button className="gap-2">
                      Start Free Trial <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GettingStarted;
