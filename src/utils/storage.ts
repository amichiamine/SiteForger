export class StorageService {
  private static instance: StorageService;
  
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Local Storage methods
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue || null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // Session Storage methods
  setSessionItem(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  }

  getSessionItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Failed to read from sessionStorage:', error);
      return defaultValue || null;
    }
  }

  removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
    }
  }

  // File operations
  async saveFile(filename: string, content: string): Promise<void> {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async loadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.html,.css,.js,.php';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        } else {
          reject(new Error('No file selected'));
        }
      };
      
      input.click();
    });
  }

  // Export/Import functionality
  async exportProject(project: any): Promise<void> {
    const exportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      project
    };
    
    const filename = `${project.name.replace(/\s+/g, '-').toLowerCase()}-export.json`;
    await this.saveFile(filename, JSON.stringify(exportData, null, 2));
  }

  async importProject(): Promise<any> {
    const content = await this.loadFile();
    try {
      const data = JSON.parse(content);
      if (data.project) {
        return data.project;
      } else {
        throw new Error('Invalid project file format');
      }
    } catch (error) {
      throw new Error('Failed to parse project file');
    }
  }

  // Backup functionality
  createBackup(): void {
    const backup = {
      timestamp: new Date().toISOString(),
      projects: this.getItem('projects', []),
      settings: this.getItem('settings', {}),
      templates: this.getItem('templates', [])
    };
    
    this.setItem('backup', backup);
  }

  restoreBackup(): boolean {
    try {
      const backup = this.getItem('backup');
      if (backup) {
        this.setItem('projects', backup.projects);
        this.setItem('settings', backup.settings);
        this.setItem('templates', backup.templates);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }
}

export const storageService = StorageService.getInstance();