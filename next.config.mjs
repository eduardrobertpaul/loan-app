/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

const nextConfig = {
  // Other configurations can go here if needed
};

export default withNextIntl(nextConfig); 