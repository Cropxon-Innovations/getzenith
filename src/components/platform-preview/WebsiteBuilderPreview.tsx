import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Home, Users, BookOpen, Mail, Smartphone, Monitor, Tablet, Layout, Eye, Zap } from 'lucide-react';

const pages = [
  { icon: Home, label: 'Home', active: true },
  { icon: Users, label: 'About', active: false },
  { icon: BookOpen, label: 'Academy', active: false },
  { icon: Mail, label: 'Contact', active: false },
];

const sections = [
  { type: 'Hero', height: 'h-24' },
  { type: 'Features', height: 'h-16' },
  { type: 'CTA', height: 'h-12' },
  { type: 'Courses', height: 'h-20' },
];

export const WebsiteBuilderPreview = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  
  const canvasWidth = device === 'mobile' ? 'w-48' : device === 'tablet' ? 'w-72' : 'w-full';
  
  return (
    <div className="flex h-full">
      {/* Left: Page Tree */}
      <div className="w-44 bg-muted/30 border-r border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">PAGES</div>
        <div className="space-y-1">
          {pages.map((page, i) => (
            <motion.div
              key={page.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm cursor-pointer transition-colors ${
                page.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <page.icon size={14} />
              <span>{page.label}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs font-semibold text-muted-foreground mb-2">SECTIONS</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            {sections.map((section) => (
              <div key={section.type} className="flex items-center gap-2 px-2 py-1">
                <Layout size={12} />
                <span>{section.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Center: Page Canvas */}
      <div className="flex-1 p-4 overflow-hidden bg-muted/20 flex flex-col">
        {/* Device toggle */}
        <div className="flex justify-center gap-2 mb-4">
          {[
            { type: 'mobile' as const, icon: Smartphone },
            { type: 'tablet' as const, icon: Tablet },
            { type: 'desktop' as const, icon: Monitor },
          ].map((d) => (
            <button
              key={d.type}
              onClick={() => setDevice(d.type)}
              className={`p-2 rounded transition-colors ${
                device === d.type ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <d.icon size={16} />
            </button>
          ))}
        </div>
        
        {/* Canvas */}
        <div className="flex-1 flex justify-center items-start overflow-auto">
          <motion.div
            animate={{ width: device === 'mobile' ? 200 : device === 'tablet' ? 300 : '100%' }}
            transition={{ duration: 0.3 }}
            className={`bg-card border border-border rounded-lg overflow-hidden ${canvasWidth}`}
          >
            {sections.map((section, i) => (
              <motion.div
                key={section.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                onMouseEnter={() => setHoveredSection(i)}
                onMouseLeave={() => setHoveredSection(null)}
                className={`${section.height} border-b border-border/50 relative transition-colors ${
                  hoveredSection === i ? 'bg-primary/5' : ''
                }`}
              >
                {/* Section placeholder content */}
                <div className="absolute inset-0 p-3 flex flex-col justify-center">
                  {section.type === 'Hero' && (
                    <>
                      <div className="h-3 w-3/4 bg-muted rounded mb-2" />
                      <div className="h-2 w-1/2 bg-muted/60 rounded mb-3" />
                      <div className="h-6 w-24 bg-primary/20 rounded" />
                    </>
                  )}
                  {section.type === 'Features' && (
                    <div className="flex gap-2">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex-1 bg-muted/40 rounded h-10" />
                      ))}
                    </div>
                  )}
                  {section.type === 'CTA' && (
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-2 w-32 bg-muted rounded" />
                      <div className="h-6 w-20 bg-primary/30 rounded" />
                    </div>
                  )}
                  {section.type === 'Courses' && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex-1 bg-muted/30 rounded h-14" />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Hover indicator */}
                {hoveredSection === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-primary/50 rounded pointer-events-none"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Right: Properties Panel */}
      <div className="w-52 bg-muted/30 border-l border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">PROPERTIES</div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Layout</label>
            <div className="flex gap-1">
              {['Stack', 'Grid', 'Flex'].map((layout) => (
                <div 
                  key={layout}
                  className={`flex-1 text-center text-xs py-1.5 rounded border cursor-pointer transition-colors ${
                    layout === 'Stack' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  {layout}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-2">Visibility Rules</label>
            <div className="space-y-1.5">
              {[
                { icon: Eye, label: 'Show on desktop', active: true },
                { icon: Smartphone, label: 'Show on mobile', active: true },
              ].map((rule) => (
                <div key={rule.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded border ${rule.active ? 'bg-primary border-primary' : 'border-border'}`} />
                  <rule.icon size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{rule.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-2">Automation Hooks</label>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-background border border-border rounded text-xs">
              <Zap size={12} className="text-primary" />
              <span className="text-muted-foreground">On section view</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};