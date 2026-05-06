import api from './api';
import { Task, DashboardStats } from '../types';

export const taskService = {
  createTask: async (
    projectId: string,
    title: string,
    description: string,
    assignedTo: string,
    priority: string,
    dueDate?: string
  ) => {
    const { data } = await api.post(`/tasks/${projectId}`, {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
    });
    return data.task;
  },

  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    const { data } = await api.get(`/tasks/${projectId}`);
    return data.tasks;
  },

  getTaskById: async (taskId: string): Promise<Task> => {
    const { data } = await api.get(`/tasks/task/${taskId}`);
    return data.task;
  },

  updateTask: async (
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string;
      assignedTo?: string;
    }
  ) => {
    const { data } = await api.put(`/tasks/${taskId}`, updates);
    return data.task;
  },

  deleteTask: async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
  },

  getDashboard: async (): Promise<{ tasks: Task[]; stats: DashboardStats }> => {
    const { data } = await api.get('/tasks/dashboard');
    return { tasks: data.tasks, stats: data.stats };
  },
};
