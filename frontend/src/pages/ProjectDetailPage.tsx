import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { Card, Button, Input, Textarea, Select, Modal, Alert, Badge } from '../components/ui';
import { Project, Task } from '../types';
import { formatDate, getStatusColor, getStatusLabel, isOverdue } from '../utils/helpers';
import { useAuthStore } from '../store';

const getUserId = (user: { id?: string; _id?: string }) => user.id || user._id || '';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const [projectData, tasksData] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getTasksByProject(projectId),
      ]);
      setProject(projectData);
      setTasks(tasksData);
      if (projectData.members.length > 0) {
        setNewTask((prev) => ({ ...prev, assignedTo: getUserId(projectData.members[0]) }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    try {
      await taskService.createTask(
        projectId,
        newTask.title,
        newTask.description,
        newTask.assignedTo,
        newTask.priority,
        newTask.dueDate || undefined
      );
      setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
      setIsCreateTaskOpen(false);
      loadProjectDetails();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        loadProjectDetails();
      } catch (err: any) {
        setError(err.message || 'Failed to delete task');
      }
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !memberEmail.trim()) return;
    try {
      const updatedProject = await projectService.addMember(projectId, memberEmail.trim());
      setProject(updatedProject);
      setMemberEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await taskService.updateTask(taskId, { status });
      loadProjectDetails();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (!project) return <p className="text-gray-500">Project not found</p>;

  const isAdmin = user?.role === 'admin';
  const isOwner = user ? getUserId(project.owner) === getUserId(user) : false;
  const canManageProject = isAdmin || isOwner;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/projects')} variant="secondary">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>

      {error && <Alert message={error} type="error" />}

      <Card>
        <h3 className="text-lg font-bold mb-2">Project Details</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Owner</p>
            <p className="font-medium">{project.owner.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Members ({project.members.length})</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {project.members.map((member) => (
                <Badge key={getUserId(member)} className="bg-blue-100 text-blue-800">
                  {member.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        {canManageProject && (
          <form onSubmit={handleAddMember} className="mt-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="member@email.com"
              aria-label="Member email"
            />
            <Button type="submit" variant="secondary">
              Add Member
            </Button>
          </form>
        )}
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        {canManageProject && (
          <Button onClick={() => setIsCreateTaskOpen(true)} variant="primary">
            <Plus size={20} className="mr-2" />
            New Task
          </Button>
        )}
      </div>

      <Modal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} title="Create Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <Select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              required
            >
              <option value="">Select member</option>
              {project.members.map((member) => (
                <option key={getUserId(member)} value={getUserId(member)}>
                  {member.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <Select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Create Task
          </Button>
        </form>
      </Modal>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <Card className="text-center py-12 text-gray-500">
            <p>No tasks yet</p>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task._id} className="hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </div>
                {canManageProject && (
                  <Button
                    variant="danger"
                    className="p-2"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <Select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className={getStatusColor(task.status)}
                  aria-label={`Status for ${task.title}`}
                >
                  <option value="todo">{getStatusLabel('todo')}</option>
                  <option value="in_progress">{getStatusLabel('in_progress')}</option>
                  <option value="completed">{getStatusLabel('completed')}</option>
                </Select>
                <Badge className="bg-gray-100 text-gray-800">Priority: {task.priority}</Badge>
                {task.dueDate && (
                  <Badge className={isOverdue(task.dueDate) ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                    Due: {formatDate(task.dueDate)}
                  </Badge>
                )}
                <Badge className="bg-purple-100 text-purple-800">Assigned: {task.assignedTo.name}</Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
