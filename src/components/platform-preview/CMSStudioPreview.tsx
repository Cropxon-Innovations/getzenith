import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Type, Image, Code, MousePointer, AlignLeft, Eye, Globe, Mail } from 'lucide-react';

const blocks = [
  { icon: Type, label: 'Heading' },
  { icon: AlignLeft, label: 'Rich Text' },
  { icon: Image, label: 'Image' },
  { icon: Code, label: 'Code' },
  { icon: MousePointer, label: 'CTA' },
];

const typewriterText = "Welcome to Zenith Studio — the all-in-one platform for creators, educators, and enterprises.";

export const CMSStudioPreview = () => {
  const [typedText, setTypedText] = useState('');
  const [showParagraph, setShowParagraph] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showCode, setShowCode] = useState(false);
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= typewriterText.length) {
        setTypedText(typewriterText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowParagraph(true), 300);
        setTimeout(() => setShowImage(true), 800);
        setTimeout(() => setShowCode(true), 1300);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex h-full">
      {/* Left: Block Panel */}
      <div className="w-44 bg-muted/30 border-r border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">BLOCKS</div>
        <div className="space-y-1">
          {blocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <block.icon size={14} />
              <span>{block.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Center: Editor Canvas */}
      <div className="flex-1 p-6 overflow-hidden bg-background">
        <div className="max-w-xl mx-auto space-y-4">
          {/* Heading block with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <h1 className="text-xl font-bold text-foreground">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
              />
            </h1>
          </motion.div>
          
          {/* Paragraph block */}
          {showParagraph && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              Build stunning websites, manage content with ease, deliver courses at scale, 
              and automate your workflows — all from one unified platform designed for growth.
            </motion.div>
          )}
          
          {/* Image block */}
          {showImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-lg overflow-hidden border border-border bg-muted/30 h-32"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Image size={24} className="text-muted-foreground mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">hero-image.jpg</span>
                </div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
                className="absolute bottom-0 left-0 h-1 bg-primary/50"
              />
            </motion.div>
          )}
          
          {/* Code block */}
          {showCode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg overflow-hidden border border-border bg-card"
            >
              <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center gap-2">
                <Code size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">JavaScript</span>
              </div>
              <pre className="p-3 text-xs font-mono">
                <span className="text-primary">const</span>{' '}
                <span className="text-foreground">zenith</span>{' '}
                <span className="text-muted-foreground">=</span>{' '}
                <span className="text-accent">await</span>{' '}
                <span className="text-foreground">init</span>
                <span className="text-muted-foreground">(</span>
                <span className="text-primary">&apos;studio&apos;</span>
                <span className="text-muted-foreground">);</span>
              </pre>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Right: Metadata Panel */}
      <div className="w-52 bg-muted/30 border-l border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">METADATA</div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">SEO Title</label>
            <div className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground">
              Getting Started with Zenith
            </div>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Visibility</label>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-4 bg-primary rounded-full relative cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="absolute right-0.5 top-0.5 w-3 h-3 bg-background rounded-full"
                  animate={{ x: [0, 0] }}
                />
              </motion.div>
              <span className="text-xs text-foreground">Published</span>
            </div>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-2">Publish To</label>
            <div className="space-y-1.5">
              {[
                { icon: Globe, label: 'Website', active: true },
                { icon: Eye, label: 'LMS', active: true },
                { icon: Mail, label: 'Email', active: false },
              ].map((dest) => (
                <div key={dest.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded border ${dest.active ? 'bg-primary border-primary' : 'border-border'}`} />
                  <dest.icon size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{dest.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};