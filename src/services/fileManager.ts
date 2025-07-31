export class FileManagerService {
  private static instance: FileManagerService;

  static getInstance(): FileManagerService {
    if (!FileManagerService.instance) {
      FileManagerService.instance = new FileManagerService();
    }
    return FileManagerService.instance;
  }

  async uploadFile(file: File, projectId?: string): Promise<{ url: string; path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) {
      formData.append('projectId', projectId);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async uploadMultipleFiles(files: FileList, projectId?: string): Promise<Array<{ url: string; path: string }>> {
    const uploadPromises = Array.from(files).map(file => this.uploadFile(file, projectId));
    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<void> {
    const response = await fetch(`/api/files${filePath}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }
  }

  async createDirectory(path: string): Promise<void> {
    const response = await fetch('/api/directories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path })
    });

    if (!response.ok) {
      throw new Error('Directory creation failed');
    }
  }

  async listFiles(directory: string = '/'): Promise<Array<{ name: string; type: 'file' | 'directory'; size?: number; modified?: string }>> {
    const response = await fetch(`/api/files?directory=${encodeURIComponent(directory)}`);
    
    if (!response.ok) {
      throw new Error('Failed to list files');
    }

    return response.json();
  }

  async downloadFile(filePath: string): Promise<Blob> {
    const response = await fetch(`/api/files${filePath}`);
    
    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }

  async saveTextFile(filePath: string, content: string): Promise<void> {
    const response = await fetch(`/api/files${filePath}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Save failed');
    }
  }

  async readTextFile(filePath: string): Promise<string> {
    const response = await fetch(`/api/files${filePath}`);
    
    if (!response.ok) {
      throw new Error('Read failed');
    }

    return response.text();
  }

  validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; error?: string } {
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = [],
      allowedExtensions = []
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
      };
    }

    // Check MIME type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          isValid: false,
          error: `File extension .${extension} is not allowed`
        };
      }
    }

    return { isValid: true };
  }

  async compressImage(file: File, options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        }, file.type, quality);
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  }

  generateThumbnail(file: File, size: number = 150): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions for square thumbnail
        const minDimension = Math.min(img.width, img.height);
        const x = (img.width - minDimension) / 2;
        const y = (img.height - minDimension) / 2;

        ctx?.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size);
        resolve(canvas.toDataURL());
      };

      img.onerror = () => reject(new Error('Thumbnail generation failed'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export const fileManagerService = FileManagerService.getInstance();