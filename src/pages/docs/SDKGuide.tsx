import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Terminal, Check, Copy, Download, Zap, Code, FileText, Globe } from 'lucide-react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { SyntaxHighlighter } from '@/components/docs/SyntaxHighlighter';
import { CodePlayground } from '@/components/docs/CodePlayground';
import { SEO } from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const sdks = [
  { name: 'JavaScript', package: '@zenith/sdk', icon: '⚡', color: '#F7DF1E', install: 'npm install @zenith/sdk' },
  { name: 'Python', package: 'zenith-sdk', icon: '🐍', color: '#3776AB', install: 'pip install zenith-sdk' },
  { name: 'Go', package: 'github.com/zenith/go-sdk', icon: '🔷', color: '#00ADD8', install: 'go get github.com/zenith/go-sdk' },
  { name: 'Ruby', package: 'zenith-sdk', icon: '💎', color: '#CC342D', install: 'gem install zenith-sdk' },
];

const features = [
  { icon: Zap, title: 'Type Safety', description: 'Full TypeScript support' },
  { icon: Globe, title: 'Multi-Platform', description: 'Node.js, browsers, edge' },
  { icon: FileText, title: 'Auto Pagination', description: 'Seamless iteration' },
  { icon: Code, title: 'Error Handling', description: 'Rich error types' },
];

const tableOfContents = [
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'quickstart', title: 'Quick Start', level: 2 },
  { id: 'configuration', title: 'Configuration', level: 2 },
  { id: 'playground', title: 'Interactive Playground', level: 2 },
  { id: 'error-handling', title: 'Error Handling', level: 2 },
  { id: 'typescript', title: 'TypeScript Support', level: 2 },
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
        title="SDK Guide | Zenith Studio Documentation"
        description="Official SDK documentation for JavaScript, Python, Go, and Ruby."
      />
      <DocsLayout
        title="SDK Guide"
        description="Official client libraries to integrate Zenith into your applications. Available for all major programming languages."
        icon={Box}
        iconColor="#10B981"
        readTime="12 min"
        difficulty="Beginner"
        tableOfContents={tableOfContents}
        prevPage={{ title: 'API Reference', href: '/docs/api-reference' }}
        nextPage={{ title: 'Integrations', href: '/docs/integrations' }}
      >
        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 not-prose">
          {features.map((feature) => (
            <div key={feature.title} className="p-4 rounded-xl border border-border bg-card">
              <feature.icon size={20} className="text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Installation */}
        <section id="installation" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Download size={18} className="text-green-500" />
            </div>
            Installation
          </h2>

          <div className="flex flex-wrap gap-2 mb-6 not-prose">
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

          <CodeBlock id="install" language="bash" code={currentSDK.install} />
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Zap size={18} className="text-blue-500" />
            </div>
            Quick Start
          </h2>

          <Tabs defaultValue="typescript" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="go">Go</TabsTrigger>
            </TabsList>
            
            <TabsContent value="typescript">
              <CodeBlock
                id="quickstart-ts"
                language="typescript"
                code={`import { Zenith } from '@zenith/sdk';

const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  tenantId: 'your-tenant-id'
});

// Create content
const post = await zenith.cms.create({
  type: 'blog',
  title: 'Hello World',
  data: { body: 'This is my first post!' }
});

// List all content
const allPosts = await zenith.cms.list({ type: 'blog' });`}
              />
            </TabsContent>
            
            <TabsContent value="python">
              <CodeBlock
                id="quickstart-py"
                language="python"
                code={`from zenith import Zenith
import os

zenith = Zenith(
    api_key=os.environ['ZENITH_API_KEY'],
    tenant_id='your-tenant-id'
)

# Create content
post = zenith.cms.create(
    type='blog',
    title='Hello World',
    data={'body': 'This is my first post!'}
)

# List all content
all_posts = zenith.cms.list(type='blog')`}
              />
            </TabsContent>
            
            <TabsContent value="go">
              <CodeBlock
                id="quickstart-go"
                language="go"
                code={`package main

import (
    "os"
    "github.com/zenith/go-sdk"
)

func main() {
    client := zenith.NewClient(
        os.Getenv("ZENITH_API_KEY"),
        "your-tenant-id",
    )

    post, _ := client.CMS.Create(zenith.CreateInput{
        Type:  "blog",
        Title: "Hello World",
        Data:  map[string]any{"body": "First post!"},
    })
}`}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Terminal size={18} className="text-purple-500" />
            </div>
            Configuration
          </h2>

          <CodeBlock
            id="config"
            language="typescript"
            code={`const zenith = new Zenith({
  apiKey: process.env.ZENITH_API_KEY,
  tenantId: 'your-tenant-id',
  
  // Optional
  baseUrl: 'https://api.zenith.studio',
  timeout: 30000,
  retries: 3,
  
  // Hooks
  onRequest: (config) => console.log('Request:', config.url),
  onResponse: (response) => console.log('Status:', response.status),
  onError: (error) => console.error('Error:', error.message)
});`}
          />
        </section>

        {/* Interactive Playground */}
        <section id="playground" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
          <p className="text-muted-foreground mb-6">
            Try out the SDK directly in your browser. Edit the code and run it to see the results.
          </p>
          <div className="not-prose">
            <CodePlayground />
          </div>
        </section>

        {/* Error Handling */}
        <section id="error-handling" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Error Handling</h2>

          <CodeBlock
            id="errors"
            language="typescript"
            code={`import { Zenith, AuthError, NotFoundError } from '@zenith/sdk';

try {
  const content = await zenith.cms.get('non-existent-id');
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Content not found:', error.message);
  } else {
    throw error;
  }
}`}
          />
        </section>

        {/* TypeScript Support */}
        <section id="typescript" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">TypeScript Support</h2>

          <CodeBlock
            id="typescript"
            language="typescript"
            code={`import { Zenith, Content, ContentType } from '@zenith/sdk';

interface BlogPost {
  body: string;
  author: string;
  tags: string[];
}

const post = await zenith.cms.create<BlogPost>({
  type: 'blog' as ContentType,
  title: 'My Post',
  data: {
    body: 'Content here...',
    author: 'John Doe',
    tags: ['tutorial']
  }
});

// TypeScript knows post.data has BlogPost shape
console.log(post.data.author); // 'John Doe'`}
          />
        </section>
      </DocsLayout>
    </>
  );
};

export default SDKGuide;