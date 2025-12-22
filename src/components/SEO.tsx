import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

export const SEO = ({
  title = 'Zenith Studio - The Operating System for Digital Businesses',
  description = 'Run your digital business from one control plane. Zenith Studio orchestrates content, experiences, learning, and automation — without locking you into tools or infrastructure.',
  canonical = 'https://zenith.studio',
  type = 'website',
  image = '/og-image.png',
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Zenith Studio',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: '30-day free trial',
          },
        })}
      </script>
    </Helmet>
  );
};
