import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Sparkles, Wand2, MessageSquare, Image, FileText,
  Languages, Search, Copy, Check, Zap, Cpu
} from 'lucide-react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { SyntaxHighlighter } from '@/components/docs/SyntaxHighlighter';
import { SEO } from '@/components/SEO';

const aiCapabilities = [
  { icon: Wand2, title: 'Content Generation', description: 'Generate blog posts, descriptions, and copy', color: '#8B5CF6' },
  { icon: MessageSquare, title: 'Conversational AI', description: 'Build chatbots and assistants', color: '#3B82F6' },
  { icon: Image, title: 'Image Analysis', description: 'Auto-tagging and alt text', color: '#10B981' },
  { icon: Languages, title: 'Translation', description: 'Translate to 100+ languages', color: '#F59E0B' },
  { icon: Search, title: 'Semantic Search', description: 'AI-powered search', color: '#EC4899' },
  { icon: FileText, title: 'Summarization', description: 'Auto-generate summaries', color: '#06B6D4' },
];

const mcpConnectors = [
  { name: 'OpenAI', models: ['GPT-4', 'GPT-3.5', 'DALL-E'], icon: '🤖' },
  { name: 'Anthropic', models: ['Claude 3', 'Claude Instant'], icon: '🧠' },
  { name: 'Google AI', models: ['Gemini Pro', 'PaLM 2'], icon: '🔮' },
  { name: 'Cohere', models: ['Command', 'Embed'], icon: '💫' },
  { name: 'Hugging Face', models: ['Custom Models'], icon: '🤗' },
  { name: 'Local LLMs', models: ['Ollama', 'LM Studio'], icon: '🏠' },
];

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'content-generation', title: 'Content Generation', level: 2 },
  { id: 'mcp', title: 'MCP Connectors', level: 2 },
  { id: 'custom', title: 'Custom Models', level: 2 },
];

const AISystems = () => {
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
        title="AI Systems | Zenith Studio Documentation"
        description="AI-powered content generation, MCP connectors, and custom model integration."
      />
      <DocsLayout
        title="AI Systems"
        description="Leverage AI to generate content, automate workflows, and enhance your digital experiences with built-in and custom AI models."
        icon={Bot}
        iconColor="#EC4899"
        readTime="12 min"
        difficulty="Intermediate"
        tableOfContents={tableOfContents}
        prevPage={{ title: 'Integrations', href: '/docs/integrations' }}
        nextPage={{ title: 'Automation', href: '/docs/automation' }}
      >
        {/* Overview */}
        <section id="overview" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <Sparkles size={18} className="text-pink-500" />
            </div>
            Overview
          </h2>

          <p className="text-muted-foreground mb-6">
            Zenith's AI systems provide powerful tools for content generation, automation, and intelligent workflows.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
            {aiCapabilities.map((capability) => (
              <motion.div
                key={capability.title}
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
          </div>
        </section>

        {/* Content Generation */}
        <section id="content-generation" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Wand2 size={18} className="text-blue-500" />
            </div>
            Content Generation
          </h2>

          <CodeBlock
            id="content-gen"
            language="typescript"
            code={`const zenith = new Zenith({ apiKey: process.env.ZENITH_API_KEY });

// Generate a blog post
const blogPost = await zenith.ai.generate({
  type: 'blog-post',
  prompt: 'Write about TypeScript best practices',
  options: {
    tone: 'professional',
    length: 'long',
    includeCodeExamples: true
  }
});

// Generate SEO metadata
const seo = await zenith.ai.generateSEO({
  content: blogPost.content,
  targetKeywords: ['typescript', 'best practices']
});`}
          />

          <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-primary/5 not-prose">
            <div className="flex items-start gap-3">
              <Zap size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  Use <code className="px-1 py-0.5 rounded bg-muted text-xs">stream: true</code> for real-time content generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MCP Connectors */}
        <section id="mcp" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Cpu size={18} className="text-purple-500" />
            </div>
            MCP Connectors
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">New</span>
          </h2>

          <p className="text-muted-foreground mb-6">
            Model Context Protocol (MCP) connectors extend AI with custom tools and data sources.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 not-prose">
            {mcpConnectors.map((connector) => (
              <div key={connector.name} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{connector.icon}</span>
                  <h4 className="font-semibold text-foreground">{connector.name}</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {connector.models.map(model => (
                    <span key={model} className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <CodeBlock
            id="mcp"
            language="typescript"
            code={`const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  mcp: {
    tools: [
      {
        name: 'fetch_product_data',
        description: 'Fetch product information from database',
        parameters: {
          type: 'object',
          properties: { productId: { type: 'string' } }
        },
        handler: async ({ productId }) => {
          return await db.products.findById(productId);
        }
      }
    ]
  }
});

// AI can now use your custom tools
const response = await zenith.ai.chat({
  messages: [{ role: 'user', content: 'Get details for product SKU-123' }],
  tools: ['fetch_product_data']
});`}
          />
        </section>

        {/* Custom Models */}
        <section id="custom" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Bot size={18} className="text-green-500" />
            </div>
            Custom Models
          </h2>

          <p className="text-muted-foreground mb-6">
            Bring your own AI models from OpenAI, Anthropic, or any OpenAI-compatible endpoint.
          </p>

          <CodeBlock
            id="openai"
            language="typescript"
            code={`// OpenAI
const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  ai: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
  }
});

// Anthropic
const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  ai: {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-opus-20240229',
  }
});`}
          />
        </section>

        {/* Use Cases */}
        <div className="p-8 rounded-2xl border border-border bg-secondary/30 not-prose">
          <h3 className="text-xl font-bold mb-6 text-foreground">Use Cases</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'E-commerce', desc: 'Auto-generate product descriptions and marketing copy', icon: '🛒' },
              { title: 'Publishing', desc: 'Draft articles, summarize content, optimize SEO', icon: '📰' },
              { title: 'Education', desc: 'Create quizzes and personalize learning paths', icon: '🎓' },
              { title: 'Support', desc: 'Build AI chatbots and analyze sentiment', icon: '💬' },
            ].map((useCase) => (
              <div key={useCase.title} className="flex gap-4">
                <span className="text-3xl">{useCase.icon}</span>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{useCase.title}</h4>
                  <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DocsLayout>
    </>
  );
};

export default AISystems;