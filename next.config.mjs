/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

const nextConfig = {
  // Ensure fonts are properly optimized and loaded
  optimizeFonts: true,
  
  // Experimental options to make sure TailwindCSS works
  experimental: {
    optimizeCss: true
  }
};

export default withNextIntl(nextConfig); 