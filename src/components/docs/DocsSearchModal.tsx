import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Book, Code, Box, Puzzle, Bot, Workflow,
  FileText, ArrowRight, Command, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: React.ElementType;
  color: string;
}

const searchableContent: SearchResult[] = [
  // Getting Started
  { title: 'Welcome to Zenith', description: 'Introduction and overview', href: '/docs/getting-started', category: 'Getting Started', icon: Book, color: '#3B82F6' },
  { title: 'Quick Start', description: 'Get up and running in minutes', href: '/docs/getting-started#quickstart', category: 'Getting Started', icon: Book, color: '#3B82F6' },
  { title: 'Understanding Studios', description: 'Learn about modular workspaces', href: '/docs/getting-started#studios', category: 'Getting Started', icon: Book, color: '#3B82F6' },
  
  // API Reference
  { title: 'Authentication', description: 'API keys and bearer tokens', href: '/docs/api-reference', category: 'API Reference', icon: Code, color: '#8B5CF6' },
  { title: 'Content API', description: 'CRUD operations for content', href: '/docs/api-reference#content', category: 'API Reference', icon: Code, color: '#8B5CF6' },
  { title: 'Media API', description: 'Upload and manage assets', href: '/docs/api-reference#media', category: 'API Reference', icon: Code, color: '#8B5CF6' },
  { title: 'Users API', description: 'User management endpoints', href: '/docs/api-reference#users', category: 'API Reference', icon: Code, color: '#8B5CF6' },
  { title: 'GraphQL', description: 'Queries and mutations', href: '/docs/api-reference#graphql', category: 'API Reference', icon: Code, color: '#8B5CF6' },
  
  // SDK Guide
  { title: 'JavaScript SDK', description: 'Node.js and browser client', href: '/docs/sdk', category: 'SDK Guide', icon: Box, color: '#10B981' },
  { title: 'Python SDK', description: 'Python client library', href: '/docs/sdk#python', category: 'SDK Guide', icon: Box, color: '#10B981' },
  { title: 'Go SDK', description: 'Go client library', href: '/docs/sdk#go', category: 'SDK Guide', icon: Box, color: '#10B981' },
  { title: 'Interactive Playground', description: 'Test API calls live', href: '/docs/sdk#playground', category: 'SDK Guide', icon: Box, color: '#10B981' },
  
  // Integrations
  { title: 'BYOB Overview', description: 'Bring your own backend', href: '/docs/integrations', category: 'Integrations', icon: Puzzle, color: '#F59E0B' },
  { title: 'PostgreSQL', description: 'PostgreSQL connector', href: '/docs/integrations#postgres', category: 'Integrations', icon: Puzzle, color: '#F59E0B' },
  { title: 'MySQL', description: 'MySQL connector', href: '/docs/integrations#mysql', category: 'Integrations', icon: Puzzle, color: '#F59E0B' },
  { title: 'SSO & Identity', description: 'SAML, OAuth, OpenID', href: '/docs/integrations#sso', category: 'Integrations', icon: Puzzle, color: '#F59E0B' },
  
  // AI Systems
  { title: 'Content Generation', description: 'AI-powered content creation', href: '/docs/ai-systems', category: 'AI Systems', icon: Bot, color: '#EC4899' },
  { title: 'MCP Connectors', description: 'Model Context Protocol', href: '/docs/ai-systems#mcp', category: 'AI Systems', icon: Bot, color: '#EC4899' },
  { title: 'Custom Models', description: 'OpenAI, Anthropic integration', href: '/docs/ai-systems#custom', category: 'AI Systems', icon: Bot, color: '#EC4899' },
  
  // Automation
  { title: 'Workflow Builder', description: 'Create automated workflows', href: '/docs/automation', category: 'Automation', icon: Workflow, color: '#06B6D4' },
  { title: 'Event Triggers', description: 'Content and webhook triggers', href: '/docs/automation#triggers', category: 'Automation', icon: Workflow, color: '#06B6D4' },
  { title: 'n8n Integration', description: 'Connect with n8n', href: '/docs/automation#n8n', category: 'Automation', icon: Workflow, color: '#06B6D4' },
];

interface DocsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsSearchModal = ({ isOpen, onClose }: DocsSearchModalProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredResults = query.length > 0
    ? searchableContent.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchableContent.slice(0, 6);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(result.href);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, handleSelect, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="container max-w-2xl mx-auto px-4 pt-[10vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={20} className="text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
                <span>esc</span>
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center">
                  <Search size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredResults.map((result, index) => (
                    <button
                      key={result.href}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                        selectedIndex === index
                          ? "bg-primary/10"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${result.color}15` }}
                      >
                        <result.icon size={18} style={{ color: result.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground truncate">{result.title}</span>
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                      </div>
                      {selectedIndex === index && (
                        <ArrowRight size={16} className="text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd>
                  to select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted">esc</kbd>
                to close
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hook to use the search modal with Cmd+K
export const useDocsSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

export default DocsSearchModal;