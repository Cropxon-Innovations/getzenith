import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BrowserFrame } from './BrowserFrame';
import { TenantAdminPreview } from './TenantAdminPreview';
import { CMSStudioPreview } from './CMSStudioPreview';
import { WebsiteBuilderPreview } from './WebsiteBuilderPreview';
import { LMSStudioPreview } from './LMSStudioPreview';
import { AutomationStudioPreview } from './AutomationStudioPreview';

const tabs = [
  { id: 'admin', label: 'Tenant Admin', url: '/admin' },
  { id: 'cms', label: 'CMS Studio', url: '/studio/cms' },
  { id: 'website', label: 'Website Builder', url: '/studio/website' },
  { id: 'lms', label: 'LMS Studio', url: '/studio/lms' },
  { id: 'automation', label: 'Automation Studio', url: '/studio/automation' },
];

export const LivePlatformPreview = () => {
  const [activeTab, setActiveTab] = useState('admin');
  
  const currentTab = tabs.find(t => t.id === activeTab)!;
  
  return (
    <section id="preview" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            Live Platform Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            See Zenith in Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore how Zenith Studio adapts across dashboards and studios — in real time.
          </p>
        </motion.div>
        
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
        
        {/* Browser Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <BrowserFrame url={currentTab.url}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === 'admin' && <TenantAdminPreview />}
                {activeTab === 'cms' && <CMSStudioPreview />}
                {activeTab === 'website' && <WebsiteBuilderPreview />}
                {activeTab === 'lms' && <LMSStudioPreview />}
                {activeTab === 'automation' && <AutomationStudioPreview />}
              </motion.div>
            </AnimatePresence>
          </BrowserFrame>
        </motion.div>
      </div>
    </section>
  );
};