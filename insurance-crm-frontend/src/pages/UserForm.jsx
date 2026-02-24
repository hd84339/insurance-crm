import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, X, User, Shield, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            role: 'agent',
            status: 'Active',
            isActive: true
        }
    });

    useEffect(() => {
        if (isEditMode) {
            loadUser();
        }
    }, [id]);

    const loadUser = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getById(id);
            const data = response.data.data;

            // Fill form with user data
            ['name', 'email', 'role', 'phone', 'location', 'bio', 'licenseNumber', 'status'].forEach(field => {
                if (data[field]) setValue(field, data[field]);
            });
            setValue('isActive', data.isActive);
        } catch (error) {
            console.error('Error loading user:', error);
            toast.error('Failed to load user data');
            navigate('/users');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Clean up empty password in edit mode
            if (isEditMode && !data.password) {
                delete data.password;
            }

            if (isEditMode) {
                await userAPI.update(id, data);
                toast.success('User updated successfully');
            } else {
                await userAPI.create(data);
                toast.success('User created successfully');
            }
            navigate('/users');
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit User' : 'Add New User'}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {isEditMode ? 'Update account details and permissions' : 'Create a new account for an agent or manager'}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/users')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Account Profile
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email is required' })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {isEditMode ? 'Change Password (leave blank to keep current)' : 'Password'}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        {...register('password', { required: !isEditMode ? 'Password is required' : false })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        {...register('phone')}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    {...register('location')}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Mumbai, India"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Profile Notes</label>
                            <textarea
                                {...register('bio')}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Write something about the agent..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Settings & Role */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-600" />
                            Role & Status
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                            <select
                                {...register('role', { required: 'Role is required' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                            >
                                <option value="agent">Agent</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Number (if Agent)</label>
                            <input
                                type="text"
                                {...register('licenseNumber')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="LIC-987654"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                id="isActive"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Enable account access
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving Changes...' : (isEditMode ? 'Update User' : 'Create Account')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/users')}
                            className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-all flex items-center justify-center gap-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
