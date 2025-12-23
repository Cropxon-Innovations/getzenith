import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Send, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  company: z.string().trim().min(1, 'Company name is required').max(100, 'Company name is too long'),
  companySize: z.string().min(1, 'Please select company size'),
  useCase: z.string().trim().min(10, 'Please describe your use case (min 10 chars)').max(1000, 'Use case description is too long'),
  integrations: z.string().max(500, 'Integration requirements is too long').optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

export const EnterpriseContactForm = () => {
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: '',
    email: '',
    company: '',
    companySize: '',
    useCase: '',
    integrations: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl border border-green-500/30 bg-green-500/5 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          We&apos;ve received your inquiry. Our enterprise team will contact you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Submit Another Inquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <section className="py-16 sm:py-24" id="enterprise-contact">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <Building2 size={14} />
            Enterprise
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Contact Our Enterprise Team</h2>
          <p className="text-muted-foreground">
            Tell us about your needs and we&apos;ll create a custom solution for your organization.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6"
        >
          {/* Name & Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.name ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Work Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@company.com"
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.email ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Company & Size */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Acme Inc."
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.company ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.company}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Size *
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.companySize ? 'border-destructive' : 'border-border'
                }`}
              >
                <option value="">Select size...</option>
                {companySizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {errors.companySize && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.companySize}
                </p>
              )}
            </div>
          </div>

          {/* Use Case */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Describe Your Use Case *
            </label>
            <textarea
              value={formData.useCase}
              onChange={(e) => handleChange('useCase', e.target.value)}
              placeholder="Tell us about your content management needs, team size, expected traffic, and any specific requirements..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                errors.useCase ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.useCase && (
              <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                <AlertCircle size={14} /> {errors.useCase}
              </p>
            )}
          </div>

          {/* Integration Requirements */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Integration Requirements (Optional)
            </label>
            <textarea
              value={formData.integrations}
              onChange={(e) => handleChange('integrations', e.target.value)}
              placeholder="List any existing systems, databases, or tools you need to integrate with (e.g., Salesforce, SAP, custom APIs)..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full h-12 gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Inquiry
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to our privacy policy. We&apos;ll never share your information.
          </p>
        </motion.form>
      </div>
    </section>
  );
};
