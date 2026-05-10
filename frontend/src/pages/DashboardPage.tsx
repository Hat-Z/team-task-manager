import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';
import { useTaskStore } from '../store';
import { taskService } from '../services/taskService';
import { Card, Badge, Alert } from '../components/ui';
import { formatDate, getStatusColor, getStatusLabel, isOverdue } from '../utils/helpers';

export const DashboardPage: React.FC = () => {
  const { tasks, setTasks, isLoading, error, setLoading, setError } = useTaskStore();
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, completed: 0, overdue: 0 });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const { tasks: dashboardTasks, stats: dashboardStats } = await taskService.getDashboard();
      setTasks(dashboardTasks);
      setStats(dashboardStats);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: Zap, color: 'bg-blue-100 text-blue-600' },
    { label: 'To Do', value: stats.todo, icon: Clock, color: 'bg-gray-100 text-gray-600' },
    { label: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {error && <Alert message={error} type="error" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon size={40} className="opacity-20" />
              </div>
            </Card>
          );
        })}
      </div>

      {stats.overdue > 0 && (
        <Alert
          message={`You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}`}
          type="warning"
        />
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <Card className="text-center py-12 text-gray-500">
            <p>No tasks assigned yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task._id} className="hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{task.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex gap-2">
                    <Badge className={`bg-gray-100 text-gray-800`}>
                      Priority: {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <Badge className={isOverdue(task.dueDate) ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {formatDate(task.dueDate)}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
