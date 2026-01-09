import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, Globe, GraduationCap, Zap, Layout, Building2, BookOpen, CreditCard } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Product', href: '#product', icon: Layout, isRoute: false },
  { label: 'How It Works', href: '#how-it-works', icon: Zap, isRoute: false },
  { label: 'Solutions', href: '#solutions', icon: Globe, isRoute: false },
  { label: 'Enterprise', href: '#enterprise', icon: Building2, isRoute: false },
  { label: 'Docs', href: '/docs', icon: BookOpen, isRoute: true },
  { label: 'Pricing', href: '/pricing', icon: CreditCard, isRoute: true },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-card/95 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-background/50 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <img 
                src="/zenith-logo.png" 
                alt="Zenith Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                  ZENITH
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wider">
                  BY CROPXON
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link key={item.label} to={item.href}>
                    <motion.div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <item.icon size={16} className="opacity-70" />
                      </motion.div>
                      {item.label}
                    </motion.div>
                  </Link>
                ) : (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <item.icon size={16} className="opacity-70" />
                    </motion.div>
                    {item.label}
                  </motion.a>
                )
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <ThemeSwitcher />
              <Link to="/auth">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button variant="ghost" size="sm" className="font-medium text-foreground">
                    Login
                  </Button>
                </motion.div>
              </Link>
              <Link to="/get-started">
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button size="sm" className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20">
                    Start Free Trial
                  </Button>
                </motion.div>
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-20 lg:hidden overflow-auto"
          >
            <nav className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => (
                  item.isRoute ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon size={20} className="text-primary" />
                        </div>
                        <span className="text-base font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon size={20} className="text-primary" />
                      </div>
                      <span className="text-base font-medium">{item.label}</span>
                    </motion.a>
                  )
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12 font-medium text-foreground border-border">
                    Login
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full h-12 font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
