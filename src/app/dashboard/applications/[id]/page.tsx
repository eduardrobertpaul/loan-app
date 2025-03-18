import { auth } from '../../../../../auth';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Sample applications data (would come from API in production)
const applications = [
  {
    id: '1',
    applicant: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, CA 90210',
      dateOfBirth: '1985-06-15',
    },
    financial: {
      income: 75000,
      employmentStatus: 'employed',
      employerName: 'Acme Corporation',
      jobTitle: 'Software Developer',
      yearsEmployed: 4,
      monthlyExpenses: 2500,
      otherLoans: 500,
      creditScore: 720,
    },
    loan: {
      amount: 25000,
      purpose: 'Home Renovation',
      term: 5,
      collateral: 'yes',
      collateralType: 'Home Equity',
      collateralValue: 150000,
    },
    status: 'pending',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-03-15T10:30:00Z',
    notes: [
      { id: '1', text: 'Initial application received', author: 'System', createdAt: '2023-03-15T10:30:00Z' },
      { id: '2', text: 'Credit check complete', author: 'Jane Smith', createdAt: '2023-03-16T14:22:00Z' },
    ],
  },
  // More applications with similar structure...
];

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const applicationId = params.id;
  
  // Find the application with the matching ID
  const application = applications.find(app => app.id === applicationId);
  
  // If application not found, return 404
  if (!application) {
    notFound();
  }
  
  // Calculate debt-to-income ratio
  const monthlyIncome = application.financial.income / 12;
  const dti = ((application.financial.monthlyExpenses + application.financial.otherLoans) / monthlyIncome) * 100;
  
  // Determine approval recommendation
  const getRecommendation = () => {
    if (application.financial.creditScore >= 700 && dti <= 36) {
      return { status: 'Approve', message: 'Good credit score and acceptable DTI ratio.' };
    } else if (application.financial.creditScore >= 650 && dti <= 40) {
      return { status: 'Review', message: 'Credit score and DTI ratio are borderline.' };
    } else {
      return { status: 'Decline', message: 'Low credit score or high DTI ratio.' };
    }
  };
  
  const recommendation = getRecommendation();
  
  return (
    <DashboardLayout session={session}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb and header */}
        <div className="mb-6">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
            <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">Dashboard</Link>
            <svg className="h-5 w-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link href="/dashboard/applications" className="hover:text-gray-700 dark:hover:text-gray-300">Applications</Link>
            <svg className="h-5 w-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-900 dark:text-white">Application #{application.id}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Loan Application: {application.applicant.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Submitted on {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                href={`/dashboard/applications/${application.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Process Application
              </button>
            </div>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            application.status === 'approved'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : application.status === 'rejected'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
        
        {/* Main content - 2 columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Application details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.applicant.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.applicant.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.applicant.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(application.applicant.dateOfBirth).toLocaleDateString()}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.applicant.address}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Financial Information */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Financial Information
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Annual Income</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">${application.financial.income.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Employment Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{application.financial.employmentStatus}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Employer</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.financial.employerName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.financial.jobTitle}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Years Employed</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.financial.yearsEmployed}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expenses</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">${application.financial.monthlyExpenses.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Other Loan Payments (Monthly)</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">${application.financial.otherLoans.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Credit Score</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.financial.creditScore}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Loan Details */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Loan Details
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Loan Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">${application.loan.amount.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Purpose</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.loan.purpose}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Term</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.loan.term} years</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Collateral</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{application.loan.collateral}</dd>
                  </div>
                  {application.loan.collateral === 'yes' && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Collateral Type</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{application.loan.collateralType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Collateral Value</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">${application.loan.collateralValue.toLocaleString()}</dd>
                      </div>
                    </>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Payment (Estimated)</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      ${Math.round(application.loan.amount / (application.loan.term * 12)).toLocaleString()}/month
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Activity log */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Activity Log
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {application.notes.map((note, noteIdx) => (
                      <li key={note.id}>
                        <div className="relative pb-8">
                          {noteIdx !== application.notes.length - 1 ? (
                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900 dark:text-white">{note.author}</span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(note.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                <p>{note.text}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <div className="flex space-x-3">
                    <div className="flex-grow">
                      <label htmlFor="comment" className="sr-only">Add note</label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                        placeholder="Add a note..."
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Evaluation and metrics */}
          <div className="space-y-6">
            {/* Recommendation */}
            <div className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border-l-4 ${
              recommendation.status === 'Approve'
                ? 'border-green-500'
                : recommendation.status === 'Review'
                ? 'border-yellow-500'
                : 'border-red-500'
            }`}>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">
                  System Recommendation
                </h3>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  recommendation.status === 'Approve'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : recommendation.status === 'Review'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {recommendation.status}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {recommendation.message}
                </p>
                <div className="mt-5 flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Request More Info
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Key Metrics
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <span>Credit Score</span>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.financial.creditScore >= 700
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : application.financial.creditScore >= 650
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {application.financial.creditScore >= 700
                            ? 'Good'
                            : application.financial.creditScore >= 650
                            ? 'Fair'
                            : 'Poor'}
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1">
                      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            application.financial.creditScore >= 700
                              ? 'bg-green-500'
                              : application.financial.creditScore >= 650
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${(application.financial.creditScore / 850) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>300</span>
                        <span className="font-medium text-gray-900 dark:text-white">{application.financial.creditScore}</span>
                        <span>850</span>
                      </div>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <span>Debt-to-Income Ratio</span>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dti <= 36
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : dti <= 43
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {dti <= 36
                            ? 'Good'
                            : dti <= 43
                            ? 'Fair'
                            : 'Poor'}
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1">
                      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            dti <= 36
                              ? 'bg-green-500'
                              : dti <= 43
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(dti, 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>0%</span>
                        <span className="font-medium text-gray-900 dark:text-white">{dti.toFixed(2)}%</span>
                        <span>100%</span>
                      </div>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Loan-to-Income Ratio</dt>
                    <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                      {(application.loan.amount / application.financial.income).toFixed(2)}x
                    </dd>
                  </div>
                  
                  {application.loan.collateral === 'yes' && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Loan-to-Value Ratio</dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {((application.loan.amount / application.loan.collateralValue) * 100).toFixed(2)}%
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            {/* Documents */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Documents
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">ID Document</span>
                    </div>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View</button>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">Proof of Income</span>
                    </div>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View</button>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">Credit Report</span>
                    </div>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View</button>
                  </li>
                </ul>
                <div className="mt-4">
                  <button
                    type="button"
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Upload Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 