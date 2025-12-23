import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plug,
  Check,
  X,
  ExternalLink,
  Settings,
  Zap,
  Database,
  Mail,
  CreditCard,
  MessageSquare,
  BarChart3,
  Cloud,
  Shield,
  Search,
  ArrowRight,
  Sparkles,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';

// Available integrations
const integrations = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments and manage subscriptions',
    category: 'payments',
    icon: CreditCard,
    connected: true,
    popular: true,
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and automation',
    category: 'marketing',
    icon: Mail,
    connected: false,
    popular: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    category: 'communication',
    icon: MessageSquare,
    connected: true,
    popular: true,
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Website traffic and user analytics',
    category: 'analytics',
    icon: BarChart3,
    connected: false,
    popular: true,
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Cloud storage for media files',
    category: 'storage',
    icon: Cloud,
    connected: false,
    popular: false,
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Enterprise SSO authentication',
    category: 'security',
    icon: Shield,
    connected: false,
    popular: false,
    enterprise: true,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5000+ apps',
    category: 'automation',
    icon: Zap,
    connected: false,
    popular: true,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and sales automation',
    category: 'crm',
    icon: Database,
    connected: false,
    popular: false,
  },
];

// Available connectors (from the system)
const availableConnectors = [
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'AI voice generation, text-to-speech, and speech-to-text',
    category: 'ai',
    icon: Sparkles,
    connected: false,
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    description: 'AI-powered scraper, search and retrieval tool',
    category: 'ai',
    icon: Globe,
    connected: false,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'AI-powered search and answer engine',
    category: 'ai',
    icon: Search,
    connected: false,
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'payments', label: 'Payments' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'communication', label: 'Communication' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'automation', label: 'Automation' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'security', label: 'Security' },
];

export default function Integrations() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allIntegrations = [...integrations, ...availableConnectors];

  const filteredIntegrations = allIntegrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = allIntegrations.filter(i => i.connected).length;

  const handleConnect = (name: string) => {
    toast({
      title: 'Connecting...',
      description: `Setting up ${name} integration`,
    });
  };

  const handleDisconnect = (name: string) => {
    toast({
      title: 'Disconnected',
      description: `${name} has been disconnected`,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Integrations & Connectors</h1>
            <p className="text-muted-foreground">Connect your favorite tools and services</p>
          </div>
          <Badge variant="secondary" className="w-fit">
            <Plug size={14} className="mr-1" />
            {connectedCount} Connected
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Available', value: allIntegrations.length, icon: Plug, color: 'text-blue-500' },
            { label: 'Connected', value: connectedCount, icon: Check, color: 'text-green-500' },
            { label: 'AI Services', value: availableConnectors.length, icon: Sparkles, color: 'text-purple-500' },
            { label: 'Enterprise', value: integrations.filter(i => i.enterprise).length, icon: Shield, color: 'text-orange-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">All Integrations</TabsTrigger>
              <TabsTrigger value="connected">Connected</TabsTrigger>
              <TabsTrigger value="connectors">AI Connectors</TabsTrigger>
            </TabsList>

            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* All Integrations Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`relative overflow-hidden ${integration.connected ? 'border-green-500/50' : ''}`}>
                    {'popular' in integration && integration.popular && (
                      <Badge className="absolute top-3 right-3 bg-primary/10 text-primary">
                        Popular
                      </Badge>
                    )}
                    {'enterprise' in integration && integration.enterprise && (
                      <Badge className="absolute top-3 right-3 bg-orange-500/10 text-orange-500">
                        Enterprise
                      </Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <integration.icon size={24} className="text-foreground" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {integration.name}
                            {integration.connected && (
                              <Check size={14} className="text-green-500" />
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        {integration.connected ? (
                          <>
                            <Button variant="outline" size="sm">
                              <Settings size={14} className="mr-2" />
                              Configure
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => handleDisconnect(integration.name)}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button 
                            className="w-full" 
                            onClick={() => handleConnect(integration.name)}
                          >
                            <Plug size={14} className="mr-2" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Connected Tab */}
          <TabsContent value="connected" className="space-y-4">
            {allIntegrations.filter(i => i.connected).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plug size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Connected Integrations</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your first integration to get started
                  </p>
                  <Button>Browse Integrations</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allIntegrations.filter(i => i.connected).map((integration, index) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-green-500/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <integration.icon size={20} />
                            </div>
                            <div>
                              <CardTitle className="text-base">{integration.name}</CardTitle>
                              <Badge variant="secondary" className="mt-1 bg-green-500/10 text-green-500">
                                Connected
                              </Badge>
                            </div>
                          </div>
                          <Switch checked />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings size={14} className="mr-2" />
                            Settings
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* AI Connectors Tab */}
          <TabsContent value="connectors" className="space-y-4">
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Sparkles size={24} className="text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">AI-Powered Connectors</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect AI services to enhance your platform with voice, search, and more
                    </p>
                  </div>
                  <Button>
                    Explore AI Features
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableConnectors.map((connector, index) => (
                <motion.div
                  key={connector.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:border-purple-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <connector.icon size={24} className="text-purple-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{connector.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {connector.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        onClick={() => handleConnect(connector.name)}
                      >
                        <Plug size={14} className="mr-2" />
                        Connect {connector.name}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}