import api from './api';
import { User } from '../types';

export const authService = {
  signup: async (name: string, email: string, password: string, role: 'admin' | 'member') => {
    const { data } = await api.post('/auth/signup', { name, email, password, role });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.user;
  },

  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/auth/users');
    return data.users;
  },
};
