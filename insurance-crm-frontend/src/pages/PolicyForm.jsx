import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, X, Search, User, FileText, Calendar, DollarSign, Briefcase } from "lucide-react";
import { policyAPI, clientAPI } from "../services/api";
import toast from "react-hot-toast";

const PolicyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        client: "",
        policyNumber: "",
        policyType: "Life Insurance",
        company: "LIC",
        planName: "",
        premiumAmount: "",
        premiumFrequency: "Yearly",
        sumAssured: "",
        policyTerm: "",
        startDate: "",
        maturityDate: "",
        renewalDate: "",
        nextPremiumDue: "",
        status: "Active",
        paymentStatus: "Pending",
        notes: ""
    });

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [clientSearch, setClientSearch] = useState("");

    useEffect(() => {
        if (isEdit) {
            loadPolicy();
        }
        loadClients();
    }, [id]);

    const loadPolicy = async () => {
        try {
            setLoading(true);
            const response = await policyAPI.getById(id);
            const data = response.data.data;

            // Format dates for input fields (YYYY-MM-DD)
            const formatDate = (dateString) => {
                if (!dateString) return "";
                return new Date(dateString).toISOString().split('T')[0];
            };

            setFormData({
                ...data,
                client: data.client?._id || data.client,
                startDate: formatDate(data.startDate),
                maturityDate: formatDate(data.maturityDate),
                renewalDate: formatDate(data.renewalDate),
                nextPremiumDue: formatDate(data.nextPremiumDue)
            });

            if (data.client?.name) {
                setClientSearch(data.client.name);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load policy data");
        } finally {
            setLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            const response = await clientAPI.getAll({ limit: 100 });
            setClients(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (isEdit) {
                await policyAPI.update(id, formData);
                toast.success("Policy updated successfully");
            } else {
                await policyAPI.create(formData);
                toast.success("Policy created successfully");
            }
            navigate("/policies");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save policy");
        } finally {
            setSaving(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.phone.includes(clientSearch)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Edit Policy" : "Add New Policy"}
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Client *</label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search client..."
                                    value={clientSearch}
                                    onChange={(e) => setClientSearch(e.target.value)}
                                    className="pl-10 input-field w-full"
                                    required={!formData.client}
                                />
                                {clientSearch && !formData.client && filteredClients.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                        {filteredClients.map(client => (
                                            <button
                                                key={client._id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, client: client._id }));
                                                    setClientSearch(client.name);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm transition-colors"
                                            >
                                                <div className="font-medium text-gray-900">{client.name}</div>
                                                <div className="text-xs text-gray-500">{client.phone}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {formData.client && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, client: "" }));
                                            setClientSearch("");
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Policy Number *</label>
                            <input
                                type="text"
                                name="policyNumber"
                                value={formData.policyNumber}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Policy Type *</label>
                            <select
                                name="policyType"
                                value={formData.policyType}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            >
                                <option value="Life Insurance">Life Insurance</option>
                                <option value="General Insurance">General Insurance</option>
                                <option value="Mutual Fund">Mutual Fund</option>
                                <option value="Health">Health</option>
                                <option value="Motor">Motor</option>
                                <option value="Travel">Travel</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Company *</label>
                            <select
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            >
                                <option value="LIC">LIC</option>
                                <option value="Bajaj">Bajaj</option>
                                <option value="HDFC">HDFC</option>
                                <option value="ICICI">ICICI</option>
                                <option value="TATA AIA">TATA AIA</option>
                                <option value="SBI Life">SBI Life</option>
                                <option value="Max Life">Max Life</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Plan Name *</label>
                            <input
                                type="text"
                                name="planName"
                                value={formData.planName}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                                placeholder="e.g. Jeevan Anand, Smart Shield, etc."
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Details */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Financial Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Premium Amount *</label>
                            <input
                                type="number"
                                name="premiumAmount"
                                value={formData.premiumAmount}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Premium Frequency</label>
                            <select
                                name="premiumFrequency"
                                value={formData.premiumFrequency}
                                onChange={handleChange}
                                className="input-field w-full"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Half-Yearly">Half-Yearly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="One-Time">One-Time</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Sum Assured *</label>
                            <input
                                type="number"
                                name="sumAssured"
                                value={formData.sumAssured}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Dates & Status */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        Dates & Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Maturity Date *</label>
                            <input
                                type="date"
                                name="maturityDate"
                                value={formData.maturityDate}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Renewal Date</label>
                            <input
                                type="date"
                                name="renewalDate"
                                value={formData.renewalDate}
                                onChange={handleChange}
                                className="input-field w-full"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Term (Years)</label>
                            <input
                                type="number"
                                name="policyTerm"
                                value={formData.policyTerm}
                                onChange={handleChange}
                                className="input-field w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Policy Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field w-full"
                            >
                                <option value="Active">Active</option>
                                <option value="Lapsed">Lapsed</option>
                                <option value="Matured">Matured</option>
                                <option value="Surrendered">Surrendered</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                            <select
                                name="paymentStatus"
                                value={formData.paymentStatus}
                                onChange={handleChange}
                                className="input-field w-full"
                            >
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="card space-y-4">
                    <label className="block text-lg font-semibold text-gray-900">Notes & Remarks</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="input-field w-full min-h-[100px]"
                        placeholder="Add any additional details or remarks here..."
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        to="/policies"
                        className="btn-outline flex items-center gap-2"
                    >
                        <X className="w-4 h-4" /> Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : (isEdit ? "Update Policy" : "Save Policy")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PolicyForm;
