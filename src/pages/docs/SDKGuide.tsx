import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, ChevronRight, Copy, Check, Terminal, Download,
  Code, ArrowRight, Play, Zap, FileText, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { CodePlayground } from '@/components/docs/CodePlayground';
import { SyntaxHighlighter } from '@/components/docs/SyntaxHighlighter';

const sdks = [
  { 
    name: 'JavaScript', 
    package: '@zenith/sdk', 
    icon: '⚡', 
    color: '#F7DF1E',
    install: 'npm install @zenith/sdk',
    example: `import { Zenith } from '@zenith/sdk';

const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  tenantId: 'your-tenant-id'
});

// Create content
const content = await zenith.cms.create({
  type: 'blog',
  title: 'My First Post',
  data: { body: 'Hello World!' }
});

// Query content
const posts = await zenith.cms.query({
  type: 'blog',
  status: 'published',
  limit: 10
});`
  },
  { 
    name: 'Python', 
    package: 'zenith-sdk', 
    icon: '🐍', 
    color: '#3776AB',
    install: 'pip install zenith-sdk',
    example: `from zenith import Zenith

zenith = Zenith(
    api_key=os.environ["ZENITH_API_KEY"],
    tenant_id="your-tenant-id"
)

# Create content
content = zenith.cms.create(
    type="blog",
    title="My First Post",
    data={"body": "Hello World!"}
)

# Query content
posts = zenith.cms.query(
    type="blog",
    status="published",
    limit=10
)`
  },
  { 
    name: 'Go', 
    package: 'github.com/zenith/go-sdk', 
    icon: '🔷', 
    color: '#00ADD8',
    install: 'go get github.com/zenith/go-sdk',
    example: `package main

import (
    "github.com/zenith/go-sdk"
)

func main() {
    client := zenith.NewClient(
        os.Getenv("ZENITH_API_KEY"),
        "your-tenant-id",
    )

    // Create content
    content, err := client.CMS.Create(zenith.CreateInput{
        Type:  "blog",
        Title: "My First Post",
        Data:  map[string]any{"body": "Hello World!"},
    })
}`
  },
  { 
    name: 'Ruby', 
    package: 'zenith-sdk', 
    icon: '💎', 
    color: '#CC342D',
    install: 'gem install zenith-sdk',
    example: `require 'zenith'

zenith = Zenith::Client.new(
  api_key: ENV['ZENITH_API_KEY'],
  tenant_id: 'your-tenant-id'
)

# Create content
content = zenith.cms.create(
  type: 'blog',
  title: 'My First Post',
  data: { body: 'Hello World!' }
)`
  },
];

const features = [
  { icon: Zap, title: 'Type Safety', description: 'Full TypeScript support with auto-generated types' },
  { icon: Globe, title: 'Multi-Platform', description: 'Works in Node.js, browsers, and edge runtimes' },
  { icon: FileText, title: 'Auto Pagination', description: 'Seamlessly iterate through large datasets' },
  { icon: Code, title: 'Error Handling', description: 'Rich error types with detailed messages' },
];

const SDKGuide = () => {
  const [activeSDK, setActiveSDK] = useState('JavaScript');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentSDK = sdks.find(sdk => sdk.name === activeSDK) || sdks[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <SEO 
        title="SDK Guide | Zenith Studio Documentation"
        description="Client libraries for JavaScript, Python, Go, Ruby, and more. Install and start building in minutes."
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
              <span className="text-foreground">SDK Guide</span>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Box size={14} />
                SDK Guide
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Zenith SDK</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Official client libraries to integrate Zenith into your applications. 
                Available for all major programming languages.
              </p>
            </motion.div>

            {/* SDK Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
              {features.map((feature, i) => (
                <div key={feature.title} className="p-4 rounded-xl border border-border bg-card">
                  <feature.icon size={20} className="text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </motion.div>

            {/* SDK Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold mb-4">Choose Your Language</h2>
              <div className="flex flex-wrap gap-2">
                {sdks.map((sdk) => (
                  <button
                    key={sdk.name}
                    onClick={() => setActiveSDK(sdk.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                      activeSDK === sdk.name
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <span className="text-lg">{sdk.icon}</span>
                    <span className="font-medium">{sdk.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Installation & Example */}
            <motion.div
              key={activeSDK}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Installation */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Download size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Installation</span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentSDK.install, 'install')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copiedCode === 'install' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copiedCode === 'install' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="p-4">
                  <code className="text-sm font-mono text-primary">{currentSDK.install}</code>
                </div>
              </div>

              {/* Package Info */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Package Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Package</span>
                    <code className="text-sm font-mono text-foreground">{currentSDK.package}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm text-foreground">v2.4.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">License</span>
                    <span className="text-sm text-foreground">MIT</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Code Example */}
            <motion.div
              key={`${activeSDK}-example`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Quick Start Example</span>
                </div>
                <button
                  onClick={() => handleCopy(currentSDK.example, 'example')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                >
                  {copiedCode === 'example' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copiedCode === 'example' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <SyntaxHighlighter 
                  code={currentSDK.example} 
                  language={activeSDK === 'Python' ? 'javascript' : 'typescript'} 
                  showLineNumbers={true} 
                />
              </div>
            </motion.div>

            {/* Interactive Playground */}
            <CodePlayground />

            {/* Advanced Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold mb-6">Advanced Topics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Error Handling', description: 'Learn how to handle errors gracefully' },
                  { title: 'Pagination', description: 'Iterate through large datasets efficiently' },
                  { title: 'Webhooks', description: 'Set up real-time event notifications' },
                  { title: 'File Uploads', description: 'Upload and manage media assets' },
                  { title: 'Batch Operations', description: 'Perform bulk operations efficiently' },
                  { title: 'Caching', description: 'Optimize performance with caching' },
                ].map((topic, i) => (
                  <motion.div
                    key={topic.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5"
            >
              <h3 className="text-xl font-bold mb-2">Explore More</h3>
              <p className="text-muted-foreground mb-4">Check out our API reference for complete endpoint documentation.</p>
              <Link to="/docs/api-reference">
                <Button className="gap-2">
                  View API Reference <ArrowRight size={16} />
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

export default SDKGuide;
