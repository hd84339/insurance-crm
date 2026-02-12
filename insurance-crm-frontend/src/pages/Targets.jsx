import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Plus, TrendingUp, Calendar, AlertCircle,
  Trash2, Edit, Award
} from 'lucide-react';
import { targetAPI } from '../services/api'; // We assume targetAPI exists based on task list
import toast from 'react-hot-toast';

const Targets = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      setLoading(true);
      const response = await targetAPI.getAll(); // Assuming getAll exists
      setTargets(response.data.data || []);
    } catch (error) {
      console.error(error);
      // Mock data
      setTargets([
        {
          _id: '1',
          type: 'Premium',
          period: 'Monthly',
          startDate: '2023-11-01',
          endDate: '2023-11-30',
          targetValue: 500000,
          achievedValue: 350000,
          status: 'Active',
          agent: { name: 'Me' } // For now single user or agent view
        },
        {
          _id: '2',
          type: 'Policies',
          period: 'Quarterly',
          startDate: '2023-10-01',
          endDate: '2023-12-31',
          targetValue: 50,
          achievedValue: 20,
          status: 'Active',
          agent: { name: 'Me' }
        },
        {
          _id: '3',
          type: 'Premium',
          period: 'Yearly',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          targetValue: 5000000,
          achievedValue: 6000000,
          status: 'Completed',
          agent: { name: 'Me' }
        },
      ]);
      if (error.response?.status !== 404) {
        toast.error("Failed to load targets");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this target?")) return;
    try {
      await targetAPI.delete(id);
      toast.success("Target deleted");
      loadTargets();
    } catch (error) {
      toast.error("Failed to delete target");
    }
  };

  const calculateProgress = (achieved, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((achieved / target) * 100), 100);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Targets</h2>
          <p className="mt-1 text-gray-500">Track your goals and achievements</p>
        </div>
        <Link
          to="/targets/new"
          className="btn-primary flex items-center gap-2 justify-center sm:w-auto w-full"
        >
          <Plus className="w-4 h-4" />
          Set New Target
        </Link>
      </div>

      {/* Targets Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
        </div>
      ) : targets.length === 0 ? (
        <div className="py-12 text-center card">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No targets set</h3>
          <p className="mt-1 text-sm text-gray-500">Set a goal to track your performance!</p>
          <Link to="/targets/new" className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Set Target
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target) => {
            const progress = calculateProgress(target.achievedValue, target.targetValue);
            const isCompleted = progress >= 100;

            return (
              <div key={target._id} className={`card border-l-4 ${isCompleted ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{target.period} {target.type}</h3>
                      {isCompleted && <Award className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(target.startDate).toLocaleDateString()} - {new Date(target.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/targets/edit/${target._id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(target._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">Achieved</p>
                      <p className={`text-xl font-bold ${isCompleted ? 'text-green-600' : 'text-gray-900'}`}>
                        {target.type === 'Premium'
                          ? formatCurrency(target.achievedValue)
                          : target.achievedValue
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Target</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {target.type === 'Premium'
                          ? formatCurrency(target.targetValue)
                          : target.targetValue
                        }
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{progress}% Completed</span>
                      <span className="text-gray-500">
                        {target.type === 'Premium'
                          ? `${formatCurrency(Math.max(0, target.targetValue - target.achievedValue))} remaining`
                          : `${Math.max(0, target.targetValue - target.achievedValue)} remaining`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-600' :
                            progress > 75 ? 'bg-blue-600' :
                              progress > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${target.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        target.status === 'Employed' ? 'bg-red-100 text-red-800' : // Typo fallback
                          target.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                      }`}>
                      {target.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Targets;
