import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: 'Admin User',
        email: 'admin@insurance-crm.com',
        phone: '+91 98765 43210',
        role: 'Administrator',
        location: 'Mumbai, India',
        bio: 'Senior Insurance Agent with 10+ years of experience in Life and Health insurance sectors.',
        avatar: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile updated successfully");
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Avatar & Core Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="card text-center">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-blue-500" />
                                )}
                            </div>
                            <button className="absolute bottom-4 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-md">
                                <Camera className="w-4 h-4" />
                            </button>
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
