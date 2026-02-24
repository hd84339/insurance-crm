import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { taskAPI, clientAPI } from '../services/api';
import toast from 'react-hot-toast';

const TaskForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            priority: 'Medium',
            dueDate: new Date().toISOString().slice(0, 16) // Format for datetime-local
        }
    });

    useEffect(() => {
        loadClients();
        if (isEditMode) {
            loadTask();
        }
    }, [id]);

    const loadClients = async () => {
        try {
            const response = await clientAPI.getAll();
            setClients(response.data.data || []);
        } catch (error) {
            console.error("Failed to load clients");
        }
    };

    const loadTask = async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getById(id);
            const data = response.data.data;

            setValue('title', data.title);
            setValue('description', data.description);
            setValue('client', data.client?._id || data.client);
            setValue('priority', data.priority);
            // Format date for input type="datetime-local"
            const date = new Date(data.dueDate);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            setValue('dueDate', date.toISOString().slice(0, 16));
        } catch (error) {
            toast.error("Failed to load task");
            navigate('/tasks');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (isEditMode) {
                await taskAPI.update(id, data);
                toast.success("Task updated");
            } else {
                await taskAPI.create(data);
                toast.success("Task created");
            }
            navigate('/tasks');
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
                    {isEditMode ? 'Edit Task' : 'New Task'}
                </h2>
                <button
                    onClick={() => navigate('/tasks')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. Call client for renewal"
                        />
                        {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Related Client (Optional)</label>
                            <select
                                {...register("client")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                            >
                                <option value="">None</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>{client.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                {...register("priority")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date & Time</label>
                        <input
                            type="datetime-local"
                            {...register("dueDate", { required: "Due date is required" })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.dueDate && <span className="text-red-500 text-xs mt-1 block">{errors.dueDate.message}</span>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Additional details..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/tasks')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
