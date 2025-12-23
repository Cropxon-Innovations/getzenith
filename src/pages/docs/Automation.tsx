import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Workflow, Play, Zap, Clock, GitBranch, Webhook, Mail,
  MessageSquare, Database, RefreshCw, Globe, Copy, Check
} from 'lucide-react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { SyntaxHighlighter } from '@/components/docs/SyntaxHighlighter';
import { SEO } from '@/components/SEO';

const triggers = [
  { icon: Database, name: 'Content Created', description: 'When new content is published' },
  { icon: Clock, name: 'Scheduled', description: 'Run at specific times' },
  { icon: Webhook, name: 'Webhook', description: 'External HTTP trigger' },
  { icon: GitBranch, name: 'Conditional', description: 'Based on conditions' },
];

const actions = [
  { icon: Mail, name: 'Send Email', description: 'Notify via email' },
  { icon: MessageSquare, name: 'Slack Message', description: 'Post to Slack' },
  { icon: Globe, name: 'HTTP Request', description: 'Call external APIs' },
  { icon: Database, name: 'Update Record', description: 'Modify database' },
  { icon: Zap, name: 'Run AI Task', description: 'Execute AI ops' },
  { icon: RefreshCw, name: 'Sync Data', description: 'Sync systems' },
];

const exampleWorkflows = [
  { name: 'Content Approval', steps: ['Content created', 'Check status', 'Send Slack notification', 'Update assignee'], color: '#3B82F6' },
  { name: 'Auto Translation', steps: ['Content published', 'Detect language', 'Translate via AI', 'Create versions'], color: '#10B981' },
  { name: 'Social Distribution', steps: ['Blog post published', 'Generate excerpt', 'Post to Twitter', 'Post to LinkedIn'], color: '#F59E0B' },
];

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'triggers', title: 'Event Triggers', level: 2 },
  { id: 'actions', title: 'Actions', level: 2 },
  { id: 'examples', title: 'Example Workflows', level: 2 },
  { id: 'n8n', title: 'n8n Integration', level: 2 },
];

const Automation = () => {
  const [activeWorkflow, setActiveWorkflow] = useState(0);
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
        title="Automation | Zenith Studio Documentation"
        description="Build powerful workflows with triggers, actions, and n8n integration."
      />
      <DocsLayout
        title="Automation"
        description="Build powerful workflows that connect your content, users, and external services. Automate repetitive tasks and create intelligent pipelines."
        icon={Workflow}
        iconColor="#06B6D4"
        readTime="10 min"
        difficulty="Intermediate"
        tableOfContents={tableOfContents}
        prevPage={{ title: 'AI Systems', href: '/docs/ai-systems' }}
      >
        {/* Overview */}
        <section id="overview" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Zap size={18} className="text-cyan-500" />
            </div>
            Overview
          </h2>

          <p className="text-muted-foreground mb-6">
            Zenith's automation system lets you create workflows that respond to events, process data, and connect with external services.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 not-prose">
            {[
              { icon: Play, title: 'Triggers', desc: 'Start workflows on events', color: '#10B981' },
              { icon: Zap, title: 'Actions', desc: 'Execute tasks', color: '#8B5CF6' },
              { icon: RefreshCw, title: 'Loops', desc: 'Process collections', color: '#F59E0B' },
            ].map((item) => (
              <div key={item.title} className="text-center p-4 rounded-xl border border-border bg-card">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon size={24} style={{ color: item.color }} />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Triggers & Actions */}
        <section id="triggers" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Play size={18} className="text-green-500" />
            </div>
            Event Triggers
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 not-prose">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Triggers</h3>
              <div className="space-y-3">
                {triggers.map((trigger) => (
                  <div key={trigger.name} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <trigger.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{trigger.name}</h4>
                      <p className="text-sm text-muted-foreground">{trigger.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="actions">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Actions</h3>
              <div className="space-y-3">
                {actions.map((action) => (
                  <div key={action.name} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <action.icon size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{action.name}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Example Workflows */}
        <section id="examples" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Example Workflows</h2>
          
          <div className="grid lg:grid-cols-[280px_1fr] gap-6 not-prose">
            <div className="space-y-2">
              {exampleWorkflows.map((workflow, i) => (
                <button
                  key={workflow.name}
                  onClick={() => setActiveWorkflow(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeWorkflow === i
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: workflow.color }} />
                    <span className="font-medium text-foreground">{workflow.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <motion.div
              key={activeWorkflow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <h3 className="font-semibold text-foreground mb-6">
                {exampleWorkflows[activeWorkflow].name}
              </h3>
              <div className="flex flex-col gap-4">
                {exampleWorkflows[activeWorkflow].steps.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
                      style={{ backgroundColor: exampleWorkflows[activeWorkflow].color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 p-3 rounded-lg border border-border bg-secondary/30">
                      <span className="text-sm font-medium text-foreground">{step}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* n8n Integration */}
        <section id="n8n" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Workflow size={18} className="text-red-500" />
            </div>
            n8n Integration
          </h2>

          <p className="text-muted-foreground mb-6">
            Connect Zenith to n8n for access to 400+ integrations.
          </p>

          <CodeBlock
            id="n8n"
            language="typescript"
            code={`const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  automation: {
    n8n: {
      baseUrl: 'https://your-n8n-instance.com',
      apiKey: process.env.N8N_API_KEY
    }
  }
});

// Trigger n8n workflow
await zenith.automation.triggerN8n({
  workflowId: 'abc123',
  data: { content: publishedContent, timestamp: new Date().toISOString() }
});`}
          />

          {/* External Integrations */}
          <div className="mt-8 p-8 rounded-2xl border border-border bg-secondary/30 not-prose">
            <h3 className="text-lg font-bold mb-6 text-foreground">External Integrations</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { name: 'n8n', desc: 'Open-source workflow automation', icon: '⚡' },
                { name: 'Zapier', desc: 'Connect 5000+ apps', icon: '🔗' },
                { name: 'Make', desc: 'Visual automation platform', icon: '🎨' },
              ].map((integration) => (
                <div key={integration.name} className="p-4 rounded-xl bg-card border border-border text-center">
                  <span className="text-3xl mb-3 block">{integration.icon}</span>
                  <h4 className="font-semibold text-foreground">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground">{integration.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </DocsLayout>
    </>
  );
};

export default Automation;