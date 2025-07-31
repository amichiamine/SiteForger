import { useState, useEffect } from 'react';
import { Project } from '../types';
import { dbService } from '../services/database';
import { apiService } from '../services/api';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from local database first
      const localProjects = await dbService.getProjects();
      setProjects(localProjects);
      
      // Then try to sync with API if available
      try {
        const apiProjects = await apiService.getProjects();
        setProjects(apiProjects);
        
        // Update local database
        for (const project of apiProjects) {
          await dbService.saveProject(project);
        }
      } catch (apiError) {
        // API not available, use local data
        console.log('API not available, using local data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Partial<Project>): Promise<Project> => {
    const newProject: Project = {
      id: generateId(),
      name: projectData.name || 'New Project',
      description: projectData.description || '',
      type: projectData.type || 'html',
      status: 'draft',
      pages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        ssl: true,
        compression: true,
        cache: true,
        analytics: false,
        seo: {
          title: projectData.name || 'New Project',
          description: projectData.description || '',
          keywords: []
        },
        deployment: {
          provider: 'cpanel',
          host: '',
          username: '',
          password: '',
          path: '/public_html'
        }
      }
    };

    try {
      // Save to API if available
      const savedProject = await apiService.createProject(newProject);
      await dbService.saveProject(savedProject);
      setProjects(prev => [...prev, savedProject]);
      return savedProject;
    } catch (apiError) {
      // Save locally if API not available
      await dbService.saveProject(newProject);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
    const existingProject = projects.find(p => p.id === id);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    const updatedProject: Project = {
      ...existingProject,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    try {
      // Update via API if available
      const savedProject = await apiService.updateProject(id, updatedProject);
      await dbService.saveProject(savedProject);
      setProjects(prev => prev.map(p => p.id === id ? savedProject : p));
      return savedProject;
    } catch (apiError) {
      // Update locally if API not available
      await dbService.saveProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      // Delete via API if available
      await apiService.deleteProject(id);
    } catch (apiError) {
      // Continue with local deletion even if API fails
    }

    await dbService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    refreshProjects: loadProjects
  };
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};