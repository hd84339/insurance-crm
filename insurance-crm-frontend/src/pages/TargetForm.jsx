import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, X, Target } from 'lucide-react';
import { targetAPI } from '../services/api'; // We assume targetAPI exists
import toast from 'react-hot-toast';

const TargetForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'Premium',
            period: 'Monthly',
            status: 'Active',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
        }
    });

    useEffect(() => {
        if (isEditMode) {
            loadTarget();
        }
    }, [id]);

    const loadTarget = async () => {
        try {
            setLoading(true);
            const response = await targetAPI.getById(id);
            const data = response.data.data;

            setValue('type', data.type);
            setValue('period', data.period);
            setValue('targetValue', data.targetValue);
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
            data.targetValue = Number(data.targetValue);

            if (isEditMode) {
                await targetAPI.update(id, data);
                toast.success("Target updated");
            } else {
                await targetAPI.create(data);
                toast.success("Target created");
            }
            navigate('/targets');
        } catch (error) {
            toast.error(isEditMode ? "Failed to update" : "Failed to create");
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Target Type</label>
                            <select
                                {...register("type", { required: "Type is required" })}
                                className="input-field mt-1 w-full"
                            >
                                <option value="Premium">Total Premium</option>
                                <option value="Policies">Number of Policies</option>
                                <option value="Revenue">Revenue / Commission</option>
                            </select>
                        </div>

                        {/* Period */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Period Frequency</label>
                            <select
                                {...register("period", { required: "Period is required" })}
                                className="input-field mt-1 w-full"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                    </div>

                    {/* Target Value */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target Value</label>
                        <input
                            type="number"
                            {...register("targetValue", {
                                required: "Target value is required",
                                min: { value: 1, message: "Must be greater than 0" }
                            })}
                            className="input-field mt-1 w-full"
                            placeholder="e.g. 100000 or 50"
                        />
                        {errors.targetValue && <span className="text-red-500 text-xs">{errors.targetValue.message}</span>}
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
                            <option value="Failed">Failed</option>
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
