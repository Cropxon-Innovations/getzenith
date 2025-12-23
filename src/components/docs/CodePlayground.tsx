import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, Check, Terminal, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaygroundExample {
  id: string;
  name: string;
  description: string;
  code: string;
  expectedOutput: string;
}

const examples: PlaygroundExample[] = [
  {
    id: 'create-content',
    name: 'Create Content',
    description: 'Create a new blog post using the CMS API',
    code: `// Create a new blog post
const response = await zenith.cms.create({
  type: 'blog',
  title: 'Hello World',
  data: {
    body: 'This is my first post!',
    author: 'John Doe',
    tags: ['tutorial', 'getting-started']
  }
});

console.log(response);`,
    expectedOutput: `{
  "id": "content_abc123",
  "type": "blog",
  "title": "Hello World",
  "status": "draft",
  "createdAt": "2024-01-15T10:30:00Z",
  "data": {
    "body": "This is my first post!",
    "author": "John Doe",
    "tags": ["tutorial", "getting-started"]
  }
}`
  },
  {
    id: 'query-content',
    name: 'Query Content',
    description: 'Fetch published blog posts with pagination',
    code: `// Query published blog posts
const posts = await zenith.cms.query({
  type: 'blog',
  status: 'published',
  limit: 10,
  orderBy: 'createdAt',
  order: 'desc'
});

console.log(posts);`,
    expectedOutput: `{
  "data": [
    {
      "id": "content_xyz789",
      "title": "Getting Started with Zenith",
      "status": "published",
      "publishedAt": "2024-01-14T09:00:00Z"
    },
    {
      "id": "content_def456",
      "title": "Advanced API Patterns",
      "status": "published",
      "publishedAt": "2024-01-13T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}`
  },
  {
    id: 'ai-generate',
    name: 'AI Generation',
    description: 'Generate content using AI capabilities',
    code: `// Generate a blog post with AI
const generated = await zenith.ai.generate({
  type: 'blog-post',
  prompt: 'Write about the benefits of headless CMS',
  tone: 'professional',
  length: 'short'
});

console.log(generated);`,
    expectedOutput: `{
  "content": {
    "title": "5 Key Benefits of Headless CMS",
    "body": "Headless CMS architecture offers unparalleled flexibility for modern digital experiences. Here are the top benefits:\\n\\n1. **Multi-channel delivery** - Serve content to any platform\\n2. **Developer freedom** - Use any frontend framework\\n3. **Scalability** - Handle traffic spikes effortlessly\\n4. **Security** - Reduced attack surface\\n5. **Future-proof** - Easy to adapt to new technologies",
    "excerpt": "Discover why headless CMS is the future of content management."
  },
  "tokens": 245,
  "model": "gpt-4"
}`
  },
];

export const CodePlayground = () => {
  const [activeExample, setActiveExample] = useState(examples[0]);
  const [code, setCode] = useState(activeExample.code);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleExampleChange = (example: PlaygroundExample) => {
    setActiveExample(example);
    setCode(example.code);
    setOutput(null);
    setError(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check for simple validation
    if (!code.trim()) {
      setError('Please enter some code to run');
      setIsRunning(false);
      return;
    }
    
    setOutput(activeExample.expectedOutput);
    setIsRunning(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleReset = () => {
    setCode(activeExample.code);
    setOutput(null);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Interactive Playground</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Test API calls directly in your browser (simulated responses)
          </p>
        </div>
      </div>

      {/* Example Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => handleExampleChange(example)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeExample.id === example.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {example.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">{activeExample.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw size={14} />
                Reset
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
              >
                {copiedCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[300px] p-4 font-mono text-sm bg-transparent text-foreground resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">{activeExample.description}</p>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-sm font-medium">Output</span>
            </div>
            <Button 
              size="sm" 
              onClick={handleRun}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={14} />
                  Run Code
                </>
              )}
            </Button>
          </div>

          <div className="h-[300px] p-4 overflow-auto">
            {isRunning ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 size={24} className="animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Executing...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : output ? (
              <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Click "Run Code" to see the output</p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              ⚡ This is a simulated environment. In production, connect with your API key.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
