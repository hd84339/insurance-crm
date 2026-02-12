import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { clientAPI } from "../services/api";
import toast from "react-hot-toast";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    clientType: "",
    priority: "",
  });

  useEffect(() => {
    loadClients();
  }, [filters]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll({
        search: searchTerm,
        ...filters,
        limit: 50,
      });
      setClients(response.data.data);
    } catch (error) {
      toast.error("Failed to load clients");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
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

  return (
    <div
      className="
        space-y-6
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center justify-between
        "
      >
        <div>
          <h2
            className="
              text-2xl font-bold text-gray-900
            "
          >
            Clients
          </h2>
          <p
            className="
              mt-1
              text-gray-500
            "
          >
            Manage your client database
          </p>
        </div>
        <Link
          // to="/clients/new"
          className="
            flex
            btn-primary items-center gap-2
          "
        >
          <Plus
            className="
              w-4 h-4
            "
          />
          Add Client
        </Link>
      </div>

      {/* Filters */}
      <div
        className="
          card
        "
      >
        <form
          onSubmit={handleSearch}
          className="
            flex
            gap-4
          "
        >
          <div
            className="
              flex-1
              relative
            "
          >
            <Search
              className="
                w-5 h-5
                text-gray-400
                absolute left-3 top-1/2 -translate-y-1/2
              "
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                pl-10
                input-field
              "
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="
              w-40
              input-field
            "
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Prospect">Prospect</option>
          </select>
          <select
            value={filters.clientType}
            onChange={(e) =>
              setFilters({ ...filters, clientType: e.target.value })
            }
            className="
              w-40
              input-field
            "
          >
            <option value="">All Types</option>
            <option value="Individual">Individual</option>
            <option value="Corporate">Corporate</option>
          </select>
          <button
            type="submit"
            className="
              btn-primary
            "
          >
            Search
          </button>
        </form>
      </div>

      {/* Clients List */}
      <div
        className="
          card
        "
      >
        {loading ? (
          <div
            className="
              flex
              h-64
              items-center justify-center
            "
          >
            <div
              className="
                h-12 w-12
                rounded-full border-b-2 border-blue-600
                animate-spin
              "
            ></div>
          </div>
        ) : clients.length === 0 ? (
          <div
            className="
              py-12
              text-center
            "
          >
            <p
              className="
                text-gray-500
              "
            >
              No clients found
            </p>
          </div>
        ) : (
          <div
            className="
              overflow-x-auto
            "
          >
            <table
              className="
                w-full
              "
            >
              <thead
                className="
                  bg-gray-50
                  border-b
                "
              >
                <tr>
                  <th
                    className="
                      px-6 py-3
                      text-left text-xs font-medium text-gray-500
                      uppercase
                    "
                  >
                    Client
                  </th>
                  <th
                    className="
                      px-6 py-3
                      text-left text-xs font-medium text-gray-500
                      uppercase
                    "
                  >
                    Contact
                  </th>
                  <th
                    className="
                      px-6 py-3
                      text-left text-xs font-medium text-gray-500
                      uppercase
                    "
                  >
                    Type
                  </th>
                  <th
                    className="
                      px-6 py-3
                      text-left text-xs font-medium text-gray-500
                      uppercase
                    "
                  >
                    Policies
                  </th>
                  <th
                    className="
                      px-6 py-3
                      text-left text-xs font-medium text-gray-500
                      uppercase
                    "
                  >
                    Status
                  </th>
                  <th
                    className="
                      px-6 py-3
                      text-left text-xs font-medium text-gray-500
                      uppercase
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className="
                  divide-y divide-gray-200
                "
              >
                {clients.map((client) => (
                  <tr
                    key={client._id}
                    className="
                      hover:bg-gray-50
                    "
                  >
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <Link
                        to={`/clients/${client._id}`}
                        className="
                          font-medium text-blue-600
                          hover:text-blue-700
                        "
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <div
                        className="
                          flex flex-col
                          gap-1
                        "
                      >
                        <div
                          className="
                            flex
                            text-sm text-gray-600
                            items-center gap-2
                          "
                        >
                          <Phone
                            className="
                              w-3 h-3
                            "
                          />
                          {client.phone}
                        </div>
                        {client.email && (
                          <div
                            className="
                              flex
                              text-sm text-gray-600
                              items-center gap-2
                            "
                          >
                            <Mail
                              className="
                                w-3 h-3
                              "
                            />
                            {client.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className="
                        px-6 py-4
                        text-sm text-gray-900
                      "
                    >
                      {client.clientType}
                    </td>
                    <td
                      className="
                        px-6 py-4
                        text-sm text-gray-900
                      "
                    >
                      {client.totalPolicies || 0}
                    </td>
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <span
                        className={`
                          badge
                          ${
                          client.status === "Active"
                          ? "badge-success"
                          : client.status === "Inactive"
                          ? "badge-danger"
                          : "badge-info"
                          }
                        `}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <div
                        className="
                          flex
                          gap-2
                        "
                      >
                        <button
                          className="
                            p-1
                            hover:bg-gray-100 rounded
                          "
                        >
                          <Edit
                            className="
                              w-4 h-4
                              text-gray-600
                            "
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="
                            p-1
                            hover:bg-gray-100 rounded
                          "
                        >
                          <Trash2
                            className="
                              w-4 h-4
                              text-red-600
                            "
                          />
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

export default Clients;
