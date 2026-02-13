import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, TrendingUp, AlertCircle, Calendar,
  Target, Bell, DollarSign, ArrowRight, Phone, Clock, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { reportAPI, reminderAPI, policyAPI, claimAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: {},
    monthlyGrowth: [],
    policyDistribution: [],
    claimsByStatus: [],
    targets: {}
  });
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all required data in parallel
      const [
        dashboardRes,
        renewalsRes,
        claimsRes,
        remindersRes
      ] = await Promise.all([
        reportAPI.getDashboard(),
        policyAPI.getUpcomingRenewals(30),
        claimAPI.getPending(),
        reminderAPI.getUpcoming(7)
      ]);

      setStats(dashboardRes.data.data || {});
      setUpcomingRenewals(renewalsRes.data.data || []);
      setPendingClaims(claimsRes.data.data || []);
      setUpcomingReminders(remindersRes.data.data || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error('Failed to load dashboard data. Using mock data for visualization.');
      // Fallback/Mock data for demonstration if API fails or is empty
      setStats({
        overview: {
          totalClients: 124,
          activePolicies: 85,
          totalPremium: 1250000,
          pendingClaims: 3,
          targetAchievement: 68,
          pendingReminders: 5,
          upcomingRenewals: 12
        },
        monthlyGrowth: [
          { name: 'Jan', premium: 40000 },
          { name: 'Feb', premium: 30000 },
          { name: 'Mar', premium: 20000 },
          { name: 'Apr', premium: 27800 },
          { name: 'May', premium: 18900 },
          { name: 'Jun', premium: 23900 },
        ],
        policyDistribution: [
          { name: 'Life', value: 400 },
          { name: 'Health', value: 300 },
          { name: 'Motor', value: 300 },
          { name: 'Mutual Fund', value: 200 },
        ],
        claimsByStatus: [
          { name: 'Approved', value: 12 },
          { name: 'Pending', value: 5 },
          { name: 'Rejected', value: 2 },
        ]
      });
      setUpcomingRenewals([
        { _id: '1', client: { name: 'John Doe' }, policyNo: 'POL-001', renewalDate: '2023-11-15', premium: 12000 },
        { _id: '2', client: { name: 'Jane Smith' }, policyNo: 'POL-002', renewalDate: '2023-11-20', premium: 8500 },
      ]);
      setPendingClaims([
        { _id: '1', client: { name: 'Alice Brown' }, amount: 50000, status: 'Processing' },
      ]);
      setUpcomingReminders([
        { _id: '1', title: 'Call for renewal', dueDate: '2023-11-10', priority: 'High', client: { name: 'Bob Wilson' } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header & KPI Summary Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview & Business Action Items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Clients"
          value={stats.overview?.totalClients || 0}
          icon={Users}
          color="blue"
          subtext="Total active database"
        />
        <KpiCard
          title="Active Policies"
          value={stats.overview?.activePolicies || 0}
          icon={FileText}
          color="green"
          subtext="Currently in force"
        />
        <KpiCard
          title="Total Premium / AUM"
          value={formatCurrency(stats.overview?.totalPremium || 0)}
          icon={DollarSign}
          color="purple"
          subtext="Assets Under Management"
        />
        <KpiCard
          title="Upcoming Renewals"
          value={stats.overview?.upcomingRenewals || upcomingRenewals.length}
          icon={Calendar}
          color="orange"
          subtext="Next 30 Days"
        />
        <KpiCard
          title="Pending Claims"
          value={stats.overview?.pendingClaims || pendingClaims.length}
          icon={AlertCircle}
          color="red"
          subtext="Requires attention"
        />
        <KpiCard
          title="Target Achievement"
          value={`${stats.overview?.targetAchievement || 0}%`}
          icon={Target}
          color="indigo"
          subtext="Monthly Goal Progress"
        />
        <KpiCard
          title="Pending Reminders"
          value={stats.overview?.pendingReminders || upcomingReminders.length}
          icon={Bell}
          color="yellow"
          subtext="Tasks for today"
        />
      </div>

      {/* 2. Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-80">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Premium Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="premium" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-80">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.policyDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(stats.policyDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Quick Action Widgets */}

        {/* Upcoming Renewals Widget */}
        <div className="card col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Renewals</h3>
            <Link to="/policies?filter=renewal" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {upcomingRenewals.slice(0, 4).map((renewal) => (
              <div key={renewal._id} className="flex flex-col p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{renewal.client?.name}</p>
                    <p className="text-xs text-gray-500">{renewal.policyNo}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{formatCurrency(renewal.premium)}</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-orange-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {new Date(renewal.renewalDate).toLocaleDateString()}
                  </span>
                  <button className="btn-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Call
                  </button>
                </div>
              </div>
            ))}
            {upcomingRenewals.length === 0 && <p className="text-gray-500 text-sm text-center">No upcoming renewals.</p>}
          </div>
        </div>

        {/* Pending Claims Widget */}
        <div className="card col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Claims</h3>
            <Link to="/claims?status=pending" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {pendingClaims.slice(0, 4).map((claim) => (
              <div key={claim._id} className="p-3 border rounded-lg bg-red-50 border-red-100">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900">{claim.client?.name}</p>
                  <span className="badge badge-warning text-xs">{claim.status}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-gray-700">{formatCurrency(claim.amount)}</span>
                  <button className="text-xs text-blue-600 hover:underline">Update Status</button>
                </div>
              </div>
            ))}
            {pendingClaims.length === 0 && <p className="text-gray-500 text-sm text-center">No pending claims.</p>}
          </div>
        </div>

        {/* Today's Reminders Widget */}
        <div className="card col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Reminders</h3>
            <Link to="/reminders" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {upcomingReminders.slice(0, 5).map((reminder) => (
              <div key={reminder._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{reminder.title}</p>
                  <p className="text-xs text-gray-500">
                    {reminder.client?.name ? `${reminder.client.name} • ` : ''}
                    {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-500" title="Snooze">
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:bg-green-100 rounded text-green-600" title="Complete">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {upcomingReminders.length === 0 && <p className="text-gray-500 text-sm text-center">No reminders.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for KPI Cards
const KpiCard = ({ title, value, icon: Icon, color, subtext }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-600'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
