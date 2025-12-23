import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Quote, ChevronLeft, ChevronRight, Star, Building2, Rocket, GraduationCap } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "Zenith Studio replaced 5 different tools we were using. Our team productivity increased by 40% in the first month.",
    author: "Sarah Chen",
    role: "CTO",
    company: "TechFlow Inc.",
    avatar: "SC",
    rating: 5,
    icon: Rocket,
    color: '#3B82F6',
  },
  {
    id: 2,
    quote: "The multi-tenant architecture is exactly what we needed to scale our agency. Managing 50+ clients from one dashboard is a game-changer.",
    author: "Marcus Johnson",
    role: "Founder",
    company: "Digital Edge Agency",
    avatar: "MJ",
    rating: 5,
    icon: Building2,
    color: '#8B5CF6',
  },
  {
    id: 3,
    quote: "Our course completion rates jumped from 60% to 95% after switching to Zenith LMS. The learning experience is unmatched.",
    author: "Dr. Emily Roberts",
    role: "Director of Learning",
    company: "EduTech Global",
    avatar: "ER",
    rating: 5,
    icon: GraduationCap,
    color: '#10B981',
  },
  {
    id: 4,
    quote: "Enterprise-grade security with startup agility. Zenith gave us the best of both worlds without compromise.",
    author: "David Park",
    role: "VP of Engineering",
    company: "SecureScale Corp",
    avatar: "DP",
    rating: 5,
    icon: Building2,
    color: '#F59E0B',
  },
  {
    id: 5,
    quote: "The automation workflows saved us 20 hours per week. ROI was positive within the first 2 weeks of deployment.",
    author: "Lisa Martinez",
    role: "Operations Lead",
    company: "GrowthOps",
    avatar: "LM",
    rating: 5,
    icon: Rocket,
    color: '#EC4899',
  },
];

const companyLogos = [
  { name: 'TechFlow', width: 'w-24' },
  { name: 'Digital Edge', width: 'w-28' },
  { name: 'EduTech', width: 'w-20' },
  { name: 'SecureScale', width: 'w-26' },
  { name: 'GrowthOps', width: 'w-24' },
  { name: 'Innovate', width: 'w-22' },
];

const trustPoints = [
  'API-first by design',
  'Event-driven, not tightly coupled',
  'Works with your existing backend',
  'Deploy anywhere, scale independently',
];

export const TrustSection = () => {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, isVisible]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => (prev + 1) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="enterprise" className="py-24 sm:py-32 relative bg-secondary/20 overflow-hidden" ref={ref}>
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">
            Trusted by Industry Leaders
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">
            What Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Customers Say</span>
          </h2>
        </motion.div>

        {/* Company logos ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-12 overflow-hidden"
        >
          <motion.div
            animate={{ x: [0, -500] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...companyLogos, ...companyLogos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card/50 border border-border"
              >
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{logo.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{logo.name}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main testimonial carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main testimonial card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative p-8 sm:p-10 rounded-2xl border border-border bg-card shadow-xl"
                style={{ boxShadow: `0 20px 60px -20px ${activeTestimonial.color}20` }}
              >
                {/* Quote icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -top-5 left-8 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: activeTestimonial.color }}
                >
                  <Quote size={18} className="text-white" />
                </motion.div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-foreground mb-6 leading-relaxed">
                  "{activeTestimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: activeTestimonial.color }}
                  >
                    {activeTestimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-foreground">{activeTestimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {activeTestimonial.role} at {activeTestimonial.company}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <activeTestimonial.icon size={24} style={{ color: activeTestimonial.color }} />
                  </div>
                </div>

                {/* Progress bar */}
                {isAutoPlaying && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
                    style={{ backgroundColor: activeTestimonial.color }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    key={`progress-${activeIndex}`}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                <ChevronLeft size={20} />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setActiveIndex(i);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === activeIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Trust points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {trustPoints.map((point, index) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card/50"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <Check size={14} className="text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-foreground">{point}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { value: '99.99%', label: 'Uptime SLA' },
            { value: '2,500+', label: 'Active Teams' },
            { value: '50M+', label: 'API Calls/Day' },
            { value: '4.9/5', label: 'Customer Rating' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center p-6 rounded-xl bg-card border border-border"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                className="text-3xl sm:text-4xl font-bold text-primary mb-1"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
