import { OutputData } from '@editorjs/editorjs';

export type TemplateCategory = 'marketing' | 'content' | 'education' | 'engage' | 'system' | 'internal';

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  icon: string;
  adminOnly?: boolean;
  mentorOnly?: boolean;
  blocks: OutputData['blocks'];
}

// Marketing Templates (15)
const marketingTemplates: BlockTemplate[] = [
  {
    id: 'hero-with-cta',
    name: 'Hero with CTA',
    description: 'Full-width hero section with headline and call-to-action button',
    category: 'marketing',
    tags: ['hero', 'landing', 'cta'],
    icon: 'Layout',
    blocks: [
      { type: 'hero', data: { title: 'Welcome to Our Platform', subtitle: 'Build something amazing today', ctaText: 'Get Started', ctaUrl: '#', alignment: 'center' } },
      { type: 'paragraph', data: { text: 'Join thousands of users who trust our platform for their daily operations.' } },
      { type: 'cta', data: { heading: 'Ready to begin?', description: 'Start your free trial today.', primaryText: 'Start Free', primaryUrl: '#', secondaryText: 'Learn More', secondaryUrl: '#' } }
    ]
  },
  {
    id: 'hero-with-video',
    name: 'Hero with Video',
    description: 'Hero section with embedded video content',
    category: 'marketing',
    tags: ['hero', 'video', 'landing'],
    icon: 'Play',
    blocks: [
      { type: 'hero', data: { title: 'See It In Action', subtitle: 'Watch how our platform works', ctaText: 'Watch Demo', ctaUrl: '#', alignment: 'center' } },
      { type: 'embed', data: { service: 'youtube', source: 'https://youtube.com/embed/dQw4w9WgXcQ', embed: 'dQw4w9WgXcQ', width: 580, height: 320 } }
    ]
  },
  {
    id: 'feature-showcase',
    name: 'Feature Showcase',
    description: 'Header with 3-column feature grid highlighting key benefits',
    category: 'marketing',
    tags: ['features', 'benefits', 'grid'],
    icon: 'Sparkles',
    blocks: [
      { type: 'header', data: { text: 'Why Choose Us?', level: 2 } },
      { type: 'paragraph', data: { text: 'Discover the features that set us apart from the competition.' } },
      { type: 'featureGrid', data: { columns: 3, features: [
        { title: 'Fast & Reliable', description: 'Lightning-fast performance you can count on', icon: '⚡' },
        { title: 'Secure', description: 'Enterprise-grade security for your data', icon: '🔒' },
        { title: 'Scalable', description: 'Grows with your business needs', icon: '📈' }
      ] } }
    ]
  },
  {
    id: 'feature-grid-icons',
    name: 'Feature Grid',
    description: 'Icon-based feature grid with descriptions',
    category: 'marketing',
    tags: ['features', 'icons', 'grid'],
    icon: 'Grid3X3',
    blocks: [
      { type: 'header', data: { text: 'Features', level: 2 } },
      { type: 'featureGrid', data: { columns: 4, features: [
        { title: 'Analytics', description: 'Track everything', icon: '📊' },
        { title: 'Reports', description: 'Custom reports', icon: '📝' },
        { title: 'Automation', description: 'Save time', icon: '🤖' },
        { title: 'Integration', description: 'Connect apps', icon: '🔗' }
      ] } }
    ]
  },
  {
    id: 'product-overview',
    name: 'Product Overview',
    description: 'Complete product section with features and CTA',
    category: 'marketing',
    tags: ['product', 'overview', 'features'],
    icon: 'Package',
    blocks: [
      { type: 'header', data: { text: 'Introducing Our Product', level: 1 } },
      { type: 'paragraph', data: { text: 'A comprehensive solution designed for modern businesses.' } },
      { type: 'image', data: { file: { url: '' }, caption: 'Product screenshot' } },
      { type: 'featureGrid', data: { columns: 2, features: [
        { title: 'Easy to Use', description: 'Intuitive interface', icon: '✨' },
        { title: 'Powerful', description: 'Advanced capabilities', icon: '💪' }
      ] } },
      { type: 'cta', data: { heading: 'Try it today', description: 'No credit card required', primaryText: 'Get Started', primaryUrl: '#' } }
    ]
  },
  {
    id: 'value-proposition',
    name: 'Value Proposition Split',
    description: 'Split section highlighting unique value',
    category: 'marketing',
    tags: ['value', 'proposition', 'split'],
    icon: 'Target',
    blocks: [
      { type: 'header', data: { text: 'What Makes Us Different', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Industry-leading technology', 'Dedicated customer support', 'Transparent pricing', 'No hidden fees'] } },
      { type: 'quote', data: { text: 'The best investment we made for our business.', caption: 'CEO, Tech Company' } }
    ]
  },
  {
    id: 'cta-banner-gradient',
    name: 'CTA Banner (Gradient)',
    description: 'Eye-catching call-to-action banner with description',
    category: 'marketing',
    tags: ['cta', 'banner', 'conversion'],
    icon: 'MousePointer',
    blocks: [
      { type: 'cta', data: { heading: 'Start Your Journey Today', description: 'Join thousands of satisfied customers', primaryText: 'Get Started Free', primaryUrl: '#', secondaryText: 'Book a Demo', secondaryUrl: '#', style: 'gradient' } }
    ]
  },
  {
    id: 'cta-banner-minimal',
    name: 'CTA Banner (Minimal)',
    description: 'Clean, minimal call-to-action section',
    category: 'marketing',
    tags: ['cta', 'minimal', 'clean'],
    icon: 'ArrowRight',
    blocks: [
      { type: 'delimiter', data: {} },
      { type: 'cta', data: { heading: 'Ready to get started?', description: '', primaryText: 'Start Now', primaryUrl: '#', style: 'minimal' } },
      { type: 'delimiter', data: {} }
    ]
  },
  {
    id: 'testimonial-carousel',
    name: 'Testimonial Carousel',
    description: 'Multiple customer testimonials section',
    category: 'marketing',
    tags: ['testimonial', 'social proof', 'quote'],
    icon: 'MessageSquareQuote',
    blocks: [
      { type: 'header', data: { text: 'What Our Customers Say', level: 2 } },
      { type: 'testimonial', data: { quote: 'This product transformed our workflow completely.', author: 'Jane Smith', role: 'Product Manager', company: 'TechCorp', avatarUrl: '' } },
      { type: 'testimonial', data: { quote: 'Best decision we made this year.', author: 'John Doe', role: 'CEO', company: 'StartupXYZ', avatarUrl: '' } }
    ]
  },
  {
    id: 'social-proof-grid',
    name: 'Social Proof Grid',
    description: 'Trust badges and customer logos',
    category: 'marketing',
    tags: ['social proof', 'logos', 'trust'],
    icon: 'Shield',
    blocks: [
      { type: 'header', data: { text: 'Trusted by Leading Companies', level: 2 } },
      { type: 'paragraph', data: { text: 'Join 10,000+ businesses that rely on our platform.' } },
      { type: 'featureGrid', data: { columns: 4, features: [
        { title: '10K+', description: 'Active users', icon: '👥' },
        { title: '99.9%', description: 'Uptime', icon: '✅' },
        { title: '24/7', description: 'Support', icon: '🎧' },
        { title: '50+', description: 'Countries', icon: '🌍' }
      ] } }
    ]
  },
  {
    id: 'pricing-section',
    name: 'Pricing Section',
    description: 'Pricing plans display section',
    category: 'marketing',
    tags: ['pricing', 'plans', 'conversion'],
    icon: 'DollarSign',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Simple, Transparent Pricing', level: 2 } },
      { type: 'paragraph', data: { text: 'Choose the plan that works for you.' } },
      { type: 'featureGrid', data: { columns: 3, features: [
        { title: 'Starter', description: '$9/month - For individuals', icon: '🌱' },
        { title: 'Professional', description: '$29/month - For teams', icon: '🚀' },
        { title: 'Enterprise', description: 'Custom - For large orgs', icon: '🏢' }
      ] } }
    ]
  },
  {
    id: 'comparison-table',
    name: 'Comparison Table',
    description: 'Feature comparison across options',
    category: 'marketing',
    tags: ['comparison', 'table', 'features'],
    icon: 'Table',
    blocks: [
      { type: 'header', data: { text: 'Compare Plans', level: 2 } },
      { type: 'table', data: { content: [
        ['Feature', 'Starter', 'Pro', 'Enterprise'],
        ['Users', '1', '10', 'Unlimited'],
        ['Storage', '5GB', '50GB', 'Unlimited'],
        ['Support', 'Email', 'Priority', 'Dedicated']
      ] } }
    ]
  },
  {
    id: 'faq-section',
    name: 'FAQ Section',
    description: 'Frequently asked questions section',
    category: 'marketing',
    tags: ['faq', 'questions', 'support'],
    icon: 'HelpCircle',
    blocks: [
      { type: 'header', data: { text: 'Frequently Asked Questions', level: 2 } },
      { type: 'header', data: { text: 'How do I get started?', level: 3 } },
      { type: 'paragraph', data: { text: 'Simply sign up for a free account and follow the onboarding wizard.' } },
      { type: 'header', data: { text: 'Is there a free trial?', level: 3 } },
      { type: 'paragraph', data: { text: 'Yes! All plans include a 14-day free trial.' } },
      { type: 'header', data: { text: 'Can I cancel anytime?', level: 3 } },
      { type: 'paragraph', data: { text: 'Absolutely. No long-term contracts or hidden fees.' } }
    ]
  },
  {
    id: 'use-case-highlight',
    name: 'Use Case Highlight',
    description: 'Highlight specific use case or industry',
    category: 'marketing',
    tags: ['use case', 'industry', 'solution'],
    icon: 'Briefcase',
    blocks: [
      { type: 'header', data: { text: 'Perfect for SaaS Teams', level: 2 } },
      { type: 'paragraph', data: { text: 'Whether you\'re a startup or enterprise, our platform adapts to your needs.' } },
      { type: 'list', data: { style: 'unordered', items: ['Onboard new users quickly', 'Track engagement metrics', 'Automate repetitive tasks'] } },
      { type: 'cta', data: { heading: 'See it in action', primaryText: 'View Demo', primaryUrl: '#' } }
    ]
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    description: 'Email newsletter subscription section',
    category: 'marketing',
    tags: ['newsletter', 'email', 'signup'],
    icon: 'Mail',
    blocks: [
      { type: 'header', data: { text: 'Stay Updated', level: 2 } },
      { type: 'paragraph', data: { text: 'Get the latest news, tips, and updates delivered to your inbox.' } },
      { type: 'cta', data: { heading: 'Join our newsletter', description: 'No spam, unsubscribe anytime.', primaryText: 'Subscribe', primaryUrl: '#' } }
    ]
  }
];

// Content Templates (12)
const contentTemplates: BlockTemplate[] = [
  {
    id: 'blog-post-starter',
    name: 'Blog Post Starter',
    description: 'Standard blog post template with intro and sections',
    category: 'content',
    tags: ['blog', 'article', 'writing'],
    icon: 'FileText',
    blocks: [
      { type: 'header', data: { text: 'Blog Post Title', level: 1 } },
      { type: 'paragraph', data: { text: 'Introduction paragraph that hooks the reader and sets up the topic.' } },
      { type: 'header', data: { text: 'Section One', level: 2 } },
      { type: 'paragraph', data: { text: 'Content for the first section goes here.' } },
      { type: 'header', data: { text: 'Section Two', level: 2 } },
      { type: 'paragraph', data: { text: 'Content for the second section goes here.' } },
      { type: 'header', data: { text: 'Conclusion', level: 2 } },
      { type: 'paragraph', data: { text: 'Wrap up and call to action.' } }
    ]
  },
  {
    id: 'long-form-article',
    name: 'Long-Form Article',
    description: 'Comprehensive article with table of contents',
    category: 'content',
    tags: ['article', 'long-form', 'detailed'],
    icon: 'BookOpen',
    blocks: [
      { type: 'header', data: { text: 'Comprehensive Guide Title', level: 1 } },
      { type: 'paragraph', data: { text: 'In this comprehensive guide, we\'ll cover everything you need to know about...' } },
      { type: 'header', data: { text: 'Table of Contents', level: 2 } },
      { type: 'list', data: { style: 'ordered', items: ['Introduction', 'Chapter 1: Getting Started', 'Chapter 2: Advanced Topics', 'Chapter 3: Best Practices', 'Conclusion'] } },
      { type: 'delimiter', data: {} },
      { type: 'header', data: { text: 'Introduction', level: 2 } },
      { type: 'paragraph', data: { text: 'Begin your comprehensive content here...' } }
    ]
  },
  {
    id: 'announcement-post',
    name: 'Announcement Post',
    description: 'Company or product announcement template',
    category: 'content',
    tags: ['announcement', 'news', 'update'],
    icon: 'Megaphone',
    blocks: [
      { type: 'header', data: { text: 'Exciting Announcement!', level: 1 } },
      { type: 'paragraph', data: { text: 'We\'re thrilled to announce...' } },
      { type: 'quote', data: { text: 'This is a game-changer for our industry.', caption: 'CEO' } },
      { type: 'header', data: { text: 'What This Means For You', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Benefit 1', 'Benefit 2', 'Benefit 3'] } },
      { type: 'cta', data: { heading: 'Get Started Today', primaryText: 'Learn More', primaryUrl: '#' } }
    ]
  },
  {
    id: 'documentation-page',
    name: 'Documentation Page',
    description: 'Technical documentation with code examples',
    category: 'content',
    tags: ['docs', 'technical', 'api'],
    icon: 'Code',
    blocks: [
      { type: 'header', data: { text: 'API Documentation', level: 1 } },
      { type: 'paragraph', data: { text: 'This document describes how to use the API.' } },
      { type: 'header', data: { text: 'Authentication', level: 2 } },
      { type: 'paragraph', data: { text: 'All requests require an API key.' } },
      { type: 'code', data: { code: 'Authorization: Bearer YOUR_API_KEY' } },
      { type: 'header', data: { text: 'Endpoints', level: 2 } },
      { type: 'table', data: { content: [['Method', 'Endpoint', 'Description'], ['GET', '/api/users', 'List all users'], ['POST', '/api/users', 'Create a user']] } }
    ]
  },
  {
    id: 'changelog-entry',
    name: 'Changelog Entry',
    description: 'Version changelog with updates and fixes',
    category: 'content',
    tags: ['changelog', 'version', 'updates'],
    icon: 'History',
    blocks: [
      { type: 'header', data: { text: 'Version 2.0.0', level: 1 } },
      { type: 'paragraph', data: { text: 'Released on January 15, 2024' } },
      { type: 'header', data: { text: '✨ New Features', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Feature A', 'Feature B'] } },
      { type: 'header', data: { text: '🐛 Bug Fixes', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Fixed issue X', 'Fixed issue Y'] } },
      { type: 'header', data: { text: '⚠️ Breaking Changes', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['API endpoint renamed'] } }
    ]
  },
  {
    id: 'release-notes',
    name: 'Release Notes',
    description: 'Detailed release notes template',
    category: 'content',
    tags: ['release', 'notes', 'version'],
    icon: 'Tag',
    blocks: [
      { type: 'header', data: { text: 'Release Notes - v2.0', level: 1 } },
      { type: 'paragraph', data: { text: 'We\'re excited to announce our latest release with major improvements.' } },
      { type: 'header', data: { text: 'Highlights', level: 2 } },
      { type: 'featureGrid', data: { columns: 2, features: [
        { title: 'New Dashboard', description: 'Completely redesigned', icon: '📊' },
        { title: 'Performance', description: '2x faster load times', icon: '⚡' }
      ] } }
    ]
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Customer success case study template',
    category: 'content',
    tags: ['case study', 'customer', 'success'],
    icon: 'Trophy',
    blocks: [
      { type: 'header', data: { text: 'How Company X Increased Revenue by 50%', level: 1 } },
      { type: 'header', data: { text: 'The Challenge', level: 2 } },
      { type: 'paragraph', data: { text: 'Company X faced significant challenges with...' } },
      { type: 'header', data: { text: 'The Solution', level: 2 } },
      { type: 'paragraph', data: { text: 'Using our platform, they were able to...' } },
      { type: 'header', data: { text: 'The Results', level: 2 } },
      { type: 'featureGrid', data: { columns: 3, features: [
        { title: '50%', description: 'Revenue increase', icon: '📈' },
        { title: '30%', description: 'Time saved', icon: '⏱️' },
        { title: '100%', description: 'Team adoption', icon: '👥' }
      ] } },
      { type: 'testimonial', data: { quote: 'The results speak for themselves.', author: 'CEO, Company X' } }
    ]
  },
  {
    id: 'how-to-guide',
    name: 'How-To Guide',
    description: 'Step-by-step instructional guide',
    category: 'content',
    tags: ['how-to', 'guide', 'tutorial'],
    icon: 'ListOrdered',
    blocks: [
      { type: 'header', data: { text: 'How to Get Started with Our Platform', level: 1 } },
      { type: 'paragraph', data: { text: 'Follow these steps to set up your account and start using the platform.' } },
      { type: 'header', data: { text: 'Step 1: Create Your Account', level: 2 } },
      { type: 'paragraph', data: { text: 'Visit our signup page and enter your details.' } },
      { type: 'header', data: { text: 'Step 2: Configure Settings', level: 2 } },
      { type: 'paragraph', data: { text: 'Navigate to settings and customize your preferences.' } },
      { type: 'header', data: { text: 'Step 3: Invite Your Team', level: 2 } },
      { type: 'paragraph', data: { text: 'Add team members and assign roles.' } }
    ]
  },
  {
    id: 'thought-leadership',
    name: 'Thought Leadership',
    description: 'Opinion piece or industry insights',
    category: 'content',
    tags: ['opinion', 'insights', 'leadership'],
    icon: 'Lightbulb',
    blocks: [
      { type: 'header', data: { text: 'The Future of Our Industry', level: 1 } },
      { type: 'quote', data: { text: 'The only constant is change.', caption: 'Industry Expert' } },
      { type: 'paragraph', data: { text: 'As we look ahead to the next decade, several trends are emerging...' } },
      { type: 'header', data: { text: 'Key Trends to Watch', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Trend 1: AI and Automation', 'Trend 2: Sustainability', 'Trend 3: Remote Work'] } }
    ]
  },
  {
    id: 'company-update',
    name: 'Company Update',
    description: 'Internal or external company update',
    category: 'content',
    tags: ['company', 'update', 'news'],
    icon: 'Building2',
    blocks: [
      { type: 'header', data: { text: 'Q4 Company Update', level: 1 } },
      { type: 'paragraph', data: { text: 'It\'s been an incredible quarter for our team...' } },
      { type: 'header', data: { text: 'Key Achievements', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Launched new product', 'Expanded to 3 new markets', 'Grew team by 20%'] } },
      { type: 'header', data: { text: 'Looking Ahead', level: 2 } },
      { type: 'paragraph', data: { text: 'In the coming quarter, we plan to...' } }
    ]
  },
  {
    id: 'seo-content-page',
    name: 'SEO Content Page',
    description: 'SEO-optimized content page template',
    category: 'content',
    tags: ['seo', 'content', 'organic'],
    icon: 'Search',
    blocks: [
      { type: 'header', data: { text: 'Primary Keyword - Complete Guide [2024]', level: 1 } },
      { type: 'paragraph', data: { text: 'Meta description optimized intro paragraph with primary keyword...' } },
      { type: 'header', data: { text: 'What is [Topic]?', level: 2 } },
      { type: 'paragraph', data: { text: 'Definition and overview...' } },
      { type: 'header', data: { text: 'Benefits of [Topic]', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Benefit 1', 'Benefit 2', 'Benefit 3'] } },
      { type: 'header', data: { text: 'How to [Action]', level: 2 } },
      { type: 'paragraph', data: { text: 'Step-by-step instructions...' } }
    ]
  },
  {
    id: 'reusable-section',
    name: 'Reusable Content Section',
    description: 'Modular content block for reuse',
    category: 'content',
    tags: ['reusable', 'modular', 'section'],
    icon: 'Copy',
    blocks: [
      { type: 'header', data: { text: 'Section Title', level: 2 } },
      { type: 'paragraph', data: { text: 'Reusable content that can be embedded across multiple pages.' } },
      { type: 'delimiter', data: {} }
    ]
  }
];

// Education Templates (12)
const educationTemplates: BlockTemplate[] = [
  {
    id: 'lesson-starter',
    name: 'Lesson Starter',
    description: 'Basic lesson template with objectives',
    category: 'education',
    tags: ['lesson', 'learning', 'course'],
    icon: 'BookOpen',
    blocks: [
      { type: 'lessonContent', data: { lessonTitle: 'Lesson Title', duration: '15 min', objectives: ['Understand concept A', 'Apply skill B'], content: 'Lesson introduction...', videoUrl: '' } },
      { type: 'header', data: { text: 'Key Concepts', level: 2 } },
      { type: 'paragraph', data: { text: 'Main lesson content goes here...' } }
    ]
  },
  {
    id: 'video-lesson',
    name: 'Video Lesson Page',
    description: 'Lesson centered around video content',
    category: 'education',
    tags: ['video', 'lesson', 'watch'],
    icon: 'Video',
    blocks: [
      { type: 'header', data: { text: 'Video Lesson: Topic Name', level: 1 } },
      { type: 'embed', data: { service: 'youtube', source: '', embed: '', width: 580, height: 320 } },
      { type: 'header', data: { text: 'Key Takeaways', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Takeaway 1', 'Takeaway 2', 'Takeaway 3'] } },
      { type: 'quiz', data: { question: 'What did you learn?', options: [{ text: 'Option A', isCorrect: true }, { text: 'Option B', isCorrect: false }], explanation: 'Correct! Option A is right because...', type: 'single' } }
    ]
  },
  {
    id: 'text-lesson',
    name: 'Text-Based Lesson',
    description: 'Reading-focused lesson template',
    category: 'education',
    tags: ['text', 'reading', 'lesson'],
    icon: 'FileText',
    blocks: [
      { type: 'header', data: { text: 'Understanding [Topic]', level: 1 } },
      { type: 'paragraph', data: { text: 'Introduction to the topic...' } },
      { type: 'header', data: { text: 'Core Concepts', level: 2 } },
      { type: 'paragraph', data: { text: 'Detailed explanation...' } },
      { type: 'quote', data: { text: 'Key insight to remember', caption: '' } },
      { type: 'header', data: { text: 'Summary', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Point 1', 'Point 2', 'Point 3'] } }
    ]
  },
  {
    id: 'code-lab-lesson',
    name: 'Code Lab Lesson',
    description: 'Hands-on coding exercise',
    category: 'education',
    tags: ['code', 'lab', 'exercise'],
    icon: 'Terminal',
    blocks: [
      { type: 'header', data: { text: 'Code Lab: Build a Component', level: 1 } },
      { type: 'paragraph', data: { text: 'In this lab, you\'ll build a React component from scratch.' } },
      { type: 'header', data: { text: 'Instructions', level: 2 } },
      { type: 'list', data: { style: 'ordered', items: ['Clone the starter repo', 'Install dependencies', 'Complete the TODO items', 'Run tests'] } },
      { type: 'header', data: { text: 'Starter Code', level: 2 } },
      { type: 'code', data: { code: 'function MyComponent() {\n  // TODO: Implement\n  return null;\n}' } }
    ]
  },
  {
    id: 'quiz-assessment',
    name: 'Quiz + Assessment',
    description: 'Quiz page with multiple questions',
    category: 'education',
    tags: ['quiz', 'assessment', 'test'],
    icon: 'HelpCircle',
    mentorOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Module 1 Assessment', level: 1 } },
      { type: 'paragraph', data: { text: 'Test your understanding of the concepts covered in Module 1.' } },
      { type: 'quiz', data: { question: 'Question 1: What is the primary purpose of X?', options: [{ text: 'Option A', isCorrect: true }, { text: 'Option B', isCorrect: false }, { text: 'Option C', isCorrect: false }], explanation: 'Correct answer explanation', type: 'single' } },
      { type: 'quiz', data: { question: 'Question 2: Select all that apply...', options: [{ text: 'Option A', isCorrect: true }, { text: 'Option B', isCorrect: true }, { text: 'Option C', isCorrect: false }], explanation: 'Both A and B are correct because...', type: 'multiple' } }
    ]
  },
  {
    id: 'course-intro',
    name: 'Course Introduction',
    description: 'Course overview and introduction page',
    category: 'education',
    tags: ['course', 'intro', 'overview'],
    icon: 'BookMarked',
    blocks: [
      { type: 'header', data: { text: 'Course: Mastering [Topic]', level: 1 } },
      { type: 'paragraph', data: { text: 'Welcome to this comprehensive course on [Topic].' } },
      { type: 'header', data: { text: 'What You\'ll Learn', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'] } },
      { type: 'header', data: { text: 'Prerequisites', level: 2 } },
      { type: 'paragraph', data: { text: 'Basic understanding of...' } },
      { type: 'header', data: { text: 'Course Structure', level: 2 } },
      { type: 'list', data: { style: 'ordered', items: ['Module 1: Introduction', 'Module 2: Core Concepts', 'Module 3: Advanced Topics', 'Module 4: Final Project'] } }
    ]
  },
  {
    id: 'course-landing',
    name: 'Course Landing Page',
    description: 'Marketing page for course enrollment',
    category: 'education',
    tags: ['course', 'landing', 'enrollment'],
    icon: 'GraduationCap',
    blocks: [
      { type: 'hero', data: { title: 'Master [Topic] in 30 Days', subtitle: 'A hands-on course for professionals', ctaText: 'Enroll Now', ctaUrl: '#' } },
      { type: 'featureGrid', data: { columns: 3, features: [
        { title: '20+ Lessons', description: 'Comprehensive curriculum', icon: '📚' },
        { title: 'Certificate', description: 'Upon completion', icon: '🏆' },
        { title: 'Community', description: 'Access to learners', icon: '👥' }
      ] } },
      { type: 'testimonial', data: { quote: 'This course transformed my career.', author: 'Student Name', role: 'Software Engineer' } }
    ]
  },
  {
    id: 'certificate-description',
    name: 'Certificate Description',
    description: 'Certificate achievement page',
    category: 'education',
    tags: ['certificate', 'achievement', 'completion'],
    icon: 'Award',
    blocks: [
      { type: 'header', data: { text: 'Certificate of Completion', level: 1 } },
      { type: 'paragraph', data: { text: 'This certificate is awarded upon successful completion of all course requirements.' } },
      { type: 'header', data: { text: 'Requirements', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Complete all lessons', 'Pass all quizzes with 80%+', 'Submit final project'] } }
    ]
  },
  {
    id: 'assignment-instructions',
    name: 'Assignment Instructions',
    description: 'Detailed assignment or project brief',
    category: 'education',
    tags: ['assignment', 'project', 'task'],
    icon: 'ClipboardList',
    mentorOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Assignment: Build a Portfolio', level: 1 } },
      { type: 'paragraph', data: { text: 'Due: January 30, 2024' } },
      { type: 'header', data: { text: 'Objective', level: 2 } },
      { type: 'paragraph', data: { text: 'Create a personal portfolio website showcasing your work.' } },
      { type: 'header', data: { text: 'Requirements', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Responsive design', 'At least 3 projects', 'Contact form', 'About section'] } },
      { type: 'header', data: { text: 'Submission', level: 2 } },
      { type: 'paragraph', data: { text: 'Submit your GitHub repo link and live URL.' } }
    ]
  },
  {
    id: 'module-overview',
    name: 'Module Overview',
    description: 'Overview page for course module',
    category: 'education',
    tags: ['module', 'overview', 'structure'],
    icon: 'Layers',
    blocks: [
      { type: 'header', data: { text: 'Module 2: Advanced Concepts', level: 1 } },
      { type: 'paragraph', data: { text: 'In this module, you\'ll dive deeper into...' } },
      { type: 'header', data: { text: 'Lessons in This Module', level: 2 } },
      { type: 'list', data: { style: 'ordered', items: ['Lesson 1: Topic A (20 min)', 'Lesson 2: Topic B (15 min)', 'Lesson 3: Topic C (25 min)', 'Quiz: Module 2 Assessment'] } },
      { type: 'header', data: { text: 'Estimated Time', level: 2 } },
      { type: 'paragraph', data: { text: 'Approximately 2 hours to complete.' } }
    ]
  },
  {
    id: 'student-welcome',
    name: 'Student Welcome',
    description: 'Welcome message for new students',
    category: 'education',
    tags: ['welcome', 'student', 'onboarding'],
    icon: 'UserPlus',
    blocks: [
      { type: 'header', data: { text: 'Welcome to the Course!', level: 1 } },
      { type: 'paragraph', data: { text: 'We\'re excited to have you here. Here\'s how to get started...' } },
      { type: 'header', data: { text: 'Getting Started', level: 2 } },
      { type: 'list', data: { style: 'ordered', items: ['Complete your profile', 'Join the community', 'Start with Module 1', 'Introduce yourself'] } },
      { type: 'cta', data: { heading: 'Ready to learn?', primaryText: 'Start Course', primaryUrl: '#' } }
    ]
  },
  {
    id: 'completion-summary',
    name: 'Completion Summary',
    description: 'Course or module completion page',
    category: 'education',
    tags: ['completion', 'summary', 'finish'],
    icon: 'CheckCircle',
    blocks: [
      { type: 'header', data: { text: 'Congratulations! 🎉', level: 1 } },
      { type: 'paragraph', data: { text: 'You\'ve successfully completed this course!' } },
      { type: 'header', data: { text: 'What You Achieved', level: 2 } },
      { type: 'featureGrid', data: { columns: 3, features: [
        { title: '20', description: 'Lessons completed', icon: '📚' },
        { title: '5', description: 'Quizzes passed', icon: '✅' },
        { title: '1', description: 'Certificate earned', icon: '🏆' }
      ] } },
      { type: 'header', data: { text: 'What\'s Next?', level: 2 } },
      { type: 'paragraph', data: { text: 'Continue your learning journey with these recommendations...' } }
    ]
  }
];

// Engagement Templates (10)
const engagementTemplates: BlockTemplate[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email Content',
    description: 'Welcome message for new users',
    category: 'engage',
    tags: ['email', 'welcome', 'onboarding'],
    icon: 'Mail',
    blocks: [
      { type: 'header', data: { text: 'Welcome to [Platform]!', level: 1 } },
      { type: 'paragraph', data: { text: 'Hi {{first_name}}, we\'re thrilled to have you join us!' } },
      { type: 'paragraph', data: { text: 'Here are some things you can do to get started:' } },
      { type: 'list', data: { style: 'unordered', items: ['Complete your profile', 'Explore features', 'Connect with community'] } },
      { type: 'cta', data: { heading: 'Get Started', primaryText: 'Go to Dashboard', primaryUrl: '{{dashboard_url}}' } }
    ]
  },
  {
    id: 'enrollment-email',
    name: 'Course Enrollment Email',
    description: 'Confirmation email for course enrollment',
    category: 'engage',
    tags: ['email', 'course', 'enrollment'],
    icon: 'GraduationCap',
    blocks: [
      { type: 'header', data: { text: 'You\'re Enrolled!', level: 1 } },
      { type: 'paragraph', data: { text: 'Hi {{first_name}}, congratulations on enrolling in {{course_name}}!' } },
      { type: 'header', data: { text: 'What\'s Next', level: 2 } },
      { type: 'list', data: { style: 'ordered', items: ['Access your course dashboard', 'Start with the first lesson', 'Join the discussion forum'] } },
      { type: 'cta', data: { heading: 'Start Learning', primaryText: 'Go to Course', primaryUrl: '{{course_url}}' } }
    ]
  },
  {
    id: 'completion-email',
    name: 'Completion Email',
    description: 'Congratulations on course completion',
    category: 'engage',
    tags: ['email', 'completion', 'certificate'],
    icon: 'Award',
    blocks: [
      { type: 'header', data: { text: 'Congratulations, {{first_name}}!', level: 1 } },
      { type: 'paragraph', data: { text: 'You\'ve successfully completed {{course_name}}!' } },
      { type: 'paragraph', data: { text: 'Your certificate is ready to download.' } },
      { type: 'cta', data: { heading: 'Get Your Certificate', primaryText: 'Download Certificate', primaryUrl: '{{certificate_url}}' } }
    ]
  },
  {
    id: 'abandoned-session',
    name: 'Abandoned Session Reminder',
    description: 'Re-engage users who left mid-session',
    category: 'engage',
    tags: ['email', 'reminder', 'retention'],
    icon: 'Bell',
    blocks: [
      { type: 'header', data: { text: 'Don\'t Leave Progress Behind!', level: 1 } },
      { type: 'paragraph', data: { text: 'Hi {{first_name}}, we noticed you were making great progress in {{course_name}}.' } },
      { type: 'paragraph', data: { text: 'You\'re {{progress}}% complete - just a little more to go!' } },
      { type: 'cta', data: { heading: 'Continue Learning', primaryText: 'Resume Course', primaryUrl: '{{resume_url}}' } }
    ]
  },
  {
    id: 'event-announcement',
    name: 'Event Announcement',
    description: 'Announce upcoming event or webinar',
    category: 'engage',
    tags: ['event', 'announcement', 'webinar'],
    icon: 'Calendar',
    blocks: [
      { type: 'header', data: { text: 'You\'re Invited: [Event Name]', level: 1 } },
      { type: 'paragraph', data: { text: 'Join us for an exclusive event on {{event_date}}.' } },
      { type: 'header', data: { text: 'Event Details', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Date: {{event_date}}', 'Time: {{event_time}}', 'Location: {{event_location}}'] } },
      { type: 'cta', data: { heading: 'Reserve Your Spot', primaryText: 'Register Now', primaryUrl: '{{registration_url}}' } }
    ]
  },
  {
    id: 'webinar-landing',
    name: 'Webinar Landing Section',
    description: 'Webinar registration section',
    category: 'engage',
    tags: ['webinar', 'landing', 'registration'],
    icon: 'Video',
    blocks: [
      { type: 'hero', data: { title: 'Free Webinar: [Topic]', subtitle: 'Learn from industry experts', ctaText: 'Register Free', ctaUrl: '#' } },
      { type: 'header', data: { text: 'What You\'ll Learn', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Topic 1', 'Topic 2', 'Topic 3'] } },
      { type: 'header', data: { text: 'About the Speaker', level: 2 } },
      { type: 'paragraph', data: { text: 'Speaker bio and credentials...' } }
    ]
  },
  {
    id: 'community-update',
    name: 'Community Update',
    description: 'Newsletter for community members',
    category: 'engage',
    tags: ['community', 'update', 'newsletter'],
    icon: 'Users',
    blocks: [
      { type: 'header', data: { text: 'This Week in Our Community', level: 1 } },
      { type: 'paragraph', data: { text: 'Here\'s what\'s been happening...' } },
      { type: 'header', data: { text: 'Top Discussions', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Discussion 1', 'Discussion 2', 'Discussion 3'] } },
      { type: 'header', data: { text: 'Featured Members', level: 2 } },
      { type: 'paragraph', data: { text: 'Spotlight on community contributors...' } }
    ]
  },
  {
    id: 'feedback-request',
    name: 'Feedback Request',
    description: 'Request for user feedback or review',
    category: 'engage',
    tags: ['feedback', 'survey', 'review'],
    icon: 'MessageSquare',
    blocks: [
      { type: 'header', data: { text: 'We\'d Love Your Feedback!', level: 1 } },
      { type: 'paragraph', data: { text: 'Hi {{first_name}}, your opinion matters to us.' } },
      { type: 'paragraph', data: { text: 'Take 2 minutes to share your experience and help us improve.' } },
      { type: 'cta', data: { heading: 'Share Feedback', primaryText: 'Take Survey', primaryUrl: '{{survey_url}}' } }
    ]
  },
  {
    id: 'reengagement-message',
    name: 'Re-engagement Message',
    description: 'Win back inactive users',
    category: 'engage',
    tags: ['re-engagement', 'retention', 'win-back'],
    icon: 'RefreshCw',
    blocks: [
      { type: 'header', data: { text: 'We Miss You, {{first_name}}!', level: 1 } },
      { type: 'paragraph', data: { text: 'It\'s been a while since we\'ve seen you. Here\'s what you\'ve missed:' } },
      { type: 'list', data: { style: 'unordered', items: ['New feature 1', 'New course added', 'Community updates'] } },
      { type: 'cta', data: { heading: 'Come Back', primaryText: 'See What\'s New', primaryUrl: '{{dashboard_url}}' } }
    ]
  },
  {
    id: 'survey-intro',
    name: 'Survey Introduction',
    description: 'Introduction page for surveys',
    category: 'engage',
    tags: ['survey', 'intro', 'research'],
    icon: 'ClipboardList',
    blocks: [
      { type: 'header', data: { text: 'Help Us Improve', level: 1 } },
      { type: 'paragraph', data: { text: 'This quick survey will help us understand your needs better.' } },
      { type: 'header', data: { text: 'What to Expect', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['5-10 questions', '3 minutes to complete', 'Anonymous responses'] } },
      { type: 'cta', data: { heading: 'Start Survey', primaryText: 'Begin', primaryUrl: '#' } }
    ]
  }
];

// System Templates (6)
const systemTemplates: BlockTemplate[] = [
  {
    id: 'automation-trigger',
    name: 'Automation Trigger Starter',
    description: 'Template for automation trigger content',
    category: 'system',
    tags: ['automation', 'trigger', 'workflow'],
    icon: 'Zap',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Automation: [Name]', level: 1 } },
      { type: 'paragraph', data: { text: 'This content triggers automation workflows when viewed.' } },
      { type: 'code', data: { code: '// Automation trigger metadata\n{\n  "trigger": "content_view",\n  "action": "send_notification"\n}' } }
    ]
  },
  {
    id: 'cms-automation-bridge',
    name: 'CMS → Automation Bridge',
    description: 'Connect CMS content to automation',
    category: 'system',
    tags: ['cms', 'automation', 'integration'],
    icon: 'Link',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Content-Triggered Automation', level: 1 } },
      { type: 'paragraph', data: { text: 'This content is connected to the following automation workflows:' } },
      { type: 'table', data: { content: [['Event', 'Action', 'Status'], ['On Publish', 'Send email', 'Active'], ['On Update', 'Sync CDN', 'Active']] } }
    ]
  },
  {
    id: 'website-conversion',
    name: 'Website Conversion Trigger',
    description: 'Trigger conversions from website actions',
    category: 'system',
    tags: ['website', 'conversion', 'tracking'],
    icon: 'Target',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Conversion Event', level: 1 } },
      { type: 'paragraph', data: { text: 'Track and trigger actions on website conversions.' } },
      { type: 'code', data: { code: '// Conversion tracking\nzenith.track("conversion", {\n  type: "signup",\n  value: 100\n})' } }
    ]
  },
  {
    id: 'lms-completion-trigger',
    name: 'LMS Completion Trigger',
    description: 'Trigger actions on course completion',
    category: 'system',
    tags: ['lms', 'completion', 'certificate'],
    icon: 'CheckSquare',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Course Completion Handler', level: 1 } },
      { type: 'paragraph', data: { text: 'Actions triggered when a student completes a course:' } },
      { type: 'list', data: { style: 'ordered', items: ['Generate certificate', 'Send completion email', 'Update student record', 'Award badge'] } }
    ]
  },
  {
    id: 'api-event-docs',
    name: 'API Event Documentation',
    description: 'Document API events and webhooks',
    category: 'system',
    tags: ['api', 'events', 'documentation'],
    icon: 'Webhook',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'API Event: [Event Name]', level: 1 } },
      { type: 'paragraph', data: { text: 'This event is triggered when...' } },
      { type: 'header', data: { text: 'Payload', level: 2 } },
      { type: 'code', data: { code: '{\n  "event": "user.created",\n  "data": {\n    "id": "user_123",\n    "email": "user@example.com"\n  }\n}' } },
      { type: 'header', data: { text: 'Handling', level: 2 } },
      { type: 'code', data: { code: 'app.post("/webhooks", (req, res) => {\n  const { event, data } = req.body;\n  // Handle event\n})' } }
    ]
  },
  {
    id: 'webhook-payload',
    name: 'Webhook Payload Explanation',
    description: 'Document webhook payload structure',
    category: 'system',
    tags: ['webhook', 'payload', 'integration'],
    icon: 'Code',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Webhook: [Name]', level: 1 } },
      { type: 'paragraph', data: { text: 'This webhook sends data to your endpoint when triggered.' } },
      { type: 'header', data: { text: 'Payload Structure', level: 2 } },
      { type: 'table', data: { content: [['Field', 'Type', 'Description'], ['event', 'string', 'Event name'], ['timestamp', 'number', 'Unix timestamp'], ['data', 'object', 'Event data']] } }
    ]
  }
];

// Internal Templates (5)
const internalTemplates: BlockTemplate[] = [
  {
    id: 'knowledge-base',
    name: 'Internal Knowledge Base',
    description: 'Internal documentation page',
    category: 'internal',
    tags: ['knowledge', 'internal', 'docs'],
    icon: 'BookOpen',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Knowledge Base: [Topic]', level: 1 } },
      { type: 'paragraph', data: { text: 'Internal documentation for team reference.' } },
      { type: 'header', data: { text: 'Overview', level: 2 } },
      { type: 'paragraph', data: { text: 'Description of the topic...' } },
      { type: 'header', data: { text: 'Related Resources', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Resource 1', 'Resource 2', 'Resource 3'] } }
    ]
  },
  {
    id: 'sop-document',
    name: 'SOP Document',
    description: 'Standard operating procedure',
    category: 'internal',
    tags: ['sop', 'procedure', 'operations'],
    icon: 'FileCheck',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'SOP: [Process Name]', level: 1 } },
      { type: 'paragraph', data: { text: 'Last updated: [Date] | Owner: [Team]' } },
      { type: 'header', data: { text: 'Purpose', level: 2 } },
      { type: 'paragraph', data: { text: 'This procedure ensures...' } },
      { type: 'header', data: { text: 'Steps', level: 2 } },
      { type: 'list', data: { style: 'ordered', items: ['Step 1: ...', 'Step 2: ...', 'Step 3: ...'] } },
      { type: 'header', data: { text: 'Exceptions', level: 2 } },
      { type: 'paragraph', data: { text: 'Contact [Team] if...' } }
    ]
  },
  {
    id: 'policy-compliance',
    name: 'Policy & Compliance',
    description: 'Policy and compliance documentation',
    category: 'internal',
    tags: ['policy', 'compliance', 'legal'],
    icon: 'Shield',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Policy: [Policy Name]', level: 1 } },
      { type: 'paragraph', data: { text: 'Effective Date: [Date]' } },
      { type: 'header', data: { text: 'Policy Statement', level: 2 } },
      { type: 'paragraph', data: { text: 'This policy establishes...' } },
      { type: 'header', data: { text: 'Scope', level: 2 } },
      { type: 'paragraph', data: { text: 'This policy applies to...' } },
      { type: 'header', data: { text: 'Requirements', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Requirement 1', 'Requirement 2', 'Requirement 3'] } }
    ]
  },
  {
    id: 'employee-training',
    name: 'Employee Training Intro',
    description: 'Training module introduction',
    category: 'internal',
    tags: ['training', 'employee', 'onboarding'],
    icon: 'Users',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Training: [Module Name]', level: 1 } },
      { type: 'paragraph', data: { text: 'Welcome to this training module. Estimated time: 30 minutes.' } },
      { type: 'header', data: { text: 'Learning Objectives', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Objective 1', 'Objective 2', 'Objective 3'] } },
      { type: 'header', data: { text: 'Prerequisites', level: 2 } },
      { type: 'paragraph', data: { text: 'Complete [Previous Module] before starting.' } }
    ]
  },
  {
    id: 'internal-announcement',
    name: 'Internal Announcement',
    description: 'Company-wide internal announcement',
    category: 'internal',
    tags: ['announcement', 'internal', 'company'],
    icon: 'Megaphone',
    adminOnly: true,
    blocks: [
      { type: 'header', data: { text: 'Announcement: [Title]', level: 1 } },
      { type: 'paragraph', data: { text: 'Posted by [Author] on [Date]' } },
      { type: 'paragraph', data: { text: 'Main announcement content...' } },
      { type: 'header', data: { text: 'Action Items', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Action 1', 'Action 2'] } },
      { type: 'header', data: { text: 'Questions?', level: 2 } },
      { type: 'paragraph', data: { text: 'Contact [Team/Person] for more information.' } }
    ]
  }
];

// Export all templates
export const allTemplates: BlockTemplate[] = [
  ...marketingTemplates,
  ...contentTemplates,
  ...educationTemplates,
  ...engagementTemplates,
  ...systemTemplates,
  ...internalTemplates
];

export const templateCategories = [
  { id: 'all', label: 'All' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'content', label: 'Content' },
  { id: 'education', label: 'Education' },
  { id: 'engage', label: 'Engage' },
  { id: 'system', label: 'System' },
  { id: 'internal', label: 'Internal' }
];

export const getTemplatesByCategory = (category: string, userRole: string = 'tenant_admin'): BlockTemplate[] => {
  let templates = category === 'all' ? allTemplates : allTemplates.filter(t => t.category === category);
  
  // Filter by role
  if (userRole !== 'tenant_admin') {
    templates = templates.filter(t => !t.adminOnly);
  }
  if (!['tenant_admin', 'mentor'].includes(userRole)) {
    templates = templates.filter(t => !t.mentorOnly);
  }
  
  return templates;
};

export const searchTemplates = (query: string, category: string = 'all', userRole: string = 'tenant_admin'): BlockTemplate[] => {
  const templates = getTemplatesByCategory(category, userRole);
  if (!query) return templates;
  
  const lowerQuery = query.toLowerCase();
  return templates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
