import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Lock, FileText, Users, Webhook, Terminal,
  Copy, Check, AlertCircle
} from 'lucide-react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { SyntaxHighlighter } from '@/components/docs/SyntaxHighlighter';
import { SEO } from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const endpoints = [
  { category: 'Authentication', icon: Lock, color: '#EF4444', items: [
    { method: 'POST', path: '/auth/login', description: 'Authenticate user and get tokens' },
    { method: 'POST', path: '/auth/refresh', description: 'Refresh access token' },
    { method: 'POST', path: '/auth/logout', description: 'Revoke tokens' },
  ]},
  { category: 'Content', icon: FileText, color: '#3B82F6', items: [
    { method: 'GET', path: '/content', description: 'List all content items' },
    { method: 'POST', path: '/content', description: 'Create new content' },
    { method: 'GET', path: '/content/:id', description: 'Get content by ID' },
    { method: 'PUT', path: '/content/:id', description: 'Update content' },
    { method: 'DELETE', path: '/content/:id', description: 'Delete content' },
  ]},
  { category: 'Users', icon: Users, color: '#10B981', items: [
    { method: 'GET', path: '/users', description: 'List all users in tenant' },
    { method: 'POST', path: '/users/invite', description: 'Invite new user' },
    { method: 'PUT', path: '/users/:id/role', description: 'Update user role' },
  ]},
  { category: 'Webhooks', icon: Webhook, color: '#F59E0B', items: [
    { method: 'GET', path: '/webhooks', description: 'List all webhooks' },
    { method: 'POST', path: '/webhooks', description: 'Create webhook' },
    { method: 'DELETE', path: '/webhooks/:id', description: 'Delete webhook' },
  ]},
];

const methodColors: Record<string, string> = {
  GET: '#10B981', POST: '#3B82F6', PUT: '#F59E0B', DELETE: '#EF4444',
};

const tableOfContents = [
  { id: 'authentication', title: 'Authentication', level: 2 },
  { id: 'api-keys', title: 'API Keys', level: 3 },
  { id: 'bearer-tokens', title: 'Bearer Tokens', level: 3 },
  { id: 'content', title: 'Content API', level: 2 },
  { id: 'users', title: 'Users API', level: 2 },
  { id: 'webhooks', title: 'Webhooks API', level: 2 },
  { id: 'rate-limits', title: 'Rate Limits', level: 2 },
];

