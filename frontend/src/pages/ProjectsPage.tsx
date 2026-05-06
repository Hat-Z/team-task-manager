import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { useAuthStore, useProjectStore } from '../store';
import { projectService } from '../services/projectService';
import { Card, Button, Input, Textarea, Modal, Alert } from '../components/ui';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, setProjects, isLoading, setLoading, error, setError } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectService.createProject(newProject.name, newProject.description);
      setNewProject({ name: '', description: '' });
      setIsCreateModalOpen(false);
      loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(projectId);
        loadProjects();
      } catch (err: any) {
        setError(err.message || 'Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        {user?.role === 'admin' && (
          <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
            <Plus size={20} className="mr-2" />
            New Project
          </Button>
        )}
      </div>

      {error && <Alert message={error} type="error" />}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="My Project"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project description"
              rows={4}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Create Project
          </Button>
        </form>
      </Modal>

      {isLoading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12 text-gray-500">
          <p>No projects yet. Create one to get started!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <h3 className="text-lg font-bold mb-2">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  {project.members.length} members
                </div>
                {user?.role === 'admin' && (
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project._id);
                    }}
                    className="p-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
