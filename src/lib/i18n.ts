import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/i18n.config';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  // Load messages for the current locale
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 