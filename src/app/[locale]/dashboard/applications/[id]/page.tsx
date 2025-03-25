'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { applications, applicationDetails, common } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { locale } = useParams();
  
  // Fetch application data
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch application');
        }
        
        const data = await response.json();
        setApplication(data.data);
      } catch (error) {
        console.error('Error fetching application:', error);
        setError('Failed to load application details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplication();
  }, [params.id]);
  
  // Format date string for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO');
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
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
  
  // Process the application (approve or reject)
  const processApplication = async (decision: 'approved' | 'rejected') => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/${params.id}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision,
          comments: `Application ${decision} by user.`
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${decision} application`);
      }
      
      const result = await response.json();
      
      // Update the application data with the result
      setApplication(result.data);
      
      // Show success message or redirect
      router.refresh();
      // Redirect to the applications list after successful processing
      setTimeout(() => {
        router.push(`/${locale}/dashboard/applications`);
      }, 1000);
    } catch (error) {
      console.error(`Error ${decision} application:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${decision} application. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return <div className="p-4 text-center">{common.loading}</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  if (!application) {
    return <div className="p-4 text-center">Application not found</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{applicationDetails.title}</h1>
        <Link
          href={`/${locale}/dashboard/applications`}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          {common.back}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{applicationDetails.status}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(application.status)}`}>
            {getTranslatedStatus(application.status)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500">{applications.id}</p>
            <p className="font-semibold">{application.id}</p>
          </div>
          <div>
            <p className="text-gray-500">{applications.createdAt}</p>
            <p className="font-semibold">{formatDate(application.createdAt)}</p>
          </div>
        </div>
      </div>
      
      {/* Applicant Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{applicationDetails.applicantInfo}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">{application.applicant?.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{application.applicant?.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-semibold">{application.applicant?.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-semibold">{application.applicant?.address}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-semibold">{formatDate(application.applicant?.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-gray-500">Employment Status</p>
            <p className="font-semibold">{application.applicant?.employmentStatus}</p>
          </div>
        </div>
      </div>
      
      {/* Financial Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{applicationDetails.financialInfo}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Annual Income</p>
            <p className="font-semibold">{formatCurrency(application.financial?.income)}</p>
          </div>
          <div>
            <p className="text-gray-500">Monthly Expenses</p>
            <p className="font-semibold">{formatCurrency(application.financial?.monthlyExpenses)}</p>
          </div>
          <div>
            <p className="text-gray-500">Other Loans</p>
            <p className="font-semibold">{formatCurrency(application.financial?.otherLoans)}</p>
          </div>
          <div>
            <p className="text-gray-500">Credit Score</p>
            <p className="font-semibold">{application.financial?.creditScore}</p>
          </div>
        </div>
      </div>
      
      {/* Loan Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{applicationDetails.loanInfo}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Loan Amount</p>
            <p className="font-semibold">{formatCurrency(application.loan?.amount)}</p>
          </div>
          <div>
            <p className="text-gray-500">Purpose</p>
            <p className="font-semibold">{application.loan?.purpose}</p>
          </div>
          <div>
            <p className="text-gray-500">Term (months)</p>
            <p className="font-semibold">{application.loan?.term}</p>
          </div>
          <div>
            <p className="text-gray-500">Collateral</p>
            <p className="font-semibold">{application.loan?.collateral}</p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      {application.status === 'pending' && (
        <div className="flex justify-end space-x-4 mt-8">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => processApplication('approved')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {common.loading}
              </div>
            ) : applications.approved}
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => processApplication('rejected')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {common.loading}
              </div>
            ) : applications.rejected}
          </button>
        </div>
      )}
      
      {/* Decision Information (if already processed) */}
      {(application.status === 'approved' || application.status === 'rejected') && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Decision Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Decision</p>
              <p className={`font-semibold ${application.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                {application.status === 'approved' ? 'Approved' : 'Rejected'}
              </p>
            </div>
            {application.reviewedBy && (
              <div>
                <p className="text-gray-500">Reviewed By</p>
                <p className="font-semibold">{application.reviewedBy}</p>
              </div>
            )}
            {application.reviewedAt && (
              <div>
                <p className="text-gray-500">Reviewed At</p>
                <p className="font-semibold">{formatDate(application.reviewedAt)}</p>
              </div>
            )}
            {application.decisionReason && (
              <div className="col-span-2">
                <p className="text-gray-500">Reason</p>
                <p className="font-semibold">{application.decisionReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 