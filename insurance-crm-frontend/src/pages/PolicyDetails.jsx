import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText, User, Calendar, DollarSign, AlertCircle,
  ArrowLeft, Edit, Download, Shield
} from 'lucide-react';
import { policyAPI } from '../services/api';
import toast from 'react-hot-toast';

const PolicyDetails = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicyDetails();
  }, [id]);

  const loadPolicyDetails = async () => {
    try {
      setLoading(true);
      const response = await policyAPI.getById(id);
      setPolicy(response.data.data);
    } catch (error) {
      console.error(error);
      // Mock data if API fails
      setPolicy({
        _id: id,
        policyNo: 'POL-8899',
        type: 'Life',
        company: 'LIC',
        premium: 15000,
        sumAssured: 500000,
        term: 20,
        frequency: 'Annual',
        startDate: '2020-01-01',
        renewalDate: '2023-12-01',
        maturityDate: '2040-01-01',
        status: 'Active',
        client: { _id: '101', name: 'John Doe', phone: '+91 9876543210' },
        nominee: { name: 'Jane Doe', relation: 'Spouse' },
        claims: []
      });
      if (error.response?.status !== 404) {
        toast.error("Failed to load policy details");
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

  if (!policy) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Policy Not Found</h2>
        <Link to="/policies" className="mt-4 text-blue-600 hover:underline">Back to Policies</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/policies" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Policy #{policy.policyNo}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`badge ${policy.status === 'Active' ? 'badge-success' :
                  policy.status === 'Lapsed' ? 'badge-danger' : 'badge-warning'
                }`}>
                {policy.status}
              </span>
              <span>•</span>
              <span>{policy.company}</span>
              <span>•</span>
              <span>{policy.type}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline flex items-center gap-2">
            <Download className="w-4 h-4" /> Download
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Policy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Policy Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Plan Name / Scheme</p>
                <p className="font-medium">{policy.planName || 'Standard Term Plan'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Policy Number</p>
                <p className="font-medium">{policy.policyNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sum Assured</p>
                <p className="font-medium text-lg text-blue-700">₹ {policy.sumAssured?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Premium Amount</p>
                <p className="font-medium text-lg text-green-700">₹ {policy.premium?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Policy Term</p>
                <p className="font-medium">{policy.term ? `${policy.term} Years` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Premium Frequency</p>
                <p className="font-medium">{policy.frequency}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Key Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{new Date(policy.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Renewal</p>
                <p className="font-medium">{policy.lastRenewalDate ? new Date(policy.lastRenewalDate).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Renewal</p>
                <p className="font-medium text-orange-600 font-bold">{new Date(policy.renewalDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maturity Date</p>
                <p className="font-medium">{new Date(policy.maturityDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Linked Claims */}
          <div className="card">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Claims History
              </h3>
              <button className="text-sm text-blue-600 hover:underline">File New Claim</button>
            </div>

            {policy.claims && policy.claims.length > 0 ? (
              <div className="space-y-4">
                {/* List claims here */}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No claims filed against this policy.</p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Client Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <Link to={`/clients/${policy.client?._id}`} className="font-medium text-blue-600 hover:underline">
                  {policy.client?.name}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{policy.client?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium break-all">{policy.client?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="card border border-l-4 border-l-purple-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nominee Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-right">{policy.nominee?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Relation</span>
                <span className="font-medium text-right">{policy.nominee?.relation || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
