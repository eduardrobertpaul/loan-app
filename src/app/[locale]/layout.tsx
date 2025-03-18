import { ReactNode } from 'react';
import { Locale, locales } from '@/i18n.config';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/lib/utils/get-messages';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: Locale;
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Await the params to avoid the "params should be awaited" error
  const { locale } = params;
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 