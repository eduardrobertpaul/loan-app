/** @type {import('next').NextConfig} */
import { withNextIntl } from 'next-intl/plugin';

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default withNextIntl('./src/lib/i18n.ts')(nextConfig); 