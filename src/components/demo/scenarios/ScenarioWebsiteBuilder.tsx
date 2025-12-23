import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Type, Image, Square, MousePointer, Palette, 
  Eye, Rocket, CheckCircle2, Globe, Sparkles,
  Layout, Layers, Settings
} from 'lucide-react';

interface ScenarioProps {
  progress: number;
  isPlaying: boolean;
}

const blocks = [
  { id: 'hero', icon: Layout, label: 'Hero Section' },
  { id: 'features', icon: Layers, label: 'Features Grid' },
  { id: 'cta', icon: MousePointer, label: 'Call to Action' },
];

const colorPalettes = [
  { primary: '#3B82F6', secondary: '#8B5CF6', name: 'Ocean' },
  { primary: '#10B981', secondary: '#06B6D4', name: 'Forest' },
  { primary: '#F59E0B', secondary: '#EF4444', name: 'Sunset' },
];

export const ScenarioWebsiteBuilder = ({ progress, isPlaying }: ScenarioProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [placedBlocks, setPlacedBlocks] = useState<string[]>([]);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (progress < 20) {
      setCurrentStep(0);
    } else if (progress < 40) {
      setCurrentStep(1);
      if (!placedBlocks.includes('hero')) setPlacedBlocks(['hero']);
    } else if (progress < 55) {
      setCurrentStep(2);
      if (!placedBlocks.includes('features')) setPlacedBlocks(['hero', 'features']);
    } else if (progress < 70) {
      setCurrentStep(3);
      setPlacedBlocks(['hero', 'features', 'cta']);
    } else if (progress < 80) {
      setCurrentStep(4);
      setSelectedPalette(1);
    } else if (progress < 90) {
      setCurrentStep(5);
      setShowPreview(true);
    } else if (progress < 95) {
      setCurrentStep(6);
      setIsPublishing(true);
    } else {
      setCurrentStep(7);
      setIsPublishing(false);
      setIsPublished(true);
    }
  }, [progress]);

  return (
    <div className="h-full flex">
      {/* Left: Block Panel */}
      <div className="w-56 border-r border-border bg-muted/20 p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Components
        </div>
        <div className="space-y-2">
          {blocks.map((block, i) => {
            const isPlaced = placedBlocks.includes(block.id);
            const isAnimating = currentStep === i + 1 && !isPlaced;
            
            return (
              <motion.div
                key={block.id}
                animate={isAnimating ? { 
                  x: [0, 10, 0],
                  boxShadow: ['0 0 0 0 hsl(var(--primary) / 0)', '0 0 0 4px hsl(var(--primary) / 0.3)', '0 0 0 0 hsl(var(--primary) / 0)']
                } : {}}
                transition={{ duration: 0.6, repeat: isAnimating ? Infinity : 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isPlaced 
                    ? 'border-green-500/50 bg-green-500/10 opacity-50' 
                    : isAnimating 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-card'
                }`}
              >
                <block.icon size={16} className={isPlaced ? 'text-green-500' : 'text-muted-foreground'} />
                <span className="text-sm font-medium">{block.label}</span>
                {isPlaced && <CheckCircle2 size={14} className="ml-auto text-green-500" />}
              </motion.div>
            );
          })}
        </div>

        {/* Color Palette */}
        <div className="mt-6">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Theme
          </div>
          <div className="space-y-2">
            {colorPalettes.map((palette, i) => (
              <motion.div
                key={palette.name}
                animate={currentStep === 4 && selectedPalette === i ? {
                  scale: [1, 1.02, 1],
                } : {}}
                transition={{ duration: 0.5 }}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                  selectedPalette === i ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.primary }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.secondary }} />
                </div>
                <span className="text-xs">{palette.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full rounded-xl border-2 border-dashed border-border bg-card/50 relative overflow-hidden">
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Placed blocks */}
          <div className="relative z-10 p-4 space-y-4">
            <AnimatePresence>
              {placedBlocks.includes('hero') && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-6 rounded-lg border border-border bg-gradient-to-r from-primary/10 to-accent/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Layout size={14} className="text-primary" />
                    <span className="text-xs text-muted-foreground">Hero Section</span>
                  </div>
                  <div 
                    className="h-3 w-3/4 rounded mb-2"
                    style={{ backgroundColor: colorPalettes[selectedPalette].primary }}
                  />
                  <div className="h-2 w-1/2 rounded bg-muted" />
                  <div className="flex gap-2 mt-4">
                    <div 
                      className="h-8 w-24 rounded"
                      style={{ backgroundColor: colorPalettes[selectedPalette].primary }}
                    />
                    <div className="h-8 w-24 rounded border border-border" />
                  </div>
                </motion.div>
              )}

              {placedBlocks.includes('features') && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Layers size={14} className="text-primary" />
                    <span className="text-xs text-muted-foreground">Features Grid</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 rounded-lg bg-muted/50"
                      >
                        <div 
                          className="w-8 h-8 rounded-lg mb-2"
                          style={{ backgroundColor: `${colorPalettes[selectedPalette].secondary}30` }}
                        />
                        <div className="h-2 w-full rounded bg-muted mb-1" />
                        <div className="h-2 w-2/3 rounded bg-muted" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {placedBlocks.includes('cta') && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-6 rounded-lg border border-border text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${colorPalettes[selectedPalette].primary}10, ${colorPalettes[selectedPalette].secondary}10)`
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MousePointer size={14} className="text-primary" />
                    <span className="text-xs text-muted-foreground">Call to Action</span>
                  </div>
                  <div className="h-3 w-48 rounded bg-muted mx-auto mb-3" />
                  <div 
                    className="h-10 w-32 rounded mx-auto"
                    style={{ backgroundColor: colorPalettes[selectedPalette].primary }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drop indicator */}
            {currentStep >= 1 && currentStep <= 3 && (
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-20 rounded-lg border-2 border-dashed border-primary/50 flex items-center justify-center"
              >
                <span className="text-xs text-primary">Drop component here</span>
              </motion.div>
            )}
          </div>

          {/* Preview overlay */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/95 flex items-center justify-center z-20"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <Eye size={28} className="text-primary" />
                  </motion.div>
                  <p className="text-lg font-semibold text-foreground">Preview Mode</p>
                  <p className="text-sm text-muted-foreground">Your website is ready to publish</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Publishing overlay */}
          <AnimatePresence>
            {isPublishing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/95 flex items-center justify-center z-30"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"
                  />
                  <p className="text-lg font-semibold text-foreground">Publishing...</p>
                  <p className="text-sm text-muted-foreground">Deploying to your domain</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Published overlay */}
          <AnimatePresence>
            {isPublished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/95 flex items-center justify-center z-30"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 size={32} className="text-green-500" />
                  </motion.div>
                  <p className="text-lg font-semibold text-foreground">Website Live!</p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Globe size={14} />
                    <span>yoursite.zenith.app</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Settings */}
      <div className="w-48 border-l border-border bg-muted/20 p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Properties
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-2">Page Title</label>
            <div className="h-8 rounded bg-card border border-border px-2 flex items-center text-xs">
              My Landing Page
            </div>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-2">URL</label>
            <div className="h-8 rounded bg-card border border-border px-2 flex items-center text-xs">
              /home
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <motion.div
              animate={currentStep >= 5 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: currentStep >= 5 && currentStep < 7 ? Infinity : 0 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentStep >= 5 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Rocket size={14} />
              <span className="text-xs font-medium">Publish</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
