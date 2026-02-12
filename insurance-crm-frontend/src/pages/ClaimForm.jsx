import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, X, Search, FileText } from 'lucide-react';
import { claimAPI, policyAPI, clientAPI } from '../services/api';
import toast from 'react-hot-toast';

const ClaimForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            priority: 'Medium',
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        }
    });

    const watchClient = watch("client");

    useEffect(() => {
        loadClients();
        if (isEditMode) {
            loadClaim();
        }
    }, [id]);

    useEffect(() => {
        if (watchClient) {
            loadPolicies(watchClient);
        } else {
            setPolicies([]);
        }
    }, [watchClient]);

    const loadClients = async () => {
        try {
            const response = await clientAPI.getAll();
            setClients(response.data.data);
        } catch (error) {
            console.error("Failed to load clients");
        }
    };

    const loadPolicies = async (clientId) => {
        try {
            // In a real app, we'd filter by client ID via API
            // Here we might fetch all and filter or use a specific endpoint
            const response = await policyAPI.getAll({ limit: 100 });
            // filter policies for this client (assuming simple string comparison or object match)
            const clientPolicies = response.data.data.filter(p =>
                p.client?._id === clientId || p.client === clientId
            );
            setPolicies(clientPolicies);
        } catch (error) {
            console.error("Failed to load policies");
        }
    };

    const loadClaim = async () => {
        try {
            setLoading(true);
            const response = await claimAPI.getById(id);
            const data = response.data.data;

            setValue('client', data.client?._id || data.client);
            // Wait for policies to load before setting policy
            setTimeout(() => setValue('policy', data.policy?._id || data.policy), 500);

            setValue('amount', data.amount);
            setValue('description', data.description);
            setValue('priority', data.priority);
            setValue('status', data.status);
            setValue('date', data.date.split('T')[0]);
        } catch (error) {
            toast.error("Failed to load claim details");
            navigate('/claims');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (isEditMode) {
                await claimAPI.update(id, data);
                toast.success("Claim updated successfully");
            } else {
                await claimAPI.create(data);
                toast.success("Claim created successfully");
            }
            navigate('/claims');
        } catch (error) {
            toast.error(isEditMode ? "Failed to update claim" : "Failed to create claim");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Claim' : 'New Claim'}
                </h2>
                <button
                    onClick={() => navigate('/claims')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Client</label>
                            <select
                                {...register("client", { required: "Client is required" })}
                                className="input-field mt-1 w-full"
                                disabled={isEditMode} // Usually can't change client on edit
                            >
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>{client.name}</option>
                                ))}
                            </select>
                            {errors.client && <span className="text-red-500 text-xs">{errors.client.message}</span>}
                        </div>

                        {/* Policy Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Policy</label>
                            <select
                                {...register("policy", { required: "Policy is required" })}
                                className="input-field mt-1 w-full"
                                disabled={!watchClient}
                            >
                                <option value="">Select Policy</option>
                                {policies.map(policy => (
                                    <option key={policy._id} value={policy._id}>
                                        {policy.policyNo} - {policy.company}
                                    </option>
                                ))}
                            </select>
                            {errors.policy && <span className="text-red-500 text-xs">{errors.policy.message}</span>}
                            {!watchClient && <span className="text-gray-400 text-xs">Select a client first</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Claim Amount (₹)</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    {...register("amount", {
                                        required: "Amount is required",
                                        min: { value: 1, message: "Amount must be greater than 0" }
                                    })}
                                    className="input-field w-full pl-8"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.amount && <span className="text-red-500 text-xs">{errors.amount.message}</span>}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
                            <input
                                type="date"
                                {...register("date", { required: "Date is required" })}
                                className="input-field mt-1 w-full"
                            />
                            {errors.date && <span className="text-red-500 text-xs">{errors.date.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                {...register("priority")}
                                className="input-field mt-1 w-full"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {/* Status (Only available in Edit mode or if user has permission) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                {...register("status")}
                                className="input-field mt-1 w-full"
                                disabled={!isEditMode} // New claims are always Pending usually
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Review">In Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description / Reason</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows="4"
                            className="input-field mt-1 w-full"
                            placeholder="Describe the reason for the claim..."
                        />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                    </div>

                    {/* Mock File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                                Click to upload bills, discharge summaries, etc.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">(Mock functionality)</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/claims')}
                            className="btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Claim'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClaimForm;
