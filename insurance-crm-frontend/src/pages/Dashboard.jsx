import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { reportAPI, reminderAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardRes, remindersRes] = await Promise.all([
        reportAPI.getDashboard(),
        reminderAPI.getUpcoming(7)
      ]);
      
      setStats(dashboardRes.data.data);
      setReminders(remindersRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats?.overview?.totalClients || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Total Clients</div>
          <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{stats?.monthlyActivity?.newClients || 0} this month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats?.overview?.totalPolicies || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Total Policies</div>
          <div className="mt-3 text-xs text-gray-600">
            {stats?.overview?.activePolicies || 0} active
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">₹</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats?.overview?.totalPremium || 0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Total Premium</div>
          <div className="mt-3 text-xs text-gray-600">
            Sum Assured: {formatCurrency(stats?.overview?.totalSumAssured || 0)}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats?.upcomingReminders || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Upcoming Reminders</div>
          <div className="mt-3 text-xs text-yellow-600">
            Next 7 days
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Overview */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Claims Overview</h3>
            <Link to="/claims" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.claims?.map((claim) => (
              <div key={claim._id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${
                  claim._id === 'Approved' ? 'text-green-600' :
                  claim._id === 'Rejected' ? 'text-red-600' :
                  claim._id === 'Pending' ? 'text-yellow-600' :
                  'text-gray-900'
                }`}>
                  {claim.count}
                </div>
                <div className="text-sm text-gray-600 mt-1">{claim._id}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(claim.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">This Month</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">New Clients</div>
                <div className="text-2xl font-bold text-blue-600">{stats?.monthlyActivity?.newClients || 0}</div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">New Policies</div>
                <div className="text-2xl font-bold text-green-600">{stats?.monthlyActivity?.newPolicies || 0}</div>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">New Claims</div>
                <div className="text-2xl font-bold text-purple-600">{stats?.monthlyActivity?.newClaims || 0}</div>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Reminders</h3>
          <Link to="/reminders" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming reminders in the next 7 days
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.slice(0, 5).map((reminder) => (
              <div key={reminder._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{reminder.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {reminder.client?.name} • {new Date(reminder.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge ${
                  reminder.priority === 'High' ? 'badge-danger' :
                  reminder.priority === 'Medium' ? 'badge-warning' :
                  'badge-info'
                }`}>
                  {reminder.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
