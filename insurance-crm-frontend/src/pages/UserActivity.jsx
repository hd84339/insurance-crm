import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Users, Briefcase, Phone, Mail, ArrowLeft,
    FileText, Shield, CheckCircle, XCircle, Calendar,
    User as UserIcon, Search
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
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredPolicies = policies.filter(policy =>
        policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-gray-50 rounded-2xl">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading activity data...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">User not found</h3>
                <p className="text-gray-500 mb-6 text-center max-w-md">The agent you are looking for doesn't exist or has been removed.</p>
                <Link to="/users" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Directory
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 max-w-7xl mx-auto">
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/users" className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600 rounded-xl transition-all shadow-sm group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Agent Activity</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Link to="/users" className="hover:text-blue-600 transition-colors">Users</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{user.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Overview Hero Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="p-6 sm:p-8 pt-12 sm:pt-16 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end">

                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white flex items-center justify-center text-blue-600 text-4xl sm:text-5xl font-bold border-4 border-white shadow-lg shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h3>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm ${user.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {user.status === 'Active' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                        {user.status}
                                    </span>
                                </div>
                                <div className="text-blue-600 font-medium flex items-center gap-1.5">
                                    <Shield className="w-4 h-4" />
                                    {user.role}
                                </div>
                            </div>

                            {/* Key Stats Mobile-friendly row */}
                            <div className="flex gap-3 sm:gap-4 shrink-0 sm:pb-2">
                                <div className="bg-gray-50 p-3 sm:px-5 sm:py-3 rounded-xl border border-gray-100 flex-1 sm:flex-none flex flex-col items-center sm:items-end transition-transform hover:scale-105">
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none mb-1">{clients.length}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">Clients</div>
                                </div>
                                <div className="bg-gray-50 p-3 sm:px-5 sm:py-3 rounded-xl border border-gray-100 flex-1 sm:flex-none flex flex-col items-center sm:items-end transition-transform hover:scale-105">
                                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600 leading-none mb-1">{policies.length}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">Policies</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Pills */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="truncate max-w-[200px]">{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {user.phone}
                                </div>
                            )}
                            {user.licenseNumber && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg text-sm text-orange-700 border border-orange-100 font-medium">
                                    <Briefcase className="w-4 h-4 text-orange-500" />
                                    LIC: {user.licenseNumber}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Data Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:min-h-[500px]">
                {/* Controls Area (Tabs + Search) */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                    <div className="flex p-1 bg-gray-100/80 rounded-xl max-w-full overflow-x-auto custom-scrollbar w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'clients' ? 'bg-white text-blue-700 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
                        >
                            <Users className="w-4 h-4" />
                            Assigned Clients
                            <span className={`ml-1.5 mr-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'clients' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                {clients.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('policies')}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'policies' ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
                        >
                            <FileText className="w-4 h-4" />
                            Managed Policies
                            <span className={`ml-1.5 mr-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'policies' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'}`}>
                                {policies.length}
                            </span>
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'clients' ? (
                        <>
                            {/* Mobile View - Cards */}
                            <div className="md:hidden flex flex-col divide-y divide-gray-100">
                                {filteredClients.length === 0 ? (
                                    <div className="py-12 px-6 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No clients found.</p>
                                    </div>
                                ) : (
                                    filteredClients.map(client => (
                                        <div key={client._id} className="p-5 hover:bg-blue-50/50 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <Link to={`/clients/${client._id}`} className="font-bold text-gray-900 hover:text-blue-600 text-lg transition-colors truncate pr-2">
                                                    {client.name}
                                                </Link>
                                                <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${client.clientType === 'Corporate' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                                                    {client.clientType}
                                                </span>
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                {client.email && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                                        <span className="truncate">{client.email}</span>
                                                    </div>
                                                )}
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                                        {client.phone}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div className="text-xs text-gray-500 font-medium">
                                                    <span className="text-gray-900 font-bold">{client.totalPolicies || 0}</span> Policies
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(client.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client Details</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Policies</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Added On</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredClients.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                            <Users className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">No clients match your search.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredClients.map(client => (
                                                <tr key={client._id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-6 py-4 align-top">
                                                        <Link to={`/clients/${client._id}`} className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base block mb-0.5">
                                                            {client.name}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 line-clamp-1">ID: {client._id.substring(0, 8)}...</div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="flex flex-col text-sm text-gray-600 gap-1.5">
                                                            {client.email && (
                                                                <span className="flex items-center gap-2">
                                                                    <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                                                                        <Mail className="w-3 h-3 text-gray-500" />
                                                                    </div>
                                                                    <span className="truncate max-w-[180px]">{client.email}</span>
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                                                                    <Phone className="w-3 h-3 text-gray-500" />
                                                                </div>
                                                                {client.phone}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${client.clientType === 'Corporate' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                                            {client.clientType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 align-top text-center">
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                                                            {client.totalPolicies || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 align-top text-right">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {new Date(client.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Mobile View - Cards */}
                            <div className="md:hidden flex flex-col divide-y divide-gray-100">
                                {filteredPolicies.length === 0 ? (
                                    <div className="py-12 px-6 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No policies found.</p>
                                    </div>
                                ) : (
                                    filteredPolicies.map(policy => (
                                        <div key={policy._id} className="p-5 hover:bg-indigo-50/50 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <Link to={`/policies/${policy._id}`} className="font-bold text-gray-900 hover:text-indigo-600 text-lg transition-colors block mb-1">
                                                        {policy.policyNumber}
                                                    </Link>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{policy.company}</span>
                                                </div>
                                                <span className={`shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${policy.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    policy.status === 'Lapsed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}>
                                                    {policy.status}
                                                </span>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Premium</div>
                                                    <div className="text-sm font-bold text-gray-900">₹{policy.premiumAmount?.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ {policy.premiumFrequency}</span></div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Renewal</div>
                                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-orange-500" /> {new Date(policy.renewalDate).toLocaleDateString()}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-sm">
                                                <UserIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700 font-medium truncate">Client: {policy.client?.name || 'Deleted Client'}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Policy Details</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Premium Overview</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Renewal Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredPolicies.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                            <FileText className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">No policies match your search.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredPolicies.map(policy => (
                                                <tr key={policy._id} className="hover:bg-indigo-50/30 transition-colors group">
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="flex flex-col">
                                                            <Link to={`/policies/${policy._id}`} className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-base mb-1">
                                                                {policy.policyNumber}
                                                            </Link>
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider">{policy.company}</span>
                                                                <span className="text-xs text-gray-500">{policy.policyType}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                                                {policy.client?.name?.charAt(0)?.toUpperCase() || '?'}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900 line-clamp-2">
                                                                {policy.client?.name || <span className="text-red-500 italic">Deleted Client</span>}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-sm font-bold text-gray-900 mb-0.5">₹{policy.premiumAmount?.toLocaleString()}</div>
                                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                            {policy.premiumFrequency}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${policy.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            policy.status === 'Lapsed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                            }`}>
                                                            {policy.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 align-top text-right">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 text-orange-800 rounded-lg text-sm font-medium">
                                                            <Calendar className="w-4 h-4 text-orange-500" />
                                                            {new Date(policy.renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserActivity;
