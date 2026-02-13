import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  FileText, Calendar, Download, Printer, Filter, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data for Reports (Since API aggregated reports might be complex to implement fully without backend)
const MOCK_DATA = {
  policyGrowth: [
    { name: 'Jan', life: 40, health: 24, motor: 24 },
    { name: 'Feb', life: 30, health: 13, motor: 22 },
    { name: 'Mar', life: 20, health: 58, motor: 22 },
    { name: 'Apr', life: 27, health: 39, motor: 20 },
    { name: 'May', life: 18, health: 48, motor: 21 },
    { name: 'Jun', life: 23, health: 38, motor: 25 },
  ],
  claimsStatus: [
    { name: 'Approved', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Rejected', value: 300 },
    { name: 'Processing', value: 200 },
  ],
  agentPerformance: [
    { name: 'Agent A', sales: 4000 },
    { name: 'Agent B', sales: 3000 },
    { name: 'Agent C', sales: 2000 },
    { name: 'Agent D', sales: 2780 },
    { name: 'Agent E', sales: 1890 },
  ]
};

const Reports = () => {
  const [activeReport, setActiveReport] = useState('summary');
  const [dateRange, setDateRange] = useState('thisMonth');

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success("Downloading report...");
    // Implement actual export logic (e.g. csv generation) here
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderContent = () => {
    switch (activeReport) {
      case 'policies':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card h-80">
                <h3 className="text-lg font-semibold mb-4">Policy Type Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_DATA.policyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="life" fill="#8884d8" name="Life" />
                    <Bar dataKey="health" fill="#82ca9d" name="Health" />
                    <Bar dataKey="motor" fill="#ffc658" name="Motor" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card h-80">
                <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_DATA.policyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="life" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Policy Details Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Policy No</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Premium</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium">POL-001</td>
                      <td className="px-4 py-3">John Doe</td>
                      <td className="px-4 py-3">Life</td>
                      <td className="px-4 py-3">₹ 12,000</td>
                      <td className="px-4 py-3"><span className="badge badge-success">Active</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium">HLT-002</td>
                      <td className="px-4 py-3">Jane Smith</td>
                      <td className="px-4 py-3">Health</td>
                      <td className="px-4 py-3">₹ 8,500</td>
                      <td className="px-4 py-3"><span className="badge badge-success">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'claims':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card h-80">
                <h3 className="text-lg font-semibold mb-4">Claims by Status</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_DATA.claimsStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {MOCK_DATA.claimsStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      default: // Summary
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <p className="text-blue-100 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold">₹ 12.5L</h3>
                <p className="text-sm text-blue-100 mt-2">+12% from last month</p>
              </div>
              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <p className="text-purple-100 mb-1">New Policies</p>
                <h3 className="text-3xl font-bold">45</h3>
                <p className="text-sm text-purple-100 mt-2">+5% from last month</p>
              </div>
              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <p className="text-orange-100 mb-1">Claims Settled</p>
                <h3 className="text-3xl font-bold">12</h3>
                <p className="text-sm text-orange-100 mt-2">95% settlement ratio</p>
              </div>
            </div>

            <div className="card h-96">
              <h3 className="text-lg font-semibold mb-6">Annual Performance Overview</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_DATA.policyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="life" stackId="a" fill="#8884d8" />
                  <Bar dataKey="health" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="motor" stackId="a" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-100px)]">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="card h-full p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-6 px-2">Reports</h3>
          <nav className="space-y-1">
            {[
              { id: 'summary', label: 'Dashboard Summary', icon: FileText },
              { id: 'policies', label: 'Policy Report', icon: FileText },
              { id: 'claims', label: 'Claim Report', icon: FileText },
              { id: 'renewals', label: 'Renewal Report', icon: Calendar },
              { id: 'targets', label: 'Target Report', icon: FileText },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveReport(item.id)}
                className={`
                              w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                              ${activeReport === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                          `}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Action Bar */}
        <div className="card flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field py-1"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={handlePrint} className="btn-outline flex items-center gap-2 justify-center flex-1 sm:flex-none">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handleExport} className="btn-primary flex items-center gap-2 justify-center flex-1 sm:flex-none">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Report View */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;
