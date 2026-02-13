import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { claimAPI } from '../services/api';
import toast from 'react-hot-toast';

const Claims = () => {
  const [searchParams] = useSearchParams();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    priority: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    loadClaims();
  }, [filters, pagination.page]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const response = await claimAPI.getAll({
        search: searchTerm,
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setClaims(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages
      }));
    } catch (error) {
      console.error(error);
      // Mock data for demo
      setClaims([
        { _id: '1', claimNo: 'CLM-001', policy: { policyNo: 'POL-001' }, client: { name: 'John Doe' }, amount: 50000, status: 'Pending', priority: 'High', date: '2023-10-25' },
        { _id: '2', claimNo: 'CLM-002', policy: { policyNo: 'HLT-002' }, client: { name: 'Jane Smith' }, amount: 12000, status: 'Approved', priority: 'Medium', date: '2023-10-20' },
        { _id: '3', claimNo: 'CLM-003', policy: { policyNo: 'MOT-005' }, client: { name: 'Rahul Kumar' }, amount: 5000, status: 'Rejected', priority: 'Low', date: '2023-10-15' },
      ]);
      if (error.response?.status !== 404) {
        toast.error("Failed to load claims");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadClaims();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this claim?")) return;
    try {
      await claimAPI.delete(id);
      toast.success("Claim deleted successfully");
      loadClaims();
    } catch (error) {
      toast.error("Failed to delete claim");
    }
  };

  const getStatusBadgeRequest = (status) => {
    switch (status) {
      case 'Approved': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      case 'In Review': return 'badge-warning';
      default: return 'badge-primary'; // Pending
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'In Review': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Claims</h2>
          <p className="mt-1 text-gray-500">Manage and track insurance claims</p>
        </div>
        <Link
          to="/claims/new"
          className="btn-primary flex items-center gap-2 justify-center sm:w-auto w-full"
        >
          <Plus className="w-4 h-4" />
          New Claim
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search claim no, client, or policy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="input-field"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button type="submit" className="btn-primary flex items-center justify-center gap-2 md:w-auto w-full">
            <Search className="w-4 h-4" />
            <span className="md:hidden">Search</span>
          </button>
        </form>
      </div>

      {/* Claims List */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
          </div>
        ) : claims.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No claims found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new claim.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client / Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/claims/${claim._id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {claim.claimNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{claim.client?.name}</div>
                      <Link to={`/policies/${claim.policy?._id}`} className="text-xs text-blue-600 hover:underline">
                        {claim.policy?.policyNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₹ {claim.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(claim.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge flex w-fit items-center gap-1 ${getStatusBadgeRequest(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${claim.priority === 'High' ? 'bg-red-100 text-red-800' :
                          claim.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {claim.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link to={`/claims/${claim._id}`} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/claims/edit/${claim._id}`} className="p-1 hover:bg-gray-100 rounded text-blue-600" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(claim._id)} className="p-1 hover:bg-gray-100 rounded text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Claims;
