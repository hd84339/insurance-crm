import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText, User, Calendar, DollarSign, AlertTriangle,
  ArrowLeft, Edit, Download, Shield, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { claimAPI } from '../services/api';
import toast from 'react-hot-toast';

const ClaimDetails = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    loadClaimDetails();
  }, [id]);

  const loadClaimDetails = async () => {
    try {
      setLoading(true);
      const response = await claimAPI.getById(id);
      setClaim(response.data.data);
    } catch (error) {
      console.error(error);
      // Mock data
      setClaim({
        _id: id,
        claimNo: 'CLM-001',
        policy: { _id: '1', policyNo: 'POL-001', type: 'Life', company: 'LIC' },
        client: { _id: '101', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210' },
        amount: 50000,
        status: 'Pending',
        priority: 'High',
        date: '2023-10-25',
        description: 'Claim regarding hospitalization for viral fever.',
        documents: ['hospital_bill.pdf', 'discharge_summary.pdf']
      });
      if (error.response?.status !== 404) {
        toast.error("Failed to load claim details");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setStatusLoading(true);
      await claimAPI.updateStatus(id, newStatus);
      setClaim(prev => ({ ...prev, status: newStatus }));
      toast.success(`Claim status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'In Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200'; // Pending
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Claim Not Found</h2>
        <Link to="/claims" className="mt-4 text-blue-600 hover:underline">Back to Claims</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/claims" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Claim #{claim.claimNo}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(claim.status)}`}>
                {claim.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Filed on {new Date(claim.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline flex items-center gap-2">
            <Download className="w-4 h-4" /> Documents
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4">Update Status</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus('In Review')}
                disabled={statusLoading || claim.status === 'In Review'}
                className="btn bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" /> Mark In Review
              </button>
              <button
                onClick={() => updateStatus('Approved')}
                disabled={statusLoading || claim.status === 'Approved'}
                className="btn bg-green-50 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Approve Claim
              </button>
              <button
                onClick={() => updateStatus('Rejected')}
                disabled={statusLoading || claim.status === 'Rejected'}
                className="btn bg-red-50 text-red-700 hover:bg-red-100 border-red-200 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject Claim
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Claim Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Claim Amount</p>
                <p className="font-medium text-lg text-gray-900">₹ {claim.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${claim.priority === 'High' ? 'bg-red-100 text-red-800' :
                    claim.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                  }`}>
                  {claim.priority}
                </span>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700 mt-1">{claim.description || 'No description provided.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Linked Policy */}
          <div className="card border-t-4 border-t-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Linked Policy
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Policy No</span>
                <Link to={`/policies/${claim.policy?._id}`} className="font-medium text-blue-600 hover:underline">
                  {claim.policy?.policyNo}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Company</span>
                <span className="font-medium">{claim.policy?.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">{claim.policy?.type}</span>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="card bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Client Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <Link to={`/clients/${claim.client?._id}`} className="font-medium text-blue-600 hover:underline">
                  {claim.client?.name}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{claim.client?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium break-all">{claim.client?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;
