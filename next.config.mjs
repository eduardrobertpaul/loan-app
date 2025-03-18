/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

const nextConfig = {
  experimental: {
    serverExternalPackages: [],
  },
};

export default withNextIntl(nextConfig); 