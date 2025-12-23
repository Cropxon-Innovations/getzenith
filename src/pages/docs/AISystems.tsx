import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, ChevronRight, Sparkles, Brain, Wand2, MessageSquare,
  ArrowRight, Copy, Check, Terminal, Zap, Globe, Image,
  FileText, Languages, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';

const aiCapabilities = [
  {
    icon: Wand2,
    title: 'Content Generation',
    description: 'Generate blog posts, product descriptions, and marketing copy',
    color: '#8B5CF6'
  },
  {
    icon: MessageSquare,
    title: 'Conversational AI',
    description: 'Build chatbots and virtual assistants',
    color: '#3B82F6'
  },
  {
    icon: Image,
    title: 'Image Analysis',
    description: 'Auto-tagging, alt text generation, and moderation',
    color: '#10B981'
  },
  {
    icon: Languages,
    title: 'Translation',
    description: 'Automatic content translation to 100+ languages',
    color: '#F59E0B'
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description: 'AI-powered search across your content',
    color: '#EC4899'
  },
  {
    icon: FileText,
    title: 'Summarization',
    description: 'Auto-generate summaries and excerpts',
    color: '#06B6D4'
  },
];

const mcpConnectors = [
  { name: 'OpenAI', models: ['GPT-4', 'GPT-3.5', 'DALL-E'], icon: '🤖' },
  { name: 'Anthropic', models: ['Claude 3', 'Claude Instant'], icon: '🧠' },
  { name: 'Google AI', models: ['Gemini Pro', 'PaLM 2'], icon: '🔮' },
  { name: 'Cohere', models: ['Command', 'Embed'], icon: '💫' },
  { name: 'Hugging Face', models: ['Custom Models'], icon: '🤗' },
  { name: 'Local LLMs', models: ['Ollama', 'LM Studio'], icon: '🏠' },
];

const codeExample = `import { Zenith } from '@zenith/sdk';

const zenith = new Zenith({ apiKey: 'your-api-key' });

// Generate content with AI
const blogPost = await zenith.ai.generate({
  type: 'blog-post',
  prompt: 'Write about the future of AI in education',
  tone: 'professional',
  length: 'medium'
});

// Auto-translate to multiple languages
const translations = await zenith.ai.translate({
  content: blogPost.content,
  targetLanguages: ['es', 'fr', 'de', 'ja']
});

// Generate image alt text
const altText = await zenith.ai.describe({
  imageUrl: 'https://example.com/image.jpg'
});`;

const AISystems = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      <SEO 
        title="AI Systems | Zenith Studio Documentation"
        description="AI-powered features for content generation, translation, image analysis, and more."
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
              <span className="text-foreground">AI Systems</span>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Bot size={14} />
                AI Systems
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">AI-Powered Intelligence</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Leverage AI to automate content creation, enhance user experiences, 
                and unlock new capabilities across your digital platform.
              </p>
            </motion.div>

            {/* AI Capabilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
            >
              {aiCapabilities.map((capability, i) => (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${capability.color}15` }}
                  >
                    <capability.icon size={20} style={{ color: capability.color }} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* MCP Connectors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-2">MCP Connectors</h2>
              <p className="text-muted-foreground mb-6">
                Connect to any AI provider through our Model Context Protocol (MCP) layer.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mcpConnectors.map((connector, i) => (
                  <motion.div
                    key={connector.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{connector.icon}</span>
                      <h4 className="font-semibold text-foreground">{connector.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {connector.models.map(model => (
                        <span 
                          key={model}
                          className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Code Example */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">AI Integration Example</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copiedCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copiedCode ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-muted-foreground">
                    {codeExample.split('\n').map((line, i) => (
                      <div key={i} className="leading-relaxed">
                        <span className="text-muted-foreground/40 mr-4 select-none">{String(i + 1).padStart(2, '0')}</span>
                        <span dangerouslySetInnerHTML={{ 
                          __html: line
                            .replace(/(import|from|const|await|new)/g, '<span class="text-primary">$1</span>')
                            .replace(/('.*?')/g, '<span class="text-green-400">$1</span>')
                            .replace(/(\/\/.*)/g, '<span class="text-muted-foreground/60">$1</span>')
                        }} />
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </motion.div>

            {/* Use Cases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-secondary/30 mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { 
                    title: 'E-commerce', 
                    description: 'Auto-generate product descriptions, translate listings, and create marketing copy.',
                    icon: '🛒'
                  },
                  { 
                    title: 'Publishing', 
                    description: 'Draft articles, summarize content, and optimize for SEO automatically.',
                    icon: '📰'
                  },
                  { 
                    title: 'Education', 
                    description: 'Create quizzes, generate explanations, and personalize learning paths.',
                    icon: '🎓'
                  },
                  { 
                    title: 'Support', 
                    description: 'Build AI chatbots, auto-respond to queries, and analyze sentiment.',
                    icon: '💬'
                  },
                ].map((useCase, i) => (
                  <div key={useCase.title} className="flex gap-4">
                    <span className="text-3xl">{useCase.icon}</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{useCase.title}</h4>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </div>
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
              <h3 className="text-xl font-bold mb-2">Ready to add AI?</h3>
              <p className="text-muted-foreground mb-4">Start building AI-powered features in minutes.</p>
              <Link to="/docs/automation">
                <Button className="gap-2">
                  Explore Automation <ArrowRight size={16} />
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

export default AISystems;
