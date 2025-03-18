import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Validate the locale and ensure it's never undefined
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  // Load messages for the current locale
  return {
    locale: locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 