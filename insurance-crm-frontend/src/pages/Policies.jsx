import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FileText, Calendar, DollarSign, Filter, ChevronLeft, ChevronRight, Edit, Eye, Trash2 } from "lucide-react";
import { policyAPI } from "../services/api";
import toast from "react-hot-toast";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    policyType: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    loadPolicies();
  }, [filters, pagination.page]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const response = await policyAPI.getAll({
        search: searchTerm,
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setPolicies(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages
      }));
    } catch (error) {
      console.error("Error loading policies:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load policies");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadPolicies();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    try {
      await policyAPI.delete(id);
      toast.success("Policy deleted successfully");
      loadPolicies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete policy");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Lapsed': return 'badge-danger';
      case 'Matured': return 'badge-info';
      case 'Surrendered': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Policies</h2>
          <p className="mt-1 text-gray-500">Manage all insurance and investment policies</p>
        </div>
        <Link
          to="/policies/new"
          className="btn-primary flex items-center gap-2 justify-center sm:w-auto w-full"
        >
          <Plus className="w-4 h-4" />
          Add Policy
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by policy number, plan name, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field w-full"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="input-field appearance-none pl-10 pr-8"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Lapsed">Lapsed</option>
                <option value="Matured">Matured</option>
                <option value="Surrendered">Surrendered</option>
              </select>
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={filters.policyType}
              onChange={(e) => {
                setFilters({ ...filters, policyType: e.target.value });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="input-field w-40"
            >
              <option value="">All Types</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="General Insurance">General Insurance</option>
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="Health">Health</option>
              <option value="Motor">Motor</option>
            </select>

            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Policies List */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
          </div>
        ) : policies.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto" strokeWidth={1.5} />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No policies found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new policy.</p>
            <div className="mt-6">
              <Link to="/policies/new" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Policy
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {policies.map((policy) => (
                    <tr key={policy._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <Link to={`/policies/${policy._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            {policy.policyNumber}
                          </Link>
                          <div className="text-xs text-gray-500">{policy.company} - {policy.policyType}</div>
                          <div className="text-xs font-medium text-gray-700">{policy.planName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {policy.client ? (
                          <Link to={`/clients/${policy.client._id}`} className="text-sm text-gray-900 hover:text-blue-600">
                            {policy.client.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">₹{policy.premiumAmount?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{policy.premiumFrequency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {policy.renewalDate ? new Date(policy.renewalDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusBadge(policy.status)}`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link to={`/policies/${policy._id}`} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link to={`/policies/edit/${policy._id}`} className="p-1 hover:bg-gray-100 rounded text-blue-600" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(policy._id)}
                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{policies.length}</span> results of <span className="font-medium">{pagination.total}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {pagination.page} / {pagination.pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Policies;
