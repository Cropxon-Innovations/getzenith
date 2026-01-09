import { motion } from 'framer-motion';
import { ZenithLogo } from './ZenithLogo';
import { Twitter, Linkedin, Github, Youtube, Facebook, Instagram } from 'lucide-react';

const footerLinks = {
  'Digital Business Studio': ['CMS', 'LMS', 'Website Builder', 'Automation Workflow Studio'],
  Resources: ['Documentation', 'API Reference', 'Guides', 'Blog', 'Community'],
  Company: ['About', 'Careers', 'Press', 'Contact', 'Partners'],
  Legal: ['Privacy', 'Terms', 'Security', 'Compliance', 'GDPR'],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/ZenithStudio', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/zenith-studio', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://facebook.com/ZenithStudio', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/zenithstudio', label: 'Instagram' },
  { icon: Github, href: 'https://github.com/zenith-studio', label: 'GitHub' },
  { icon: Youtube, href: 'https://youtube.com/@ZenithStudio', label: 'YouTube' },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <ZenithLogo size={36} animated={false} />
              <div className="flex flex-col">
                <span className="text-xl font-semibold">ZENITH</span>
                <span className="text-xs text-muted-foreground">BY CROPXON</span>
              </div>
            </motion.div>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">
              <strong>Digital Business Studio (DBS)</strong> — The complete operating system for digital businesses. Orchestrate content, experiences, learning, and automation.
            </p>
            <p className="text-muted-foreground text-xs mb-6 max-w-xs">
              Powered by{' '}
              <a 
                href="https://cropxon.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Cropxon Innovations Pvt. Ltd.
              </a>
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-secondary/50 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                      whileHover={{ x: 3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Zenith Studio. All rights reserved.
              </p>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                A division of{' '}
                <a 
                  href="https://cropxon.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Cropxon Innovations Pvt. Ltd.
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Status:</span>
              <span className="flex items-center gap-2 text-xs">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
