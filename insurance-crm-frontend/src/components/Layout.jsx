import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Grid, Users, Bell, FileText, Target, BarChart3, Search, User } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navigation = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/policies', label: 'Policies', icon: Grid },
    { path: '/claims', label: 'Claims', icon: FileText },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/targets', label: 'Targets', icon: Target },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-gray-600" />
            <h1 className="text-xl font-semibold text-gray-800">Insurance & Mutual Fund CRM</h1>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-6 flex gap-1 border-t border-gray-100">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${isActive(item.path)
                  ? 'border-blue-600 text-blue-600 bg-gray-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
