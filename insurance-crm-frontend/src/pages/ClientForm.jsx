import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { clientAPI } from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    occupation: "",
    clientType: "Individual",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getById(id);
      const client = response.data.data;
      // Format DOB for input date field if exists
      const dob = client.dateOfBirth ? new Date(client.dateOfBirth).toISOString().split('T')[0] : "";

      setForm({
        name: client.name || "",
        phone: client.phone || "",
        email: client.email || "",
        address: client.address?.street || client.address || "",
        dob: dob,
        occupation: client.occupation || "",
        clientType: client.clientType || "Individual",
        status: client.status || "Active",
      });
    } catch (error) {
      toast.error("Failed to load client details");
      console.error(error);
      navigate("/clients");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await clientAPI.update(id, form);
        toast.success("Client updated successfully");
      } else {
        await clientAPI.create(form);
        toast.success("Client created successfully");
      }
      navigate("/clients");
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${id ? 'update' : 'create'} client`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/clients" className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">{id ? 'Edit Client' : 'Add New Client'}</h2>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="col-span-full">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Personal Information</h3>
            </div>

            <div>
              <label className="label">Full Name <span className="text-red-500">*</span></label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="label">Phone Number <span className="text-red-500">*</span></label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="client@example.com"
              />
            </div>

            <div className="col-span-full">
              <label className="label">Address</label>
              <textarea
                name="address"
                rows="3"
                value={form.address}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Full residential address"
              ></textarea>
            </div>

            {/* Additional Info */}
            <div className="col-span-full mt-2">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Other Details</h3>
            </div>

            <div>
              <label className="label">Occupation</label>
              <input
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div>
              <label className="label">Client Type</label>
              <select
                name="clientType"
                value={form.clientType}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="HNI">HNI (High Net-worth)</option>
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="btn-outline px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : (id ? "Update Client" : "Save Client")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
