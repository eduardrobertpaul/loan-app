import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n.config';
import Link from 'next/link';

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Loan Evaluation System
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          A comprehensive tool for bank employees to assess loan applications
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Log In
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="text-lg font-medium">Evaluate Applications</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Process loan applications with a rule-based evaluation system
          </p>
        </div>
        
        <div className="rounded-lg border p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="text-lg font-medium">Review Results</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Analyze evaluation results with detailed metrics and recommendations
          </p>
        </div>
        
        <div className="rounded-lg border p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="text-lg font-medium">Secure Access</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Bank employee authentication ensures data security and privacy
          </p>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Bank Corp. All rights reserved.</p>
      </footer>
    </div>
  );
}
