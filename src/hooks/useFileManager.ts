import { useState } from 'react';
import { fileManagerService } from '../services/fileManager';

export const useFileManager = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, projectId?: string) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate file
      const validation = fileManagerService.validateFile(file, {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'pdf', 'zip', 'html', 'css', 'js', 'json', 'php']
      });

      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Compress image if needed
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) { // 2MB
        fileToUpload = await fileManagerService.compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8
        });
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await fileManagerService.uploadFile(fileToUpload, projectId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadMultipleFiles = async (files: FileList, projectId?: string) => {
    setUploading(true);
    setError(null);

    try {
      const results = await fileManagerService.uploadMultipleFiles(files, projectId);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const generateThumbnail = async (file: File) => {
    try {
      return await fileManagerService.generateThumbnail(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thumbnail generation failed');
      throw err;
    }
  };

  return {
    uploading,
    uploadProgress,
    error,
    uploadFile,
    uploadMultipleFiles,
    generateThumbnail,
    clearError: () => setError(null)
  };
};