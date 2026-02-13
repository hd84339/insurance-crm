import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, X, Bell } from 'lucide-react';
import { reminderAPI, clientAPI } from '../services/api';
import toast from 'react-hot-toast';

const ReminderForm = () => {
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
            loadReminder();
        }
    }, [id]);

    const loadClients = async () => {
        try {
            const response = await clientAPI.getAll();
            setClients(response.data.data);
        } catch (error) {
            console.error("Failed to load clients");
        }
    };

    const loadReminder = async () => {
        try {
            setLoading(true);
            const response = await reminderAPI.getById(id);
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
            toast.error("Failed to load reminder");
            navigate('/reminders');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (isEditMode) {
                await reminderAPI.update(id, data);
                toast.success("Reminder updated");
            } else {
                await reminderAPI.create(data);
                toast.success("Reminder created");
            }
            navigate('/reminders');
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
                    {isEditMode ? 'Edit Reminder' : 'New Reminder'}
                </h2>
                <button
                    onClick={() => navigate('/reminders')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className="input-field mt-1 w-full"
                            placeholder="e.g. Call client for renewal"
                        />
                        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Related Client (Optional)</label>
                            <select
                                {...register("client")}
                                className="input-field mt-1 w-full"
                            >
                                <option value="">None</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>{client.name}</option>
                                ))}
                            </select>
                        </div>

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
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date & Time</label>
                        <input
                            type="datetime-local"
                            {...register("dueDate", { required: "Due date is required" })}
                            className="input-field mt-1 w-full"
                        />
                        {errors.dueDate && <span className="text-red-500 text-xs">{errors.dueDate.message}</span>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register("description")}
                            rows="3"
                            className="input-field mt-1 w-full"
                            placeholder="Additional details..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/reminders')}
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
                            {loading ? 'Saving...' : 'Save Reminder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReminderForm;
