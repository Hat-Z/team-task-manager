import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setToken } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
              Task Manager
            </h1>
            <div className="hidden md:flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="hover:bg-blue-700 px-3 py-2 rounded-lg transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="hover:bg-blue-700 px-3 py-2 rounded-lg transition"
              >
                Projects
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-500 pt-4">
            <button
              onClick={() => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded-lg transition mb-2"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate('/projects');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded-lg transition mb-2"
            >
              Projects
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded-lg transition flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
