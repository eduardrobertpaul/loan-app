'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale } from '@/i18n.config';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: Locale) => {
    startTransition(() => {
      // If the current pathname already has a locale prefix, replace it
      if (pathname.startsWith(`/${currentLocale}/`)) {
        const pathWithoutLocale = pathname.replace(`/${currentLocale}/`, '/');
        router.push(`/${newLocale}${pathWithoutLocale}`);
      } else if (pathname === `/${currentLocale}`) {
        // Handle root path with locale
        router.push(`/${newLocale}`);
      } else {
        // For paths without locale prefix
        router.push(`/${newLocale}${pathname}`);
      }
    });
  };

  const localeCodes: Record<Locale, string> = {
    ro: '🇷🇴',
    en: '🇬🇧'
  };

  const localeNames: Record<Locale, string> = {
    ro: 'Română',
    en: 'English'
  };

  return (
    <div className="flex items-center space-x-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleChange(locale)}
          className={`flex items-center px-2 py-1 rounded ${
            currentLocale === locale
              ? 'bg-primary text-white font-bold'
              : 'hover:bg-gray-100'
          } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
          disabled={isPending || currentLocale === locale}
          title={localeNames[locale]}
        >
          <span className="mr-1">{localeCodes[locale]}</span>
          <span className="text-sm">{locale.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
} 