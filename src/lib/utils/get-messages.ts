import { Locale } from '@/i18n.config';
import { notFound } from 'next/navigation';
import { Messages } from '@/i18n.config';

export async function getMessages(locale: Locale): Promise<Messages> {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
} 