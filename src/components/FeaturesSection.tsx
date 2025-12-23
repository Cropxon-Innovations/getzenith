import { motion } from 'framer-motion';
import { 
  FileText, Layout, Globe, GraduationCap, Zap, Users, 
  Shield, BarChart3, Palette, Layers, Clock, Lock
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: FileText,
    title: 'CMS Studio',
    description: 'Create and manage content with a powerful visual editor. Version control, scheduling, and multi-language support built-in.',
    color: 'hsl(217 91% 60%)',
    stats: '50+ content types',
  },
  {
    icon: Layout,
    title: 'Experience Canvas',
    description: 'Design stunning landing pages and microsites with drag-and-drop simplicity. No code required.',
    color: 'hsl(262 83% 58%)',
    stats: '100+ templates',
  },
  {
    icon: Globe,
    title: 'Website Builder',
    description: 'Build full websites with custom domains, SEO optimization, and blazing-fast performance.',
    color: 'hsl(142 76% 45%)',
    stats: '99.9% uptime',
  },
  {
    icon: GraduationCap,
    title: 'LMS Platform',
    description: 'Create courses, track progress, issue certificates. Everything you need for digital learning.',
    color: 'hsl(38 92% 50%)',
    stats: '10M+ learners',
  },
  {
    icon: Zap,
    title: 'Automation Engine',
    description: 'Automate workflows with visual builders. Connect apps, trigger actions, save hours daily.',
    color: 'hsl(0 84% 60%)',
    stats: '500+ integrations',
  },
  {
    icon: Users,
    title: 'Tenant Management',
    description: 'Multi-tenant architecture with role-based access, white-labeling, and custom branding.',
    color: 'hsl(199 89% 48%)',
    stats: 'Unlimited tenants',
  },
];

const capabilities = [
  { icon: Shield, label: 'Enterprise Security' },
  { icon: BarChart3, label: 'Advanced Analytics' },
  { icon: Palette, label: 'Custom Branding' },
  { icon: Layers, label: 'API-First Design' },
  { icon: Clock, label: 'Real-time Sync' },
  { icon: Lock, label: 'SSO & SAML' },
];

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const FeatureCard = ({ feature, index, isHovered, onHover, onLeave }: FeatureCardProps) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative"
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -4 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="relative h-full p-6 rounded-2xl bg-card border border-border overflow-hidden cursor-pointer"
      >
        {/* Hover glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 rounded-2xl"
          style={{ 
            background: `radial-gradient(circle at 50% 0%, ${feature.color}15 0%, transparent 70%)`,
          }}
        />
        
        {/* Icon with background */}
        <motion.div
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${feature.color}15` }}
        >
          <Icon 
            size={26} 
            style={{ color: feature.color }}
          />
          
          {/* Animated ring on hover */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
            className="absolute inset-0 rounded-xl border-2"
            style={{ borderColor: feature.color }}
          />
        </motion.div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {feature.description}
        </p>
        
        {/* Stats badge */}
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${feature.color}10`,
            color: feature.color,
          }}
        >
          <motion.span
            animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: feature.color }}
          />
          {feature.stats}
        </motion.div>
        
        {/* Bottom gradient line on hover */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 origin-left"
          style={{ backgroundColor: feature.color }}
        />
      </motion.div>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <motion.div
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px]"
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-foreground mb-6"
          >
            <Layers size={16} className="text-primary" />
            All-in-One Platform
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Scale Your Business
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Six powerful modules working together seamlessly. Build, launch, and grow without switching tools.
          </p>
        </motion.div>
        
        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
        
        {/* Capabilities row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-foreground cursor-default"
            >
              <cap.icon size={16} className="text-primary" />
              {cap.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
