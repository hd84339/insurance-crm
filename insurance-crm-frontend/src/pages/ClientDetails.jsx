import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User, Phone, Mail, MapPin, Calendar, FileText,
  AlertCircle, Bell, ArrowLeft, Edit, Plus, Clock
} from 'lucide-react';
import { clientAPI } from '../services/api';
import toast from 'react-hot-toast';

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadClientDetails();
  }, [id]);

  const loadClientDetails = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getById(id);
      setClient(response.data.data);
    } catch (error) {
      console.error(error);
      // Mock data if API fails
      setClient({
        _id: id,
        name: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543210",
        address: "123 Main St, Mumbai, MH",
        dob: "1985-05-15",
        clientType: "Individual",
        status: "Active",
        policies: [
          { _id: '101', policyNo: 'POL-8899', type: 'Life', company: 'LIC', premium: 15000, status: 'Active', renewalDate: '2023-12-01' },
          { _id: '102', policyNo: 'HLT-5544', type: 'Health', company: 'HDFC Ergo', premium: 8000, status: 'Active', renewalDate: '2023-11-20' }
        ],
        claims: [],
        reminders: [
          { _id: '201', title: 'Renewal Follow-up', dueDate: '2023-11-15', status: 'Pending', priority: 'High' }
        ]
      });
      if (error.response?.status !== 404) {
        toast.error("Failed to load client details");
      }
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

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Client Not Found</h2>
        <Link to="/clients" className="mt-4 text-blue-600 hover:underline">Back to Clients</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'claims', label: 'Claims', icon: AlertCircle },
    { id: 'reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/clients" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`badge ${client.status === 'Active' ? 'badge-success' : 'badge-danger'
                }`}>
                {client.status}
              </span>
              <span>•</span>
              <span>{client.clientType}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/policies/new?clientId=${client._id}`} className="btn-outline flex items-center gap-2">
            <Plus className="w-4 h-4" /> Policy
          </Link>
          <button className="btn-primary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                {client.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
              <p className="text-gray-500">{client.occupation || 'N/A'}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{client.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{client.address || 'No address provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>DOB: {client.dob ? new Date(client.dob).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="card bg-blue-50 border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">Total Business</h4>
            <div className="text-3xl font-bold text-blue-700">
              ₹ {new Intl.NumberFormat('en-IN').format(
                client.policies?.reduce((sum, p) => sum + (p.premium || 0), 0) || 0
              )}
            </div>
            <p className="text-sm text-blue-600 mt-1">Annual Premium</p>
          </div>
        </div>

        {/* Right Content - Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-gray-500 text-sm">No recent activity recorded.</p>

                  <h3 className="font-semibold text-gray-900 pt-4">Notes</h3>
                  <textarea className="input-field min-h-[100px]" placeholder="Add a note about this client..."></textarea>
                  <button className="btn-secondary mt-2">Save Note</button>
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Policies ({client.policies?.length || 0})</h3>
                  </div>
                  {client.policies && client.policies.length > 0 ? (
                    <div className="space-y-3">
                      {client.policies.map(policy => (
                        <div key={policy._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {policy.policyNo}
                              <span className="badge badge-info text-xs">{policy.type}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{policy.company}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <p className="font-bold text-gray-900">₹ {policy.premium?.toLocaleString()}</p>
                            <p className="text-xs text-blue-600">Renew: {new Date(policy.renewalDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No policies found.</p>
                  )}
                </div>
              )}

              {activeTab === 'claims' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Claims History</h3>
                  {client.claims && client.claims.length > 0 ? (
                    <div>{/* Claims list */}</div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No claims records found.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reminders' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Reminders</h3>
                  {client.reminders && client.reminders.length > 0 ? (
                    <div className="space-y-3">
                      {client.reminders.map(reminder => (
                        <div key={reminder._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-100">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-yellow-900 font-medium">{reminder.title}</span>
                          </div>
                          <span className="text-xs text-yellow-700">
                            Due: {new Date(reminder.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No active reminders.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
