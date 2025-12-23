import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Puzzle, Database, Server, Cloud, Lock, Check, Copy,
  Shield, Zap, ArrowRight, RefreshCw, Key, Webhook
} from 'lucide-react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { SyntaxHighlighter } from '@/components/docs/SyntaxHighlighter';
import { SEO } from '@/components/SEO';

const integrationCategories = [
  { id: 'byob', title: 'Bring Your Own Backend', icon: Server, color: '#8B5CF6', features: ['Connect any PostgreSQL, MySQL, or MongoDB', 'Use your existing auth system', 'Keep data in your infrastructure', 'Zero vendor lock-in'] },
  { id: 'databases', title: 'Database Connectors', icon: Database, color: '#3B82F6', features: ['PostgreSQL with full RLS', 'MySQL / MariaDB', 'MongoDB Atlas', 'Redis caching'] },
  { id: 'identity', title: 'SSO & Identity', icon: Lock, color: '#10B981', features: ['SAML 2.0 SSO', 'OAuth 2.0 / OpenID Connect', 'Active Directory / LDAP', 'Custom identity providers'] },
  { id: 'cloud', title: 'Cloud Providers', icon: Cloud, color: '#F59E0B', features: ['AWS (S3, Lambda, RDS)', 'Google Cloud Platform', 'Microsoft Azure', 'Vercel / Netlify edge'] },
];

const connectors = [
  { name: 'PostgreSQL', icon: '🐘' }, { name: 'MySQL', icon: '🐬' }, { name: 'MongoDB', icon: '🍃' },
  { name: 'Redis', icon: '⚡' }, { name: 'Okta', icon: '🔐' }, { name: 'Auth0', icon: '🔑' },
  { name: 'Stripe', icon: '💳' }, { name: 'Twilio', icon: '📱' }, { name: 'SendGrid', icon: '📧' },
  { name: 'Slack', icon: '💬' }, { name: 'GitHub', icon: '🐙' }, { name: 'Zapier', icon: '⚡' },
];

const tableOfContents = [
  { id: 'byob', title: 'BYOB Overview', level: 2 },
  { id: 'postgres', title: 'PostgreSQL', level: 2 },
  { id: 'mysql', title: 'MySQL', level: 2 },
  { id: 'sso', title: 'SSO & Identity', level: 2 },
  { id: 'webhooks', title: 'Webhooks', level: 2 },
];

const Integrations = () => {
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

  return (
    <>
      <SEO 
        title="Integrations | Zenith Studio Documentation"
        description="Connect Zenith to your existing infrastructure. BYOB, database connectors, SSO, and webhooks."
      />
      <DocsLayout
        title="Integrations"
        description="Connect Zenith with your existing infrastructure. Bring your own backend, connect databases, and integrate with identity providers."
        icon={Puzzle}
        iconColor="#F59E0B"
        readTime="15 min"
        difficulty="Intermediate"
        tableOfContents={tableOfContents}
        prevPage={{ title: 'SDK Guide', href: '/docs/sdk' }}
        nextPage={{ title: 'AI Systems', href: '/docs/ai-systems' }}
      >
        {/* BYOB Overview */}
        <section id="byob" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Server size={18} className="text-purple-500" />
            </div>
            BYOB Overview
          </h2>

          <p className="text-muted-foreground mb-6">
            Bring Your Own Backend lets you connect your existing databases, auth systems, and storage.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8 not-prose">
            {[
              { icon: Database, title: 'Data Ownership', desc: 'Your data stays in your infrastructure' },
              { icon: Shield, title: 'Compliance', desc: 'Meet regulatory requirements' },
              { icon: Zap, title: 'Performance', desc: 'Optimize for your needs' },
              { icon: Key, title: 'No Lock-in', desc: 'Switch providers anytime' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture */}
          <div className="p-6 rounded-xl border border-border bg-card not-prose">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {['Zenith Cloud', 'Your Backend', 'Your Database'].map((label, i) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="px-6 py-4 rounded-xl border-2 border-primary/30 bg-primary/5 text-center">
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                  </div>
                  {i < 2 && <ArrowRight size={20} className="text-primary" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PostgreSQL */}
        <section id="postgres" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <span className="text-2xl">🐘</span>
            PostgreSQL
          </h2>

          <p className="text-muted-foreground mb-6">
            Connect to any PostgreSQL database, including AWS RDS, Google Cloud SQL, or Supabase.
          </p>

          <CodeBlock
            id="postgres"
            language="typescript"
            code={`const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  database: {
    type: 'postgresql',
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    pool: { min: 2, max: 10 }
  }
});`}
          />

          <div className="mt-4 p-4 rounded-xl border border-green-500/30 bg-green-500/5 not-prose">
            <div className="flex items-start gap-3">
              <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Automatic Migrations</h4>
                <p className="text-sm text-muted-foreground">Zenith automatically creates required tables.</p>
              </div>
            </div>
          </div>
        </section>

        {/* MySQL */}
        <section id="mysql" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <span className="text-2xl">🐬</span>
            MySQL
          </h2>

          <CodeBlock
            id="mysql"
            language="typescript"
            code={`const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  database: {
    type: 'mysql',
    host: 'your-mysql-host.com',
    port: 3306,
    user: 'zenith_user',
    password: process.env.MYSQL_PASSWORD,
    database: 'zenith_db'
  }
});`}
          />
        </section>

        {/* SSO */}
        <section id="sso" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Key size={18} className="text-blue-500" />
            </div>
            SSO & Identity
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6 not-prose">
            {['SAML 2.0', 'OAuth 2.0', 'OpenID Connect', 'Auth0'].map((provider) => (
              <div key={provider} className="p-4 rounded-xl border border-border bg-card">
                <h4 className="font-semibold text-foreground">{provider}</h4>
              </div>
            ))}
          </div>

          <CodeBlock
            id="sso"
            language="typescript"
            code={`const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  auth: {
    provider: 'saml',
    sso: {
      entryPoint: 'https://idp.company.com/sso/saml',
      issuer: 'zenith-app',
      cert: process.env.SAML_CERT
    }
  }
});`}
          />
        </section>

        {/* Webhooks */}
        <section id="webhooks" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Webhook size={18} className="text-purple-500" />
            </div>
            Webhooks
          </h2>

          <CodeBlock
            id="webhooks"
            language="typescript"
            code={`// Configure webhook endpoint
await zenith.webhooks.create({
  url: 'https://your-server.com/webhooks/zenith',
  events: ['content.created', 'content.published'],
  secret: process.env.WEBHOOK_SECRET
});

// Verify webhook in your handler
import { verifyWebhook } from '@zenith/sdk';

app.post('/webhooks/zenith', (req, res) => {
  const isValid = verifyWebhook(req.body, req.headers['x-zenith-signature'], process.env.WEBHOOK_SECRET);
  if (!isValid) return res.status(401).send('Invalid');
  
  const { event, data } = req.body;
  console.log(\`Received \${event}:\`, data);
  res.status(200).send('OK');
});`}
          />
        </section>

        {/* Connectors Grid */}
        <div className="not-prose">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Available Connectors</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {connectors.map((connector) => (
              <div key={connector.name} className="p-3 rounded-xl border border-border bg-card text-center hover:border-primary/50 transition-colors">
                <span className="text-xl mb-1 block">{connector.icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{connector.name}</span>
              </div>
            ))}
          </div>
        </div>
      </DocsLayout>
    </>
  );
};

export default Integrations;