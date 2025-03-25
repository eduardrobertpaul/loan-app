'use client';

import { useSession } from 'next-auth/react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session } = useSession();
  const { dashboard, navigation, t } = useTranslation();

  // Sample data for the dashboard
  const stats = {
    pendingApplications: 12,
    approvedApplications: 45,
    rejectedApplications: 8,
    totalApplications: 65,
  };

  // Sample recent activity
  const recentActivity = [
    {
      id: 1,
      action: 'Cerere nouă',
      description: 'O cerere nouă a fost creată',
      time: '2 ore în urmă',
    },
    {
      id: 2,
      action: 'Aprobare',
      description: 'Cererea #1234 a fost aprobată',
      time: '5 ore în urmă',
    },
    {
      id: 3,
      action: 'Respingere',
      description: 'Cererea #1235 a fost respinsă',
      time: '1 zi în urmă',
    },
    {
      id: 4,
      action: 'Evaluare',
      description: 'Cererea #1236 a fost evaluată',
      time: '1 zi în urmă',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{dashboard.title}</h1>
      <p className="mb-6">
        {t.rich('dashboard.welcome', { name: session?.user?.name || 'User' })}
      </p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {dashboard.pendingApplications}
          </h2>
          <p className="text-3xl font-bold">{stats.pendingApplications}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {dashboard.approvedApplications}
          </h2>
          <p className="text-3xl font-bold">{stats.approvedApplications}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {dashboard.rejectedApplications}
          </h2>
          <p className="text-3xl font-bold">{stats.rejectedApplications}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total</h2>
          <p className="text-3xl font-bold">{stats.totalApplications}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">{dashboard.quickActions}</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/applications/new"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
          >
            {navigation.newApplication}
          </Link>
          <Link
            href="/dashboard/applications"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            {navigation.applications}
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          {dashboard.recentActivity}
        </h2>
        <div className="divide-y">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="py-3">
              <div className="flex justify-between">
                <span className="font-medium">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
              <p className="text-gray-600">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 