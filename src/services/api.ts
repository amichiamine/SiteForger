import { Project, Page, Template, DeploymentHistory, User } from '../types';

const API_BASE = '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  // Pages
  async getPages(projectId: string): Promise<Page[]> {
    return this.request<Page[]>(`/projects/${projectId}/pages`);
  }

  async getPage(projectId: string, pageId: string): Promise<Page> {
    return this.request<Page>(`/projects/${projectId}/pages/${pageId}`);
  }

  async createPage(projectId: string, page: Partial<Page>): Promise<Page> {
    return this.request<Page>(`/projects/${projectId}/pages`, {
      method: 'POST',
      body: JSON.stringify(page),
    });
  }

  async updatePage(projectId: string, pageId: string, page: Partial<Page>): Promise<Page> {
    return this.request<Page>(`/projects/${projectId}/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(page),
    });
  }

  async deletePage(projectId: string, pageId: string): Promise<void> {
    await this.request(`/projects/${projectId}/pages/${pageId}`, { method: 'DELETE' });
  }

  // Templates
  async getTemplates(): Promise<Template[]> {
    return this.request<Template[]>('/templates');
  }

  async getTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/templates/${id}`);
  }

  // Deployment
  async deployProject(projectId: string, settings: any): Promise<DeploymentHistory> {
    return this.request<DeploymentHistory>(`/projects/${projectId}/deploy`, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getDeploymentHistory(projectId: string): Promise<DeploymentHistory[]> {
    return this.request<DeploymentHistory[]>(`/projects/${projectId}/deployments`);
  }

  // File operations
  async uploadFile(file: File, projectId?: string): Promise<{ url: string; path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  // VS Code Integration
  async exportToVSCode(projectId: string): Promise<{ downloadUrl: string }> {
    return this.request<{ downloadUrl: string }>(`/projects/${projectId}/export/vscode`, {
      method: 'POST',
    });
  }

  async importFromVSCode(file: File): Promise<Project> {
    const formData = new FormData();
    formData.append('project', file);

    const response = await fetch(`${API_BASE}/import/vscode`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Import failed');
    }

    return response.json();
  }

  // Preview
  async generatePreview(projectId: string, pageId?: string): Promise<{ url: string }> {
    return this.request<{ url: string }>(`/projects/${projectId}/preview`, {
      method: 'POST',
      body: JSON.stringify({ pageId }),
    });
  }
}

export const apiService = new ApiService();