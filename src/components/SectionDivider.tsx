import { motion } from 'framer-motion';
import { ZenithLogo } from './ZenithLogo';

export const SectionDivider = () => {
  return (
    <div className="py-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
        <ZenithLogo size={40} animated />
      </motion.div>
    </div>
  );
};
