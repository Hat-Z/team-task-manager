export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: Project;
  assignedTo: User;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
