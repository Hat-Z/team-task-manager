import api from './api';
import { Project } from '../types';

export const projectService = {
  createProject: async (name: string, description: string) => {
    const { data } = await api.post('/projects', { name, description });
    return data.project;
  },

  getProjects: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data.projects;
  },

  getProjectById: async (projectId: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${projectId}`);
    return data.project;
  },

  updateProject: async (projectId: string, name: string, description: string) => {
    const { data } = await api.put(`/projects/${projectId}`, { name, description });
    return data.project;
  },

  deleteProject: async (projectId: string) => {
    await api.delete(`/projects/${projectId}`);
  },

  addMember: async (projectId: string, memberEmail: string) => {
    const { data } = await api.post(`/projects/${projectId}/members`, { memberEmail });
    return data.project;
  },

  removeMember: async (projectId: string, memberId: string) => {
    const { data } = await api.delete(`/projects/${projectId}/members`, {
      data: { memberId },
    });
    return data.project;
  },
};
