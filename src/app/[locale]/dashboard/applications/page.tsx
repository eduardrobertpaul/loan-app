'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ApplicationsPage() {
  const { applications, common } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useParams();
  
  // Mock data for applications
  const mockApplications = [
    {
      id: '1',
      applicant: { name: 'Ioan Popescu' },
      loan: { amount: 25000, purpose: 'home' },
      status: 'pending',
      createdAt: '2023-11-15T10:30:00Z'
    },
    {
      id: '2',
      applicant: { name: 'Maria Ionescu' },
      loan: { amount: 10000, purpose: 'auto' },
      status: 'approved',
      createdAt: '2023-11-12T14:45:00Z'
    },
    {
      id: '3',
      applicant: { name: 'Alexandru Dumitrescu' },
      loan: { amount: 5000, purpose: 'personal' },
      status: 'rejected',
      createdAt: '2023-11-10T09:15:00Z'
    }
  ];

  // Format date string for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO');
  };

  // Format currency for display
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '0 RON';
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get translated status
  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case 'approved':
        return applications.approved;
      case 'rejected':
        return applications.rejected;
      default:
        return applications.pending;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{applications.title}</h1>
        <Link
          href={`/${locale}/dashboard/applications/new`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
        >
          {applications.new}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">{common.loading}</div>
        ) : mockApplications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {applications.noApplications}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {applications.id}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {applications.applicantName}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {applications.loanAmount}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {applications.purpose}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {applications.status}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {applications.createdAt}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {applications.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {application.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.applicant?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(application.loan?.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.loan?.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(application.status)}`}>
                        {getTranslatedStatus(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/${locale}/dashboard/applications/${application.id}`}
                        className="text-primary hover:text-primary-dark mx-2"
                      >
                        {applications.viewDetails}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 