import React, { useCallback, useState } from 'react';
import { Upload, X, File, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { useFileManager } from '../hooks/useFileManager';

interface FileUploaderProps {
  onUpload: (files: Array<{ url: string; path: string }>) => void;
  projectId?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  projectId,
  accept = '*',
  multiple = true,
  maxFiles = 10
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());
  
  const { uploading, uploadProgress, error, uploadFile, uploadMultipleFiles, generateThumbnail, clearError } = useFileManager();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    const validFiles = files.slice(0, maxFiles);
    setSelectedFiles(validFiles);
    clearError();

    // Generate previews for images
    const newPreviews = new Map();
    for (const file of validFiles) {
      if (file.type.startsWith('image/')) {
        try {
          const thumbnail = await generateThumbnail(file);
          newPreviews.set(file.name, thumbnail);
        } catch (error) {
          console.error('Failed to generate thumbnail:', error);
        }
      }
    }
    setPreviews(newPreviews);
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    setPreviews(prev => {
      const newPreviews = new Map(prev);
      newPreviews.delete(fileName);
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      let results;
      if (selectedFiles.length === 1) {
        const result = await uploadFile(selectedFiles[0], projectId);
        results = [result];
      } else {
        const fileList = selectedFiles.reduce((acc, file, index) => {
          acc[index] = file;
          return acc;
        }, {} as any);
        fileList.length = selectedFiles.length;
        results = await uploadMultipleFiles(fileList as FileList, projectId);
      }

      onUpload(results);
      setSelectedFiles([]);
      setPreviews(new Map());
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {dragActive ? 'Déposez vos fichiers ici' : 'Glissez vos fichiers ici'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ou cliquez pour sélectionner des fichiers
          </p>
          <p className="text-xs text-gray-400">
            {multiple ? `Maximum ${maxFiles} fichiers` : '1 fichier maximum'} • 50MB max par fichier
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Fichiers sélectionnés ({selectedFiles.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {previews.has(file.name) ? (
                    <img
                      src={previews.get(file.name)}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : file.type.startsWith('image/') ? (
                    <Image className="w-10 h-10 text-gray-400" />
                  ) : (
                    <File className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(file.name)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Upload en cours...
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Upload...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Upload {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''}
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                setSelectedFiles([]);
                setPreviews(new Map());
                clearError();
              }}
              disabled={uploading}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;