const APIReference = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="rounded-xl border border-border overflow-hidden not-prose">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <span className="text-xs text-muted-foreground capitalize">{language}</span>
        <button
          onClick={() => handleCopy(code, id)}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copiedCode === id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copiedCode === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter code={code} language={language} />
    </div>
  );

  const MethodBadge = ({ method }: { method: string }) => (
    <span 
      className="px-2.5 py-1 rounded text-xs font-bold uppercase"
      style={{ backgroundColor: `${methodColors[method]}15`, color: methodColors[method] }}
    >
      {method}
    </span>
  );

  return (
    <>
      <SEO 
        title="API Reference | Zenith Studio Documentation"
        description="Complete REST API documentation for Zenith Studio. Authentication, endpoints, and examples."
      />
      <DocsLayout
        title="API Reference"
        description="The Zenith API is organized around REST. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, and returns JSON-encoded responses."
        icon={Code}
        iconColor="#8B5CF6"
        readTime="15 min"
        difficulty="Intermediate"
        tableOfContents={tableOfContents}
        prevPage={{ title: 'Getting Started', href: '/docs/getting-started' }}
        nextPage={{ title: 'SDK Guide', href: '/docs/sdk' }}
      >
        {/* Base URL */}
        <div className="p-4 rounded-xl border border-border bg-card mb-8 not-prose">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Base URL</h3>
          <code className="text-lg font-mono text-primary">https://api.zenith.studio/v1</code>
        </div>

        {/* Authentication */}
        <section id="authentication" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Lock size={18} className="text-red-500" />
            </div>
            Authentication
          </h2>

          <p className="text-muted-foreground mb-6">
            All API requests require authentication. Zenith supports two authentication methods.
          </p>

          <div id="api-keys" className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">API Keys</h3>
            <p className="text-muted-foreground mb-4">
              API keys are long-lived credentials for server-side integrations. Include them in the 
              <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono mx-1">X-API-Key</code> header.
            </p>
            
            <CodeBlock
              id="api-key"
              language="bash"
              code={`curl -X GET "https://api.zenith.studio/v1/content" \\
  -H "X-API-Key: zen_sk_live_abc123..." \\
  -H "Content-Type: application/json"`}
            />

            <div className="mt-4 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 not-prose">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Security Warning</h4>
                  <p className="text-sm text-muted-foreground">
                    Never expose API keys in client-side code. Use environment variables and server-side requests only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="bearer-tokens" className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Bearer Tokens</h3>
            <p className="text-muted-foreground mb-4">
              For user authentication, use JWT bearer tokens obtained from the auth flow.
            </p>

            <CodeBlock
              id="bearer"
              language="typescript"
              code={`import { Zenith } from '@zenith/sdk';

const zenith = new Zenith({
  token: 'eyJhbGciOiJIUzI1NiIs...',
  tenantId: 'your-tenant-id'
});

const content = await zenith.cms.list();`}
            />
          </div>
        </section>

        {/* Content API */}
        <section id="content" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText size={18} className="text-blue-500" />
            </div>
            Content API
          </h2>

          <div className="rounded-xl border border-border overflow-hidden mb-8 not-prose">
            <div className="px-4 py-3 bg-muted/30 border-b border-border">
              <span className="text-sm font-medium text-foreground">Endpoints</span>
            </div>
            <div className="divide-y divide-border">
              {endpoints.find(e => e.category === 'Content')?.items.map((endpoint) => (
                <div key={endpoint.path} className="flex items-center gap-4 px-4 py-3">
                  <MethodBadge method={endpoint.method} />
                  <code className="text-sm font-mono text-foreground flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List Content</TabsTrigger>
              <TabsTrigger value="create">Create Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <CodeBlock
                id="list-content"
                language="typescript"
                code={`const response = await zenith.cms.list({
  limit: 10,
  offset: 0,
  type: 'blog',
  status: 'published'
});

// Response
{
  data: [{ id: '...', title: '...', ... }],
  total: 100,
  limit: 10,
  offset: 0
}`}
              />
            </TabsContent>
            
            <TabsContent value="create">
              <CodeBlock
                id="create-content"
                language="typescript"
                code={`const newPost = await zenith.cms.create({
  type: 'blog',
  title: 'My New Blog Post',
  slug: 'my-new-blog-post',
  status: 'draft',
  data: {
    body: 'This is the content...',
    author: 'John Doe',
    tags: ['tutorial']
  }
});`}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Users API */}
        <section id="users" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users size={18} className="text-green-500" />
            </div>
            Users API
          </h2>

          <p className="text-muted-foreground mb-6">
            Manage users, roles, and permissions within your tenant.
          </p>

          <CodeBlock
            id="users"
            language="typescript"
            code={`// List users
const users = await zenith.users.list({ role: 'editor' });

// Invite a new user
await zenith.users.invite({
  email: 'newuser@example.com',
  role: 'editor',
  sendEmail: true
});

// Update user role
await zenith.users.updateRole('user_id', 'admin');`}
          />
        </section>

        {/* Webhooks API */}
        <section id="webhooks" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Webhook size={18} className="text-yellow-500" />
            </div>
            Webhooks API
          </h2>

          <p className="text-muted-foreground mb-6">
            Receive real-time notifications when events occur.
          </p>

          <CodeBlock
            id="webhooks"
            language="typescript"
            code={`await zenith.webhooks.create({
  url: 'https://your-server.com/webhooks/zenith',
  events: [
    'content.created',
    'content.published',
    'content.deleted'
  ],
  secret: 'your_webhook_secret'
});`}
          />
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Rate Limits</h2>
          
          <div className="grid sm:grid-cols-3 gap-4 not-prose">
            {[
              { plan: 'Starter', limit: '1,000', unit: 'requests/minute' },
              { plan: 'Growth', limit: '10,000', unit: 'requests/minute' },
              { plan: 'Enterprise', limit: 'Unlimited', unit: 'custom limits' },
            ].map((tier) => (
              <div key={tier.plan} className="p-4 rounded-xl bg-card border border-border">
                <h4 className="font-semibold text-foreground">{tier.plan}</h4>
                <p className="text-2xl font-bold text-primary">{tier.limit}</p>
                <p className="text-sm text-muted-foreground">{tier.unit}</p>
              </div>
            ))}
          </div>
        </section>
      </DocsLayout>
    </>
  );
};

export default APIReference;