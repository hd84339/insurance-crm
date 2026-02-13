import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { userAPI } from '../services/api';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        location: '',
        bio: '',
        avatar: null
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            setUser(response.data.data);
        } catch (error) {
            console.error('Failed to load profile:', error);
            toast.error('Failed to load profile');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await userAPI.updateProfile({
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                bio: user.bio
            });
            setUser(response.data.data);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await userAPI.uploadAvatar(formData);
            setUser(response.data.data);
            toast.success('Profile picture uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!user.avatar) return;

        if (!confirm('Are you sure you want to delete your profile picture?')) {
            return;
        }

        setUploading(true);
        try {
            const response = await userAPI.deleteAvatar();
            setUser(response.data.data);
            toast.success('Profile picture deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete profile picture');
        } finally {
            setUploading(false);
        }
    };

    const getAvatarUrl = () => {
        if (!user.avatar) return null;
        // If avatar is already a full URL, use it; otherwise prepend API base URL
        if (user.avatar.startsWith('http')) {
            return user.avatar;
        }
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        return baseUrl.replace('/api', '') + user.avatar;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Avatar & Core Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="card text-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="relative inline-block">
                            <div
                                className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={handleAvatarClick}
                            >
                                {user.avatar ? (
                                    <img src={getAvatarUrl()} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-blue-500" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={uploading}
                                className="absolute bottom-4 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-md disabled:opacity-50"
                                title="Upload profile picture"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            {user.avatar && (
                                <button
                                    type="button"
                                    onClick={handleDeleteAvatar}
                                    disabled={uploading}
                                    className="absolute bottom-4 left-0 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 shadow-md disabled:opacity-50"
                                    title="Delete profile picture"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>

                    <div className="card space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Info</h4>
                        <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-3 text-gray-400" />
                            {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-3 text-gray-400" />
                            {user.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                            {user.location}
                        </div>
                    </div>
                </div>

                {/* Right Column - Edit Form */}
                <div className="md:col-span-2">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        className="input-field mt-1 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={user.role}
                                        disabled
                                        className="input-field mt-1 w-full bg-gray-50 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        className="input-field mt-1 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                        className="input-field mt-1 w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={user.location}
                                    onChange={handleChange}
                                    className="input-field mt-1 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    value={user.bio}
                                    onChange={handleChange}
                                    className="input-field mt-1 w-full"
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
