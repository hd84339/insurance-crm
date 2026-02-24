import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Bell, Plus, Calendar, CheckCircle, Trash2, Edit
} from 'lucide-react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // today, upcoming, overdue, completed
    const [stats, setStats] = useState({ today: 0, upcoming: 0, overdue: 0, completed: 0 });

    useEffect(() => {
        loadTasks();
    }, [activeTab]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            let response;
            if (activeTab === 'overdue') {
                response = await taskAPI.getAll({ filter: 'overdue' });
            } else if (activeTab === 'today') {
                response = await taskAPI.getAll({ filter: 'today' });
            } else if (activeTab === 'completed') {
                response = await taskAPI.getAll({ filter: 'completed' });
            } else {
                response = await taskAPI.getAll({ filter: 'upcoming' });
            }

            const data = response.data.data || [];
            setTasks(data);

            // Update stats (mocked or from separate call)
            setStats({
                today: activeTab === 'today' ? data.length : stats.today,
                upcoming: activeTab === 'upcoming' ? data.length : stats.upcoming,
                overdue: activeTab === 'overdue' ? data.length : stats.overdue,
                completed: activeTab === 'completed' ? data.length : stats.completed
            });

        } catch (error) {
            console.error(error);
            if (error.response?.status !== 404) {
                toast.error("Failed to load tasks");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async (id) => {
        try {
            await taskAPI.complete(id);
            toast.success("Task marked as complete");
            loadTasks();
        } catch (error) {
            toast.error("Failed to update task");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await taskAPI.delete(id);
            toast.success("Task deleted");
            loadTasks();
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                    <p className="mt-1 text-gray-500">Stay on top of your tasks and follow-ups</p>
                </div>
                <Link
                    to="/tasks/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center sm:w-auto w-full transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {['today', 'upcoming', 'overdue', 'completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all
                ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
                        >
                            {tab}
                            <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${activeTab === tab ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'}`}>
                                {stats[tab] || 0}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="py-12 text-center">
                        <Bell className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No {activeTab} tasks</h3>
                        <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <li key={task._id} className="p-4 hover:bg-gray-50 flex items-start justify-between gap-4 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        <Bell className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium text-gray-900 ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {task.client && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                    {task.client.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {task.status !== 'Completed' && (
                                        <>
                                            <button
                                                onClick={() => handleMarkComplete(task._id)}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Mark Complete"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <Link
                                                to={`/tasks/edit/${task._id}`}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Tasks;
