import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Workflow, ChevronRight, Play, Zap, Clock, GitBranch,
  ArrowRight, Webhook, Mail, MessageSquare, Database,
  RefreshCw, Check, AlertTriangle, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';

const triggers = [
  { icon: Database, name: 'Content Created', description: 'When new content is published' },
  { icon: Clock, name: 'Scheduled', description: 'Run at specific times' },
  { icon: Webhook, name: 'Webhook', description: 'External HTTP trigger' },
  { icon: GitBranch, name: 'Conditional', description: 'Based on conditions' },
];

const actions = [
  { icon: Mail, name: 'Send Email', description: 'Notify users via email' },
  { icon: MessageSquare, name: 'Slack Message', description: 'Post to Slack channels' },
  { icon: Globe, name: 'HTTP Request', description: 'Call external APIs' },
  { icon: Database, name: 'Update Record', description: 'Modify database entries' },
  { icon: Zap, name: 'Run AI Task', description: 'Execute AI operations' },
  { icon: RefreshCw, name: 'Sync Data', description: 'Sync with external systems' },
];

const exampleWorkflows = [
  {
    name: 'Content Approval',
    description: 'Notify editors when content needs review',
    steps: ['Content created', 'Check status = draft', 'Send Slack notification', 'Update assignee'],
    color: '#3B82F6'
  },
  {
    name: 'Auto Translation',
    description: 'Translate published content to target languages',
    steps: ['Content published', 'Detect language', 'Translate via AI', 'Create localized versions'],
    color: '#10B981'
  },
  {
    name: 'Social Distribution',
    description: 'Share new posts across social platforms',
    steps: ['Blog post published', 'Generate excerpt', 'Post to Twitter', 'Post to LinkedIn'],
    color: '#F59E0B'
  },
];

const Automation = () => {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  return (
    <>
      <SEO 
        title="Automation | Zenith Studio Documentation"
        description="Build powerful workflows with triggers, actions, and conditional logic. Integrate with n8n and Zapier."
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
              <span className="text-foreground">Automation</span>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Workflow size={14} />
                Automation
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Workflow Automation</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Build powerful workflows that trigger automatically. Connect triggers to actions 
                and automate your entire content operations.
              </p>
            </motion.div>

            {/* Triggers & Actions */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Triggers */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Play size={20} className="text-primary" />
                  Triggers
                </h2>
                <div className="space-y-3">
                  {triggers.map((trigger, i) => (
                    <motion.div
                      key={trigger.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <trigger.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{trigger.name}</h4>
                        <p className="text-sm text-muted-foreground">{trigger.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-accent" />
                  Actions
                </h2>
                <div className="space-y-3">
                  {actions.map((action, i) => (
                    <motion.div
                      key={action.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <action.icon size={20} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{action.name}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Example Workflows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Example Workflows</h2>
              
              <div className="grid lg:grid-cols-[300px_1fr] gap-6">
                {/* Workflow List */}
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
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: workflow.color }}
                        />
                        <div>
                          <h4 className="font-medium text-foreground">{workflow.name}</h4>
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Workflow Visualization */}
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
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-background"
                          style={{ backgroundColor: exampleWorkflows[activeWorkflow].color }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 p-3 rounded-lg border border-border bg-secondary/30">
                          <span className="text-sm font-medium text-foreground">{step}</span>
                        </div>
                        {i < exampleWorkflows[activeWorkflow].steps.length - 1 && (
                          <div className="absolute left-4 mt-10 w-0.5 h-4 bg-border" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Integrations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-secondary/30 mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">External Integrations</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { name: 'n8n', description: 'Open-source workflow automation', icon: '⚡' },
                  { name: 'Zapier', description: 'Connect 5000+ apps', icon: '🔗' },
                  { name: 'Make', description: 'Visual automation platform', icon: '🎨' },
                ].map((integration, i) => (
                  <div key={integration.name} className="p-4 rounded-xl bg-card border border-border text-center">
                    <span className="text-3xl mb-3 block">{integration.icon}</span>
                    <h4 className="font-semibold text-foreground">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
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
              <h3 className="text-xl font-bold mb-2">Start automating</h3>
              <p className="text-muted-foreground mb-4">Build your first workflow in minutes with our visual builder.</p>
              <Link to="/get-started">
                <Button className="gap-2">
                  Get Started <ArrowRight size={16} />
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

export default Automation;
