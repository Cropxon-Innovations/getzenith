import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronRight, ChevronDown, Book, Code, Box, Puzzle, 
  Bot, Workflow, Search, Menu, X, ArrowLeft, ArrowRight,
  ExternalLink, Home, MessageCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavSection {
  title: string;
  items: {
    title: string;
    href: string;
    badge?: string;
  }[];
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface DocsLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  readTime?: string;
  difficulty?: string;
  tableOfContents?: TOCItem[];
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

const navigation: { category: string; icon: React.ElementType; color: string; sections: NavSection[] }[] = [
  {
    category: 'Getting Started',
    icon: Book,
    color: '#3B82F6',
    sections: [
      {
        title: 'Introduction',
        items: [
          { title: 'Welcome to Zenith', href: '/docs/getting-started' },
          { title: 'Quick Start', href: '/docs/getting-started#quickstart' },
          { title: 'Core Concepts', href: '/docs/getting-started#studios' },
        ]
      }
    ]
  },
  {
    category: 'API Reference',
    icon: Code,
    color: '#8B5CF6',
    sections: [
      {
        title: 'REST API',
        items: [
          { title: 'Authentication', href: '/docs/api-reference' },
          { title: 'Content API', href: '/docs/api-reference#content' },
          { title: 'Media API', href: '/docs/api-reference#media' },
          { title: 'Users API', href: '/docs/api-reference#users' },
        ]
      },
      {
        title: 'GraphQL',
        items: [
          { title: 'Schema Overview', href: '/docs/api-reference#graphql' },
          { title: 'Queries', href: '/docs/api-reference#queries' },
          { title: 'Mutations', href: '/docs/api-reference#mutations' },
        ]
      }
    ]
  },
  {
    category: 'SDK Guide',
    icon: Box,
    color: '#10B981',
    sections: [
      {
        title: 'Client Libraries',
        items: [
          { title: 'JavaScript SDK', href: '/docs/sdk' },
          { title: 'Python SDK', href: '/docs/sdk#python' },
          { title: 'Go SDK', href: '/docs/sdk#go' },
        ]
      }
    ]
  },
  {
    category: 'Integrations',
    icon: Puzzle,
    color: '#F59E0B',
    sections: [
      {
        title: 'Database',
        items: [
          { title: 'BYOB Overview', href: '/docs/integrations' },
          { title: 'PostgreSQL', href: '/docs/integrations#postgres' },
          { title: 'MySQL', href: '/docs/integrations#mysql' },
        ]
      }
    ]
  },
  {
    category: 'AI Systems',
    icon: Bot,
    color: '#EC4899',
    sections: [
      {
        title: 'AI Features',
        items: [
          { title: 'Content Generation', href: '/docs/ai-systems' },
          { title: 'MCP Connectors', href: '/docs/ai-systems#mcp', badge: 'New' },
          { title: 'Custom Models', href: '/docs/ai-systems#custom' },
        ]
      }
    ]
  },
  {
    category: 'Automation',
    icon: Workflow,
    color: '#06B6D4',
    sections: [
      {
        title: 'Workflows',
        items: [
          { title: 'Workflow Builder', href: '/docs/automation' },
          { title: 'Event Triggers', href: '/docs/automation#triggers' },
          { title: 'n8n Integration', href: '/docs/automation#n8n' },
        ]
      }
    ]
  },
];

export const DocsLayout = ({
  children,
  title,
  description,
  icon: Icon,
  iconColor,
  readTime = '5 min',
  difficulty = 'Beginner',
  tableOfContents = [],
  prevPage,
  nextPage,
}: DocsLayoutProps) => {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Getting Started', 'API Reference', 'SDK Guide', 'Integrations', 'AI Systems', 'Automation']);
  const [activeSection, setActiveSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isActivePath = (href: string) => {
    const basePath = href.split('#')[0];
    return location.pathname === basePath;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="pt-16">
        <div className="flex">
          {/* Left Sidebar - Navigation */}
          <aside className="hidden lg:block w-72 border-r border-border bg-card/50 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
            <div className="p-4">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                  ⌘K
                </kbd>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navigation.map((cat) => (
                  <div key={cat.category}>
                    <button
                      onClick={() => toggleCategory(cat.category)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <cat.icon size={16} style={{ color: cat.color }} />
                        <span className="text-foreground">{cat.category}</span>
                      </div>
                      <ChevronDown 
                        size={14} 
                        className={cn(
                          "text-muted-foreground transition-transform",
                          expandedCategories.includes(cat.category) && "rotate-180"
                        )}
                      />
                    </button>
                    
                    {expandedCategories.includes(cat.category) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-5 border-l border-border pl-3 mt-1 space-y-1"
                      >
                        {cat.sections.map((section) => (
                          <div key={section.title}>
                            <span className="block px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {section.title}
                            </span>
                            {section.items.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                  "flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors",
                                  isActivePath(item.href)
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                              >
                                <span>{item.title}</span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Breadcrumb */}
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
              >
                <Link to="/" className="hover:text-foreground transition-colors">
                  <Home size={14} />
                </Link>
                <ChevronRight size={14} />
                <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                <ChevronRight size={14} />
                <span className="text-foreground font-medium">{title}</span>
              </motion.nav>

              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ 
                    backgroundColor: `${iconColor}15`,
                    color: iconColor,
                    border: `1px solid ${iconColor}30`
                  }}
                >
                  <Icon size={14} />
                  {title}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">{title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {readTime} read
                  </span>
                  <span className="flex items-center gap-1">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      difficulty === 'Beginner' && "bg-green-500",
                      difficulty === 'Intermediate' && "bg-yellow-500",
                      difficulty === 'Advanced' && "bg-red-500"
                    )} />
                    {difficulty}
                  </span>
                </div>
              </motion.header>

              {/* Content */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-gray dark:prose-invert max-w-none"
              >
                {children}
              </motion.article>

              {/* Navigation Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-16 pt-8 border-t border-border"
              >
                <div className="flex items-center justify-between">
                  {prevPage ? (
                    <Link to={prevPage.href}>
                      <Button variant="ghost" className="gap-2">
                        <ArrowLeft size={16} />
                        {prevPage.title}
                      </Button>
                    </Link>
                  ) : <div />}
                  
                  {nextPage && (
                    <Link to={nextPage.href}>
                      <Button variant="ghost" className="gap-2">
                        {nextPage.title}
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Feedback */}
                <div className="mt-8 p-4 rounded-xl border border-border bg-card/50 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Was this page helpful?</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm">👍 Yes</Button>
                    <Button variant="outline" size="sm">👎 No</Button>
                  </div>
                </div>
              </motion.footer>
            </div>
          </main>

          {/* Right Sidebar - TOC */}
          {tableOfContents.length > 0 && (
            <aside className="hidden xl:block w-64 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-l border-border bg-card/30">
              <div className="p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  On This Page
                </h4>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "block py-1 text-sm transition-colors border-l-2 -ml-px",
                        item.level === 2 ? "pl-3" : "pl-6",
                        activeSection === item.id
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                      )}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>

                {/* Help Card */}
                <div className="mt-8 p-4 rounded-xl border border-border bg-card">
                  <h5 className="font-semibold text-sm mb-2">Need Help?</h5>
                  <p className="text-xs text-muted-foreground mb-3">
                    Join our community or contact support.
                  </p>
                  <div className="space-y-2">
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle size={12} />
                      Discord Community
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={12} />
                      GitHub Issues
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Mobile Nav Toggle */}
      <button
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-20 overflow-y-auto"
        >
          <div className="p-4">
            <nav className="space-y-2">
              {navigation.map((cat) => (
                <Link
                  key={cat.category}
                  to={cat.sections[0]?.items[0]?.href || '/docs'}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                >
                  <cat.icon size={20} style={{ color: cat.color }} />
                  <span className="font-medium">{cat.category}</span>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DocsLayout;