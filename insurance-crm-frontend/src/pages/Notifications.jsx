import React, { useState } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, Info, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'warning', title: 'Policy Renewal Due', message: 'Policy POL-001 for John Doe expires in 3 days.', time: '2 hours ago', read: false },
        { id: 2, type: 'info', title: 'New Claim Assigned', message: 'Claim #CLM-2023-005 has been assigned to you.', time: '5 hours ago', read: false },
        { id: 3, type: 'success', title: 'Target Achieved', message: 'Congratulations! You have achieved your monthly premium target.', time: '1 day ago', read: false },
        { id: 4, type: 'warning', title: 'Meeting Reminder', message: 'Client meeting with Jane Smith at 3:00 PM today.', time: '1 day ago', read: true },
        { id: 5, type: 'error', title: 'Payment Failed', message: 'Premium payment for Policy POL-089 failed. Please follow up.', time: '2 days ago', read: true },
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <Clock className="w-5 h-5 text-orange-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                    <Check className="w-4 h-4" /> Mark all as read
                </button>
            </div>

            <div className="card p-0 overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className={`flex-shrink-0 mt-1 p-2 rounded-full bg-white border shadow-sm`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
