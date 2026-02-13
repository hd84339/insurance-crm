import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Phone, Mail, Edit, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { clientAPI } from "../services/api";
import toast from "react-hot-toast";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    clientType: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    loadClients();
  }, [filters, pagination.page]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll({
        search: searchTerm,
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setClients(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages
      }));
    } catch (error) {
      // Graceful fallback for demo if API fails
      console.error(error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load clients");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadClients();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      await clientAPI.delete(id);
      toast.success("Client deleted successfully");
      loadClients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete client");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="mt-1 text-gray-500">Manage your client database</p>
        </div>
        <Link
          to="/clients/new"
          className="btn-primary flex items-center gap-2 justify-center sm:w-auto w-full"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
              </select>
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={filters.clientType}
              onChange={(e) => {
                setFilters({ ...filters, clientType: e.target.value });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="input-field w-32 md:w-40"
            >
              <option value="">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
            </select>

            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Clients List */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <UsersIcon />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new client.</p>
            <div className="mt-6">
              <Link to="/clients/new" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Client
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policies</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {client.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <Link to={`/clients/${client._id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                              {client.name}
                            </Link>
                            <div className="text-xs text-gray-500">ID: {client._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-600 gap-2">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </div>
                          {client.email && (
                            <div className="flex items-center text-sm text-gray-600 gap-2">
                              <Mail className="w-3 h-3" />
                              {client.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.clientType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.totalPolicies || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${client.status === "Active" ? "badge-success" :
                          client.status === "Inactive" ? "badge-danger" :
                            "badge-info"
                          }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link to={`/clients/edit/${client._id}`} className="p-1 hover:bg-gray-100 rounded text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="p-1 hover:bg-gray-100 rounded text-red-600"
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

            {/* Pagination Controls */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.pages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
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

const UsersIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default Clients;
