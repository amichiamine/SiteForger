import { useState, useEffect } from 'react';
import { Page } from '../types';
import { dbService } from '../services/database';
import { apiService } from '../services/api';

export const usePages = (projectId: string | null) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadPages(projectId);
    }
  }, [projectId]);

  const loadPages = async (projId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from local database first
      const localPages = await dbService.getPages(projId);
      setPages(localPages);
      
      // Then try to sync with API if available
      try {
        const apiPages = await apiService.getPages(projId);
        setPages(apiPages);
        
        // Update local database
        for (const page of apiPages) {
          await dbService.savePage(page);
        }
      } catch (apiError) {
        // API not available, use local data
        console.log('API not available, using local data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (projId: string, pageData: Partial<Page>): Promise<Page> => {
    const newPage: Page = {
      id: generateId(),
      name: pageData.name || 'New Page',
      path: pageData.path || `/${pageData.name?.toLowerCase().replace(/\s+/g, '-') || 'new-page'}`,
      title: pageData.title || pageData.name || 'New Page',
      content: pageData.content || '',
      components: pageData.components || [],
      styles: pageData.styles || '',
      scripts: pageData.scripts || '',
      meta: {
        title: pageData.title || pageData.name || 'New Page',
        description: '',
        keywords: [],
        ...pageData.meta
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Save to API if available
      const savedPage = await apiService.createPage(projId, newPage);
      await dbService.savePage(savedPage);
      setPages(prev => [...prev, savedPage]);
      return savedPage;
    } catch (apiError) {
      // Save locally if API not available
      await dbService.savePage(newPage);
      setPages(prev => [...prev, newPage]);
      return newPage;
    }
  };

  const updatePage = async (projId: string, pageId: string, updates: Partial<Page>): Promise<Page> => {
    const existingPage = pages.find(p => p.id === pageId);
    if (!existingPage) {
      throw new Error('Page not found');
    }

    const updatedPage: Page = {
      ...existingPage,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    try {
      // Update via API if available
      const savedPage = await apiService.updatePage(projId, pageId, updatedPage);
      await dbService.savePage(savedPage);
      setPages(prev => prev.map(p => p.id === pageId ? savedPage : p));
      return savedPage;
    } catch (apiError) {
      // Update locally if API not available
      await dbService.savePage(updatedPage);
      setPages(prev => prev.map(p => p.id === pageId ? updatedPage : p));
      return updatedPage;
    }
  };

  const deletePage = async (projId: string, pageId: string): Promise<void> => {
    try {
      // Delete via API if available
      await apiService.deletePage(projId, pageId);
    } catch (apiError) {
      // Continue with local deletion even if API fails
    }

    await dbService.deletePage(pageId);
    setPages(prev => prev.filter(p => p.id !== pageId));
  };

  const getPage = (pageId: string): Page | undefined => {
    return pages.find(p => p.id === pageId);
  };

  return {
    pages,
    loading,
    error,
    createPage,
    updatePage,
    deletePage,
    getPage,
    refreshPages: () => projectId && loadPages(projectId)
  };
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};