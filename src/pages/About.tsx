import { motion } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ZenithLogo } from '@/components/ZenithLogo';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  {
    title: 'Why Zenith Exists',
    content: `We started Zenith because we saw the same pattern everywhere: brilliant teams spending more time managing tools than building products. Every business needs content management, a web presence, learning systems, and automation — but connecting these pieces became a full-time job.

    At Cropxon Innovations, we asked: what if these weren't separate tools at all? What if they were layers of a single, coherent operating system?`,
  },
  {
    title: 'Why Tools Failed',
    content: `The SaaS revolution gave us incredible point solutions. But it also created fragmentation. Each tool is a silo with its own data model, its own user experience, its own integration requirements.

    The result? Businesses spend 30% of their time on "tool overhead" — syncing data, maintaining integrations, training teams on different interfaces. We built Zenith to eliminate that overhead entirely.`,
  },
  {
    title: 'Digital Business Studio (DBS)',
    content: `Zenith Studio is Cropxon's flagship Digital Business Studio — a complete operating system that combines CMS, LMS, Website Builder, and Automation Workflow Studio in one unified platform.

    When your content management, website, learning platform, and automation engine share the same foundation, magic happens. Content flows seamlessly into experiences. User actions trigger automated workflows. Learning outcomes connect to business results.`,
  },
  {
    title: 'Our 10-Year Vision',
    content: `We're building the operating system that runs digital businesses. Not a platform you use, but infrastructure you rely on. Like AWS for compute or Stripe for payments, Zenith will be the default answer for "how do we run our digital operations?"

    Cropxon Innovations is in year one of a decade-long mission. Every feature we ship, every integration we build, every enterprise we serve — it all moves us closer to a world where businesses focus on their mission, not their tools.`,
  },
];

const About = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="container mx-auto px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <div className="flex justify-center mb-8">
                  <ZenithLogo size={80} animated />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  Building the Operating System for{' '}
                  <span className="text-gradient">Digital Businesses</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  We're on a mission to eliminate tool chaos and let businesses focus on what matters: their customers, their products, their vision.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Values/Philosophy */}
          <section className="py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto space-y-20">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="grid md:grid-cols-3 gap-8"
                  >
                    <div>
                      <span className="text-sm uppercase tracking-widest text-muted-foreground">
                        0{index + 1}
                      </span>
                      <h2 className="text-2xl font-bold mt-2">{value.title}</h2>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {value.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Ready to join the future?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Start your 30-day trial and see why leading teams choose Zenith.
                </p>
                <Button size="lg" className="bg-gradient-primary text-primary-foreground gap-2 glow">
                  Get Started
                  <ArrowRight size={18} />
                </Button>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default About;
