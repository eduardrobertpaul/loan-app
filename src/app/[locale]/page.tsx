'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LocalizedHomePage() {
  const { common, navigation } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">{common.appTitle}</h1>
      <p className="text-xl text-center mb-8 max-w-2xl">
        Platformă pentru evaluarea și gestionarea cererilor de credit
      </p>
      <div className="flex space-x-4">
        <Link
          href="/login"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          {navigation.dashboard}
        </Link>
      </div>
    </div>
  );
} 