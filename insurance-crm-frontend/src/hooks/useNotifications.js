import { useState, useEffect, useCallback } from 'react';
import { policyAPI, taskAPI } from '../services/api';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchRealNotifications = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch upcoming renewals (7 days)
            const renewalResponse = await policyAPI.getUpcomingRenewals(7);
            const renewals = (renewalResponse.data.data || []).map(p => ({
                id: `renewal-${p._id}`,
                type: 'warning',
                title: 'Policy Renewal Due',
                message: `Policy ${p.policyNumber} for ${p.client?.name || 'Client'} expires on ${new Date(p.renewalDate).toLocaleDateString()}.`,
                time: 'Upcoming',
                read: localStorage.getItem(`read-notification-renewal-${p._id}`) === 'true',
                link: `/policies/${p._id}`
            }));

            // Fetch overdue tasks
            const overdueResponse = await taskAPI.getOverdue();
            const overdueTasks = (overdueResponse.data.data || []).map(t => ({
                id: `task-${t._id}`,
                type: 'error',
                title: 'Task Overdue',
                message: `Task "${t.title}" for ${t.client?.name || 'Client'} was due on ${new Date(t.dueDate).toLocaleDateString()}.`,
                time: 'Overdue',
                read: localStorage.getItem(`read-notification-task-${t._id}`) === 'true',
                link: `/tasks`
            }));

            const allNotifications = [...renewals, ...overdueTasks];
            setNotifications(allNotifications);
            setUnreadCount(allNotifications.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRealNotifications();
        // Poll every 5 minutes
        const interval = setInterval(fetchRealNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchRealNotifications]);

    const markAsRead = (id) => {
        localStorage.setItem(`read-notification-${id}`, 'true');
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        notifications.forEach(n => {
            localStorage.setItem(`read-notification-${n.id}`, 'true');
        });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: fetchRealNotifications
    };
};

export default useNotifications;
