import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, X, Target } from 'lucide-react';
import { targetAPI, agentAPI } from '../services/api';
import toast from 'react-hot-toast';

const TargetForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            productType: 'All',
            targetPeriod: 'Monthly',
            status: 'Active',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
        }
    });

    useEffect(() => {
        loadAgents();
        if (isEditMode) {
            loadTarget();
        }
    }, [id]);

    const loadAgents = async () => {
        try {
            const response = await agentAPI.getAll();
            setAgents(response.data.data || []);
        } catch (error) {
            console.error("Failed to load agents", error);
        }
    };

    const loadTarget = async () => {
        try {
            setLoading(true);
            const response = await targetAPI.getById(id);
            const data = response.data.data;

            setValue('agent', data.agent?._id || data.agent);
            setValue('productType', data.productType);
            setValue('targetPeriod', data.targetPeriod);
            setValue('targetAmount', data.targetAmount);
            setValue('startDate', data.startDate.split('T')[0]);
            setValue('endDate', data.endDate.split('T')[0]);
            setValue('status', data.status);
        } catch (error) {
            toast.error("Failed to load target");
            navigate('/targets');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            // Ensure numeric values
            data.targetAmount = Number(data.targetAmount);

            if (isEditMode) {
                await targetAPI.update(id, data);
                toast.success("Target updated");
            } else {
                await targetAPI.create(data);
                toast.success("Target created");
            }
            navigate('/targets');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || (isEditMode ? "Failed to update" : "Failed to create"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Target' : 'Set New Target'}
                </h2>
                <button
                    onClick={() => navigate('/targets')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Agent Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign to Agent</label>
                        <select
                            {...register("agent", { required: "Agent is required" })}
                            className="input-field mt-1 w-full"
                        >
                            <option value="">Select Agent</option>
                            {agents.map(agent => (
                                <option key={agent._id} value={agent._id}>
                                    {agent.name} ({agent.email})
                                </option>
                            ))}
                        </select>
                        {errors.agent && <span className="text-red-500 text-xs">{errors.agent.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Type</label>
                            <select
                                {...register("productType", { required: "Product Type is required" })}
                                className="input-field mt-1 w-full"
                            >
                                <option value="All">All Products</option>
                                <option value="Life">Life Insurance</option>
                                <option value="Health">Health Insurance</option>
                                <option value="General">General Insurance</option>
                                <option value="Motor">Motor Insurance</option>
                                <option value="Mutual Fund">Mutual Fund</option>
                            </select>
                            {errors.productType && <span className="text-red-500 text-xs">{errors.productType.message}</span>}
                        </div>

                        {/* Period */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Target Period</label>
                            <select
                                {...register("targetPeriod", { required: "Period is required" })}
                                className="input-field mt-1 w-full"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Half-Yearly">Half-Yearly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                            {errors.targetPeriod && <span className="text-red-500 text-xs">{errors.targetPeriod.message}</span>}
                        </div>
                    </div>

                    {/* Target Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target Amount (Volume)</label>
                        <input
                            type="number"
                            {...register("targetAmount", {
                                required: "Target amount is required",
                                min: { value: 1, message: "Must be greater than 0" }
                            })}
                            className="input-field mt-1 w-full"
                            placeholder="e.g. 100000"
                        />
                        {errors.targetAmount && <span className="text-red-500 text-xs">{errors.targetAmount.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                {...register("startDate", { required: "Start date is required" })}
                                className="input-field mt-1 w-full"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                {...register("endDate", { required: "End date is required" })}
                                className="input-field mt-1 w-full"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            {...register("status")}
                            className="input-field mt-1 w-full"
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Expired">Expired</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/targets')}
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
                            {loading ? 'Saving...' : 'Save Target'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TargetForm;
