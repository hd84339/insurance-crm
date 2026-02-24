import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Users, Briefcase, Phone, Mail, ArrowLeft,
    FileText, Shield, CheckCircle, XCircle, Calendar,
    User as UserIcon, Activity
} from 'lucide-react';
import { userAPI, clientAPI, policyAPI } from '../services/api';
import toast from 'react-hot-toast';

const UserActivity = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [clients, setClients] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('clients');

    useEffect(() => {
        loadActivityData();
    }, [id]);

    const loadActivityData = async () => {
        try {
            setLoading(true);
            const [userRes, clientsRes, policiesRes] = await Promise.all([
                userAPI.getById(id),
                clientAPI.getAll({ assignedTo: id, limit: 100 }),
                policyAPI.getAll({ assignedTo: id, limit: 100 })
            ]);

            setUser(userRes.data.data);
            setClients(clientsRes.data.data);
            setPolicies(policiesRes.data.data);
        } catch (error) {
            console.error('Error loading activity data:', error);
            toast.error('Failed to load agent activity');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-gray-900">User not found</h3>
                <Link to="/users" className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/users" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Agent Activity</h2>
                    <p className="text-gray-500">Tracking performance and assignments for {user.name}</p>
                </div>
            </div>

            {/* Agent Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold border-2 border-blue-100 shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 uppercase">
                                {user.role}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${user.status === 'Active' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                {user.status === 'Active' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                {user.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4 opacity-70" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4 opacity-70" />
                                <span className="text-sm">{user.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Shield className="w-4 h-4 opacity-70" />
                                <span className="text-sm">License: {user.licenseNumber || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 text-center">
                            <div className="text-2xl font-bold text-blue-700">{clients.length}</div>
                            <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Clients</div>
                        </div>
                        <div className="bg-purple-50 px-4 py-3 rounded-xl border border-purple-100 text-center">
                            <div className="text-2xl font-bold text-purple-700">{policies.length}</div>
                            <div className="text-xs text-purple-600 font-medium uppercase tracking-wider">Policies</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'clients' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Assigned Clients
                        {activeTab === 'clients' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('policies')}
                        className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'policies' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Assigned Policies
                        {activeTab === 'policies' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {activeTab === 'clients' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Policies</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Added On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">No clients assigned to this agent yet.</td>
                                    </tr>
                                ) : (
                                    clients.map(client => (
                                        <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link to={`/clients/${client._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                    {client.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs text-gray-600 gap-1">
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 opacity-60" /> {client.email || 'N/A'}</span>
                                                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 opacity-60" /> {client.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${client.clientType === 'Corporate' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-700'}`}>
                                                    {client.clientType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                {client.totalPolicies || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-500">
                                                {new Date(client.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Policy Info</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Premium</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Renewal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {policies.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">No policies tracked by this agent yet.</td>
                                    </tr>
                                ) : (
                                    policies.map(policy => (
                                        <tr key={policy._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <Link to={`/policies/${policy._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                        {policy.policyNumber}
                                                    </Link>
                                                    <span className="text-xs text-gray-500 uppercase tracking-tighter">{policy.company} • {policy.policyType}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {policy.client?.name || 'Deleted Client'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">₹{policy.premiumAmount?.toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">{policy.premiumFrequency}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${policy.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        policy.status === 'Lapsed' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            'bg-gray-50 text-gray-700 border-gray-100'
                                                    }`}>
                                                    {policy.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600">
                                                    <Calendar className="w-3.5 h-3.5 opacity-50" />
                                                    {new Date(policy.renewalDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserActivity;
