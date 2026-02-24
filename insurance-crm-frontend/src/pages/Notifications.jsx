import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertCircle, CheckCircle, Clock, Info, Check } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <Clock className="w-5 h-5 text-orange-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-center h-[50vh]">
                <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 animate-pulse">Checking for notifications...</p>
                </div>
            </div>
        );
    }

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
                            <Link
                                key={notification.id}
                                to={notification.link || '#'}
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
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
