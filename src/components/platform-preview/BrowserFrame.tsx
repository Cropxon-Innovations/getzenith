import { motion } from 'framer-motion';

interface BrowserFrameProps {
  url: string;
  children: React.ReactNode;
}

export const BrowserFrame = ({ url, children }: BrowserFrameProps) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/70" />
          <div className="w-3 h-3 rounded-full bg-accent/70" />
          <div className="w-3 h-3 rounded-full bg-primary/70" />
        </div>
        
        {/* URL bar */}
        <div className="flex-1 mx-4">
          <motion.div 
            key={url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-background/50 rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono"
          >
            zenith.studio{url}
          </motion.div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      {/* Content area */}
      <div className="h-[500px] overflow-hidden bg-background">
        {children}
      </div>
    </div>
  );
};