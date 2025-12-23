import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, ChevronRight, Copy, Check, Terminal, Lock, 
  Webhook, Database, FileText, Users, Settings,
  ArrowRight, Play, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';

const endpoints = [
  {
    category: 'Authentication',
    icon: Lock,
    color: '#EF4444',
    items: [
      { method: 'POST', path: '/auth/login', description: 'Authenticate user and get tokens' },
      { method: 'POST', path: '/auth/refresh', description: 'Refresh access token' },
      { method: 'POST', path: '/auth/logout', description: 'Revoke tokens' },
    ]
  },
  {
    category: 'Content',
    icon: FileText,
    color: '#3B82F6',
    items: [
      { method: 'GET', path: '/content', description: 'List all content items' },
      { method: 'POST', path: '/content', description: 'Create new content' },
      { method: 'GET', path: '/content/:id', description: 'Get content by ID' },
      { method: 'PUT', path: '/content/:id', description: 'Update content' },
      { method: 'DELETE', path: '/content/:id', description: 'Delete content' },
    ]
  },
  {
    category: 'Users',
    icon: Users,
    color: '#10B981',
    items: [
      { method: 'GET', path: '/users', description: 'List all users in tenant' },
      { method: 'POST', path: '/users/invite', description: 'Invite new user' },
      { method: 'PUT', path: '/users/:id/role', description: 'Update user role' },
    ]
  },
  {
    category: 'Webhooks',
    icon: Webhook,
    color: '#F59E0B',
    items: [
      { method: 'GET', path: '/webhooks', description: 'List all webhooks' },
      { method: 'POST', path: '/webhooks', description: 'Create webhook' },
      { method: 'DELETE', path: '/webhooks/:id', description: 'Delete webhook' },
    ]
  },
];

const methodColors: Record<string, string> = {
  GET: '#10B981',
  POST: '#3B82F6',
  PUT: '#F59E0B',
  DELETE: '#EF4444',
};

const authExample = `curl -X POST https://api.zenith.studio/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'`;

const responseExample = `{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJl...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "tenant_id": "tnt_456def"
  }
}`;

const APIReference = () => {
  const [activeCategory, setActiveCategory] = useState('Authentication');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <SEO 
        title="API Reference | Zenith Studio Documentation"
        description="Complete REST API documentation for Zenith Studio. Authentication, endpoints, and examples."
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
              <span className="text-foreground">API Reference</span>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Code size={14} />
                API Reference
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">REST API Documentation</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                The Zenith API is organized around REST. Our API has predictable resource-oriented URLs, 
                accepts JSON-encoded request bodies, and returns JSON-encoded responses.
              </p>
            </motion.div>

            {/* Base URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl border border-border bg-card mb-8"
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Base URL</h3>
              <code className="text-lg font-mono text-primary">https://api.zenith.studio/v1</code>
            </motion.div>

            <div className="grid lg:grid-cols-[300px_1fr] gap-12">
              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:block"
              >
                <div className="sticky top-28 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Endpoints
                  </h3>
                  {endpoints.map((section) => (
                    <button
                      key={section.category}
                      onClick={() => setActiveCategory(section.category)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                        activeCategory === section.category
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${section.color}15` }}
                      >
                        <section.icon size={16} style={{ color: section.color }} />
                      </div>
                      {section.category}
                    </button>
                  ))}
                </div>
              </motion.aside>

              {/* Main Content */}
              <div className="space-y-12">
                {/* Authentication Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                  <p className="text-muted-foreground mb-6">
                    All API requests require authentication using Bearer tokens. Include the token 
                    in the Authorization header of your requests.
                  </p>

                  <div className="grid gap-6">
                    {/* Request Example */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Terminal size={16} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Request Example</span>
                        </div>
                        <button
                          onClick={() => handleCopy(authExample, 'auth')}
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                        >
                          {copiedCode === 'auth' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copiedCode === 'auth' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm">
                        <code className="text-muted-foreground">{authExample}</code>
                      </pre>
                    </div>

                    {/* Response Example */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-500">200</span>
                          <span className="text-sm font-medium">Response</span>
                        </div>
                        <button
                          onClick={() => handleCopy(responseExample, 'response')}
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                        >
                          {copiedCode === 'response' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copiedCode === 'response' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm">
                        <code className="text-muted-foreground">{responseExample}</code>
                      </pre>
                    </div>
                  </div>
                </section>

                {/* Endpoints List */}
                {endpoints.map((section, sectionIndex) => (
                  <motion.section
                    key={section.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: sectionIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${section.color}15` }}
                      >
                        <section.icon size={20} style={{ color: section.color }} />
                      </div>
                      <h2 className="text-2xl font-bold">{section.category}</h2>
                    </div>

                    <div className="space-y-3">
                      {section.items.map((endpoint, i) => (
                        <motion.div
                          key={endpoint.path}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group"
                        >
                          <span 
                            className="px-2.5 py-1 rounded text-xs font-bold uppercase"
                            style={{ 
                              backgroundColor: `${methodColors[endpoint.method]}15`,
                              color: methodColors[endpoint.method]
                            }}
                          >
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-foreground flex-1">{endpoint.path}</code>
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {endpoint.description}
                          </span>
                          <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                ))}

                {/* Rate Limits */}
                <section className="p-6 rounded-2xl border border-border bg-secondary/30">
                  <h3 className="text-xl font-bold mb-3">Rate Limits</h3>
                  <p className="text-muted-foreground mb-4">
                    API requests are rate limited based on your plan:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <h4 className="font-semibold text-foreground">Starter</h4>
                      <p className="text-2xl font-bold text-primary">1,000</p>
                      <p className="text-sm text-muted-foreground">requests/minute</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <h4 className="font-semibold text-foreground">Growth</h4>
                      <p className="text-2xl font-bold text-primary">10,000</p>
                      <p className="text-sm text-muted-foreground">requests/minute</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <h4 className="font-semibold text-foreground">Enterprise</h4>
                      <p className="text-2xl font-bold text-primary">Unlimited</p>
                      <p className="text-sm text-muted-foreground">Custom limits</p>
                    </div>
                  </div>
                </section>

                {/* CTA */}
                <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
                  <h3 className="text-xl font-bold mb-2">Need help?</h3>
                  <p className="text-muted-foreground mb-4">Explore our SDKs for easier integration.</p>
                  <Link to="/docs/sdk">
                    <Button className="gap-2">
                      View SDK Documentation <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default APIReference;
