'use client';

import { useTranslation } from '@/lib/hooks/useTranslation';
import ApplicationForm from '@/components/forms/ApplicationForm';

export default function NewApplicationPage() {
  const { applications } = useTranslation();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{applications.new}</h1>
      <ApplicationForm />
    </div>
  );
} 