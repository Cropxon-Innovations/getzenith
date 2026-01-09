import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  keywords?: string;
}

export const SEO = ({
  title = 'Zenith Studio by Cropxon | Digital Business Operating System - CMS, LMS, Website Builder, Automation',
  description = 'Zenith Studio is the complete Digital Business Studio (DBS) by Cropxon Innovations. Run CMS, LMS, Website Builder, and Automation Workflow Studio from one control plane.',
  canonical = 'https://zenith.studio',
  type = 'website',
  image = '/og-image.png',
  keywords = 'Zenith Studio, Cropxon, digital business studio, DBS, CMS, LMS, website builder, automation workflow, enterprise software',
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />
      
      {/* Publisher Info */}
      <meta name="author" content="Cropxon Innovations Pvt. Ltd." />
      <meta name="publisher" content="Cropxon Innovations Pvt. Ltd." />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Zenith Studio by Cropxon" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@Cropxon" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Zenith Studio',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: description,
          creator: {
            '@type': 'Organization',
            name: 'Cropxon Innovations Pvt. Ltd.',
            url: 'https://cropxon.com',
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: '30-day free trial',
          },
          featureList: [
            'Content Management System (CMS)',
            'Learning Management System (LMS)',
            'Website Builder',
            'Automation Workflow Studio',
          ],
        })}
      </script>
    </Helmet>
  );
};
